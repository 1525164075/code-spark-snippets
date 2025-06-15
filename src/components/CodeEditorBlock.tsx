
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { ICodeFile } from '../types/CodeSnippet';

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
  const [activeTab, setActiveTab] = useState<string>('0');
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
    setActiveTab((newFiles.length - 1).toString());
  }, [files, onFilesChange]);

  // 删除文件
  const removeFile = useCallback((index: number) => {
    if (files.length === 1) {
      return; // 至少保留一个文件
    }

    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
    
    // 调整激活的标签页
    if (index.toString() === activeTab) {
      const newActiveIndex = Math.min(index, newFiles.length - 1);
      setActiveTab(newActiveIndex.toString());
    }
  }, [files, onFilesChange, activeTab]);

  // 更新文件内容
  const updateFile = useCallback((index: number, updates: Partial<ICodeFile>) => {
    const newFiles = files.map((file, i) => 
      i === index ? { ...file, ...updates } : file
    );
    onFilesChange(newFiles);
  }, [files, onFilesChange]);

  // 更新当前激活文件的语言
  const updateCurrentLanguage = useCallback((language: string) => {
    const currentIndex = parseInt(activeTab);
    updateFile(currentIndex, { language });
  }, [activeTab, updateFile]);

  // 编辑器内容变化
  const handleEditorChange = useCallback((value: string | undefined, index: number) => {
    updateFile(index, { content: value || '' });
  }, [updateFile]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>代码编辑器</CardTitle>
          <div className="flex gap-2">
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {THEME_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={files[parseInt(activeTab)]?.language || 'javascript'}
              onValueChange={updateCurrentLanguage}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button onClick={addFile} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              添加文件
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b px-4">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
              {files.map((file, index) => (
                <div key={index} className="flex items-center">
                  <TabsTrigger 
                    value={index.toString()} 
                    className="flex items-center gap-2 px-3 py-2"
                  >
                    <Input
                      value={file.filename}
                      onChange={(e) => updateFile(index, { filename: e.target.value })}
                      className="border-none p-0 h-auto bg-transparent focus-visible:ring-0 w-20"
                      onFocus={(e) => e.target.select()}
                    />
                    {files.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                        className="h-4 w-4 p-0 hover:bg-red-100"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </TabsTrigger>
                </div>
              ))}
            </TabsList>
          </div>
          
          {files.map((file, index) => (
            <TabsContent key={index} value={index.toString()} className="m-0">
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
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CodeEditorBlock;
