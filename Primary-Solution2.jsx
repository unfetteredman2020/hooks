import React, { useEffect, useState } from 'react'
import { Form, Input, Select, Button, Switch } from 'antd';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useIsBrowser from '@docusaurus/useIsBrowser';
import '@ant-design/v5-patch-for-react-19'

function Primary() {
  const [form] = Form.useForm();
  const [visible, setVisible] = React.useState(false);
  const isBrowser = useIsBrowser();
  
  return (
    <BrowserOnly fallback={<div>Loading...</div>}>
      {() => {
        // 使用 React.lazy 和动态 import
        const ReadOnlyWrap = React.lazy(() => 
          import('desktop-kit/components/read-only-wrap')
            .then(module => ({ default: module.default || module }))
        );
        
        return (
          <React.Suspense fallback={<div>加载中...</div>}>
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
          </React.Suspense>
        );
      }}
    </BrowserOnly>
  );
}

export default Primary;