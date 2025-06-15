
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface SettingsPanelProps {
  title: string;
  setTitle: (title: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  expiryDate: Date | null;
  setExpiryDate: (date: Date | null) => void;
  visibility: 'public' | 'private';
  password: string;
  onVisibilityChange: (visibility: 'public' | 'private') => void;
  onPasswordChange: (password: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  title,
  setTitle,
  tags,
  setTags,
  expiryDate,
  setExpiryDate,
  visibility,
  password,
  onVisibilityChange,
  onPasswordChange,
  onSubmit,
  loading
}) => {
  const { t, i18n } = useTranslation();
  const [newTag, setNewTag] = React.useState('');

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // Get the appropriate locale for date formatting
  const dateLocale = i18n.language === 'zh-CN' ? zhCN : enUS;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('create.basicSettings')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">{t('create.titleRequired')}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('create.titlePlaceholderText')}
              className="mt-1"
            />
          </div>

          {/* Tags */}
          <div>
            <Label>{t('create.tags')}</Label>
            <div className="mt-1 space-y-2">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTag(tag)}
                      className="h-4 w-4 p-0 hover:bg-red-100"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('create.addTagPlaceholder')}
                  className="flex-1"
                />
                <Button onClick={addTag} size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <Label>{t('create.expiryDate')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !expiryDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, "PPP", { locale: dateLocale }) : t('create.expiryDateOptional')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={expiryDate || undefined}
                  onSelect={(date) => setExpiryDate(date || null)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
                {expiryDate && (
                  <div className="p-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpiryDate(null)}
                      className="w-full"
                    >
                      {t('create.clearExpiryDate')}
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('create.privacySettings')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{t('create.visibility')}</Label>
            <Select value={visibility} onValueChange={onVisibilityChange}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">{t('create.publicVisibility')}</SelectItem>
                <SelectItem value="private">{t('create.privateVisibility')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {visibility === 'private' && (
            <div>
              <Label htmlFor="password">{t('create.accessPassword')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                placeholder={t('create.passwordRequiredPlaceholder')}
                className="mt-1"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Button */}
      <Button 
        onClick={onSubmit} 
        disabled={loading}
        className="w-full"
        size="lg"
      >
        {loading ? t('create.creating') : t('create.createButton')}
      </Button>
    </div>
  );
};

export default SettingsPanel;
