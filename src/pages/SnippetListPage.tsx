
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Calendar, Code, Tag } from 'lucide-react';
import { ICodeSnippet } from '../types/CodeSnippet';

// 模拟 API 调用函数
const fetchSnippets = async (): Promise<ICodeSnippet[]> => {
  console.log('Fetching snippets list...');
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 模拟数据
  const mockSnippets: ICodeSnippet[] = [
    {
      _id: 'snippet-1',
      title: 'React Hook 实用工具',
      files: [
        {
          filename: 'useLocalStorage.js',
          language: 'javascript',
          content: 'const useLocalStorage = (key, initialValue) => { ... }'
        }
      ],
      description: '一个用于管理 localStorage 的自定义 React Hook',
      tags: ['react', 'hooks', 'utils'],
      visibility: 'public',
      createdAt: new Date('2024-01-15')
    },
    {
      _id: 'snippet-2',
      title: 'CSS 动画库',
      files: [
        {
          filename: 'animations.css',
          language: 'css',
          content: '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }'
        }
      ],
      description: '常用的 CSS 动画效果合集',
      tags: ['css', 'animation', 'ui'],
      visibility: 'public',
      createdAt: new Date('2024-01-14')
    },
    {
      _id: 'snippet-3',
      title: 'TypeScript 工具类型',
      files: [
        {
          filename: 'utils.ts',
          language: 'typescript',
          content: 'type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;'
        }
      ],
      description: '实用的 TypeScript 工具类型定义',
      tags: ['typescript', 'types', 'utils'],
      visibility: 'public',
      createdAt: new Date('2024-01-13')
    },
    {
      _id: 'snippet-4',
      title: 'API 请求封装',
      files: [
        {
          filename: 'api.js',
          language: 'javascript',
          content: 'const api = { get: (url) => fetch(url), post: (url, data) => fetch(url, { method: "POST", body: JSON.stringify(data) }) };'
        }
      ],
      description: '简单的 API 请求封装函数',
      tags: ['javascript', 'api', 'fetch'],
      visibility: 'public',
      createdAt: new Date('2024-01-12')
    },
    {
      _id: 'snippet-5',
      title: '响应式设计 Mixins',
      files: [
        {
          filename: 'mixins.scss',
          language: 'scss',
          content: '@mixin mobile { @media (max-width: 768px) { @content; } }'
        }
      ],
      description: 'SCSS 响应式设计混入',
      tags: ['scss', 'responsive', 'css'],
      visibility: 'public',
      createdAt: new Date('2024-01-11')
    }
  ];
  
  return mockSnippets;
};

const SnippetListPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  // 使用 useQuery 来获取数据
  const { 
    data: snippets = [], 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['snippets'],
    queryFn: fetchSnippets,
    onError: (error: Error) => {
      console.error('Failed to fetch snippets:', error);
      toast({
        title: "加载失败",
        description: "无法加载代码片段列表，请稍后重试",
        variant: "destructive",
      });
    }
  });

  // 过滤和排序逻辑
  const filteredAndSortedSnippets = React.useMemo(() => {
    let filtered = snippets.filter(snippet =>
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // 排序逻辑
    filtered.sort((a, b) => {
      if (sortBy === 'createdAt') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return filtered;
  }, [snippets, searchTerm, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">正在加载代码片段...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600">加载失败，请稍后重试</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                重新加载
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">代码片段</h1>
              <p className="mt-1 text-sm text-gray-500">
                发现和分享有用的代码片段
              </p>
            </div>
            <Button onClick={() => navigate('/create')} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              创建代码片段
            </Button>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索和过滤 */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索代码片段、标签或描述..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="排序方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">最新创建</SelectItem>
              <SelectItem value="title">标题排序</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 代码片段列表 */}
        {filteredAndSortedSnippets.length === 0 ? (
          <div className="text-center py-12">
            <Code className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">没有找到代码片段</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? '尝试使用不同的搜索词' : '开始创建你的第一个代码片段吧'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <Button onClick={() => navigate('/create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  创建代码片段
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedSnippets.map((snippet) => (
              <Card key={snippet._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link
                      to={`/share/${snippet._id}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {snippet.title}
                    </Link>
                  </CardTitle>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {snippet.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {snippet.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{snippet.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {snippet.description.replace(/[#*`]/g, '').substring(0, 120)}...
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(snippet.createdAt).toLocaleDateString('zh-CN')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Code className="h-3 w-3" />
                      {snippet.files.length} 个文件
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SnippetListPage;
