import { use, cache } from 'react';

// 类型定义
type DynamicImportResult<T> = T | undefined;
type ImportFactory<T> = () => Promise<T>;
type LazyComponent<T> = () => T;

// 缓存动态导入的Promise，避免重复加载
const importCache = new Map<string, Promise<any>>();

/**
 * React 19+ 动态导入工具函数
 * 支持服务端渲染，纯函数实现，无副作用
 * 
 * @param importFactory - 动态导入函数，返回Promise
 * @param cacheKey - 缓存键，用于避免重复导入
 * @returns 导入的模块或undefined（加载中）
 */
export function useDynamicImport<T = any>(
  importFactory: ImportFactory<T>,
  cacheKey: string
): DynamicImportResult<T> {
  // 使用React 19的cache API缓存导入操作
  const cachedImport = cache((key: string) => {
    if (!importCache.has(key)) {
      importCache.set(key, importFactory());
    }
    return importCache.get(key)!;
  });

  // 使用React 19的use hook处理Promise
  // use会自动处理Suspense边界
  try {
    const module = use(cachedImport(cacheKey));
    return module;
  } catch (promise) {
    // 如果Promise还在pending状态，use会抛出Promise
    // React会自动处理这个Promise并触发Suspense
    if (promise instanceof Promise) {
      throw promise;
    }
    // 其他错误直接抛出
    throw promise;
  }
}

/**
 * 创建懒加载组件的工具函数
 * 
 * @param importFactory - 动态导入组件的函数
 * @param cacheKey - 缓存键
 * @returns 懒加载组件
 */
export function createLazyComponent<T = any>(
  importFactory: ImportFactory<{ default: T }>,
  cacheKey: string
): LazyComponent<T> {
  return function LazyComponent() {
    const module = useDynamicImport(importFactory, cacheKey);
    if (!module) {
      throw new Error('Component is still loading');
    }
    return module.default;
  };
}

/**
 * 预加载模块的工具函数
 * 可以在需要时提前加载模块，提升用户体验
 * 
 * @param importFactory - 动态导入函数
 * @param cacheKey - 缓存键
 */
export function preloadModule<T = any>(
  importFactory: ImportFactory<T>,
  cacheKey: string
): void {
  if (!importCache.has(cacheKey)) {
    importCache.set(cacheKey, importFactory());
  }
}

/**
 * 批量动态导入工具函数
 * 
 * @param imports - 导入配置数组
 * @returns 导入结果数组
 */
export function useDynamicImports<T extends Record<string, any>>(
  imports: Array<{
    factory: ImportFactory<T[keyof T]>;
    key: string;
  }>
): Array<DynamicImportResult<T[keyof T]>> {
  return imports.map(({ factory, key }) => 
    useDynamicImport(factory, key)
  );
}

/**
 * 条件动态导入工具函数
 * 
 * @param condition - 导入条件
 * @param importFactory - 动态导入函数
 * @param cacheKey - 缓存键
 * @returns 导入的模块或null
 */
export function useConditionalImport<T = any>(
  condition: boolean,
  importFactory: ImportFactory<T>,
  cacheKey: string
): DynamicImportResult<T> | null {
  if (!condition) {
    return null;
  }
  return useDynamicImport(importFactory, cacheKey);
}

/**
 * 带错误处理的动态导入工具函数
 * 
 * @param importFactory - 动态导入函数
 * @param cacheKey - 缓存键
 * @param fallback - 错误时的降级值
 * @returns 导入的模块或降级值
 */
export function useSafeDynamicImport<T = any>(
  importFactory: ImportFactory<T>,
  cacheKey: string,
  fallback: T
): T {
  try {
    const result = useDynamicImport(importFactory, cacheKey);
    return result ?? fallback;
  } catch (error) {
    if (error instanceof Promise) {
      throw error; // 保持Suspense工作
    }
    console.error('Dynamic import failed:', error);
    return fallback;
  }
}

/**
 * 服务端渲染兼容的动态导入
 * 在服务端返回null，避免水合不匹配
 * 
 * @param importFactory - 动态导入函数
 * @param cacheKey - 缓存键
 * @returns 导入的模块或null
 */
export function useClientOnlyImport<T = any>(
  importFactory: ImportFactory<T>,
  cacheKey: string
): DynamicImportResult<T> | null {
  // 检查是否在服务端环境
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    return null;
  }
  
  return useDynamicImport(importFactory, cacheKey);
}

/**
 * 清除特定缓存
 * 
 * @param cacheKey - 要清除的缓存键
 */
export function clearImportCache(cacheKey: string): void {
  importCache.delete(cacheKey);
}

/**
 * 清除所有缓存
 */
export function clearAllImportCache(): void {
  importCache.clear();
}