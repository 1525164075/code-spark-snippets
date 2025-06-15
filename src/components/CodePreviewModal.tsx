
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ICodeSnippet } from '@/types/CodeSnippet';
import { Calendar, Code, Tag, User } from 'lucide-react';

interface CodePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snippet: ICodeSnippet | null;
}

const CodePreviewModal: React.FC<CodePreviewModalProps> = ({
  open,
  onOpenChange,
  snippet
}) => {
  if (!snippet) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{snippet.title}</DialogTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            {snippet.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* 描述 */}
          {snippet.description && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">{snippet.description}</p>
            </div>
          )}
          
          {/* 代码文件 */}
          <div className="space-y-4">
            {snippet.files.map((file, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{file.filename}</span>
                    <Badge variant="outline" className="text-xs">
                      {file.language}
                    </Badge>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <pre className="bg-gray-50 p-4 text-sm font-mono overflow-x-auto">
                    <code className="text-gray-800 leading-relaxed">
                      {file.content}
                    </code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
          
          {/* 元信息 */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(snippet.createdAt).toLocaleDateString('zh-CN')}
              </div>
              <div className="flex items-center gap-1">
                <Code className="h-3 w-3" />
                {snippet.files.length} 个文件
              </div>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {snippet.visibility === 'public' ? '公开' : '私有'}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodePreviewModal;
