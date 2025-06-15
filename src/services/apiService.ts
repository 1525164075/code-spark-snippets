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
      // Clean and validate file data to prevent encoding issues
      const cleanFiles = snippetData.files.map(file => ({
        filename: (file.filename || 'untitled').trim(),
        language: (file.language || 'javascript').trim(),
        content: (file.content || '').trim()
      }));

      // Ensure content is properly encoded as UTF-8 string
      const contentString = JSON.stringify(cleanFiles);
      
      // Validate JSON can be parsed back (encoding check)
      try {
        JSON.parse(contentString);
      } catch (parseError) {
        console.error('JSON encoding validation failed:', parseError);
        throw new Error('代码内容编码错误，请检查特殊字符');
      }

      const snippet = {
        title: snippetData.title.trim(),
        description: (snippetData.description || '').trim(),
        content: contentString,
        language: cleanFiles[0]?.language || 'javascript',
        tags: Array.isArray(snippetData.tags) ? snippetData.tags.filter(tag => tag && tag.trim()) : [],
        is_private: snippetData.visibility === 'private',
        author_id: user.id
      };

      console.log('Inserting snippet with cleaned data:', {
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
        
        // Handle specific database errors
        if (error.message.includes('invalid input syntax')) {
          throw new Error('代码内容包含无效字符，请检查输入');
        }
        if (error.message.includes('value too long')) {
          throw new Error('代码内容过长，请减少内容长度');
        }
        if (error.code === '23505') { // unique violation
          throw new Error('标题已存在，请使用不同的标题');
        }
        
        throw new Error(`创建失败: ${error.message}`);
      }

      console.log('Snippet created successfully:', data);

      // Parse content back and validate
      let parsedFiles;
      try {
        parsedFiles = JSON.parse(data.content);
      } catch (parseError) {
        console.error('Failed to parse saved content:', parseError);
        parsedFiles = cleanFiles; // fallback to original
      }

      // Transform database response to ICodeSnippet format
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
      
      // Provide user-friendly error messages
      if (error.message.includes('encoding') || error.message.includes('编码')) {
        throw new Error('数据编码错误，请重试');
      }
      if (error.message.includes('auth')) {
        throw new Error('用户认证失败，请重新登录');
      }
      if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error('网络连接错误，请检查网络连接');
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
