import { supabase } from '@/integrations/supabase/client';
import { ICodeSnippet, CreateSnippetRequest } from '@/types/CodeSnippet';

export const apiService = {
  // Authentication
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: fullName
        }
      }
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Code snippets
  async createSnippet(snippetData: CreateSnippetRequest): Promise<ICodeSnippet> {
    console.log('Creating snippet with data:', snippetData);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('用户未认证');

    // Validate required data
    if (!snippetData.files || snippetData.files.length === 0) {
      throw new Error('至少需要一个代码文件');
    }

    if (!snippetData.title || !snippetData.title.trim()) {
      throw new Error('标题不能为空');
    }

    try {
      // 更严格的数据清理和编码处理
      const cleanFiles = snippetData.files.map(file => {
        let cleanContent = (file.content || '').trim();
        
        // 移除BOM和其他问题字符
        cleanContent = cleanContent
          .replace(/\uFEFF/g, '') // BOM
          .replace(/\u0000/g, '') // NULL字符
          .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''); // 控制字符
        
        // 确保内容是有效的UTF-8
        try {
          // 测试编码/解码
          const encoded = encodeURIComponent(cleanContent);
          const decoded = decodeURIComponent(encoded);
          if (decoded !== cleanContent) {
            console.warn('Content encoding mismatch detected, using encoded version');
            cleanContent = decoded;
          }
        } catch (encodingError) {
          console.warn('Content encoding test failed:', encodingError);
          // 如果编码测试失败，移除所有非ASCII字符
          cleanContent = cleanContent.replace(/[^\x20-\x7E\s]/g, '');
        }

        return {
          filename: (file.filename || 'untitled').trim().substring(0, 100), // 限制文件名长度
          language: (file.language || 'javascript').trim(),
          content: cleanContent
        };
      });

      // 验证清理后的数据
      const hasValidContent = cleanFiles.some(file => file.content.length > 0);
      if (!hasValidContent) {
        throw new Error('代码内容不能为空');
      }

      // 创建JSON字符串，使用安全的序列化
      let contentString;
      try {
        contentString = JSON.stringify(cleanFiles, null, 0);
        
        // 验证JSON可以被解析
        const testParse = JSON.parse(contentString);
        if (!Array.isArray(testParse) || testParse.length === 0) {
          throw new Error('数据序列化验证失败');
        }
      } catch (jsonError) {
        console.error('JSON serialization error:', jsonError);
        throw new Error('代码内容包含无法处理的字符，请检查输入');
      }

      // 检查内容大小限制
      if (contentString.length > 1000000) { // 1MB限制
        throw new Error('代码内容过大，请减少内容长度');
      }

      const snippet = {
        title: snippetData.title.trim().substring(0, 200), // 限制标题长度
        description: (snippetData.description || '').trim().substring(0, 1000), // 限制描述长度
        content: contentString,
        language: cleanFiles[0]?.language || 'javascript',
        tags: Array.isArray(snippetData.tags) 
          ? snippetData.tags.filter(tag => tag && tag.trim()).slice(0, 10) // 限制标签数量
          : [],
        is_private: snippetData.visibility === 'private',
        author_id: user.id
      };

      console.log('Inserting snippet with processed data:', {
        ...snippet,
        content: `[${contentString.length} chars]`
      });

      const { data, error } = await supabase
        .from('code_snippets')
        .insert([snippet])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        
        // 更详细的错误处理
        if (error.message.includes('invalid input syntax') || 
            error.message.includes('encoding') ||
            error.message.includes('character')) {
          throw new Error('代码内容包含无效字符，请检查特殊字符或编码');
        }
        if (error.message.includes('value too long')) {
          throw new Error('内容过长，请减少代码长度');
        }
        if (error.code === '23505') {
          throw new Error('标题已存在，请使用不同的标题');
        }
        if (error.code === '23514') {
          throw new Error('数据格式不符合要求，请检查输入');
        }
        
        throw new Error(`创建失败: ${error.message}`);
      }

      console.log('Snippet created successfully:', data);

      // 解析返回的内容
      let parsedFiles;
      try {
        parsedFiles = JSON.parse(data.content);
      } catch (parseError) {
        console.error('Failed to parse saved content:', parseError);
        parsedFiles = cleanFiles; // 使用原始清理后的数据
      }

      return {
        _id: data.id,
        title: data.title,
        description: data.description || '',
        files: parsedFiles,
        tags: data.tags || [],
        visibility: data.is_private ? 'private' : 'public',
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error: any) {
      console.error('Error in createSnippet:', error);
      
      // 提供更友好的错误信息
      if (error.message.includes('encoding') || error.message.includes('编码')) {
        throw new Error('代码内容编码错误，请避免使用特殊字符');
      }
      if (error.message.includes('auth') || error.message.includes('认证')) {
        throw new Error('用户认证失败，请重新登录');
      }
      if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error('网络连接错误，请检查网络连接');
      }
      if (error.message.includes('timeout')) {
        throw new Error('请求超时，请重试');
      }
      
      throw new Error(error.message || '创建失败，请重试');
    }
  },

  async getAllSnippets(): Promise<ICodeSnippet[]> {
    const { data, error } = await supabase
      .from('code_snippets')
      .select('*')
      .eq('is_private', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      _id: item.id,
      title: item.title,
      description: item.description,
      files: JSON.parse(item.content),
      tags: item.tags || [],
      visibility: item.is_private ? 'private' : 'public',
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  },

  async getSnippetById(id: string): Promise<ICodeSnippet | null> {
    const { data, error } = await supabase
      .from('code_snippets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;

    return {
      _id: data.id,
      title: data.title,
      description: data.description,
      files: JSON.parse(data.content),
      tags: data.tags || [],
      visibility: data.is_private ? 'private' : 'public',
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  },

  async getUserSnippets(): Promise<ICodeSnippet[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('code_snippets')
      .select('*')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      _id: item.id,
      title: item.title,
      description: item.description,
      files: JSON.parse(item.content),
      tags: item.tags || [],
      visibility: item.is_private ? 'private' : 'public',
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  },

  async deleteSnippet(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('code_snippets')
      .delete()
      .eq('id', id)
      .eq('author_id', user.id);

    if (error) throw error;
  }
};
