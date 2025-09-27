import React, { lazy, ComponentType, ReactNode } from 'react';

/**
 * 动态导入配置选项
 */
export interface DynamicImportOptions {
  /** 加载状态显示组件 */
  loading?: ComponentType | ReactNode;
  /** 错误状态显示组件 */
  error?: ComponentType<{ error: Error; retry: () => void }> | ReactNode;
  /** 加载延迟时间（毫秒），避免闪烁 */
  delay?: number;
  /** 超时时间（毫秒） */
  timeout?: number;
  /** 预加载策略 */
  preload?: 'hover' | 'visible' | 'idle' | boolean;
  /** SSR降级策略 */
  ssr?: 'fallback' | 'client-only' | 'hydrate';
}

/**
 * 动态导入结果
 */
export interface DynamicImportResult<T = any> {
  /** 懒加载组件 */
  Component: ComponentType<T>;
  /** 预加载函数 */
  preload: () => Promise<void>;
  /** 是否已加载 */
  isLoaded: () => boolean;
  /** 获取加载状态 */
  getLoadingState: () => 'idle' | 'loading' | 'loaded' | 'error';
}

/**
 * 组件导入函数类型
 */
type ImportFunction<T = any> = () => Promise<{ default: ComponentType<T> } | ComponentType<T>>;

/**
 * 检查是否在服务端环境
 */
const isServer = (): boolean => {
  return typeof window === 'undefined';
};

/**
 * 检查是否支持动态导入
 */
const supportsDynamicImport = (): boolean => {
  if (isServer()) return false;
  try {
    return typeof import === 'function';
  } catch {
    return false;
  }
};

/**
 * React 19 兼容的动态导入工具函数
 */
export function createDynamicImport<T = any>(
  importFn: ImportFunction<T>,
  options: DynamicImportOptions = {}
): DynamicImportResult<T> {
  const {
    loading,
    error,
    delay = 0,
    timeout = 30000,
    preload = false,
    ssr = 'fallback'
  } = options;

  // 状态管理（使用闭包实现纯函数）
  let loadingState: 'idle' | 'loading' | 'loaded' | 'error' = 'idle';
  let loadedComponent: ComponentType<T> | null = null;
  let loadError: Error | null = null;
  let preloadPromise: Promise<void> | null = null;

  /**
   * 标准化组件导入结果
   */
  const normalizeComponent = (module: any): ComponentType<T> => {
    // 处理 ES6 模块默认导出
    if (module && typeof module === 'object' && 'default' in module) {
      return module.default;
    }
    // 处理直接导出的组件
    if (typeof module === 'function') {
      return module;
    }
    throw new Error('Invalid component module format');
  };

  /**
   * 执行实际的动态导入
   */
  const performImport = async (): Promise<ComponentType<T>> => {
    if (loadedComponent) {
      return loadedComponent;
    }

    if (loadingState === 'loading' && preloadPromise) {
      await preloadPromise;
      return loadedComponent!;
    }

    loadingState = 'loading';
    loadError = null;

    try {
      // 设置超时处理
      const timeoutPromise = timeout > 0 
        ? new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error(`Import timeout after ${timeout}ms`)), timeout);
          })
        : Promise.race([]);

      // 添加延迟（如果需要）
      const delayPromise = delay > 0
        ? new Promise(resolve => setTimeout(resolve, delay))
        : Promise.resolve();

      // 执行导入
      const importPromise = Promise.all([importFn(), delayPromise]).then(([module]) => module);

      // 等待导入完成或超时
      const module = timeout > 0 
        ? await Promise.race([importPromise, timeoutPromise])
        : await importPromise;

      const component = normalizeComponent(module);
      
      loadedComponent = component;
      loadingState = 'loaded';
      
      return component;
    } catch (err) {
      loadError = err instanceof Error ? err : new Error(String(err));
      loadingState = 'error';
      throw loadError;
    }
  };

  /**
   * 预加载函数
   */
  const preloadFn = async (): Promise<void> => {
    if (loadedComponent || loadingState === 'loading') {
      return;
    }

    if (!preloadPromise) {
      preloadPromise = performImport().then(() => {}).catch(() => {});
    }
    
    return preloadPromise;
  };

  /**
   * 创建懒加载组件
   */
  const createLazyComponent = (): ComponentType<T> => {
    // 服务端渲染处理
    if (isServer()) {
      switch (ssr) {
        case 'client-only':
          // 服务端返回空组件，客户端渲染
          return (() => null) as ComponentType<T>;
        
        case 'hydrate':
          // 服务端渲染占位符，客户端激活时替换
          return ((props: T) => {
            if (typeof loading === 'function') {
              const LoadingComponent = loading as ComponentType;
              return React.createElement(LoadingComponent);
            }
            return loading as ReactNode;
          }) as ComponentType<T>;
        
        case 'fallback':
        default:
          // 服务端使用fallback组件
          return ((props: T) => {
            if (typeof loading === 'function') {
              const LoadingComponent = loading as ComponentType;
              return React.createElement(LoadingComponent);
            }
            return loading as ReactNode;
          }) as ComponentType<T>;
      }
    }

    // 客户端使用React.lazy
    if (supportsDynamicImport()) {
      return lazy(performImport);
    }

    // 降级处理：不支持动态导入时返回错误组件
    return ((props: T) => {
      const errorObj = new Error('Dynamic import not supported');
      if (typeof error === 'function') {
        const ErrorComponent = error as ComponentType<{ error: Error; retry: () => void }>;
        return React.createElement(ErrorComponent, { 
          error: errorObj, 
          retry: () => window.location.reload() 
        });
      }
      return error as ReactNode || React.createElement('div', {}, 'Dynamic import not supported');
    }) as ComponentType<T>;
  };

  const LazyComponent = createLazyComponent();

  // 自动预加载处理（客户端）
  if (!isServer() && preload) {
    if (preload === true || preload === 'idle') {
      // 空闲时预加载
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          preloadFn().catch(() => {});
        });
      } else {
        setTimeout(() => {
          preloadFn().catch(() => {});
        }, 0);
      }
    }
  }

  return {
    Component: LazyComponent,
    preload: preloadFn,
    isLoaded: () => loadingState === 'loaded',
    getLoadingState: () => loadingState
  };
}

/**
 * 简化版动态导入函数（适用于简单场景）
 */
export function dynamicImport<T = any>(
  importFn: ImportFunction<T>
): ComponentType<T> {
  const { Component } = createDynamicImport(importFn);
  return Component;
}

/**
 * 批量动态导入工具
 */
export function createBatchDynamicImport<T extends Record<string, any>>(
  importMap: { [K in keyof T]: ImportFunction<T[K]> },
  options: DynamicImportOptions = {}
): { [K in keyof T]: DynamicImportResult<T[K]> } {
  const results = {} as { [K in keyof T]: DynamicImportResult<T[K]> };
  
  for (const key in importMap) {
    if (Object.prototype.hasOwnProperty.call(importMap, key)) {
      results[key] = createDynamicImport(importMap[key], options);
    }
  }
  
  return results;
}

/**
 * 带路由分割的动态导入（适用于React Router等场景）
 */
export function createRouteDynamicImport<T = any>(
  importFn: ImportFunction<T>,
  options: DynamicImportOptions & {
    /** 路由级别的预加载策略 */
    routePreload?: boolean;
  } = {}
): DynamicImportResult<T> {
  const { routePreload = true, ...restOptions } = options;
  
  const result = createDynamicImport(importFn, {
    ...restOptions,
    preload: routePreload ? 'idle' : restOptions.preload
  });
  
  return result;
}

export default createDynamicImport;