
import React, { useState, useCallback, useMemo } from 'react';
import { Card, Input } from 'antd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const { TextArea } = Input;

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // 处理输入变化
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  // Markdown 渲染配置
  const markdownComponents = useMemo(() => ({
    // 自定义渲染组件以适配样式
    h1: ({ children }: any) => <h1 className="text-2xl font-bold mb-4 pb-2 border-b">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-xl font-semibold mb-3 pb-1 border-b">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-lg font-medium mb-2">{children}</h3>,
    p: ({ children }: any) => <p className="mb-3 leading-relaxed">{children}</p>,
    ul: ({ children }: any) => <ul className="mb-3 pl-6 list-disc">{children}</ul>,
    ol: ({ children }: any) => <ol className="mb-3 pl-6 list-decimal">{children}</ol>,
    li: ({ children }: any) => <li className="mb-1">{children}</li>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-400 pl-4 my-4 italic text-gray-600">
        {children}
      </blockquote>
    ),
    code: ({ inline, children }: any) => 
      inline ? (
        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>
      ) : (
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto mb-4">
          <code className="text-sm font-mono">{children}</code>
        </pre>
      ),
    a: ({ href, children }: any) => (
      <a href={href} className="text-blue-500 hover:text-blue-700 underline" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
    table: ({ children }: any) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border border-gray-300">{children}</table>
      </div>
    ),
    th: ({ children }: any) => (
      <th className="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left">{children}</th>
    ),
    td: ({ children }: any) => (
      <td className="border border-gray-300 px-4 py-2">{children}</td>
    ),
  }), []);

  return (
    <Card 
      title="描述 (支持 Markdown)"
      className="mb-6"
      extra={
        <button
          type="button"
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
        >
          {isPreviewMode ? '编辑模式' : '预览模式'}
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[300px]">
        {/* 编辑区域 */}
        <div className={`${isPreviewMode ? 'hidden lg:block' : ''}`}>
          <TextArea
            value={value}
            onChange={handleChange}
            placeholder={`支持 Markdown 语法，例如：

# 这是标题
这是普通文本段落。

## 功能特性
- 支持**粗体**和*斜体*
- 支持 \`行内代码\`
- 支持链接：[GitHub](https://github.com)

\`\`\`javascript
// 支持代码块
function hello() {
  console.log('Hello World!');
}
\`\`\`

> 这是引用块
`}
            rows={12}
            className="resize-none"
            showCount
            maxLength={5000}
          />
        </div>

        {/* 预览区域 */}
        <div className={`border rounded-lg p-4 bg-gray-50 overflow-y-auto max-h-[300px] ${!isPreviewMode ? 'hidden lg:block' : ''}`}>
          {value ? (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {value}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="text-gray-400 italic text-center py-8">
              在左侧输入 Markdown 内容，这里将显示预览效果
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MarkdownEditor;
