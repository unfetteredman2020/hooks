import React, { Suspense, useState } from 'react';
import { 
  createDynamicImport, 
  dynamicImport, 
  createBatchDynamicImport,
  createRouteDynamicImport 
} from '../utils/dynamicImport';

// 示例1: 基本用法
const { Component: LazyBasicComponent, preload: preloadBasic } = createDynamicImport(
  () => import('./components/BasicComponent'),
  {
    loading: () => <div className="loading">Loading Basic Component...</div>,
    error: ({ error, retry }) => (
      <div className="error">
        <h3>Failed to load component</h3>
        <p>{error.message}</p>
        <button onClick={retry}>Retry</button>
      </div>
    ),
    delay: 300, // 300ms 延迟，避免闪烁
    timeout: 10000, // 10秒超时
    ssr: 'fallback' // SSR降级策略
  }
);

// 示例2: 简化用法
const LazySimpleComponent = dynamicImport(() => import('./components/SimpleComponent'));

// 示例3: 批量导入
const batchComponents = createBatchDynamicImport({
  Dashboard: () => import('./components/Dashboard'),
  Settings: () => import('./components/Settings'),
  Profile: () => import('./components/Profile')
}, {
  loading: () => <div className="batch-loading">Loading...</div>,
  preload: 'idle'
});

// 示例4: 路由级别动态导入
const { Component: LazyRouteComponent } = createRouteDynamicImport(
  () => import('./components/RouteComponent'),
  {
    loading: () => <div className="route-loading">Loading Route...</div>,
    routePreload: true
  }
);

// 自定义加载组件
const CustomLoadingComponent = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '200px',
    background: '#f5f5f5',
    borderRadius: '8px'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// 自定义错误组件
const CustomErrorComponent: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => (
  <div style={{
    padding: '20px',
    border: '2px solid #e74c3c',
    borderRadius: '8px',
    backgroundColor: '#fdf2f2',
    color: '#c0392b'
  }}>
    <h3>⚠️ Component Load Failed</h3>
    <p><strong>Error:</strong> {error.message}</p>
    <button 
      onClick={retry}
      style={{
        padding: '8px 16px',
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      🔄 Retry Loading
    </button>
  </div>
);

// 示例5: 高级配置用法
const { Component: LazyAdvancedComponent, preload, isLoaded, getLoadingState } = createDynamicImport(
  () => import('./components/AdvancedComponent'),
  {
    loading: <CustomLoadingComponent />,
    error: CustomErrorComponent,
    delay: 500,
    timeout: 15000,
    preload: 'hover', // 鼠标悬停时预加载
    ssr: 'client-only' // 仅客户端渲染
  }
);

// 主示例组件
const DynamicImportExample: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 预加载处理
  const handlePreload = async (componentName: string) => {
    try {
      switch (componentName) {
        case 'basic':
          await preloadBasic();
          break;
        case 'advanced':
          await preload();
          break;
        case 'batch':
          await Promise.all([
            batchComponents.Dashboard.preload(),
            batchComponents.Settings.preload(),
            batchComponents.Profile.preload()
          ]);
          break;
      }
      console.log(`✅ ${componentName} component preloaded successfully`);
    } catch (error) {
      console.error(`❌ Failed to preload ${componentName}:`, error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 React 19 Dynamic Import Examples</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>📖 Usage Examples</h2>
        
        {/* Tab Navigation */}
        <div style={{ marginBottom: '20px' }}>
          {['basic', 'simple', 'batch', 'route', 'advanced'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                marginRight: '10px',
                padding: '8px 16px',
                backgroundColor: activeTab === tab ? '#3498db' : '#ecf0f1',
                color: activeTab === tab ? 'white' : '#2c3e50',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Preload Buttons */}
        <div style={{ marginBottom: '20px' }}>
          <h3>🔄 Preload Controls</h3>
          {['basic', 'advanced', 'batch'].map(comp => (
            <button
              key={comp}
              onClick={() => handlePreload(comp)}
              style={{
                marginRight: '10px',
                padding: '6px 12px',
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Preload {comp}
            </button>
          ))}
        </div>

        {/* Status Display */}
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <h4>📊 Component Status</h4>
          <p>Advanced Component - Loaded: {isLoaded() ? '✅' : '❌'} | State: {getLoadingState()}</p>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ minHeight: '300px', border: '2px dashed #bdc3c7', borderRadius: '8px', padding: '20px' }}>
        <Suspense fallback={<div>🔄 Suspense Fallback Loading...</div>}>
          {activeTab === 'basic' && (
            <div>
              <h3>📦 Basic Dynamic Import</h3>
              <p>Features: Loading state, Error handling, Delay, Timeout, SSR support</p>
              <LazyBasicComponent />
            </div>
          )}

          {activeTab === 'simple' && (
            <div>
              <h3>⚡ Simple Dynamic Import</h3>
              <p>Minimal configuration for quick setup</p>
              <LazySimpleComponent />
            </div>
          )}

          {activeTab === 'batch' && (
            <div>
              <h3>🎯 Batch Dynamic Import</h3>
              <p>Multiple components loaded together</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <h4>Dashboard</h4>
                  <batchComponents.Dashboard.Component />
                </div>
                <div>
                  <h4>Settings</h4>
                  <batchComponents.Settings.Component />
                </div>
                <div>
                  <h4>Profile</h4>
                  <batchComponents.Profile.Component />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'route' && (
            <div>
              <h3>🛣️ Route Dynamic Import</h3>
              <p>Optimized for routing scenarios with automatic preloading</p>
              <LazyRouteComponent />
            </div>
          )}

          {activeTab === 'advanced' && (
            <div>
              <h3>🎛️ Advanced Dynamic Import</h3>
              <p>Custom components, hover preload, client-only rendering</p>
              <div 
                onMouseEnter={() => {
                  if (!isLoaded()) {
                    console.log('🖱️ Hover detected, preloading...');
                    handlePreload('advanced');
                  }
                }}
                style={{ padding: '10px', border: '1px solid #3498db', borderRadius: '4px' }}
              >
                <p>Hover over this area to trigger preload!</p>
                {showAdvanced ? (
                  <LazyAdvancedComponent />
                ) : (
                  <button 
                    onClick={() => setShowAdvanced(true)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#9b59b6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Show Advanced Component
                  </button>
                )}
              </div>
            </div>
          )}
        </Suspense>
      </div>

      {/* Code Examples */}
      <div style={{ marginTop: '30px' }}>
        <h2>💻 Code Examples</h2>
        <div style={{ backgroundColor: '#2c3e50', color: '#ecf0f1', padding: '20px', borderRadius: '8px', overflow: 'auto' }}>
          <pre><code>{`
// 基本用法
const { Component, preload, isLoaded } = createDynamicImport(
  () => import('./MyComponent'),
  {
    loading: () => <div>Loading...</div>,
    error: ({ error, retry }) => <ErrorComponent error={error} retry={retry} />,
    delay: 300,
    timeout: 10000,
    preload: 'idle',
    ssr: 'fallback'
  }
);

// 简化用法
const LazyComponent = dynamicImport(() => import('./MyComponent'));

// 批量导入
const components = createBatchDynamicImport({
  Home: () => import('./Home'),
  About: () => import('./About')
});

// 使用示例
function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
}
          `}</code></pre>
        </div>
      </div>
    </div>
  );
};

export default DynamicImportExample;