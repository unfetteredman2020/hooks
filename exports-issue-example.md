# Package.json Exports 配置问题解析

## 问题原因

你的配置：
```json
"./*": {
  "types": "./dist/types/*",
  "import": "./dist/es/*",
  "require": "./dist/cjs/*"
}
```

这个配置的问题在于路径模式不完整。当你使用 `import ClipboardText from 'desktop-kit/components/clipboard-text/index'` 时：

1. Node.js 会匹配 `./*` 模式
2. 但是你的路径配置缺少了文件扩展名
3. Node.js 无法正确解析到具体的文件

## 解决方案

### 方案1：修正通配符路径（推荐）

```json
{
  "exports": {
    ".": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/es/index.js",
      "require": "./dist/cjs/index.js"
    },
    "./*": {
      "types": "./dist/types/*/index.d.ts",
      "import": "./dist/es/*/index.js",
      "require": "./dist/cjs/*/index.js"
    }
  }
}
```

这样当导入 `desktop-kit/components/clipboard-text/index` 时，会解析为：
- types: `./dist/types/components/clipboard-text/index/index.d.ts`
- import: `./dist/es/components/clipboard-text/index/index.js`

### 方案2：使用更灵活的通配符

```json
{
  "exports": {
    ".": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/es/index.js",
      "require": "./dist/cjs/index.js"
    },
    "./*": {
      "types": "./dist/types/*.d.ts",
      "import": "./dist/es/*.js",
      "require": "./dist/cjs/*.js"
    }
  }
}
```

这样导入时需要省略 `/index`：
```typescript
import ClipboardText from 'desktop-kit/components/clipboard-text';
```

### 方案3：支持多种导入模式

```json
{
  "exports": {
    ".": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/es/index.js",
      "require": "./dist/cjs/index.js"
    },
    "./*": {
      "types": "./dist/types/*.d.ts",
      "import": "./dist/es/*.js",
      "require": "./dist/cjs/*.js"
    },
    "./*/index": {
      "types": "./dist/types/*/index.d.ts",
      "import": "./dist/es/*/index.js",
      "require": "./dist/cjs/*/index.js"
    }
  }
}
```

这样两种导入方式都支持：
```typescript
// 方式1
import ClipboardText from 'desktop-kit/components/clipboard-text';
// 方式2
import ClipboardText from 'desktop-kit/components/clipboard-text/index';
```

## 调试技巧

可以使用 Node.js 的 `--conditions` 和 `--experimental-print-exports` 来调试：

```bash
# 查看包的导出映射
node --experimental-print-exports node_modules/desktop-kit/package.json

# 测试解析
node -e "console.log(require.resolve('desktop-kit/components/clipboard-text/index'))"
```

## 文件结构要求

确保你的构建输出符合 exports 配置的路径结构：

```
dist/
├── types/
│   ├── index.d.ts
│   └── components/
│       └── clipboard-text/
│           └── index.d.ts
├── es/
│   ├── index.js
│   └── components/
│       └── clipboard-text/
│           └── index.js
└── cjs/
    ├── index.js
    └── components/
        └── clipboard-text/
            └── index.js
```