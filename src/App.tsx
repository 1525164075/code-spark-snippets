
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Index from "./pages/Index";
import CreateSnippetPage from "./pages/CreateSnippetPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Ant Design 主题配置
const antdTheme = {
  token: {
    colorPrimary: '#2563eb',
    borderRadius: 8,
    fontSize: 14,
  },
  components: {
    Card: {
      borderRadiusLG: 12,
    },
    Button: {
      borderRadius: 8,
    },
    Input: {
      borderRadius: 8,
    },
    Select: {
      borderRadius: 8,
    },
  },
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ConfigProvider theme={antdTheme} locale={zhCN}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create" element={<CreateSnippetPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ConfigProvider>
  </QueryClientProvider>
);

export default App;
