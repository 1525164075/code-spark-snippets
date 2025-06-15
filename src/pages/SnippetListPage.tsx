
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Calendar, Code, Tag, Eye } from 'lucide-react';
import { ICodeSnippet } from '../types/CodeSnippet';
import CodePreviewModal from '../components/CodePreviewModal';

// Mock API call function
const fetchSnippets = async (): Promise<ICodeSnippet[]> => {
  console.log('Fetching snippets list...');
  
  // Simulate network delay
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
          content: 'const useLocalStorage = (key, initialValue) => {\n  const [storedValue, setStoredValue] = useState(() => {\n    try {\n      const item = window.localStorage.getItem(key);\n      return item ? JSON.parse(item) : initialValue;\n    } catch (error) {\n      console.log(error);\n      return initialValue;\n    }\n  });\n\n  const setValue = (value) => {\n    try {\n      setStoredValue(value);\n      window.localStorage.setItem(key, JSON.stringify(value));\n    } catch (error) {\n      console.log(error);\n    }\n  };\n\n  return [storedValue, setValue];\n};'
        }
      ],
      description: '一个用于管理 localStorage 的自定义 React Hook，支持 JSON 序列化和错误处理',
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
          content: '@keyframes fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n@keyframes slideIn {\n  from {\n    transform: translateX(-100%);\n  }\n  to {\n    transform: translateX(0);\n  }\n}\n\n.fade-in {\n  animation: fadeIn 0.3s ease-out;\n}\n\n.slide-in {\n  animation: slideIn 0.5s ease-out;\n}'
        }
      ],
      description: '常用的 CSS 动画效果合集，包含淡入、滑入等效果',
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
          content: '// 可选属性类型\ntype Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;\n\n// 深度只读类型\ntype DeepReadonly<T> = {\n  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];\n};\n\n// 提取函数返回类型\ntype ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never;\n\n// 使用示例\ninterface User {\n  id: string;\n  name: string;\n  email: string;\n}\n\n// 让 email 变为可选\ntype UserWithOptionalEmail = Optional<User, "email">;'
        }
      ],
      description: '实用的 TypeScript 工具类型定义，提高类型安全性',
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
          content: 'class ApiClient {\n  constructor(baseURL) {\n    this.baseURL = baseURL;\n    this.headers = {\n      "Content-Type": "application/json",\n    };\n  }\n\n  async request(endpoint, options = {}) {\n    const url = `${this.baseURL}${endpoint}`;\n    const config = {\n      headers: this.headers,\n      ...options,\n    };\n\n    try {\n      const response = await fetch(url, config);\n      if (!response.ok) {\n        throw new Error(`HTTP error! status: ${response.status}`);\n      }\n      return await response.json();\n    } catch (error) {\n      console.error("API request failed:", error);\n      throw error;\n    }\n  }\n\n  get(endpoint) {\n    return this.request(endpoint, { method: "GET" });\n  }\n\n  post(endpoint, data) {\n    return this.request(endpoint, {\n      method: "POST",\n      body: JSON.stringify(data),\n    });\n  }\n}'
        }
      ],
      description: '简单的 API 请求封装类，支持 GET、POST 等方法',
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
          content: '// 响应式断点\n$breakpoints: (\n  mobile: 480px,\n  tablet: 768px,\n  desktop: 1024px,\n  large: 1200px\n);\n\n// 媒体查询 mixin\n@mixin respond-to($breakpoint) {\n  @if map-has-key($breakpoints, $breakpoint) {\n    @media (min-width: map-get($breakpoints, $breakpoint)) {\n      @content;\n    }\n  } @else {\n    @warn "Unfortunately, no value could be retrieved from `#{$breakpoint}`. "\n        + "Available breakpoints are: #{map-keys($breakpoints)}.";\n  }\n}\n\n// 使用示例\n.container {\n  width: 100%;\n  padding: 0 16px;\n  \n  @include respond-to(tablet) {\n    padding: 0 24px;\n  }\n  \n  @include respond-to(desktop) {\n    max-width: 1200px;\n    margin: 0 auto;\n  }\n}'
        }
      ],
      description: 'SCSS 响应式设计混入，简化媒体查询的使用',
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
  const { t } = useTranslation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [previewSnippet, setPreviewSnippet] = useState<ICodeSnippet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use useQuery to fetch data
  const { 
    data: snippets = [], 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['snippets'],
    queryFn: fetchSnippets
  });

  // Handle errors with useEffect
  useEffect(() => {
    if (isError && error) {
      console.error('Failed to fetch snippets:', error);
      toast({
        title: "加载失败",
        description: "无法加载代码片段列表，请稍后重试",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  // 过滤和排序逻辑
  const filteredAndSortedSnippets = React.useMemo(() => {
    let filtered = snippets.filter(snippet =>
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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

  const handlePreview = (snippet: ICodeSnippet) => {
    setPreviewSnippet(snippet);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">{t('common.loading')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600">加载失败，请稍后重试</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                {t('common.retry')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Apple-inspired header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="apple-title mb-4">{t('snippets.title')}</h1>
            <p className="apple-subtitle mb-8">
              {t('snippets.subtitle')}
            </p>
            <Button onClick={() => navigate('/create')} size="lg" className="rounded-full px-8">
              <Plus className="h-5 w-5 mr-2" />
              {t('nav.create')}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('snippets.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48 rounded-xl">
              <SelectValue placeholder={t('snippets.sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">{t('snippets.sortNewest')}</SelectItem>
              <SelectItem value="title">{t('snippets.sortTitle')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Apple-inspired single column list */}
        {filteredAndSortedSnippets.length === 0 ? (
          <div className="text-center py-16">
            <Code className="mx-auto h-16 w-16 text-gray-300 mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('snippets.noSnippets')}</h3>
            <p className="text-gray-600 mb-8">
              {searchTerm ? t('snippets.tryDifferent') : t('snippets.createFirst')}
            </p>
            {!searchTerm && (
              <Button onClick={() => navigate('/create')} size="lg" className="rounded-full">
                <Plus className="h-5 w-5 mr-2" />
                {t('nav.create')}
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAndSortedSnippets.map((snippet) => (
              <div key={snippet._id} className="apple-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Link
                      to={`/share/${snippet._id}`}
                      className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {snippet.title}
                    </Link>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(snippet.createdAt).toLocaleDateString('zh-CN')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Code className="h-4 w-4" />
                        {snippet.files.length} {t('snippets.files')}
                      </div>
                      <Badge variant={snippet.visibility === 'public' ? "default" : "destructive"} className="text-xs">
                        {snippet.visibility === 'public' ? t('snippets.public') : t('snippets.private')}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {snippet.description.replace(/[#*`]/g, '').substring(0, 150)}...
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {snippet.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs rounded-full">
                        {tag}
                      </Badge>
                    ))}
                    {snippet.tags.length > 4 && (
                      <Badge variant="outline" className="text-xs rounded-full">
                        +{snippet.tags.length - 4}
                      </Badge>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => handlePreview(snippet)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t('snippets.preview')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Code preview modal */}
      <CodePreviewModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        snippet={previewSnippet}
      />
    </div>
  );
};

export default SnippetListPage;
