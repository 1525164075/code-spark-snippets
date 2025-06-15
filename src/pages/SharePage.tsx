import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Copy, Link, Download, Share2, Palette, Instagram } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Editor from '@monaco-editor/react';
import { ICodeSnippet } from '../types/CodeSnippet';

interface CardSettings {
  backgroundType: 'solid' | 'gradient' | 'wallpaper';
  backgroundColor: string;
  gradientIndex: number;
  showWindowDecorations: boolean;
  shadowSize: number;
  padding: number;
  showLineNumbers: boolean;
}

const SharePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [snippet, setSnippet] = useState<ICodeSnippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCardGenerator, setShowCardGenerator] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Card generator settings
  const [cardSettings, setCardSettings] = useState<CardSettings>({
    backgroundType: 'gradient',
    backgroundColor: '#1e293b',
    gradientIndex: 0,
    showWindowDecorations: true,
    shadowSize: 20,
    padding: 32,
    showLineNumbers: true
  });

  // Predefined gradients
  const gradientOptions = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  ];

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

  // 卡片生成器函数
  const getCardBackground = () => {
    switch (cardSettings.backgroundType) {
      case 'solid':
        return cardSettings.backgroundColor;
      case 'gradient':
        return gradientOptions[cardSettings.gradientIndex];
      case 'wallpaper':
        return '#1e293b'; // Fallback for wallpaper
      default:
        return gradientOptions[0];
    }
  };

  const handleDownloadPNG = async () => {
    try {
      const { toPng } = await import('html-to-image');
      const element = document.getElementById('custom-card-preview');
      if (element) {
        const dataUrl = await toPng(element);
        const link = document.createElement('a');
        link.download = `${snippet?.title || 'code-snippet'}.png`;
        link.href = dataUrl;
        link.click();
        toast({
          title: "下载成功",
          description: "PNG 图片已下载",
        });
      }
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "下载失败",
        description: "PNG 下载过程中出现错误",
        variant: "destructive",
      });
    }
  };

  const handleDownloadSVG = async () => {
    try {
      const { toSvg } = await import('html-to-image');
      const element = document.getElementById('custom-card-preview');
      if (element) {
        const dataUrl = await toSvg(element);
        const link = document.createElement('a');
        link.download = `${snippet?.title || 'code-snippet'}.svg`;
        link.href = dataUrl;
        link.click();
        toast({
          title: "下载成功",
          description: "SVG 图片已下载",
        });
      }
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "下载失败",
        description: "SVG 下载过程中出现错误",
        variant: "destructive",
      });
    }
  };

  const handleCopyHTML = () => {
    const element = document.getElementById('custom-card-preview');
    if (element) {
      const html = element.outerHTML;
      navigator.clipboard.writeText(html).then(() => {
        toast({
          title: "HTML 已复制",
          description: "包含内联样式的 HTML 代码已复制到剪贴板",
        });
      });
    }
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
                  onClick={() => setShowCardGenerator(true)}
                  className="flex items-center gap-2"
                  title="生成分享卡片"
                >
                  <Share2 className="h-4 w-4" />
                  生成分享卡片
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

      {/* 卡片生成器模态框 */}
      <Dialog open={showCardGenerator} onOpenChange={setShowCardGenerator}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>自定义你的代码卡片</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左侧控制面板 */}
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">背景样式</Label>
                <RadioGroup
                  value={cardSettings.backgroundType}
                  onValueChange={(value: 'solid' | 'gradient' | 'wallpaper') =>
                    setCardSettings(prev => ({ ...prev, backgroundType: value }))
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="solid" id="solid" />
                    <Label htmlFor="solid">纯色</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gradient" id="gradient" />
                    <Label htmlFor="gradient">渐变</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wallpaper" id="wallpaper" />
                    <Label htmlFor="wallpaper">壁纸</Label>
                  </div>
                </RadioGroup>

                {cardSettings.backgroundType === 'solid' && (
                  <div className="mt-3">
                    <Input
                      type="color"
                      value={cardSettings.backgroundColor}
                      onChange={(e) =>
                        setCardSettings(prev => ({ ...prev, backgroundColor: e.target.value }))
                      }
                      className="w-20 h-10"
                    />
                  </div>
                )}

                {cardSettings.backgroundType === 'gradient' && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {gradientOptions.map((gradient, index) => (
                      <button
                        key={index}
                        className={`w-12 h-12 rounded-lg border-2 ${
                          cardSettings.gradientIndex === index ? 'border-blue-500' : 'border-gray-300'
                        }`}
                        style={{ background: gradient }}
                        onClick={() =>
                          setCardSettings(prev => ({ ...prev, gradientIndex: index }))
                        }
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="window-decorations">窗口装饰</Label>
                <Switch
                  id="window-decorations"
                  checked={cardSettings.showWindowDecorations}
                  onCheckedChange={(checked) =>
                    setCardSettings(prev => ({ ...prev, showWindowDecorations: checked }))
                  }
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">
                  阴影大小: {cardSettings.shadowSize}px
                </Label>
                <Slider
                  value={[cardSettings.shadowSize]}
                  onValueChange={([value]) =>
                    setCardSettings(prev => ({ ...prev, shadowSize: value }))
                  }
                  max={50}
                  min={0}
                  step={5}
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">
                  内边距: {cardSettings.padding}px
                </Label>
                <Slider
                  value={[cardSettings.padding]}
                  onValueChange={([value]) =>
                    setCardSettings(prev => ({ ...prev, padding: value }))
                  }
                  max={64}
                  min={16}
                  step={8}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="line-numbers">显示行号</Label>
                <Switch
                  id="line-numbers"
                  checked={cardSettings.showLineNumbers}
                  onCheckedChange={(checked) =>
                    setCardSettings(prev => ({ ...prev, showLineNumbers: checked }))
                  }
                />
              </div>
            </div>

            {/* 右侧实时预览 */}
            <div className="flex justify-center items-start">
              <div
                id="custom-card-preview"
                className="rounded-lg overflow-hidden transform scale-75 origin-top"
                style={{
                  background: getCardBackground(),
                  padding: `${cardSettings.padding}px`,
                  boxShadow: `0 ${cardSettings.shadowSize}px ${cardSettings.shadowSize * 2}px rgba(0,0,0,0.3)`,
                }}
              >
                {cardSettings.showWindowDecorations && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                )}
                
                <div className="bg-gray-900 rounded-lg p-4 text-white font-mono text-sm max-w-md">
                  <div className="mb-2 text-gray-400">{snippet.files[0].filename}</div>
                  <pre className="overflow-hidden">
                    {snippet.files[0].content.split('\n').slice(0, 15).map((line, index) => (
                      <div key={index} className="flex">
                        {cardSettings.showLineNumbers && (
                          <span className="text-gray-500 mr-3 w-6 text-right">
                            {index + 1}
                          </span>
                        )}
                        <span>{line}</span>
                      </div>
                    ))}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* 模态框页脚 */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleDownloadPNG}>
              下载 PNG
            </Button>
            <Button variant="outline" onClick={handleDownloadSVG}>
              下载 SVG
            </Button>
            <Button variant="outline" onClick={handleCopyHTML}>
              复制代码(HTML)
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
