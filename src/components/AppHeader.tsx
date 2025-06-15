
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import LanguageSwitcher from './LanguageSwitcher';

const AppHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive 
        ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <Code2 className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900 tracking-tight">CodeSnip</span>
        </NavLink>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          <NavLink to="/" className={navLinkClassName}>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/snippets" className={navLinkClassName}>
            {t('nav.explore')}
          </NavLink>
          {user && (
            <NavLink to="/create" className={navLinkClassName}>
              {t('nav.create')}
            </NavLink>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          
          {user ? (
            <div className="flex items-center space-x-3">
              <Button asChild size="sm" className="rounded-full font-medium">
                <NavLink to="/create">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('nav.create')}
                </NavLink>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-100 transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
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
                      {t('nav.mySnippets')}
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      {t('nav.profile')}
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Button asChild variant="ghost" className="font-medium">
                <NavLink to="/login">{t('nav.login')}</NavLink>
              </Button>
              <Button asChild className="rounded-full font-medium">
                <NavLink to="/register">{t('nav.register')}</NavLink>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
