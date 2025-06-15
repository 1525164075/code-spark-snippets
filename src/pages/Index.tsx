
import React from 'react';
import { Button, Card, Typography, Space, Divider } from 'antd';
import { CodeOutlined, ShareAltOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Index: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <CodeOutlined className="text-2xl text-blue-500" />,
      title: 'Monaco 编辑器',
      description: '享受 VS Code 级别的代码编辑体验，支持语法高亮和智能提示'
    },
    {
      icon: <ShareAltOutlined className="text-2xl text-green-500" />,
      title: '一键分享',
      description: '生成短链接，轻松分享你的代码片段给同事和朋友'
    },
    {
      icon: <LockOutlined className="text-2xl text-purple-500" />,
      title: '私密保护',
      description: '支持密码保护，确保敏感代码的安全性'
    },
    {
      icon: <GlobalOutlined className="text-2xl text-orange-500" />,
      title: '多语言支持',
      description: '支持20+种编程语言，满足不同开发场景需求'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 导航栏 */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <CodeOutlined className="text-2xl text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">CodeSnip</span>
            </div>
            
            <Space>
              <Button 
                type="text"
                onClick={() => navigate('/browse')}
              >
                浏览代码
              </Button>
              <Button 
                type="primary"
                onClick={() => navigate('/create')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                创建代码片段
              </Button>
            </Space>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <Title level={1} className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            CodeSnip
          </Title>
          <Paragraph className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            优雅地创建、分享和管理你的代码片段。<br />
            像 Carbon 一样美观，像 Gist 一样简单。
          </Paragraph>
          
          <Space size="large" className="mb-12">
            <Button 
              type="primary" 
              size="large"
              onClick={() => navigate('/create')}
              className="bg-blue-600 hover:bg-blue-700 h-12 px-8 text-lg"
            >
              立即开始创建
            </Button>
            <Button 
              size="large"
              onClick={() => navigate('/browse')}
              className="h-12 px-8 text-lg"
            >
              浏览示例
            </Button>
          </Space>

          {/* 预览图片占位 */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="ml-auto text-gray-400 text-sm">main.js</div>
              </div>
              <div className="text-left space-y-2 font-mono text-sm">
                <div className="text-purple-400">// 欢迎使用 CodeSnip</div>
                <div className="text-blue-400">function <span className="text-yellow-400">greet</span>(<span className="text-green-400">name</span>) {</div>
                <div className="text-gray-300 ml-4">console.<span className="text-blue-400">log</span>(<span className="text-green-300">`Hello, ${'{'}name{'}'} 👋`</span>);</div>
                <div className="text-blue-400">}</div>
                <div className="text-yellow-400">greet</div>(<span className="text-green-300">'CodeSnip'</span>);
              </div>
            </div>
          </div>
        </div>

        <Divider className="my-20" />

        {/* 特性介绍 */}
        <div className="text-center mb-16">
          <Title level={2} className="text-3xl md:text-4xl font-bold mb-4">
            为什么选择 CodeSnip？
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
            我们结合了最佳的代码分享工具的优点，创造出既美观又实用的代码片段分享平台
          </Paragraph>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center h-full hover:shadow-lg transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm"
              bodyStyle={{ padding: '2rem' }}
            >
              <div className="mb-4">{feature.icon}</div>
              <Title level={4} className="mb-3">{feature.title}</Title>
              <Paragraph className="text-gray-600 text-sm">
                {feature.description}
              </Paragraph>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <Title level={2} className="text-white mb-4">
            准备好分享你的代码了吗？
          </Title>
          <Paragraph className="text-blue-100 mb-8 text-lg">
            加入数千名开发者，开始创建和分享优美的代码片段
          </Paragraph>
          <Button 
            type="primary"
            size="large"
            onClick={() => navigate('/create')}
            className="bg-white text-blue-600 hover:bg-gray-100 border-0 h-12 px-8 text-lg font-semibold"
          >
            创建我的第一个代码片段
          </Button>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <CodeOutlined className="text-2xl mr-2" />
            <span className="text-xl font-bold">CodeSnip</span>
          </div>
          <Paragraph className="text-gray-400">
            让代码分享变得更简单、更优雅
          </Paragraph>
          <div className="text-sm text-gray-500">
            © 2024 CodeSnip. Built with ❤️ by developers, for developers.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
