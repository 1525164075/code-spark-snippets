
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccountSecurity = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "密码不匹配",
        description: "新密码和确认密码不一致",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "密码太短",
        description: "密码长度至少需要6位字符",
        variant: "destructive",
      });
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;

      setPasswordForm({ newPassword: '', confirmPassword: '' });
      toast({
        title: "密码更新成功",
        description: "您的密码已成功更新",
      });
    } catch (error: any) {
      toast({
        title: "密码更新失败",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmEmail !== user?.email) {
      toast({
        title: "邮箱地址不匹配",
        description: "请输入正确的邮箱地址以确认删除操作",
        variant: "destructive",
      });
      return;
    }

    if (!confirm('此操作将永久删除您的账户和所有相关数据，且无法恢复。确定要继续吗？')) {
      return;
    }

    setDeleteLoading(true);
    try {
      // First delete all user's snippets
      const { error: snippetsError } = await supabase
        .from('code_snippets')
        .delete()
        .eq('author_id', user?.id);

      if (snippetsError) throw snippetsError;

      // Then delete the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user?.id);

      if (profileError) throw profileError;

      toast({
        title: "账户删除成功",
        description: "您的账户已被永久删除",
      });

      // Sign out and redirect
      await signOut();
      navigate('/');
    } catch (error: any) {
      toast({
        title: "删除失败",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>修改密码</CardTitle>
          <CardDescription>更新您的账户密码</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">新密码</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="输入新密码"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认新密码</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="再次输入新密码"
                required
              />
            </div>

            <Button type="submit" disabled={passwordLoading}>
              {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              更新密码
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            危险区域
          </CardTitle>
          <CardDescription>
            以下操作将永久删除您的账户和所有相关数据，请谨慎操作
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirmEmail">
              输入您的邮箱地址以确认删除操作: <span className="font-mono text-sm">{user?.email}</span>
            </Label>
            <Input
              id="confirmEmail"
              type="email"
              value={deleteConfirmEmail}
              onChange={(e) => setDeleteConfirmEmail(e.target.value)}
              placeholder="输入您的邮箱地址"
            />
          </div>

          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={deleteLoading || deleteConfirmEmail !== user?.email}
          >
            {deleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            永久删除账户
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSecurity;
