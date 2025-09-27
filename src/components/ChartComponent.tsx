import React from 'react';

interface ChartComponentProps {
  type: 'line' | 'bar' | 'pie';
  data: number[];
  title?: string;
}

/**
 * 模拟图表组件，用于演示动态导入
 */
const ChartComponent: React.FC<ChartComponentProps> = ({ type, data, title }) => {
  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #28a745', 
      borderRadius: '8px',
      margin: '10px 0',
      backgroundColor: '#f8f9fa'
    }}>
      <h3>{title || `${type.toUpperCase()} 图表`}</h3>
      <div style={{ 
        height: '200px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#e9ecef',
        borderRadius: '4px'
      }}>
        <div>
          <p>图表类型: {type}</p>
          <p>数据: {data.join(', ')}</p>
          <p style={{ fontSize: '12px', color: '#6c757d' }}>
            (这是模拟的图表组件)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;