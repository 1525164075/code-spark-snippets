
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MDEditor from '@uiw/react-md-editor';

interface MarkdownEditorPanelProps {
  value: string;
  onChange: (value: string) => void;
}

const MarkdownEditorPanel: React.FC<MarkdownEditorPanelProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  const handleChange = (val?: string) => {
    onChange(val || '');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('create.markdownTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div data-color-mode="light">
          <MDEditor
            value={value}
            onChange={handleChange}
            preview="edit"
            hideToolbar={false}
            visibleDragbar={false}
            textareaProps={{
              placeholder: t('create.markdownPlaceholder'),
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
          {value.length}/5000 {t('create.characterCount')}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarkdownEditorPanel;
