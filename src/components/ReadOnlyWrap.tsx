import React, { createContext, useContext, useState } from 'react';
import { Form } from 'antd';
import type { FormInstance } from 'antd';

interface ReadOnlyContextType {
  readOnly: boolean;
  setReadOnly: (value: boolean) => void;
}

const ReadOnlyContext = createContext<ReadOnlyContextType>({
  readOnly: false,
  setReadOnly: () => {},
});

export const useReadOnly = () => useContext(ReadOnlyContext);

interface ReadOnlyWrapProps {
  children: React.ReactNode;
  defaultReadOnly?: boolean;
}

const ReadOnlyWrap: React.FC<ReadOnlyWrapProps> = ({ 
  children, 
  defaultReadOnly = false 
}) => {
  const [readOnly, setReadOnly] = useState(defaultReadOnly);

  // 如果处于只读模式，禁用所有表单项
  React.useEffect(() => {
    if (readOnly) {
      // 这里可以添加禁用表单的逻辑
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea, button[type="submit"]');
        inputs.forEach(input => {
          (input as HTMLInputElement).disabled = true;
        });
      });
    } else {
      // 恢复表单
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea, button[type="submit"]');
        inputs.forEach(input => {
          (input as HTMLInputElement).disabled = false;
        });
      });
    }
  }, [readOnly]);

  return (
    <ReadOnlyContext.Provider value={{ readOnly, setReadOnly }}>
      <div className={`read-only-wrap ${readOnly ? 'read-only' : ''}`}>
        {children}
      </div>
    </ReadOnlyContext.Provider>
  );
};

export default ReadOnlyWrap;