
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import CodeEditorBlock from '../components/CodeEditorBlock';
import SettingsPanel from '../components/SettingsPanel';
import MarkdownEditorPanel from '../components/MarkdownEditorPanel';
import { ICodeFile, CreateSnippetRequest } from '../types/CodeSnippet';

// 模拟创建代码片段的 API 函数
const createSnippet = async (data: CreateSnippetRequest): Promise<any> => {
  console.log('Creating code snippet with data:', data);
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 模拟成功响应
  return {
    id: 'snippet-' + Date.now(),
    ...data,
    createdAt: new Date()
  };
};

const CreateSnippetPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // 核心状态管理
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

  // 使用 useMutation 来处理创建代码片段
  const mutation = useMutation({
    mutationFn: createSnippet,
    onSuccess: () => {
      // 关键！让 'snippets' 查询失效，触发自动重新获取
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      
      toast({
        title: "创建成功！",
        description: `你的代码片段已成功创建`,
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

  // 提交处理函数
  const handleSubmit = useCallback(async () => {
    // 验证输入
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

    // 验证私有片段密码
    if (visibility === 'private' && password.length < 6) {
      toast({
        title: "错误",
        description: "私有代码片段密码长度至少需要6位字符",
        variant: "destructive",
      });
      return;
    }

    // 构建请求数据
    const requestData: CreateSnippetRequest = {
      title: title.trim(),
      files: files,
      description: description,
      tags: tags,
      visibility: visibility,
      password: visibility === 'private' ? password : undefined,
      expiresAt: expiryDate || undefined,
    };

    // 执行创建
    mutation.mutate(requestData);
  }, [title, files, description, tags, visibility, password, expiryDate, mutation, toast]);

  // 文件变化处理
  const handleFilesChange = useCallback((newFiles: ICodeFile[]) => {
    setFiles(newFiles);
  }, []);

  // 可见性变化处理
  const handleVisibilityChange = useCallback((newVisibility: 'public' | 'private') => {
    setVisibility(newVisibility);
    if (newVisibility === 'public') {
      setPassword('');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">创建代码片段</h1>
              <p className="mt-1 text-sm text-gray-500">
                分享你的代码，让知识传播得更远
              </p>
            </div>
            <div className="text-sm text-gray-400">
              CodeSnip v1.0
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区 - 双列布局 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧列 - 主内容创作区 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 代码编辑器区域 */}
            <CodeEditorBlock
              files={files}
              onFilesChange={handleFilesChange}
            />

            {/* Markdown 描述区域 */}
            <MarkdownEditorPanel
              value={description}
              onChange={setDescription}
            />
          </div>

          {/* 右侧列 - 配置与操作区 */}
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
