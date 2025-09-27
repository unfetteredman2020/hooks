import React from 'react';

interface HeavyComponentProps {
  title: string;
  data?: any[];
}

/**
 * 模拟一个重量级组件，用于演示动态导入
 */
const HeavyComponent: React.FC<HeavyComponentProps> = ({ title, data = [] }) => {
  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #007bff', 
      borderRadius: '8px',
      margin: '10px 0',
      backgroundColor: '#f8f9fa'
    }}>
      <h3>{title}</h3>
      <p>这是一个重量级组件，通过动态导入加载</p>
      {data.length > 0 && (
        <div>
          <h4>数据列表：</h4>
          <ul>
            {data.map((item, index) => (
              <li key={index}>{JSON.stringify(item)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HeavyComponent;