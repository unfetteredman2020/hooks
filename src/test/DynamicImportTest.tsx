import React from 'react';
import { createDynamicImport, dynamicImport } from '../utils/dynamicImport';

/**
 * 动态导入工具测试组件
 */
const DynamicImportTest: React.FC = () => {
  const [testResult, setTestResult] = React.useState<string>('');

  // 测试纯函数动态导入
  const testPureFunction = async () => {
    try {
      const Component = await dynamicImport(() => import('../components/HeavyComponent'));
      setTestResult('✅ 纯函数动态导入测试成功');
    } catch (error) {
      setTestResult(`❌ 纯函数动态导入测试失败: ${error}`);
    }
  };

  // 测试创建动态组件
  const TestDynamicComponent = createDynamicImport(
    () => import('../components/HeavyComponent'),
    {
      fallback: <div>测试组件加载中...</div>
    }
  );

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>动态导入工具测试</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testPureFunction}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          测试纯函数导入
        </button>
        
        <span>{testResult}</span>
      </div>

      <div>
        <h4>测试动态组件:</h4>
        {React.createElement(TestDynamicComponent, {
          title: "测试组件",
          data: [{ id: 1, name: '测试数据' }]
        })}
      </div>
    </div>
  );
};

export default DynamicImportTest;