import React, { useEffect, useState } from 'react'
import { Form, Input, Select, Button, Switch } from 'antd';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useIsBrowser from '@docusaurus/useIsBrowser';
import '@ant-design/v5-patch-for-react-19'

function Primary() {
  const [form] = Form.useForm();
  const [visible, setVisible] = React.useState(false);
  const [ReadOnlyWrap, setReadOnlyWrap] = useState(null);
  const isBrowser = useIsBrowser();
  
  useEffect(() => {
    if (isBrowser) {
      // 动态导入组件
      const loadComponent = async () => {
        try {
          const module = await import('desktop-kit/components/read-only-wrap');
          setReadOnlyWrap(() => module.default || module);
        } catch (error) {
          console.error('Failed to load ReadOnlyWrap:', error);
        }
      };
      loadComponent();
    }
  }, [isBrowser]);
  
  if (!ReadOnlyWrap) {
    return <div>加载中...</div>;
  }
  
  return (
    <ReadOnlyWrap>
      <Form form={form}>
        <Form.Item label="姓名" name="name">
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item label="年龄" name="age">
          <Input placeholder="请输入年龄" />
        </Form.Item>
        <Form.Item label="开关" name="switch">
          <Select options={[{ label: '开', value: '1' }, { label: '关', value: '0' }]} />
        </Form.Item>
        <Form.Item label="切换">
          <Switch checked={visible} onChange={(v) => setVisible(v)} />
        </Form.Item>
        <Form.Item>
          <Button type="primary">提交</Button>
        </Form.Item>
      </Form>
    </ReadOnlyWrap>
  );
}

export default Primary;