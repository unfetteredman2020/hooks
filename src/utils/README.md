# React 19+ 动态导入工具

这是一个专为React 19+设计的动态导入工具函数库，提供了完整的服务端渲染(SSR)兼容性和TypeScript类型支持。

## 特性

- ✅ **React 19+ 兼容**: 使用最新的React特性
- ✅ **SSR 兼容**: 完全支持服务端渲染，不会报错
- ✅ **纯函数实现**: 无副作用，可以在任何地方使用
- ✅ **TypeScript 支持**: 完整的类型定义
- ✅ **错误处理**: 内置错误边界和重试机制
- ✅ **批量导入**: 支持一次性加载多个组件
- ✅ **预加载**: 支持组件预加载到缓存

## 安装

确保你的项目使用React 19+版本：

```bash
npm install react@^19.0.0 react-dom@^19.0.0
npm install @types/react@^19.0.0 @types/react-dom@^19.0.0
```

## 使用方法

### 1. createDynamicImport (推荐)

这是最推荐的方式，提供了完整的错误处理和加载状态管理。

```tsx
import { createDynamicImport } from './utils/dynamicImport';
import ErrorBoundary from './components/ErrorBoundary';

// 创建动态组件
const DynamicComponent = createDynamicImport(
  () => import('./components/HeavyComponent'),
  {
    fallback: <div>加载中...</div>,
    errorBoundary: ErrorBoundary,
    retryCount: 3,
    retryDelay: 1000,
    ssr: true // 是否在服务端渲染时启用
  }
);

// 使用组件
function App() {
  return (
    <DynamicComponent 
      title="动态加载的组件"
      data={[{ id: 1, name: '测试数据' }]}
    />
  );
}
```

### 2. dynamicImport (纯函数)

纯函数实现，不依赖React hooks，可以在任何地方使用。

```tsx
import { dynamicImport } from './utils/dynamicImport';

// 在组件外部使用
async function loadComponent() {
  try {
    const Component = await dynamicImport(() => import('./components/HeavyComponent'));
    return Component;
  } catch (error) {
    console.error('加载失败:', error);
  }
}

// 在组件内使用
function MyComponent() {
  const [Component, setComponent] = useState(null);
  
  useEffect(() => {
    dynamicImport(() => import('./components/HeavyComponent'))
      .then(setComponent)
      .catch(console.error);
  }, []);
  
  return Component ? <Component /> : <div>加载中...</div>;
}
```

### 3. batchDynamicImport (批量导入)

一次性加载多个组件，提高效率。

```tsx
import { batchDynamicImport } from './utils/dynamicImport';

async function loadMultipleComponents() {
  try {
    const [Component1, Component2, Component3] = await batchDynamicImport([
      () => import('./components/Component1'),
      () => import('./components/Component2'),
      () => import('./components/Component3')
    ]);
    
    return { Component1, Component2, Component3 };
  } catch (error) {
    console.error('批量加载失败:', error);
  }
}
```

### 4. preloadComponent (预加载)

提前加载组件到缓存中，后续使用更快。

```tsx
import { preloadComponent } from './utils/dynamicImport';

// 在应用启动时预加载
async function preloadComponents() {
  try {
    await preloadComponent(() => import('./components/HeavyComponent'));
    console.log('组件预加载完成');
  } catch (error) {
    console.error('预加载失败:', error);
  }
}
```

## API 参考

### DynamicImportOptions

```typescript
interface DynamicImportOptions {
  /** 加载中显示的组件 */
  fallback?: ReactNode;
  /** 是否在服务端渲染时禁用 */
  ssr?: boolean;
  /** 错误边界组件 */
  errorBoundary?: ComponentType<{ error: Error; retry: () => void }>;
  /** 重试次数 */
  retryCount?: number;
  /** 重试延迟（毫秒） */
  retryDelay?: number;
}
```

### 函数签名

```typescript
// 创建动态导入组件
function createDynamicImport<T = any>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options?: DynamicImportOptions
): ComponentType<T>;

// 纯函数动态导入
function dynamicImport<T = any>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options?: Pick<DynamicImportOptions, 'retryCount' | 'retryDelay'>
): Promise<ComponentType<T>>;

// 批量动态导入
function batchDynamicImport<T = any>(
  importFns: Array<() => Promise<{ default: ComponentType<T> }>>,
  options?: Pick<DynamicImportOptions, 'retryCount' | 'retryDelay'>
): Promise<ComponentType<T>[]>;

// 预加载组件
function preloadComponent<T = any>(
  importFn: () => Promise<{ default: ComponentType<T> }>
): Promise<ComponentType<T>>;
```

## 服务端渲染 (SSR) 支持

工具完全支持服务端渲染，通过以下方式确保兼容性：

1. **环境检测**: 自动检测是否在服务端环境
2. **SSR 选项**: 可以通过 `ssr: false` 在服务端禁用特定组件
3. **错误处理**: 服务端导入失败时返回空组件而不是抛出错误

```tsx
// 在服务端禁用的组件
const ClientOnlyComponent = createDynamicImport(
  () => import('./components/ClientOnlyComponent'),
  { ssr: false }
);
```

## 错误处理

工具提供了完整的错误处理机制：

1. **自动重试**: 支持指数退避重试
2. **错误边界**: 可自定义错误边界组件
3. **优雅降级**: 导入失败时显示错误信息而不是崩溃

```tsx
const ErrorBoundary = ({ error, retry }) => (
  <div>
    <p>加载失败: {error.message}</p>
    <button onClick={retry}>重试</button>
  </div>
);

const DynamicComponent = createDynamicImport(
  () => import('./components/HeavyComponent'),
  { errorBoundary: ErrorBoundary }
);
```

## 最佳实践

1. **使用 createDynamicImport**: 对于大多数用例，推荐使用 `createDynamicImport`
2. **合理设置重试**: 根据网络情况调整重试次数和延迟
3. **预加载关键组件**: 对用户可能访问的组件进行预加载
4. **错误边界**: 为动态组件提供合适的错误边界
5. **TypeScript**: 充分利用TypeScript的类型检查

## 注意事项

- 确保所有动态导入的组件都有默认导出
- 在服务端渲染时，某些组件可能需要特殊处理
- 动态导入的组件在首次加载时会有延迟，考虑使用预加载
- 错误边界组件应该简单且不依赖其他动态导入的组件