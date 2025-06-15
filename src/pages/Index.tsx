
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Search, Code, ArrowRight, Sparkles, Users, Zap } from 'lucide-react';
import { mockDataStore } from '../services/mockDataStore';
import { ICodeSnippet } from '../types/CodeSnippet';

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Fetch featured snippets for the homepage
  const { data: snippets = [] } = useQuery({
    queryKey: ['snippets'],
    queryFn: () => mockDataStore.getAllSnippets()
  });

  // Get the latest 3 snippets for the featured section
  const featuredSnippets = snippets.slice(0, 3);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/snippets?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/snippets');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4" />
              {t('home.badge')}
            </div>
            
            <h1 className="apple-hero-title text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-none">
              {t('home.heroTitle')}
            </h1>
            
            <p className="apple-hero-subtitle text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('home.heroSubtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button 
                onClick={() => navigate('/create')} 
                size="lg" 
                className="apple-button-primary px-8 py-4 text-base rounded-2xl font-semibold"
              >
                <Code className="h-5 w-5 mr-2" />
                {t('home.createSnippet')}
              </Button>
              
              <Button 
                onClick={() => navigate('/snippets')} 
                variant="outline" 
                size="lg"
                className="px-8 py-4 text-base rounded-2xl font-semibold border-2"
              >
                {t('home.exploreSnippets')}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
            
            {/* Search Section */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder={t('home.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-12 pr-4 py-4 text-base rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="apple-section-title text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.whyChooseTitle')}
            </h2>
            <p className="apple-section-subtitle text-xl text-gray-600 max-w-2xl mx-auto">
              {t('home.whyChooseSubtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="apple-feature-card text-center p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-white border border-blue-100">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
                <Code className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('home.feature1Title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('home.feature1Description')}</p>
            </div>
            
            <div className="apple-feature-card text-center p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-white border border-purple-100">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-6">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('home.feature2Title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('home.feature2Description')}</p>
            </div>
            
            <div className="apple-feature-card text-center p-8 rounded-3xl bg-gradient-to-br from-green-50 to-white border border-green-100">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('home.feature3Title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('home.feature3Description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Snippets Section */}
      {featuredSnippets.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="apple-section-title text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('home.featuredTitle')}
              </h2>
              <p className="apple-section-subtitle text-xl text-gray-600">
                {t('home.featuredSubtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {featuredSnippets.map((snippet) => (
                <Card 
                  key={snippet._id}
                  className="apple-snippet-card p-6 rounded-3xl border-0 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                  onClick={() => navigate(`/share/${snippet._id}`)}
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {snippet.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {snippet.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {snippet.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs rounded-full">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{snippet.files.length} {t('snippets.files')}</span>
                    <span>{new Date(snippet.createdAt).toLocaleDateString()}</span>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Button 
                onClick={() => navigate('/snippets')} 
                variant="outline"
                size="lg"
                className="px-8 py-3 rounded-2xl font-semibold"
              >
                {t('home.viewAllSnippets')}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('home.ctaTitle')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('home.ctaSubtitle')}
          </p>
          <Button 
            onClick={() => navigate('/create')}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-base rounded-2xl font-semibold"
          >
            <Code className="h-5 w-5 mr-2" />
            {t('home.getStarted')}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
