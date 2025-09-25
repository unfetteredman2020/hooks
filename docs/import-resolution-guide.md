---
sidebar_position: 3
---

# 解决导入路径需要扩展名的问题

当使用 `desktop-kit` 包时，如果遇到必须写 `.js` 扩展名才能导入的问题，可以通过以下方法解决。

## 问题描述

```typescript
// ❌ 这样会报错
import ClipboardText from 'desktop-kit/components/clipboard-text';

// ✅ 这样可以工作，但不够优雅
import ClipboardText from 'desktop-kit/components/clipboard-text/index.js';
```

## 解决方案

### 方案 1：配置 TypeScript 路径映射（推荐）

在 `tsconfig.json` 中添加路径映射：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "desktop-kit/components/clipboard-text": ["node_modules/desktop-kit/components/clipboard-text/index.js"],
      "desktop-kit/components/*": ["node_modules/desktop-kit/components/*/index.js"]
    }
  }
}
```

现在可以这样导入：
```typescript
import ClipboardText from 'desktop-kit/components/clipboard-text';
```

### 方案 2：创建类型声明文件

创建 `src/@types/desktop-kit.d.ts`：

```typescript
declare module 'desktop-kit/components/clipboard-text' {
  interface ClipboardTextProps {
    text: string;
    children?: React.ReactNode;
    onCopy?: () => void;
  }
  
  const ClipboardText: React.FC<ClipboardTextProps>;
  export default ClipboardText;
}
```

### 方案 3：使用 CRACO 配置 Webpack（适用于 CRA）

1. 安装 CRACO：
```bash
npm install @craco/craco
```

2. 创建 `craco.config.js`：
```javascript
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'desktop-kit/components/clipboard-text': path.resolve(
          __dirname,
          'node_modules/desktop-kit/components/clipboard-text/index.js'
        ),
      };
      return webpackConfig;
    },
  },
};
```

3. 修改 `package.json` 中的脚本：
```json
{
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test"
  }
}
```

### 方案 4：创建重新导出文件

创建 `src/lib/desktop-kit.ts`：

```typescript
// 重新导出所需的组件
export { default as ClipboardText } from 'desktop-kit/components/clipboard-text/index.js';
export { default as Button } from 'desktop-kit/components/button/index.js';
```

使用时：
```typescript
import { ClipboardText } from '@/lib/desktop-kit';
```

### 方案 5：配置模块解析规则

如果 `desktop-kit` 包支持 `exports` 字段，可以请求包的维护者在 `package.json` 中添加：

```json
{
  "exports": {
    "./components/clipboard-text": {
      "import": "./components/clipboard-text/index.js",
      "require": "./components/clipboard-text/index.js",
      "types": "./components/clipboard-text/index.d.ts"
    }
  }
}
```

## 最佳实践

1. **优先使用 TypeScript 路径映射**：这是最干净的解决方案，不需要修改构建配置。

2. **类型安全**：确保添加类型声明文件，以获得更好的 TypeScript 支持。

3. **性能考虑**：路径映射在编译时解析，不会影响运行时性能。

4. **团队协作**：选择一种方案后，确保团队成员都了解并使用相同的导入方式。

## 故障排除

### 清除缓存
如果配置后仍然有问题，尝试清除缓存：
```bash
# 删除 node_modules 和锁文件
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 如果使用 TypeScript
npx tsc --build --clean
```

### VS Code 配置
确保 VS Code 使用项目的 TypeScript 版本：
1. 打开命令面板（Cmd/Ctrl + Shift + P）
2. 选择 "TypeScript: Select TypeScript Version"
3. 选择 "Use Workspace Version"

### 检查包结构
确认 `desktop-kit` 包的实际结构：
```bash
ls -la node_modules/desktop-kit/components/clipboard-text/
```

## 总结

不同的方案适用于不同的场景：
- **TypeScript 项目**：使用路径映射
- **需要 Webpack 定制**：使用 CRACO
- **简单快速**：创建重新导出文件
- **长期解决**：联系包维护者改进包的导出配置