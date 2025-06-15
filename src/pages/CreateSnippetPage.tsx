
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import CodeEditorBlock from '../components/CodeEditorBlock';
import MoreSettings from '../components/MoreSettings';
import MarkdownEditor from '../components/MarkdownEditor';
import Actions from '../components/Actions';
import { ICodeFile, ICodeSnippet, CreateSnippetRequest } from '../types/CodeSnippet';

const CreateSnippetPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
  const [expiryHours, setExpiryHours] = useState<number | null>(null);
  const [description, setDescription] = useState<string>('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // 提交处理函数
  const handleSubmit = useCallback(async () => {
    try {
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
        // 简化的确认逻辑
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

      setLoading(true);

      // 构建请求数据
      const requestData: CreateSnippetRequest = {
        title: title.trim(),
        files: files,
        description: description,
        tags: tags,
        visibility: visibility,
        password: visibility === 'private' ? password : undefined,
        expiresAt: expiryHours ? 
          new Date(Date.now() + expiryHours * 60 * 60 * 1000) : 
          undefined,
      };

      console.log('Creating code snippet with data:', requestData);

      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResponse = {
        id: 'mock_snippet_' + Date.now(),
        url: `/share/mock_snippet_${Date.now()}`
      };

      // 成功提示
      toast({
        title: "创建成功！",
        description: `你的代码片段已成功创建。分享链接: ${window.location.origin}${mockResponse.url}`,
      });

    } catch (error) {
      console.error('Failed to create snippet:', error);
      toast({
        title: "创建失败",
        description: "请检查输入信息后重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [title, files, description, tags, visibility, password, expiryHours, toast]);

  // 文件变化处理
  const handleFilesChange = useCallback((newFiles: ICodeFile[]) => {
    setFiles(newFiles);
  }, []);

  // 可见性变化处理
  const handleVisibilityChange = useCallback((newVisibility: 'public' | 'private') => {
    setVisibility(newVisibility);
    if (newVisibility === 'public') {
      setPassword(''); // 切换到公开时清空密码
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

      {/* 主内容区 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 代码编辑器区域 */}
          <CodeEditorBlock
            files={files}
            onFilesChange={handleFilesChange}
          />

          {/* 更多设置区域 */}
          <MoreSettings
            title={title}
            setTitle={setTitle}
            tags={tags}
            setTags={setTags}
            expiryHours={expiryHours}
            setExpiryHours={setExpiryHours}
          />

          {/* Markdown 描述区域 */}
          <MarkdownEditor
            value={description}
            onChange={setDescription}
          />

          {/* 底部操作区域 */}
          <Actions
            visibility={visibility}
            password={password}
            onVisibilityChange={handleVisibilityChange}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateSnippetPage;
