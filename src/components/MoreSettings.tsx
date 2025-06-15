
import React from 'react';
import { Card, Form, Input, Select, FormInstance } from 'antd';

const { Option } = Select;

interface MoreSettingsProps {
  form: FormInstance;
}

// 过期时间选项
const EXPIRY_OPTIONS = [
  { value: null, label: '永不过期' },
  { value: 1, label: '1小时后' },
  { value: 24, label: '1天后' },
  { value: 168, label: '1周后' },  // 7 * 24
  { value: 720, label: '1个月后' }, // 30 * 24
];

const MoreSettings: React.FC<MoreSettingsProps> = ({ form }) => {
  return (
    <Card title="更多设置" className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item
          name="title"
          label="标题"
          rules={[
            { required: true, message: '请输入代码片段标题' },
            { min: 1, max: 100, message: '标题长度应在1-100字符之间' }
          ]}
        >
          <Input
            placeholder="为你的代码片段起个好名字..."
            size="large"
            showCount
            maxLength={100}
          />
        </Form.Item>

        <Form.Item
          name="tags"
          label="标签"
          help="按回车键添加标签，便于分类和搜索"
        >
          <Select
            mode="tags"
            placeholder="添加标签 (如: react, typescript, utils...)"
            size="large"
            maxTagCount={10}
            tokenSeparators={[',']}
          />
        </Form.Item>

        <Form.Item
          name="expiryHours"
          label="过期时间"
          help="设置代码片段的有效期"
        >
          <Select
            placeholder="选择过期时间"
            size="large"
            allowClear
          >
            {EXPIRY_OPTIONS.map(option => (
              <Option key={option.value || 'never'} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    </Card>
  );
};

export default MoreSettings;
