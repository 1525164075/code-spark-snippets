
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MDEditor from '@uiw/react-md-editor';

interface MarkdownEditorPanelProps {
  value: string;
  onChange: (value: string) => void;
}

const MarkdownEditorPanel: React.FC<MarkdownEditorPanelProps> = ({ value, onChange }) => {
  const handleChange = (val?: string) => {
    onChange(val || '');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>描述 (支持 Markdown)</CardTitle>
      </CardHeader>
      <CardContent>
        <div data-color-mode="light">
          <MDEditor
            value={value}
            onChange={handleChange}
            preview="edit"
            hideToolbar={false}
            visibleDragBar={false}
            textareaProps={{
              placeholder: `支持 Markdown 语法，例如：

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
`,
              style: {
                fontSize: 14,
                lineHeight: 1.6,
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
              }
            }}
            height={400}
          />
        </div>
        <div className="text-sm text-gray-500 mt-2">
          {value.length}/5000 字符
        </div>
      </CardContent>
    </Card>
  );
};

export default MarkdownEditorPanel;
