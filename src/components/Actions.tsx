
import React, { useState, useCallback } from 'react';
import { Card, Radio, Input, Button, Space } from 'antd';
import { ReloadOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

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

  // 动画配置
  const slideVariants = {
    hidden: {
      height: 0,
      opacity: 0,
      marginTop: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: {
      height: "auto",
      opacity: 1,
      marginTop: 16,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <Card className="sticky bottom-0 bg-white shadow-lg border-t-2 border-blue-100">
      <div className="space-y-4">
        {/* 可见性设置 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">代码片段可见性</h4>
          <Radio.Group
            value={visibility}
            onChange={(e) => onVisibilityChange(e.target.value)}
            optionType="button"
            buttonStyle="solid"
            size="large"
          >
            <Radio.Button value="public" className="flex items-center">
              <GlobalOutlined className="mr-2" />
              公开分享
            </Radio.Button>
            <Radio.Button value="private" className="flex items-center">
              <LockOutlined className="mr-2" />
              加密分享
            </Radio.Button>
          </Radio.Group>
        </div>

        {/* 密码输入框 - 带动画 */}
        <AnimatePresence>
          {visibility === 'private' && (
            <motion.div
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              style={{ overflow: 'hidden' }}
            >
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h5 className="text-sm font-medium text-yellow-800 mb-2">
                  设置访问密码
                </h5>
                <p className="text-xs text-yellow-600 mb-3">
                  其他人需要输入正确密码才能查看此代码片段
                </p>
                <Input.Password
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  placeholder="输入6位以上密码"
                  size="large"
                  maxLength={20}
                  addonAfter={
                    <Button
                      type="text"
                      icon={<ReloadOutlined />}
                      onClick={generateRandomPassword}
                      title="生成随机密码"
                      className="border-0 shadow-none hover:bg-gray-100"
                    />
                  }
                  className="font-mono"
                />
                {password && password.length < 6 && (
                  <p className="text-xs text-red-500 mt-1">
                    密码长度至少需要6位字符
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 提交按钮 */}
        <div className="flex justify-end pt-4 border-t">
          <Space>
            <Button size="large" disabled={loading}>
              保存草稿
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={onSubmit}
              loading={loading}
              className="min-w-[120px]"
            >
              {loading ? '创建中...' : '创建代码片段'}
            </Button>
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default Actions;
