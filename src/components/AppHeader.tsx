
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { Code2, Plus, List, LogOut, User } from 'lucide-react';

const AppHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive 
        ? 'bg-blue-100 text-blue-700 font-semibold' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`;

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* 左侧 Logo */}
        <NavLink to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Code2 className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">CodeSnip</span>
        </NavLink>

        {/* 中间导航链接 */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavLink to="/" className={navLinkClassName}>
            首页
          </NavLink>
          <NavLink to="/snippets" className={navLinkClassName}>
            代码广场
          </NavLink>
          {user && (
            <NavLink to="/create" className={navLinkClassName}>
              创建代码
            </NavLink>
          )}
        </nav>

        {/* 右侧操作区 */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <Button asChild variant="outline" size="sm">
                <NavLink to="/create">
                  <Plus className="h-4 w-4 mr-1" />
                  创建
                </NavLink>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.user_metadata?.full_name 
                          ? getInitials(user.user_metadata.full_name)
                          : user.email?.[0]?.toUpperCase() || 'U'
                        }
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">
                      {user.user_metadata?.full_name || '用户'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <NavLink to="/snippets" className="cursor-pointer">
                      <List className="mr-2 h-4 w-4" />
                      我的代码片段
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      个人资料
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Button asChild variant="ghost">
                <NavLink to="/login">登录</NavLink>
              </Button>
              <Button asChild>
                <NavLink to="/register">注册</NavLink>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
