# React 19 Dynamic Import Utility

一个强大、类型安全、支持SSR的React动态导入工具函数，专为React 19设计。

## ✨ 特性

- 🚀 **React 19兼容**: 使用最新的React特性和最佳实践
- 🔒 **类型安全**: 完整的TypeScript支持
- 🌐 **SSR友好**: 完全兼容服务端渲染，不会报错
- ⚡ **纯函数实现**: 无副作用，函数式编程风格
- 🎯 **多种预加载策略**: 支持hover、visible、idle等预加载模式
- 🛠️ **灵活配置**: 支持自定义loading、error组件
- ⏱️ **超时处理**: 内置超时和重试机制
- 📦 **批量导入**: 支持一次性导入多个组件
- 🛣️ **路由优化**: 专门的路由级动态导入

## 🚀 快速开始

### 基本用法

```tsx
import { createDynamicImport } from './utils/dynamicImport';

const { Component } = createDynamicImport(
  () => import('./MyComponent')
);

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
}
```

### 带配置的高级用法

```tsx
const { Component, preload, isLoaded } = createDynamicImport(
  () => import('./MyComponent'),
  {
    loading: () => <div>Loading...</div>,
    error: ({ error, retry }) => (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={retry}>Retry</button>
      </div>
    ),
    delay: 300,
    timeout: 10000,
    preload: 'hover',
    ssr: 'fallback'
  }
);
```

## 📖 API 文档

### `createDynamicImport<T>(importFn, options)`

主要的动态导入函数。

#### 参数

- `importFn`: `() => Promise<{ default: ComponentType<T> } | ComponentType<T>>`
  - 动态导入函数，返回组件的Promise

- `options`: `DynamicImportOptions` (可选)
  - `loading`: 加载状态显示的组件或元素
  - `error`: 错误状态显示的组件
  - `delay`: 加载延迟时间（毫秒），避免闪烁
  - `timeout`: 超时时间（毫秒）
  - `preload`: 预加载策略 (`'hover' | 'visible' | 'idle' | boolean`)
  - `ssr`: SSR策略 (`'fallback' | 'client-only' | 'hydrate'`)

#### 返回值

- `Component`: 懒加载的React组件
- `preload`: 手动预加载函数
- `isLoaded`: 检查是否已加载的函数
- `getLoadingState`: 获取当前加载状态的函数

### `dynamicImport<T>(importFn)`

简化版本，适用于简单场景。

```tsx
const LazyComponent = dynamicImport(() => import('./MyComponent'));
```

### `createBatchDynamicImport<T>(importMap, options)`

批量动态导入多个组件。

```tsx
const components = createBatchDynamicImport({
  Home: () => import('./Home'),
  About: () => import('./About'),
  Contact: () => import('./Contact')
});

// 使用
<components.Home.Component />
<components.About.Component />
<components.Contact.Component />
```

### `createRouteDynamicImport<T>(importFn, options)`

专为路由场景优化的动态导入。

```tsx
const { Component: LazyRoute } = createRouteDynamicImport(
  () => import('./RoutePage'),
  { routePreload: true }
);
```

## 🔧 配置选项详解

### Loading状态

```tsx
// 函数组件
loading: () => <MyLoadingSpinner />

// React元素
loading: <div>Loading...</div>
```

### 错误处理

```tsx
error: ({ error, retry }) => (
  <div>
    <h3>加载失败</h3>
    <p>{error.message}</p>
    <button onClick={retry}>重试</button>
  </div>
)
```

### 预加载策略

- `'hover'`: 鼠标悬停时预加载
- `'visible'`: 组件可见时预加载
- `'idle'`: 浏览器空闲时预加载
- `true`: 立即预加载
- `false`: 不预加载（默认）

### SSR策略

- `'fallback'`: 服务端显示fallback内容（默认）
- `'client-only'`: 仅在客户端渲染
- `'hydrate'`: 服务端渲染占位符，客户端激活

## 🌐 SSR兼容性

这个工具完全支持服务端渲染：

```tsx
// 服务端安全的使用方式
const { Component } = createDynamicImport(
  () => import('./MyComponent'),
  {
    ssr: 'fallback',
    loading: () => <div>Loading on server...</div>
  }
);
```

## ⚡ 性能优化

### 预加载最佳实践

```tsx
// 1. 路由级别预加载
const { Component, preload } = createRouteDynamicImport(
  () => import('./Dashboard')
);

// 2. 用户交互预加载
<div onMouseEnter={() => preload()}>
  <Link to="/dashboard">Dashboard</Link>
</div>

// 3. 批量预加载
const batchComponents = createBatchDynamicImport({
  Page1: () => import('./Page1'),
  Page2: () => import('./Page2')
}, { preload: 'idle' });
```

### 状态监控

```tsx
const { Component, isLoaded, getLoadingState } = createDynamicImport(
  () => import('./MyComponent')
);

console.log('已加载:', isLoaded());
console.log('加载状态:', getLoadingState()); // 'idle' | 'loading' | 'loaded' | 'error'
```

## 🚨 最佳实践

1. **使用Suspense边界**：始终用`<Suspense>`包装动态组件
2. **设置合理超时**：避免无限加载状态
3. **优雅错误处理**：提供重试机制
4. **预加载策略**：根据用户行为选择合适的预加载时机
5. **SSR考虑**：为服务端渲染选择合适的策略

## 🔍 调试和监控

```tsx
// 开发环境调试
const { Component, preload, getLoadingState } = createDynamicImport(
  () => import('./MyComponent'),
  {
    // 添加调试回调
    loading: () => {
      console.log('开始加载组件...');
      return <LoadingSpinner />;
    }
  }
);

// 监控加载状态
useEffect(() => {
  const state = getLoadingState();
  console.log('当前状态:', state);
}, []);
```

## 📦 与现有工具集成

### React Router

```tsx
import { createRouteDynamicImport } from './utils/dynamicImport';

const routes = [
  {
    path: '/dashboard',
    element: createRouteDynamicImport(
      () => import('./pages/Dashboard')
    ).Component
  }
];
```

### Next.js

```tsx
// 与Next.js dynamic兼容
import { createDynamicImport } from './utils/dynamicImport';

const DynamicComponent = createDynamicImport(
  () => import('./MyComponent'),
  { ssr: 'client-only' } // Next.js风格
);
```

## 🧪 测试

```tsx
import { render, waitFor } from '@testing-library/react';
import { createDynamicImport } from './dynamicImport';

test('should load component dynamically', async () => {
  const { Component } = createDynamicImport(
    () => Promise.resolve({ default: () => <div>Test Component</div> })
  );

  const { getByText } = render(
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );

  await waitFor(() => {
    expect(getByText('Test Component')).toBeInTheDocument();
  });
});
```

## 🔄 迁移指南

### 从React.lazy迁移

```tsx
// 之前
const LazyComponent = React.lazy(() => import('./Component'));

// 之后
const { Component: LazyComponent } = createDynamicImport(
  () => import('./Component')
);
```

### 从Next.js dynamic迁移

```tsx
// 之前
const DynamicComponent = dynamic(() => import('./Component'), {
  loading: () => <Loading />,
  ssr: false
});

// 之后  
const { Component: DynamicComponent } = createDynamicImport(
  () => import('./Component'),
  {
    loading: () => <Loading />,
    ssr: 'client-only'
  }
);
```

---

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！