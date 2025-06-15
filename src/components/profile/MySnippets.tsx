
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Eye, Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface CodeSnippet {
  id: string;
  title: string;
  language: string;
  created_at: string;
  view_count: number;
  is_private: boolean;
  share_id: string;
}

const MySnippets = () => {
  const { user } = useAuth();
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const fetchMySnippets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('code_snippets')
        .select('id, title, language, created_at, view_count, is_private, share_id')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSnippets(data || []);
    } catch (error: any) {
      toast({
        title: "加载失败",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个代码片段吗？此操作不可恢复。')) return;

    setDeleteLoading(id);
    try {
      const { error } = await supabase
        .from('code_snippets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSnippets(snippets.filter(snippet => snippet.id !== id));
      toast({
        title: "删除成功",
        description: "代码片段已删除",
      });
    } catch (error: any) {
      toast({
        title: "删除失败",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  useEffect(() => {
    fetchMySnippets();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>我的代码片段</CardTitle>
            <CardDescription>
              管理您创建的所有代码片段 ({snippets.length} 个)
            </CardDescription>
          </div>
          <Button asChild>
            <Link to="/create">
              <Plus className="mr-2 h-4 w-4" />
              创建新片段
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {snippets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">您还没有创建任何代码片段</p>
            <Button asChild>
              <Link to="/create">创建第一个代码片段</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>标题</TableHead>
                  <TableHead>语言</TableHead>
                  <TableHead>可见性</TableHead>
                  <TableHead>浏览次数</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snippets.map((snippet) => (
                  <TableRow key={snippet.id}>
                    <TableCell className="font-medium">{snippet.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{snippet.language}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={snippet.is_private ? "destructive" : "default"}>
                        {snippet.is_private ? "私有" : "公开"}
                      </Badge>
                    </TableCell>
                    <TableCell>{snippet.view_count}</TableCell>
                    <TableCell>
                      {format(new Date(snippet.created_at), 'yyyy年MM月dd日', { locale: zhCN })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                        >
                          <Link to={`/share/${snippet.share_id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(snippet.id)}
                          disabled={deleteLoading === snippet.id}
                        >
                          {deleteLoading === snippet.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MySnippets;
