
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
      
      try {
        const result = await apiService.createSnippet(data);
        console.log('Snippet created successfully:', result);
        return result;
      } catch (error: any) {
        console.error('Error creating snippet:', error);
        throw error;
      }
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
      
      let errorMessage = error.message || t('errors.checkInput');
      
      toast({
        title: t('errors.createFailed'),
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  // Submit handling function with improved validation
  const handleSubmit = useCallback(async () => {
    console.log('Submit started with state:', { 
      title, 
      filesCount: files.length, 
      visibility, 
      passwordLength: password.length,
      tagsCount: tags.length
    });
    
    // Enhanced validation
    if (!title.trim()) {
      console.error('Validation failed: Title is empty');
      toast({
        title: t('common.error'),
        description: t('errors.titleRequired'),
        variant: "destructive",
      });
      return;
    }

    if (files.length === 0) {
      console.error('Validation failed: No files provided');
      toast({
        title: t('common.error'), 
        description: t('errors.fileRequired'),
        variant: "destructive",
      });
      return;
    }

    // 检查是否有内容过长的文件
    const maxFileSize = 500000; // 500KB per file
    const oversizedFiles = files.filter(file => file.content.length > maxFileSize);
    if (oversizedFiles.length > 0) {
      toast({
        title: t('common.error'),
        description: `文件 "${oversizedFiles[0].filename}" 内容过大，请减少内容长度`,
        variant: "destructive",
      });
      return;
    }

    const hasEmptyFiles = files.some(file => !file.content.trim());
    if (hasEmptyFiles) {
      console.warn('Warning: Some files are empty');
      const confirmContinue = window.confirm(t('errors.emptyFiles'));
      if (!confirmContinue) return;
    }

    if (visibility === 'private' && password.length < 6) {
      console.error('Validation failed: Password too short for private snippet');
      toast({
        title: t('common.error'),
        description: t('errors.passwordLength'),
        variant: "destructive",
      });
      return;
    }

    // 更严格的数据预处理
    const processedFiles = files.map(file => {
      let content = (file.content || '').trim();
      let filename = (file.filename || 'untitled').trim();
      let language = (file.language || 'javascript').trim();
      
      // 检测和处理潜在的编码问题
      try {
        // 移除潜在的问题字符
        content = content
          .replace(/\uFEFF/g, '') // BOM
          .replace(/\u0000/g, '') // NULL
          .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''); // 控制字符
        
        // 验证内容可以正确编码
        const testEncode = encodeURIComponent(content);
        const testDecode = decodeURIComponent(testEncode);
        
        if (testDecode !== content) {
          console.warn(`Encoding issue detected in file: ${filename}`);
        }
      } catch (encodingError) {
        console.error('Content encoding error:', encodingError);
        toast({
          title: t('common.error'),
          description: `文件 "${filename}" 包含无法处理的字符，请检查内容`,
          variant: "destructive",
        });
        return null;
      }

      return {
        filename: filename.substring(0, 100), // 限制文件名长度
        language,
        content
      };
    }).filter(Boolean) as ICodeFile[];

    if (processedFiles.length === 0) {
      toast({
        title: t('common.error'),
        description: '没有有效的文件内容',
        variant: "destructive",
      });
      return;
    }

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

    try {
      mutation.mutate(requestData);
    } catch (error: any) {
      console.error('Error in mutation.mutate:', error);
    }
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
