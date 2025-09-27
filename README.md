# React 19+ 动态导入工具函数

这是一个基于 React 19+ 新特性的动态导入工具函数库，提供了纯函数实现，完全兼容服务端渲染（SSR）。

## 特性

- ✅ 使用 React 19 的 `use` 和 `cache` API
- ✅ 纯函数实现，无副作用
- ✅ 完全兼容服务端渲染（SSR）
- ✅ 自动缓存管理
- ✅ TypeScript 支持
- ✅ 支持 Suspense
- ✅ 错误边界友好

## 核心 API

### `useDynamicImport`

基础的动态导入 hook，支持自动缓存和 Suspense。

```typescript
const module = useDynamicImport(
  () => import('./module'),
  'unique-cache-key'
);
```

### `createLazyComponent`

创建懒加载组件，自动处理 default 导出。

```typescript
const LazyComponent = createLazyComponent(
  () => import('./components/MyComponent'),
  'my-component'
);

// 使用时需要包裹在 Suspense 中
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

### `preloadModule`

预加载模块，提升用户体验。

```typescript
// 在用户交互前预加载
onMouseEnter={() => {
  preloadModule(
    () => import('./heavy-module'),
    'heavy-module-key'
  );
}}
```

### `useDynamicImports`

批量导入多个模块。

```typescript
const modules = useDynamicImports([
  { factory: () => import('./moduleA'), key: 'module-a' },
  { factory: () => import('./moduleB'), key: 'module-b' },
]);
```

### `useConditionalImport`

根据条件动态导入模块。

```typescript
const adminModule = useConditionalImport(
  userRole === 'admin',
  () => import('./admin-module'),
  'admin-module'
);
```

### `useSafeDynamicImport`

带错误处理的动态导入，支持降级。

```typescript
const config = useSafeDynamicImport(
  () => import('./config'),
  'app-config',
  { theme: 'default' } // 降级配置
);
```

### `useClientOnlyImport`

仅在客户端导入，完美解决 SSR 兼容问题。

```typescript
const clientModule = useClientOnlyImport(
  () => import('./client-only-module'),
  'client-module'
);
```

## SSR 兼容性

所有函数都完全兼容服务端渲染：

1. 使用 React 19 的 `use` hook 自动处理 Suspense
2. `useClientOnlyImport` 在服务端返回 `null`
3. 无副作用，纯函数实现
4. 支持流式 SSR

## 缓存管理

提供了灵活的缓存管理功能：

```typescript
// 清除特定缓存
clearImportCache('cache-key');

// 清除所有缓存
clearAllImportCache();
```

## 最佳实践

1. **始终使用唯一的缓存键**：避免模块冲突
2. **合理使用预加载**：在用户交互前预加载，提升体验
3. **错误边界**：配合 React Error Boundary 使用
4. **代码分割**：根据路由或功能模块进行分割

## 性能优化

1. 自动缓存已加载的模块
2. 支持预加载关键模块
3. 避免重复导入
4. 支持批量导入优化

## 注意事项

1. 需要 React 19 或更高版本
2. 必须在 Suspense 边界内使用
3. 服务端渲染时注意使用 `useClientOnlyImport`
4. 缓存键必须全局唯一

## TypeScript 支持

完整的 TypeScript 类型定义，支持泛型：

```typescript
interface MyModule {
  someFunction: () => string;
}

const module = useDynamicImport<MyModule>(
  () => import('./my-module'),
  'my-module'
);
```