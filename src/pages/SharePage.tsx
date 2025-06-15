
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Copy, Link, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Editor from '@monaco-editor/react';
import { ICodeSnippet } from '../types/CodeSnippet';

const SharePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [snippet, setSnippet] = useState<ICodeSnippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // 模拟 API 调用获取代码片段
  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        setLoading(true);
        console.log('Fetching snippet:', id);
        
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟数据
        const mockSnippet: ICodeSnippet = {
          _id: id,
          title: '示例代码片段',
          files: [
            {
              filename: 'index.js',
              language: 'javascript',
              content: `// 这是一个示例代码片段
function hello() {
  console.log('Hello, CodeSnip!');
  return 'Welcome to CodeSnip sharing!';
}

hello();`
            },
            {
              filename: 'styles.css',
              language: 'css',
              content: `.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.code-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}`
            }
          ],
          description: '# 代码片段描述\n\n这是一个**示例**代码片段，展示了如何创建和分享代码。\n\n## 特性\n- 支持多文件\n- 语法高亮\n- Markdown 描述',
          tags: ['javascript', 'example', 'demo'],
          visibility: 'public',
          createdAt: new Date()
        };
        
        // 模拟私密片段
        if (id === 'private-example') {
          mockSnippet.visibility = 'private';
          mockSnippet.password = '123456';
          setShowPasswordModal(true);
        }
        
        setSnippet(mockSnippet);
      } catch (error) {
        console.error('Failed to fetch snippet:', error);
        toast({
          title: "加载失败",
          description: "无法加载代码片段，请稍后重试",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSnippet();
    }
  }, [id, navigate, toast]);

  // 验证密码
  const handlePasswordVerify = async () => {
    try {
      setPasswordLoading(true);
      console.log('Verifying password:', password);
      
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟验证逻辑
      if (password === '123456') {
        setShowPasswordModal(false);
        toast({
          title: "验证成功",
          description: "密码正确，现在可以查看代码片段",
        });
      } else {
        toast({
          title: "密码错误",
          description: "请输入正确的访问密码",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Password verification failed:', error);
      toast({
        title: "验证失败",
        description: "验证过程中出现错误，请重试",
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // 复制所有代码
  const handleCopyAllCode = () => {
    if (!snippet) return;
    
    const allCode = snippet.files.map(file => 
      `// ${file.filename}\n${file.content}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(allCode).then(() => {
      toast({
        title: "复制成功",
        description: "已复制全部代码到剪贴板",
      });
    });
  };

  // 复制分享链接
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({
        title: "链接已复制",
        description: "分享链接已复制到剪贴板",
      });
    });
  };

  // 下载为图片 (简化实现)
  const handleDownloadImage = () => {
    toast({
      title: "功能开发中",
      description: "图片下载功能正在开发中，敬请期待",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载代码片段...</p>
        </div>
      </div>
    );
  }

  if (!snippet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">代码片段不存在</h1>
          <Button onClick={() => navigate('/')}>返回首页</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 代码卡片 */}
        <Card className="shadow-2xl bg-white" id="code-card">
          <CardHeader className="relative">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {snippet.title}
                </CardTitle>
                <div className="flex flex-wrap gap-2 mb-4">
                  {snippet.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyAllCode}
                  title="复制全部代码"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  title="复制分享链接"
                >
                  <Link className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDownloadImage}
                  title="下载为图片"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 描述区域 */}
            {snippet.description && (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {snippet.description}
                </ReactMarkdown>
              </div>
            )}

            {/* 代码区域 */}
            <div>
              {snippet.files.length === 1 ? (
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 border-b">
                    <span className="font-mono text-sm text-gray-700">
                      {snippet.files[0].filename}
                    </span>
                  </div>
                  <Editor
                    height="400px"
                    language={snippet.files[0].language}
                    value={snippet.files[0].content}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      theme: 'vs'
                    }}
                  />
                </div>
              ) : (
                <Tabs defaultValue={snippet.files[0].filename} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                    {snippet.files.map((file) => (
                      <TabsTrigger key={file.filename} value={file.filename}>
                        {file.filename}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {snippet.files.map((file) => (
                    <TabsContent key={file.filename} value={file.filename}>
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-100 px-4 py-2 border-b">
                          <span className="font-mono text-sm text-gray-700">
                            {file.filename}
                          </span>
                        </div>
                        <Editor
                          height="400px"
                          language={file.language}
                          value={file.content}
                          options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            fontSize: 14,
                            theme: 'vs'
                          }}
                        />
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 密码验证模态框 */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>此代码片段已加密</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              请输入访问密码来查看这个私密代码片段
            </p>
            <Input
              type="password"
              placeholder="请输入访问密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePasswordVerify()}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => navigate('/')}>
                取消
              </Button>
              <Button onClick={handlePasswordVerify} disabled={passwordLoading}>
                {passwordLoading ? '验证中...' : '确认'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SharePage;
