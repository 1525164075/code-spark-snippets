
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Plus, Search, Code, Share, Lock, Clock, Tag, User, Calendar } from "lucide-react";

const Index = () => {
  // 模拟数据
  const recentSnippets = [
    {
      id: '1',
      title: 'React useCallback Hook 示例',
      description: '演示如何正确使用 useCallback 优化 React 组件性能',
      tags: ['react', 'hooks', 'performance'],
      language: 'javascript',
      author: 'developer',
      createdAt: '2024-01-15',
      isPrivate: false,
      preview: 'const memoizedCallback = useCallback(() => {\n  doSomething(a, b);\n}, [a, b]);'
    },
    {
      id: '2', 
      title: 'Python 数据处理脚本',
      description: '使用 pandas 处理 CSV 数据的常用操作',
      tags: ['python', 'pandas', 'data'],
      language: 'python',
      author: 'data_analyst',
      createdAt: '2024-01-14',
      isPrivate: true,
      preview: 'import pandas as pd\n\ndf = pd.read_csv("data.csv")\ndf.head()'
    },
    {
      id: '3',
      title: 'CSS Grid 布局模板',
      description: '响应式网格布局的最佳实践',
      tags: ['css', 'grid', 'responsive'],
      language: 'css',
      author: 'ui_designer',
      createdAt: '2024-01-13',
      isPrivate: false,
      preview: '.grid-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 20px;\n}'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Code className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">CodeSnip</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="搜索代码片段..."
                  className="pl-10 w-64"
                />
              </div>
              <Link to="/create">
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>创建片段</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            优雅分享你的代码片段
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            CodeSnip 让你轻松创建、分享和管理代码片段。支持多种编程语言，提供美观的代码高亮和实时预览。
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/create">
              <Button size="lg" className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>开始创建</span>
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="flex items-center space-x-2">
              <Share className="h-5 w-5" />
              <span>浏览公开片段</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            为什么选择 CodeSnip？
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Code className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>多语言支持</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  支持 JavaScript、Python、CSS、HTML 等多种编程语言，提供语法高亮和智能补全。
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Share className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>便捷分享</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  一键生成分享链接，支持公开和私密分享模式，让协作变得更简单。
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Lock className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>安全可靠</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  支持密码保护和过期时间设置，确保你的代码片段安全可控。
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Snippets Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900">最近的代码片段</h3>
            <Button variant="outline">查看全部</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentSnippets.map((snippet) => (
              <Card key={snippet.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{snippet.title}</CardTitle>
                    {snippet.isPrivate && (
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <Lock className="h-3 w-3" />
                        <span>私密</span>
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-sm">
                    {snippet.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-4">
                    <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
                      <code>{snippet.preview}</code>
                    </pre>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {snippet.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{snippet.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{snippet.createdAt}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Code className="h-6 w-6" />
                <span className="text-lg font-semibold">CodeSnip</span>
              </div>
              <p className="text-gray-400 text-sm">
                让代码分享变得更简单、更优雅。
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">产品</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">功能特性</a></li>
                <li><a href="#" className="hover:text-white">使用指南</a></li>
                <li><a href="#" className="hover:text-white">API 文档</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">支持</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">帮助中心</a></li>
                <li><a href="#" className="hover:text-white">联系我们</a></li>
                <li><a href="#" className="hover:text-white">反馈建议</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">关于</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">关于我们</a></li>
                <li><a href="#" className="hover:text-white">隐私政策</a></li>
                <li><a href="#" className="hover:text-white">服务条款</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 CodeSnip. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
