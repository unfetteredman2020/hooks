import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import {
  useDynamicImport,
  createLazyComponent,
  preloadModule,
  useDynamicImports,
  useConditionalImport,
  useSafeDynamicImport,
  useClientOnlyImport,
  clearImportCache,
  clearAllImportCache
} from './dynamicImport';

// Mock模块
const mockModule = { 
  default: () => <div>Mock Component</div>,
  someFunction: () => 'test value'
};

// 测试包装器
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
);

describe('Dynamic Import Utils', () => {
  beforeEach(() => {
    clearAllImportCache();
  });

  describe('useDynamicImport', () => {
    it('应该成功导入模块', async () => {
      const importFactory = jest.fn().mockResolvedValue(mockModule);
      
      const { result } = renderHook(
        () => useDynamicImport(importFactory, 'test-key'),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current).toBe(mockModule);
      });

      expect(importFactory).toHaveBeenCalledTimes(1);
    });

    it('应该缓存导入结果', async () => {
      const importFactory = jest.fn().mockResolvedValue(mockModule);
      
      const { result: result1 } = renderHook(
        () => useDynamicImport(importFactory, 'cache-test'),
        { wrapper }
      );

      const { result: result2 } = renderHook(
        () => useDynamicImport(importFactory, 'cache-test'),
        { wrapper }
      );

      await waitFor(() => {
        expect(result1.current).toBe(mockModule);
        expect(result2.current).toBe(mockModule);
      });

      // 应该只调用一次
      expect(importFactory).toHaveBeenCalledTimes(1);
    });
  });

  describe('createLazyComponent', () => {
    it('应该创建懒加载组件', async () => {
      const importFactory = jest.fn().mockResolvedValue({
        default: () => <div>Lazy Component</div>
      });

      const LazyComponent = createLazyComponent(importFactory, 'lazy-comp');
      
      const { result } = renderHook(() => LazyComponent(), { wrapper });

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });
    });
  });

  describe('preloadModule', () => {
    it('应该预加载模块', async () => {
      const importFactory = jest.fn().mockResolvedValue(mockModule);
      
      // 预加载
      preloadModule(importFactory, 'preload-test');
      
      // 立即使用应该已经在缓存中
      const { result } = renderHook(
        () => useDynamicImport(importFactory, 'preload-test'),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current).toBe(mockModule);
      });

      // 只调用一次（预加载时）
      expect(importFactory).toHaveBeenCalledTimes(1);
    });
  });

  describe('useDynamicImports', () => {
    it('应该批量导入多个模块', async () => {
      const modules = [
        { data: 'module1' },
        { data: 'module2' },
        { data: 'module3' }
      ];

      const imports = modules.map((module, index) => ({
        factory: jest.fn().mockResolvedValue(module),
        key: `batch-${index}`
      }));

      const { result } = renderHook(
        () => useDynamicImports(imports),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current).toHaveLength(3);
        result.current.forEach((module, index) => {
          expect(module).toBe(modules[index]);
        });
      });
    });
  });

  describe('useConditionalImport', () => {
    it('条件为true时应该导入模块', async () => {
      const importFactory = jest.fn().mockResolvedValue(mockModule);
      
      const { result } = renderHook(
        () => useConditionalImport(true, importFactory, 'conditional-true'),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current).toBe(mockModule);
      });
    });

    it('条件为false时应该返回null', () => {
      const importFactory = jest.fn().mockResolvedValue(mockModule);
      
      const { result } = renderHook(
        () => useConditionalImport(false, importFactory, 'conditional-false'),
        { wrapper }
      );

      expect(result.current).toBeNull();
      expect(importFactory).not.toHaveBeenCalled();
    });
  });

  describe('useSafeDynamicImport', () => {
    it('成功时应该返回导入的模块', async () => {
      const importFactory = jest.fn().mockResolvedValue(mockModule);
      const fallback = { default: 'fallback' };
      
      const { result } = renderHook(
        () => useSafeDynamicImport(importFactory, 'safe-success', fallback),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current).toBe(mockModule);
      });
    });

    it('失败时应该返回降级值', async () => {
      const importFactory = jest.fn().mockRejectedValue(new Error('Import failed'));
      const fallback = { default: 'fallback' };
      
      const { result } = renderHook(
        () => useSafeDynamicImport(importFactory, 'safe-fail', fallback),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current).toBe(fallback);
      });
    });
  });

  describe('useClientOnlyImport', () => {
    it('在客户端应该导入模块', async () => {
      const importFactory = jest.fn().mockResolvedValue(mockModule);
      
      const { result } = renderHook(
        () => useClientOnlyImport(importFactory, 'client-only'),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current).toBe(mockModule);
      });
    });

    it('在服务端应该返回null', async () => {
      // 模拟服务端环境
      const originalWindow = global.window;
      delete (global as any).window;

      const importFactory = jest.fn().mockResolvedValue(mockModule);
      
      const { result } = renderHook(
        () => useClientOnlyImport(importFactory, 'server-side'),
        { wrapper }
      );

      expect(result.current).toBeNull();
      expect(importFactory).not.toHaveBeenCalled();

      // 恢复window
      (global as any).window = originalWindow;
    });
  });

  describe('缓存管理', () => {
    it('clearImportCache应该清除特定缓存', async () => {
      const importFactory = jest.fn().mockResolvedValue(mockModule);
      
      // 第一次导入
      renderHook(
        () => useDynamicImport(importFactory, 'clear-test'),
        { wrapper }
      );

      // 清除缓存
      clearImportCache('clear-test');

      // 再次导入应该重新调用factory
      renderHook(
        () => useDynamicImport(importFactory, 'clear-test'),
        { wrapper }
      );

      await waitFor(() => {
        expect(importFactory).toHaveBeenCalledTimes(2);
      });
    });

    it('clearAllImportCache应该清除所有缓存', async () => {
      const factory1 = jest.fn().mockResolvedValue({ data: 1 });
      const factory2 = jest.fn().mockResolvedValue({ data: 2 });
      
      // 导入两个模块
      renderHook(() => useDynamicImport(factory1, 'all-clear-1'), { wrapper });
      renderHook(() => useDynamicImport(factory2, 'all-clear-2'), { wrapper });

      // 清除所有缓存
      clearAllImportCache();

      // 再次导入应该重新调用所有factory
      renderHook(() => useDynamicImport(factory1, 'all-clear-1'), { wrapper });
      renderHook(() => useDynamicImport(factory2, 'all-clear-2'), { wrapper });

      await waitFor(() => {
        expect(factory1).toHaveBeenCalledTimes(2);
        expect(factory2).toHaveBeenCalledTimes(2);
      });
    });
  });
});