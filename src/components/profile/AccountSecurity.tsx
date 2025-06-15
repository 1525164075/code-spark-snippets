
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AccountSecurity = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
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
        title: t('profile.passwordMismatch'),
        description: t('profile.passwordMismatchDesc'),
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: t('profile.passwordTooShort'),
        description: t('profile.passwordTooShortDesc'),
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
        title: t('profile.passwordUpdateSuccess'),
        description: t('profile.passwordUpdateSuccessDesc'),
      });
    } catch (error: any) {
      toast({
        title: t('profile.passwordUpdateFailed'),
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
        title: t('profile.emailMismatch'),
        description: t('profile.emailMismatchDesc'),
        variant: "destructive",
      });
      return;
    }

    if (!confirm(t('profile.deleteConfirm'))) {
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
        title: t('profile.deleteAccountSuccess'),
        description: t('profile.deleteAccountSuccessDesc'),
      });

      // Sign out and redirect
      await signOut();
      navigate('/');
    } catch (error: any) {
      toast({
        title: t('profile.deleteAccountFailed'),
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
          <CardTitle>{t('profile.changePassword')}</CardTitle>
          <CardDescription>{t('profile.changePasswordDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t('profile.newPassword')}</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder={t('profile.newPasswordPlaceholder')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('profile.confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder={t('profile.confirmPasswordPlaceholder')}
                required
              />
            </div>

            <Button type="submit" disabled={passwordLoading}>
              {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('profile.updatePassword')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {t('profile.dangerZone')}
          </CardTitle>
          <CardDescription>
            {t('profile.dangerZoneDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirmEmail">
              {t('profile.confirmEmailLabel')} <span className="font-mono text-sm">{user?.email}</span>
            </Label>
            <Input
              id="confirmEmail"
              type="email"
              value={deleteConfirmEmail}
              onChange={(e) => setDeleteConfirmEmail(e.target.value)}
              placeholder={t('profile.confirmEmailPlaceholder')}
            />
          </div>

          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={deleteLoading || deleteConfirmEmail !== user?.email}
          >
            {deleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('profile.deleteAccountButton')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSecurity;
