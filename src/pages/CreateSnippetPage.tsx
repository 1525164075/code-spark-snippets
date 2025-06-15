
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
      console.log('Mutation started with data:', {
        ...data,
        files: data.files.map(f => ({ ...f, content: `[${f.content.length} chars]` }))
      });
      
      return await apiService.createSnippet(data);
    },
    onSuccess: (data) => {
      console.log('Mutation success, data:', data);
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
      console.error('Mutation failed with error:', error);
      
      toast({
        title: t('errors.createFailed'),
        description: error.message || t('errors.checkInput'),
        variant: "destructive",
      });
    }
  });

  // Submit handling function with basic validation
  const handleSubmit = useCallback(async () => {
    console.log('Submit started with state:', { 
      title, 
      filesCount: files.length, 
      visibility
    });
    
    // Basic validation
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

    // Check for empty files
    const hasEmptyFiles = files.some(file => !file.content.trim());
    if (hasEmptyFiles) {
      const confirmContinue = window.confirm(t('errors.emptyFiles'));
      if (!confirmContinue) return;
    }

    // Password validation for private snippets
    if (visibility === 'private' && password.length < 6) {
      toast({
        title: t('common.error'),
        description: t('errors.passwordLength'),
        variant: "destructive",
      });
      return;
    }

    // Clean file processing
    const processedFiles = files.map(file => ({
      filename: (file.filename || 'untitled').trim().substring(0, 100),
      language: (file.language || 'javascript').trim(),
      content: (file.content || '').trim()
    }));

    const requestData: CreateSnippetRequest = {
      title: title.trim().substring(0, 200),
      files: processedFiles,
      description: description.trim().substring(0, 1000),
      tags: tags.filter(tag => tag && tag.trim().length > 0).slice(0, 10),
      visibility: visibility,
      password: visibility === 'private' ? password : undefined,
      expiresAt: expiryDate || undefined,
    };

    console.log('Final request data:', {
      ...requestData,
      password: requestData.password ? '[REDACTED]' : undefined,
      files: requestData.files.map(f => ({ ...f, content: `[${f.content.length} chars]` }))
    });

    mutation.mutate(requestData);
  }, [title, files, description, tags, visibility, password, expiryDate, mutation, toast, t]);

  // File change handling
  const handleFilesChange = useCallback((newFiles: ICodeFile[]) => {
    console.log('Files changed:', newFiles.map(f => ({ ...f, content: `[${f.content.length} chars]` })));
    setFiles(newFiles);
  }, []);

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
