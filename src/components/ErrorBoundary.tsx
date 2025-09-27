import React from 'react';

interface ErrorBoundaryProps {
  error: Error;
  retry: () => void;
}

/**
 * 错误边界组件，用于处理动态导入失败的情况
 */
const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ error, retry }) => {
  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #dc3545', 
      borderRadius: '8px',
      margin: '10px 0',
      backgroundColor: '#f8d7da',
      color: '#721c24'
    }}>
      <h3>组件加载失败</h3>
      <p>错误信息: {error.message}</p>
      <button 
        onClick={retry}
        style={{
          padding: '8px 16px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        重试加载
      </button>
    </div>
  );
};

export default ErrorBoundary;