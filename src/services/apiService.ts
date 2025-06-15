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

    // Basic validation
    if (!snippetData.files || snippetData.files.length === 0) {
      throw new Error('至少需要一个代码文件');
    }

    if (!snippetData.title || !snippetData.title.trim()) {
      throw new Error('标题不能为空');
    }

    try {
      // Clean and validate files
      const cleanFiles = snippetData.files.map(file => ({
        filename: (file.filename || 'untitled').trim().substring(0, 100),
        language: (file.language || 'javascript').trim(),
        content: (file.content || '').trim()
      }));

      // Validate that we have content
      const hasValidContent = cleanFiles.some(file => file.content.length > 0);
      if (!hasValidContent) {
        throw new Error('代码内容不能为空');
      }

      // Create the content as simple JSON string
      const contentString = JSON.stringify(cleanFiles);
      
      // Check size limit (1MB)
      if (contentString.length > 1000000) {
        throw new Error('代码内容过大，请减少内容长度');
      }

      const snippet = {
        title: snippetData.title.trim().substring(0, 200),
        description: (snippetData.description || '').trim().substring(0, 1000),
        content: contentString,
        language: cleanFiles[0]?.language || 'javascript',
        tags: Array.isArray(snippetData.tags) 
          ? snippetData.tags.filter(tag => tag && tag.trim()).slice(0, 10)
          : [],
        is_private: snippetData.visibility === 'private',
        author_id: user.id
      };

      console.log('Inserting snippet:', {
        ...snippet,
        content: `[${contentString.length} characters]`
      });

      const { data, error } = await supabase
        .from('code_snippets')
        .insert([snippet])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error(`创建失败: ${error.message}`);
      }

      console.log('Snippet created successfully:', data);

      // Parse the returned content
      const parsedFiles = JSON.parse(data.content);

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
