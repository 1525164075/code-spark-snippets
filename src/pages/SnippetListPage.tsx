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
import { Search, Plus, Calendar, Code, Tag, Eye, ChevronDown } from 'lucide-react';
import { ICodeSnippet } from '../types/CodeSnippet';
import CodePreviewModal from '../components/CodePreviewModal';
import { mockDataStore } from '../services/mockDataStore';

const SnippetListPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [previewSnippet, setPreviewSnippet] = useState<ICodeSnippet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Use useQuery to fetch data with the correct queryKey that matches the invalidation
  const { 
    data: snippets = [], 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['snippets'],
    queryFn: () => mockDataStore.getAllSnippets()
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

  const toggleExpanded = (snippetId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(snippetId)) {
        newSet.delete(snippetId);
      } else {
        newSet.add(snippetId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
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
      <div className="min-h-screen bg-gray-50 pt-20">
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
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Apple-inspired header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="apple-title mb-4">{t('snippets.title')}</h1>
            <p className="apple-subtitle mb-8">
              {t('snippets.subtitle')}
            </p>
            <Button onClick={() => navigate('/create')} size="lg" className="rounded-full px-8 font-medium">
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
              className="pl-10 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48 rounded-xl border-gray-300">
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
              <div 
                key={snippet._id} 
                className="bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
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
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => toggleExpanded(snippet._id)}
                  >
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform ${
                        expandedItems.has(snippet._id) ? 'rotate-180' : ''
                      }`} 
                    />
                  </Button>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {snippet.description.replace(/[#*`]/g, '').substring(0, 150)}...
                </p>

                {/* Expandable code preview */}
                {expandedItems.has(snippet._id) && (
                  <div className="mb-4 border rounded-lg overflow-hidden bg-gray-50">
                    <div className="bg-gray-100 px-4 py-2 border-b">
                      <span className="font-medium text-sm">{snippet.files[0]?.filename}</span>
                    </div>
                    <div className="p-4">
                      <pre className="apple-mono text-sm text-gray-800 overflow-x-auto">
                        <code>{snippet.files[0]?.content.substring(0, 500)}...</code>
                      </pre>
                    </div>
                  </div>
                )}
                
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
