import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import CodeEditorBlock from '../components/CodeEditorBlock';
import SettingsPanel from '../components/SettingsPanel';
import MarkdownEditorPanel from '../components/MarkdownEditorPanel';
import { ICodeFile, CreateSnippetRequest } from '../types/CodeSnippet';

// Mock API function for creating code snippets
const createSnippet = async (data: CreateSnippetRequest): Promise<any> => {
  console.log('Creating code snippet with data:', data);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate success response
  return {
    id: 'snippet-' + Date.now(),
    ...data,
    createdAt: new Date()
  };
};

const CreateSnippetPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  
  // Core state management
  const [files, setFiles] = useState<ICodeFile[]>([
    {
      filename: '代码一',
      language: 'javascript',
      content: '// 在这里编写你的代码\nconsole.log("Hello, CodeSnip!");'
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
    mutationFn: createSnippet,
    onSuccess: () => {
      // Key fix: Invalidate the 'snippets' query to trigger automatic refetch
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      
      toast({
        title: t('create.success'),
        description: t('create.successDesc'),
      });

      setTimeout(() => {
        navigate('/snippets');
      }, 1000);
    },
    onError: (error: Error) => {
      console.error('Failed to create snippet:', error);
      toast({
        title: "创建失败",
        description: "请检查输入信息后重试",
        variant: "destructive",
      });
    }
  });

  // Submit handling function
  const handleSubmit = useCallback(async () => {
    // Validation
    if (!title.trim()) {
      toast({
        title: "错误",
        description: "请输入代码片段标题",
        variant: "destructive",
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: "错误", 
        description: "至少需要添加一个代码文件",
        variant: "destructive",
      });
      return;
    }

    const hasEmptyFiles = files.some(file => !file.content.trim());
    if (hasEmptyFiles) {
      const confirmContinue = window.confirm('某些代码文件内容为空，确定要继续创建吗？');
      if (!confirmContinue) return;
    }

    // Validate private snippet password
    if (visibility === 'private' && password.length < 6) {
      toast({
        title: "错误",
        description: "私有代码片段密码长度至少需要6位字符",
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

    // Execute creation
    mutation.mutate(requestData);
  }, [title, files, description, tags, visibility, password, expiryDate, mutation, toast]);

  // File change handling
  const handleFilesChange = useCallback((newFiles: ICodeFile[]) => {
    setFiles(newFiles);
  }, []);

  // Visibility change handling
  const handleVisibilityChange = useCallback((newVisibility: 'public' | 'private') => {
    setVisibility(newVisibility);
    if (newVisibility === 'public') {
      setPassword('');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="apple-title">{t('create.title')}</h1>
              <p className="mt-1 text-sm text-gray-500">
                {t('create.subtitle')}
              </p>
            </div>
            <div className="text-sm text-gray-400">
              CodeSnip v1.0
            </div>
          </div>
        </div>
      </div>

      {/* Main content - dual column layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - main content creation area */}
          <div className="lg:col-span-2 space-y-6">
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
