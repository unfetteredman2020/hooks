/*
 * @Author: unfetteredman
 * @Date: 2022-12-08 15:21:20
 * @LastEditors: unfetteredman
 * @LastEditTime: 2023-01-09 11:13:46
 */
import React, { Suspense } from 'react';
import './App.css';
import DynamicImportExample from './examples/DynamicImportExample';

function App() {
  return (
    <div className="App">
      <header className="App-header" style={{
        backgroundColor: '#282c34',
        padding: '20px',
        color: 'white',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h1>🚀 React 19 Dynamic Import Utility</h1>
        <p>高性能、类型安全、SSR兼容的动态导入工具</p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '15px',
          fontSize: '14px'
        }}>
          <span>✅ 纯函数实现</span>
          <span>✅ TypeScript支持</span>
          <span>✅ 服务端渲染兼容</span>
          <span>✅ 多种预加载策略</span>
        </div>
      </header>
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <Suspense fallback={
          <div style={{
            padding: '40px', 
            textAlign: 'center',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            margin: '20px 0'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '5px solid #f3f3f3',
              borderTop: '5px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 15px'
            }} />
            Loading Dynamic Import Examples...
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        }>
          <DynamicImportExample />
        </Suspense>
      </main>
      
      <footer style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        textAlign: 'center',
        color: '#6c757d'
      }}>
        <p>🛠️ Built with React 19 Dynamic Import Utility</p>
        <p>📖 Check out the documentation in <code>src/utils/README.md</code></p>
      </footer>
    </div>
  );
}

export default App;