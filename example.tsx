import React, { Suspense } from 'react';
import {
  useDynamicImport,
  createLazyComponent,
  preloadModule,
  useDynamicImports,
  useConditionalImport,
  useSafeDynamicImport,
  useClientOnlyImport
} from './dynamicImport';

// 示例1: 基础动态导入
function BasicExample() {
  // 动态导入一个模块
  const utils = useDynamicImport(
    () => import('./utils/helpers'),
    'utils-helpers'
  );

  if (!utils) {
    return <div>Loading utils...</div>;
  }

  return <div>Utils loaded: {utils.someFunction()}</div>;
}

// 示例2: 懒加载组件
const LazyChart = createLazyComponent(
  () => import('./components/Chart'),
  'chart-component'
);

function ChartExample() {
  return (
    <Suspense fallback={<div>Loading chart...</div>}>
      <LazyChart />
    </Suspense>
  );
}

// 示例3: 预加载模块
function PreloadExample() {
  // 在用户交互前预加载模块
  const handleMouseEnter = () => {
    preloadModule(
      () => import('./components/HeavyComponent'),
      'heavy-component'
    );
  };

  const handleClick = () => {
    // 实际使用时已经预加载了
    const Component = createLazyComponent(
      () => import('./components/HeavyComponent'),
      'heavy-component'
    );
    // 渲染组件...
  };

  return (
    <button 
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      Load Heavy Component
    </button>
  );
}

// 示例4: 批量动态导入
function BatchImportExample() {
  const modules = useDynamicImports([
    {
      factory: () => import('./modules/moduleA'),
      key: 'module-a'
    },
    {
      factory: () => import('./modules/moduleB'),
      key: 'module-b'
    },
    {
      factory: () => import('./modules/moduleC'),
      key: 'module-c'
    }
  ]);

  const allLoaded = modules.every(m => m !== undefined);

  if (!allLoaded) {
    return <div>Loading modules...</div>;
  }

  return (
    <div>
      All modules loaded:
      {modules.map((module, index) => (
        <div key={index}>Module {index}: {module?.name}</div>
      ))}
    </div>
  );
}

// 示例5: 条件导入
function ConditionalImportExample({ userRole }: { userRole: string }) {
  // 只有管理员才加载管理面板
  const adminPanel = useConditionalImport(
    userRole === 'admin',
    () => import('./components/AdminPanel'),
    'admin-panel'
  );

  if (userRole !== 'admin') {
    return <div>Access denied</div>;
  }

  if (!adminPanel) {
    return <div>Loading admin panel...</div>;
  }

  const AdminPanel = adminPanel.default;
  return <AdminPanel />;
}

// 示例6: 带错误处理的导入
function SafeImportExample() {
  const config = useSafeDynamicImport(
    () => import('./config/settings'),
    'app-settings',
    { theme: 'default', language: 'en' } // 降级配置
  );

  return (
    <div>
      Theme: {config.theme}
      Language: {config.language}
    </div>
  );
}

// 示例7: 仅客户端导入（SSR兼容）
function ClientOnlyExample() {
  // 这个组件只在客户端加载，避免SSR问题
  const clientModule = useClientOnlyImport(
    () => import('./client-only/analytics'),
    'analytics-module'
  );

  if (!clientModule) {
    // 服务端渲染时返回占位内容
    return <div>Analytics placeholder</div>;
  }

  return <div>Analytics loaded: {clientModule.track('page_view')}</div>;
}

// 主应用组件
export default function App() {
  return (
    <div>
      <h1>React 19+ Dynamic Import Examples</h1>
      
      <Suspense fallback={<div>Loading...</div>}>
        <BasicExample />
        <ChartExample />
        <PreloadExample />
        <BatchImportExample />
        <ConditionalImportExample userRole="admin" />
        <SafeImportExample />
        <ClientOnlyExample />
      </Suspense>
    </div>
  );
}