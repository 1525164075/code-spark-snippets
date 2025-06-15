
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import CodeEditorBlock from '../components/CodeEditorBlock';
import SettingsPanel from '../components/SettingsPanel';
import MarkdownEditorPanel from '../components/MarkdownEditorPanel';
import { ICodeFile, CreateSnippetRequest } from '../types/CodeSnippet';
import { apiService } from '../services/apiService';

const CreateSnippetPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  
  // Core state management
  const [files, setFiles] = useState<ICodeFile[]>([
    {
      filename: 'index.js',
      language: 'javascript',
      content: '// Write your code here\nconsole.log("Hello, CodeSnip!");'
    }
  ]);
  
  const [title, setTitle] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [description, setDescription] = useState<string>('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [password, setPassword] = useState<string>('');

  // Use useMutation to handle snippet creation
  const mutation = useMutation({
    mutationFn: async (data: CreateSnippetRequest) => {
      console.log('Creating snippet with data:', data);
      
      try {
        const result = await apiService.createSnippet(data);
        console.log('Snippet created successfully:', result);
        return result;
      } catch (error) {
        console.error('Error creating snippet:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Mutation success, data:', data);
      // Invalidate queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      queryClient.invalidateQueries({ queryKey: ['userSnippets'] });
      
      toast({
        title: t('create.success'),
        description: t('create.successDesc'),
      });

      setTimeout(() => {
        navigate('/snippets');
      }, 1000);
    },
    onError: (error: any) => {
      console.error('Mutation failed:', error);
      toast({
        title: t('errors.createFailed'),
        description: error.message || t('errors.checkInput'),
        variant: "destructive",
      });
    }
  });

  // Submit handling function
  const handleSubmit = useCallback(async () => {
    console.log('Submit started with:', { title, files, visibility, password });
    
    // Validation
    if (!title.trim()) {
      toast({
        title: t('common.error'),
        description: t('errors.titleRequired'),
        variant: "destructive",
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: t('common.error'), 
        description: t('errors.fileRequired'),
        variant: "destructive",
      });
      return;
    }

    const hasEmptyFiles = files.some(file => !file.content.trim());
    if (hasEmptyFiles) {
      const confirmContinue = window.confirm(t('errors.emptyFiles'));
      if (!confirmContinue) return;
    }

    // Validate private snippet password
    if (visibility === 'private' && password.length < 6) {
      toast({
        title: t('common.error'),
        description: t('errors.passwordLength'),
        variant: "destructive",
      });
      return;
    }

    // Build request data
    const requestData: CreateSnippetRequest = {
      title: title.trim(),
      files: files,
      description: description,
      tags: tags,
      visibility: visibility,
      password: visibility === 'private' ? password : undefined,
      expiresAt: expiryDate || undefined,
    };

    console.log('Submitting request data:', requestData);

    // Execute creation
    mutation.mutate(requestData);
  }, [title, files, description, tags, visibility, password, expiryDate, mutation, toast, t]);

  // File change handling
  const handleFilesChange = useCallback((newFiles: ICodeFile[]) => {
    console.log('Files changed:', newFiles);
    setFiles(newFiles);
  }, []);

  // Visibility change handling
  const handleVisibilityChange = useCallback((newVisibility: 'public' | 'private') => {
    console.log('Visibility changed to:', newVisibility);
    setVisibility(newVisibility);
    if (newVisibility === 'public') {
      setPassword('');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Apple-inspired header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="apple-title">{t('create.title')}</h1>
            <p className="apple-subtitle mt-2">
              {t('create.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Main content - dual column layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - main content creation area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Code editor area */}
            <CodeEditorBlock
              files={files}
              onFilesChange={handleFilesChange}
            />

            {/* Markdown description area */}
            <MarkdownEditorPanel
              value={description}
              onChange={setDescription}
            />
          </div>

          {/* Right column - configuration and action area */}
          <div className="lg:col-span-1">
            <SettingsPanel
              title={title}
              setTitle={setTitle}
              tags={tags}
              setTags={setTags}
              expiryDate={expiryDate}
              setExpiryDate={setExpiryDate}
              visibility={visibility}
              password={password}
              onVisibilityChange={handleVisibilityChange}
              onPasswordChange={setPassword}
              onSubmit={handleSubmit}
              loading={mutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSnippetPage;
