import React, { Suspense } from 'react';
import { createDynamicImport, dynamicImport, createBatchDynamicImport } from '../utils/dynamicImport';

// 快速开始示例 - 演示最基本的用法

// 1. 最简单的用法
const SimpleComponent = dynamicImport(() => import('./components/SimpleComponent'));

// 2. 基本配置用法
const { Component: ConfiguredComponent, preload } = createDynamicImport(
  () => import('./components/BasicComponent'),
  {
    loading: () => <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>,
    delay: 200
  }
);

// 3. 批量导入用法
const { Dashboard, Profile } = createBatchDynamicImport({
  Dashboard: () => import('./components/Dashboard'),
  Profile: () => import('./components/Profile')
});

const QuickStart: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 Quick Start - React 19 Dynamic Import</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>使用方法对比</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* 传统方法 */}
          <div style={{ 
            padding: '15px', 
            border: '2px solid #dc3545', 
            borderRadius: '8px',
            backgroundColor: '#f8f9fa'
          }}>
            <h3>❌ 传统方法</h3>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>{`
// React.lazy (功能有限)
const Component = React.lazy(
  () => import('./Component')
);

// 问题:
// - 无法自定义loading
// - 无预加载功能  
// - SSR支持有限
// - 无错误处理
            `}</pre>
          </div>

          {/* 新方法 */}
          <div style={{ 
            padding: '15px', 
            border: '2px solid #28a745', 
            borderRadius: '8px',
            backgroundColor: '#f8f9fa'
          }}>
            <h3>✅ 新方法</h3>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>{`
// React 19 Dynamic Import
const { Component, preload } = createDynamicImport(
  () => import('./Component'),
  {
    loading: <CustomLoading />,
    error: CustomError,
    delay: 300,
    preload: 'hover',
    ssr: 'fallback'
  }
);
            `}</pre>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>实际演示</h2>
        
        <Suspense fallback={<div>Global Suspense Loading...</div>}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* 简单用法 */}
            <div>
              <h3>1. 简单用法</h3>
              <p><code>dynamicImport()</code></p>
              <SimpleComponent />
            </div>

            {/* 配置用法 */}
            <div>
              <h3>2. 配置用法</h3>
              <p><code>createDynamicImport()</code></p>
              <button 
                onClick={() => preload()}
                style={{ marginBottom: '10px', padding: '5px 10px' }}
              >
                预加载组件
              </button>
              <ConfiguredComponent />
            </div>

            {/* 批量用法 */}
            <div>
              <h3>3. 批量导入</h3>
              <p><code>createBatchDynamicImport()</code></p>
              <Dashboard.Component />
            </div>

            <div>
              <h3>4. 用户信息</h3>
              <Profile.Component />
            </div>
          </div>
        </Suspense>
      </div>

      <div style={{ 
        padding: '20px', 
        backgroundColor: '#e3f2fd', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2>💡 核心优势</h2>
        <ul>
          <li><strong>🎯 React 19 兼容</strong>: 使用最新的React特性和最佳实践</li>
          <li><strong>🔒 类型安全</strong>: 完整的TypeScript支持，编译时错误检查</li>
          <li><strong>🌐 SSR友好</strong>: 完全兼容服务端渲染，自动检测环境</li>
          <li><strong>⚡ 纯函数实现</strong>: 无副作用，函数式编程风格</li>
          <li><strong>🚀 性能优化</strong>: 多种预加载策略，提升用户体验</li>
          <li><strong>🛠️ 开发友好</strong>: 丰富的配置选项，灵活的错误处理</li>
        </ul>
      </div>

      <div style={{ 
        padding: '20px', 
        backgroundColor: '#fff3cd', 
        borderRadius: '8px' 
      }}>
        <h2>🔧 使用建议</h2>
        <ol>
          <li><strong>始终使用 Suspense</strong>: 包装所有动态组件</li>
          <li><strong>合理设置延迟</strong>: 避免加载状态闪烁</li>
          <li><strong>提供错误边界</strong>: 处理加载失败情况</li>
          <li><strong>选择预加载策略</strong>: 根据用户行为优化加载时机</li>
          <li><strong>考虑SSR需求</strong>: 选择合适的服务端渲染策略</li>
        </ol>
      </div>
    </div>
  );
};

export default QuickStart;