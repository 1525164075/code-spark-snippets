
import React from 'react';
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
import { zhCN } from 'date-fns/locale';
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>基本设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 标题 */}
          <div>
            <Label htmlFor="title">标题 *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入代码片段标题"
              className="mt-1"
            />
          </div>

          {/* 标签 */}
          <div>
            <Label>标签</Label>
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
                  placeholder="添加标签"
                  className="flex-1"
                />
                <Button onClick={addTag} size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* 过期时间 */}
          <div>
            <Label>过期时间</Label>
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
                  {expiryDate ? format(expiryDate, "PPP", { locale: zhCN }) : "选择过期日期（可选）"}
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
                      清除过期时间
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* 隐私设置 */}
      <Card>
        <CardHeader>
          <CardTitle>隐私设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>可见性</Label>
            <Select value={visibility} onValueChange={onVisibilityChange}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">公开 - 任何人都可以查看</SelectItem>
                <SelectItem value="private">私有 - 需要密码访问</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {visibility === 'private' && (
            <div>
              <Label htmlFor="password">访问密码</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                placeholder="设置访问密码（至少6位）"
                className="mt-1"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <Button 
        onClick={onSubmit} 
        loading={loading}
        className="w-full"
        size="lg"
      >
        {loading ? '创建中...' : '创建代码片段'}
      </Button>
    </div>
  );
};

export default SettingsPanel;
