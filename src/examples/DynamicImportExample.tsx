import React, { useState, useCallback } from 'react';
import { createDynamicImport, dynamicImport, batchDynamicImport, preloadComponent } from '../utils/dynamicImport';
import ErrorBoundary from '../components/ErrorBoundary';

/**
 * 动态导入示例组件
 * 演示各种动态导入的使用方法
 */
const DynamicImportExample: React.FC = () => {
  const [loadedComponents, setLoadedComponents] = useState<React.ComponentType<any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 方法1: 使用 createDynamicImport 创建动态组件
  const DynamicHeavyComponent = createDynamicImport(
    () => import('../components/HeavyComponent'),
    {
      fallback: <div style={{ padding: '20px', textAlign: 'center' }}>加载中...</div>,
      errorBoundary: ErrorBoundary,
      retryCount: 3,
      retryDelay: 1000
    }
  );

  const DynamicChartComponent = createDynamicImport(
    () => import('../components/ChartComponent'),
    {
      fallback: <div style={{ padding: '20px', textAlign: 'center' }}>图表加载中...</div>,
      errorBoundary: ErrorBoundary
    }
  );

  // 方法2: 使用纯函数 dynamicImport
  const handleLoadSingleComponent = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const Component = await dynamicImport(() => import('../components/HeavyComponent'));
      setLoadedComponents(prev => [...prev, Component]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 方法3: 批量动态导入
  const handleBatchLoad = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const components = await batchDynamicImport<any>([
        () => import('../components/HeavyComponent'),
        () => import('../components/ChartComponent')
      ]);
      setLoadedComponents(prev => [...prev, ...components]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '批量加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 方法4: 预加载组件
  const handlePreload = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const Component = await preloadComponent(() => import('../components/HeavyComponent'));
      setLoadedComponents(prev => [...prev, Component]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '预加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearComponents = useCallback(() => {
    setLoadedComponents([]);
    setError(null);
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>React 19+ 动态导入工具演示</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>方法1: 使用 createDynamicImport (推荐)</h2>
        <p>这是最推荐的方式，提供了完整的错误处理和加载状态管理。</p>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>重量级组件 (带错误边界)</h3>
          {React.createElement(DynamicHeavyComponent, {
            title: "动态加载的重量级组件",
            data: [{ id: 1, name: '测试数据' }, { id: 2, name: '更多数据' }]
          })}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>图表组件</h3>
          {React.createElement(DynamicChartComponent, {
            type: "line",
            data: [1, 2, 3, 4, 5],
            title: "动态加载的图表"
          })}
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>方法2: 纯函数 dynamicImport</h2>
        <p>纯函数实现，不依赖React hooks，可以在任何地方使用。</p>
        
        <div style={{ marginBottom: '10px' }}>
          <button 
            onClick={handleLoadSingleComponent}
            disabled={loading}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '加载中...' : '加载单个组件'}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>方法3: 批量动态导入</h2>
        <p>一次性加载多个组件，提高效率。</p>
        
        <div style={{ marginBottom: '10px' }}>
          <button 
            onClick={handleBatchLoad}
            disabled={loading}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '批量加载中...' : '批量加载组件'}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>方法4: 预加载组件</h2>
        <p>提前加载组件到缓存中，后续使用更快。</p>
        
        <div style={{ marginBottom: '10px' }}>
          <button 
            onClick={handlePreload}
            disabled={loading}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              backgroundColor: '#ffc107',
              color: 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '预加载中...' : '预加载组件'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          错误: {error}
        </div>
      )}

      {loadedComponents.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2>已加载的组件</h2>
          <button 
            onClick={clearComponents}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          >
            清空组件
          </button>
          
          {loadedComponents.map((Component, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <Component 
                title={`动态加载的组件 ${index + 1}`}
                data={[{ id: index + 1, name: `数据 ${index + 1}` }]}
              />
            </div>
          ))}
        </div>
      )}

      <div style={{ 
        padding: '20px', 
        backgroundColor: '#e9ecef', 
        borderRadius: '8px',
        marginTop: '30px'
      }}>
        <h3>特性说明</h3>
        <ul>
          <li>✅ 兼容React 19+</li>
          <li>✅ 服务端渲染(SSR)兼容</li>
          <li>✅ 纯函数实现，无副作用</li>
          <li>✅ 自动重试机制</li>
          <li>✅ 错误边界处理</li>
          <li>✅ TypeScript类型支持</li>
          <li>✅ 批量导入支持</li>
          <li>✅ 预加载功能</li>
        </ul>
      </div>
    </div>
  );
};

export default DynamicImportExample;