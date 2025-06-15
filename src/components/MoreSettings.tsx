
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface MoreSettingsProps {
  title: string;
  setTitle: (title: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  expiryHours: number | null;
  setExpiryHours: (hours: number | null) => void;
}

// 过期时间选项
const EXPIRY_OPTIONS = [
  { value: 'never', label: '永不过期' },
  { value: '1', label: '1小时后' },
  { value: '24', label: '1天后' },
  { value: '168', label: '1周后' },  // 7 * 24
  { value: '720', label: '1个月后' }, // 30 * 24
];

const MoreSettings: React.FC<MoreSettingsProps> = ({ 
  title, 
  setTitle, 
  tags, 
  setTags, 
  expiryHours, 
  setExpiryHours 
}) => {
  const [tagInput, setTagInput] = React.useState('');

  const handleAddTag = (value: string) => {
    if (value.trim() && !tags.includes(value.trim()) && tags.length < 10) {
      setTags([...tags, value.trim()]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
      setTagInput('');
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>更多设置</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">标题 *</Label>
            <Input
              id="title"
              placeholder="为你的代码片段起个好名字..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
            <p className="text-sm text-gray-500">{title.length}/100 字符</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">标签</Label>
            <Input
              id="tags"
              placeholder="添加标签 (如: react, typescript, utils...)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              onBlur={() => {
                if (tagInput.trim()) {
                  handleAddTag(tagInput);
                  setTagInput('');
                }
              }}
            />
            <p className="text-sm text-gray-500">按回车键添加标签，便于分类和搜索</p>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiry">过期时间</Label>
            <Select 
              value={expiryHours === null ? 'never' : expiryHours.toString()} 
              onValueChange={(value) => setExpiryHours(value === 'never' ? null : parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择过期时间" />
              </SelectTrigger>
              <SelectContent>
                {EXPIRY_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">设置代码片段的有效期</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoreSettings;
