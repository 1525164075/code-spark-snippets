
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Plus, Search, Code, Share, Lock, Clock, Tag, User, Calendar, Eye } from "lucide-react";
import React, { useState } from 'react';
import CodePreviewModal from "@/components/CodePreviewModal";
import { ICodeSnippet } from "@/types/CodeSnippet";

const Index = () => {
  const [previewSnippet, setPreviewSnippet] = useState<ICodeSnippet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 模拟数据
  const recentSnippets = [
    {
      _id: '1',
      title: 'React useCallback Hook 示例',
      description: '演示如何正确使用 useCallback 优化 React 组件性能',
      tags: ['react', 'hooks', 'performance'],
      files: [
        {
          filename: 'useCallback-example.js',
          language: 'javascript',
          content: 'import React, { useState, useCallback } from \'react\';\n\nfunction ExpensiveComponent({ onButtonClick }) {\n  console.log(\'ExpensiveComponent rendered\');\n  return <button onClick={onButtonClick}>Click me</button>;\n}\n\nfunction App() {\n  const [count, setCount] = useState(0);\n  const [name, setName] = useState(\'\');\n\n  // 使用 useCallback 优化性能\n  const memoizedCallback = useCallback(() => {\n    setCount(prevCount => prevCount + 1);\n  }, []); // 依赖数组为空，回调函数永远不会改变\n\n  return (\n    <div>\n      <input \n        value={name} \n        onChange={(e) => setName(e.target.value)} \n        placeholder="Type your name"\n      />\n      <p>Count: {count}</p>\n      <ExpensiveComponent onButtonClick={memoizedCallback} />\n    </div>\n  );\n}'
        }
      ],
      visibility: 'public' as const,
      createdAt: new Date('2024-01-15')
    },
    {
      _id: '2', 
      title: 'Python 数据处理脚本',
      description: '使用 pandas 处理 CSV 数据的常用操作',
      tags: ['python', 'pandas', 'data'],
      files: [
        {
          filename: 'data-processing.py',
          language: 'python',
          content: 'import pandas as pd\nimport numpy as np\nfrom datetime import datetime\n\n# 读取 CSV 文件\ndf = pd.read_csv("data.csv")\n\n# 数据清洗\nprint("数据基本信息：")\nprint(df.info())\nprint("\\n缺失值统计：")\nprint(df.isnull().sum())\n\n# 处理缺失值\ndf.fillna(df.mean(), inplace=True)  # 数值列用均值填充\ndf[\'category\'].fillna(\'未知\', inplace=True)  # 分类列用默认值填充\n\n# 数据转换\ndf[\'date\'] = pd.to_datetime(df[\'date\'])\ndf[\'year\'] = df[\'date\'].dt.year\ndf[\'month\'] = df[\'date\'].dt.month\n\n# 数据分组聚合\nresult = df.groupby([\'category\', \'year\']).agg({\n    \'sales\': [\'sum\', \'mean\', \'count\'],\n    \'profit\': \'sum\'\n}).round(2)\n\nprint("\\n聚合结果：")\nprint(result)\n\n# 保存处理后的数据\ndf.to_csv("processed_data.csv", index=False)\nprint("\\n数据处理完成，结果已保存到 processed_data.csv")'
        }
      ],
      visibility: 'private' as const,
      createdAt: new Date('2024-01-14')
    },
    {
      _id: '3',
      title: 'CSS Grid 布局模板',
      description: '响应式网格布局的最佳实践',
      tags: ['css', 'grid', 'responsive'],
      files: [
        {
          filename: 'grid-layout.css',
          language: 'css',
          content: '/* 基础网格容器 */\n.grid-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 20px;\n  padding: 20px;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n\n/* 响应式网格项 */\n.grid-item {\n  background: #ffffff;\n  border-radius: 8px;\n  padding: 20px;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n  transition: transform 0.2s ease;\n}\n\n.grid-item:hover {\n  transform: translateY(-5px);\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);\n}\n\n/* 特殊布局：头部占满宽度 */\n.grid-header {\n  grid-column: 1 / -1;\n  text-align: center;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n  padding: 40px;\n  border-radius: 12px;\n}\n\n/* 侧边栏布局 */\n.grid-sidebar {\n  grid-row: span 2;\n  background: #f8f9fa;\n}\n\n/* 移动端适配 */\n@media (max-width: 768px) {\n  .grid-container {\n    grid-template-columns: 1fr;\n    gap: 15px;\n    padding: 15px;\n  }\n  \n  .grid-sidebar {\n    grid-row: span 1;\n  }\n}'
        }
      ],
      visibility: 'public' as const,
      createdAt: new Date('2024-01-13')
    }
  ];

  const handlePreview = (snippet: any) => {
    setPreviewSnippet(snippet);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
            <Link to="/snippets">
              <Button variant="outline" size="lg" className="flex items-center space-x-2">
                <Share className="h-5 w-5" />
                <span>浏览公开片段</span>
              </Button>
            </Link>
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
            <Link to="/snippets">
              <Button variant="outline">查看全部</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentSnippets.map((snippet) => (
              <Card key={snippet._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{snippet.title}</CardTitle>
                    {snippet.visibility === 'private' && (
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
                      <code>{snippet.files[0]?.content.substring(0, 100)}...</code>
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
                  
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>developer</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{snippet.createdAt.toLocaleDateString('zh-CN')}</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handlePreview(snippet)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    预览代码
                  </Button>
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

      {/* 代码预览模态框 */}
      <CodePreviewModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        snippet={previewSnippet}
      />
    </div>
  );
};

export default Index;
