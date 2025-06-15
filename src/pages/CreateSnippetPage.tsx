
import React, { useState, useCallback } from 'react';
import { Form, message, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import CodeEditorBlock from '../components/CodeEditorBlock';
import MoreSettings from '../components/MoreSettings';
import MarkdownEditor from '../components/MarkdownEditor';
import Actions from '../components/Actions';
import { ICodeFile, ICodeSnippet, CreateSnippetRequest } from '../types/CodeSnippet';

const CreateSnippetPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  // 核心状态管理
  const [files, setFiles] = useState<ICodeFile[]>([
    {
      filename: '代码一',
      language: 'javascript',
      content: '// 在这里编写你的代码\nconsole.log("Hello, CodeSnip!");'
    }
  ]);
  
  const [description, setDescription] = useState<string>('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // 提交处理函数
  const handleSubmit = useCallback(async () => {
    try {
      // 验证表单
      const formValues = await form.validateFields();
      
      // 验证代码文件
      if (files.length === 0) {
        message.error('至少需要添加一个代码文件');
        return;
      }

      const hasEmptyFiles = files.some(file => !file.content.trim());
      if (hasEmptyFiles) {
        const confirm = await new Promise<boolean>((resolve) => {
          notification.warning({
            message: '检测到空文件',
            description: '某些代码文件内容为空，确定要继续创建吗？',
            btn: (
              <div className="space-x-2">
                <button 
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => {
                    notification.destroy();
                    resolve(true);
                  }}
                >
                  继续创建
                </button>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    notification.destroy();
                    resolve(false);
                  }}
                >
                  取消
                </button>
              </div>
            ),
            duration: 0,
          });
        });
        
        if (!confirm) return;
      }

      // 验证私有片段密码
      if (visibility === 'private' && password.length < 6) {
        message.error('私有代码片段密码长度至少需要6位字符');
        return;
      }

      setLoading(true);

      // 构建请求数据
      const requestData: CreateSnippetRequest = {
        title: formValues.title,
        files: files,
        description: description,
        tags: formValues.tags || [],
        visibility: visibility,
        password: visibility === 'private' ? password : undefined,
        expiresAt: formValues.expiryHours ? 
          new Date(Date.now() + formValues.expiryHours * 60 * 60 * 1000) : 
          undefined,
      };

      console.log('Creating code snippet with data:', requestData);

      // 模拟 API 调用
      // 在实际应用中，这里应该调用真实的 API
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResponse = {
        id: 'mock_snippet_' + Date.now(),
        url: `/share/mock_snippet_${Date.now()}`
      };

      // 成功提示
      notification.success({
        message: '代码片段创建成功！',
        description: (
          <div>
            <p>你的代码片段已成功创建</p>
            <p className="text-sm text-gray-500 mt-1">
              分享链接: {window.location.origin}{mockResponse.url}
            </p>
          </div>
        ),
        duration: 5,
      });

      // 重置表单（可选）
      // form.resetFields();
      // setFiles([{ filename: '代码一', language: 'javascript', content: '' }]);
      // setDescription('');
      // setVisibility('public');
      // setPassword('');

      // 导航到分享页面或列表页面
      // navigate(mockResponse.url);

    } catch (error) {
      console.error('Failed to create snippet:', error);
      message.error('创建失败，请检查输入信息后重试');
    } finally {
      setLoading(false);
    }
  }, [form, files, description, visibility, password, navigate]);

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
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            title: '',
            tags: [],
            expiryHours: null,
          }}
          className="space-y-6"
        >
          {/* 代码编辑器区域 */}
          <CodeEditorBlock
            files={files}
            onFilesChange={handleFilesChange}
          />

          {/* 更多设置区域 */}
          <MoreSettings form={form} />

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
        </Form>
      </div>
    </div>
  );
};

export default CreateSnippetPage;
