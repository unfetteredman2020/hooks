import React, { useState } from 'react';
import { Form, Input, Select, Button, Switch } from 'antd';
import ReadOnlyWrap from './ReadOnlyWrap';

function Primary() {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <label>
          只读模式：
          <Switch checked={readOnly} onChange={setReadOnly} />
        </label>
      </div>
      
      <ReadOnlyWrap defaultReadOnly={readOnly}>
        <Form form={form} disabled={readOnly}>
          <Form.Item label="姓名" name="name">
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item label="年龄" name="age">
            <Input placeholder="请输入年龄" />
          </Form.Item>
          <Form.Item label="开关" name="switch">
            <Select 
              options={[
                { label: '开', value: '1' }, 
                { label: '关', value: '0' }
              ]} 
            />
          </Form.Item>
          <Form.Item label="切换">
            <Switch checked={visible} onChange={(v) => setVisible(v)} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </ReadOnlyWrap>
    </div>
  );
}

export default Primary;