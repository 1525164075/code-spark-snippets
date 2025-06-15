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
    if (!user) throw new Error('User not authenticated');

    // Ensure we have valid data
    if (!snippetData.files || snippetData.files.length === 0) {
      throw new Error('At least one file is required');
    }

    if (!snippetData.title || !snippetData.title.trim()) {
      throw new Error('Title is required');
    }

    try {
      const snippet = {
        title: snippetData.title.trim(),
        description: snippetData.description || '',
        content: JSON.stringify(snippetData.files),
        language: snippetData.files[0]?.language || 'javascript',
        tags: snippetData.tags || [],
        is_private: snippetData.visibility === 'private',
        author_id: user.id
      };

      console.log('Inserting snippet:', snippet);

      const { data, error } = await supabase
        .from('code_snippets')
        .insert([snippet])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to create snippet: ${error.message}`);
      }

      console.log('Snippet created successfully:', data);

      // Transform database response to ICodeSnippet format
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
    } catch (error: any) {
      console.error('Error in createSnippet:', error);
      throw new Error(error.message || 'Failed to create snippet');
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
      .eq('author_id', user.id); // Ensure user can only delete their own snippets

    if (error) throw error;
  }
};
