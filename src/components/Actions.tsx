
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { RotateCcw, Lock, Globe } from 'lucide-react';

interface ActionsProps {
  visibility: 'public' | 'private';
  password: string;
  onVisibilityChange: (visibility: 'public' | 'private') => void;
  onPasswordChange: (password: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}

const Actions: React.FC<ActionsProps> = ({
  visibility,
  password,
  onVisibilityChange,
  onPasswordChange,
  onSubmit,
  loading = false
}) => {
  // 生成随机密码
  const generateRandomPassword = useCallback(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    onPasswordChange(result);
  }, [onPasswordChange]);

  return (
    <Card className="sticky bottom-0 bg-white shadow-lg border-t-2 border-blue-100">
      <CardHeader>
        <CardTitle>操作设置</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 可见性设置 */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">代码片段可见性</Label>
          <RadioGroup value={visibility} onValueChange={onVisibilityChange} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public" className="flex items-center cursor-pointer">
                <Globe className="mr-2 h-4 w-4" />
                公开分享
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="private" />
              <Label htmlFor="private" className="flex items-center cursor-pointer">
                <Lock className="mr-2 h-4 w-4" />
                加密分享
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* 密码输入框 - 简化动画 */}
        {visibility === 'private' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 animate-fade-in">
            <h5 className="text-sm font-medium text-yellow-800 mb-2">
              设置访问密码
            </h5>
            <p className="text-xs text-yellow-600 mb-3">
              其他人需要输入正确密码才能查看此代码片段
            </p>
            <div className="flex gap-2">
              <Input
                type="password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                placeholder="输入6位以上密码"
                maxLength={20}
                className="font-mono flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={generateRandomPassword}
                title="生成随机密码"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            {password && password.length < 6 && (
              <p className="text-xs text-red-500 mt-1">
                密码长度至少需要6位字符
              </p>
            )}
          </div>
        )}

        {/* 提交按钮 */}
        <div className="flex justify-end pt-4 border-t gap-2">
          <Button variant="outline" size="lg" disabled={loading}>
            保存草稿
          </Button>
          <Button
            onClick={onSubmit}
            disabled={loading}
            size="lg"
            className="min-w-[120px]"
          >
            {loading ? '创建中...' : '创建代码片段'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Actions;
