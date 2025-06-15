
import React, { useState, useCallback } from 'react';
import { Card, Tabs, Select, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import { ICodeFile } from '../types/CodeSnippet';

const { TabPane } = Tabs;
const { Option } = Select;

interface CodeEditorBlockProps {
  files: ICodeFile[];
  onFilesChange: (files: ICodeFile[]) => void;
}

// 编程语言选项
const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'sql', label: 'SQL' },
  { value: 'shell', label: 'Shell' },
];

// 主题选项
const THEME_OPTIONS = [
  { value: 'vs-dark', label: 'Dark' },
  { value: 'vs-light', label: 'Light' },
];

const CodeEditorBlock: React.FC<CodeEditorBlockProps> = ({ files, onFilesChange }) => {
  const [activeKey, setActiveKey] = useState<string>('0');
  const [theme, setTheme] = useState<string>('vs-dark');

  // 添加新文件
  const addFile = useCallback(() => {
    const newFile: ICodeFile = {
      filename: `代码${files.length + 1}`,
      language: 'javascript',
      content: ''
    };
    const newFiles = [...files, newFile];
    onFilesChange(newFiles);
    setActiveKey((newFiles.length - 1).toString());
  }, [files, onFilesChange]);

  // 删除文件
  const removeFile = useCallback((targetKey: string) => {
    if (files.length === 1) {
      message.warning('至少需要保留一个文件');
      return;
    }

    const newFiles = files.filter((_, index) => index.toString() !== targetKey);
    onFilesChange(newFiles);
    
    // 调整激活的标签页
    const currentIndex = parseInt(targetKey);
    if (currentIndex >= newFiles.length) {
      setActiveKey((newFiles.length - 1).toString());
    }
  }, [files, onFilesChange]);

  // 编辑标签页
  const onEdit = useCallback((targetKey: any, action: 'add' | 'remove') => {
    if (action === 'add') {
      addFile();
    } else {
      removeFile(targetKey);
    }
  }, [addFile, removeFile]);

  // 更新文件内容
  const updateFile = useCallback((index: number, updates: Partial<ICodeFile>) => {
    const newFiles = files.map((file, i) => 
      i === index ? { ...file, ...updates } : file
    );
    onFilesChange(newFiles);
  }, [files, onFilesChange]);

  // 更新当前激活文件的语言
  const updateCurrentLanguage = useCallback((language: string) => {
    const currentIndex = parseInt(activeKey);
    updateFile(currentIndex, { language });
  }, [activeKey, updateFile]);

  // 编辑器内容变化
  const handleEditorChange = useCallback((value: string | undefined, index: number) => {
    updateFile(index, { content: value || '' });
  }, [updateFile]);

  // 标签页额外内容（主题和语言选择器）
  const tabBarExtraContent = (
    <div className="flex gap-2">
      <Select
        value={theme}
        onChange={setTheme}
        style={{ width: 80 }}
        size="small"
      >
        {THEME_OPTIONS.map(option => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
      
      <Select
        value={files[parseInt(activeKey)]?.language || 'javascript'}
        onChange={updateCurrentLanguage}
        style={{ width: 120 }}
        size="small"
        showSearch
        placeholder="选择语言"
        filterOption={(input, option) =>
          option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ?? false
        }
      >
        {LANGUAGE_OPTIONS.map(option => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </div>
  );

  return (
    <Card className="mb-6" bodyStyle={{ padding: 0 }}>
      <Tabs
        type="editable-card"
        activeKey={activeKey}
        onChange={setActiveKey}
        onEdit={onEdit}
        tabBarExtraContent={tabBarExtraContent}
        addIcon={<PlusOutlined />}
        className="min-h-[400px]"
      >
        {files.map((file, index) => (
          <TabPane
            tab={
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newFilename = e.target.textContent || `代码${index + 1}`;
                  updateFile(index, { filename: newFilename });
                }}
                className="outline-none"
              >
                {file.filename}
              </span>
            }
            key={index.toString()}
            closable={files.length > 1}
          >
            <div className="h-[400px]">
              <Editor
                height="100%"
                language={file.language}
                theme={theme}
                value={file.content}
                onChange={(value) => handleEditorChange(value, index)}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                }}
              />
            </div>
          </TabPane>
        ))}
      </Tabs>
    </Card>
  );
};

export default CodeEditorBlock;
