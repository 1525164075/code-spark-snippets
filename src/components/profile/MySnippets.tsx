
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Eye, Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { apiService } from '@/services/apiService';

const MySnippets = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  const { data: snippets = [], isLoading, error } = useQuery({
    queryKey: ['userSnippets'],
    queryFn: () => apiService.getUserSnippets(),
    enabled: !!user
  });

  const handleDelete = async (id: string) => {
    if (!confirm(t('profile.deleteConfirm'))) return;

    try {
      // Note: We'll need to add a delete method to apiService
      await apiService.deleteSnippet(id);
      
      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ['userSnippets'] });
      
      toast({
        title: t('profile.deleteSuccess'),
        description: t('profile.deleteSuccessDesc'),
      });
    } catch (error: any) {
      toast({
        title: t('profile.deleteFailed'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
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
            <CardTitle>{t('profile.mySnippetsTitle')}</CardTitle>
            <CardDescription>
              {t('profile.mySnippetsDesc', { count: snippets.length })}
            </CardDescription>
          </div>
          <Button asChild>
            <Link to="/create">
              <Plus className="mr-2 h-4 w-4" />
              {t('profile.createNewSnippet')}
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {snippets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">{t('profile.noSnippetsYet')}</p>
            <Button asChild>
              <Link to="/create">{t('profile.createFirstSnippet')}</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('profile.snippetTitle')}</TableHead>
                  <TableHead>{t('profile.language')}</TableHead>
                  <TableHead>{t('profile.visibility')}</TableHead>
                  <TableHead>{t('profile.viewCount')}</TableHead>
                  <TableHead>{t('profile.createdAt')}</TableHead>
                  <TableHead>{t('profile.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snippets.map((snippet) => (
                  <TableRow key={snippet._id}>
                    <TableCell className="font-medium">{snippet.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{snippet.files[0]?.language || 'javascript'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={snippet.visibility === 'private' ? "destructive" : "default"}>
                        {snippet.visibility === 'private' ? t('profile.private') : t('profile.public')}
                      </Badge>
                    </TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>
                      {format(new Date(snippet.createdAt), 'yyyy年MM月dd日', { 
                        locale: i18n.language === 'zh-CN' ? zhCN : enUS 
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                        >
                          <Link to={`/share/${snippet._id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(snippet._id!)}
                        >
                          <Trash2 className="h-4 w-4" />
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
