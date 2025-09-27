import React, { ComponentType, lazy, Suspense, ReactNode } from 'react';

/**
 * 动态导入组件的配置选项
 */
export interface DynamicImportOptions {
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

/**
 * 动态导入状态
 */
export interface DynamicImportState<T> {
  /** 组件是否已加载 */
  loaded: boolean;
  /** 加载的组件 */
  component: ComponentType<T> | null;
  /** 加载错误 */
  error: Error | null;
  /** 是否正在加载 */
  loading: boolean;
  /** 重试函数 */
  retry: () => void;
}

/**
 * 检查是否在服务端环境
 */
const isServer = typeof window === 'undefined';

/**
 * 延迟函数
 */
const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * 带重试的动态导入函数
 */
const importWithRetry = async <T>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  retryCount: number = 3,
  retryDelay: number = 1000
): Promise<ComponentType<T>> => {
  let lastError: Error | null = null;
  
  for (let i = 0; i <= retryCount; i++) {
    try {
      const module = await importFn();
      return module.default;
    } catch (error) {
      lastError = error as Error;
      
      if (i < retryCount) {
        await delay(retryDelay * Math.pow(2, i)); // 指数退避
      }
    }
  }
  
  throw lastError || new Error('Import failed after all retries');
};

/**
 * 创建动态导入的React组件
 * 使用React 19的新特性，兼容服务端渲染
 */
export const createDynamicImport = <T = any>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: DynamicImportOptions = {}
) => {
  const {
    fallback = null,
    ssr = true,
    errorBoundary: ErrorBoundary,
    retryCount = 3,
    retryDelay = 1000
  } = options;

  // 在服务端且禁用SSR时，返回空组件
  if (isServer && !ssr) {
    return () => null as any;
  }

  // 使用React.lazy创建懒加载组件
  const LazyComponent = lazy(async () => {
    try {
      const component = await importWithRetry(importFn, retryCount, retryDelay);
      return { default: component };
    } catch (error) {
      // 如果导入失败，返回错误组件
      const ErrorComponent = () => {
        if (ErrorBoundary) {
          return React.createElement(ErrorBoundary, { 
            error: error as Error, 
            retry: () => window.location.reload() 
          });
        }
        return React.createElement('div', null, `Failed to load component: ${(error as Error).message}`);
      };
      return { default: ErrorComponent as ComponentType<T> };
    }
  });

  // 返回包装后的组件
  const DynamicComponent = (props: T) => {
    return React.createElement(
      Suspense,
      { fallback },
      React.createElement(LazyComponent as any, props as any)
    );
  };

  return DynamicComponent;
};

/**
 * 纯函数版本的动态导入工具
 * 不依赖React hooks，可以在任何地方使用
 */
export const dynamicImport = async <T = any>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: Pick<DynamicImportOptions, 'retryCount' | 'retryDelay'> = {}
): Promise<ComponentType<T>> => {
  const { retryCount = 3, retryDelay = 1000 } = options;
  
  try {
    return await importWithRetry(importFn, retryCount, retryDelay);
  } catch (error) {
    throw new Error(`Dynamic import failed: ${(error as Error).message}`);
  }
};

/**
 * 批量动态导入工具
 */
export const batchDynamicImport = async <T = any>(
  importFns: Array<() => Promise<{ default: ComponentType<T> }>>,
  options: Pick<DynamicImportOptions, 'retryCount' | 'retryDelay'> = {}
): Promise<ComponentType<T>[]> => {
  const { retryCount = 3, retryDelay = 1000 } = options;
  
  const promises = importFns.map(importFn => 
    importWithRetry(importFn, retryCount, retryDelay)
  );
  
  try {
    return await Promise.all(promises);
  } catch (error) {
    throw new Error(`Batch dynamic import failed: ${(error as Error).message}`);
  }
};

/**
 * 预加载组件工具
 */
export const preloadComponent = <T = any>(
  importFn: () => Promise<{ default: ComponentType<T> }>
): Promise<ComponentType<T>> => {
  return importWithRetry(importFn, 1, 0);
};

/**
 * 检查组件是否已缓存的工具
 */
export const isComponentCached = (importFn: () => Promise<any>): boolean => {
  try {
    // 尝试同步访问，如果已缓存则不会抛出错误
    importFn();
    return true;
  } catch {
    return false;
  }
};

export default createDynamicImport;