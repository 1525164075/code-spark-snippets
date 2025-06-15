
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Code, Shield } from 'lucide-react';
import ProfileInfo from '@/components/profile/ProfileInfo';
import MySnippets from '@/components/profile/MySnippets';
import AccountSecurity from '@/components/profile/AccountSecurity';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">用户中心</h1>
          <p className="mt-2 text-gray-600">管理您的个人信息和代码片段</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              个人资料
            </TabsTrigger>
            <TabsTrigger value="snippets" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              我的代码
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              账户安全
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileInfo />
          </TabsContent>

          <TabsContent value="snippets">
            <MySnippets />
          </TabsContent>

          <TabsContent value="security">
            <AccountSecurity />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
