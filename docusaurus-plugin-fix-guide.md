# Docusaurus Custom Plugin Error Fix Guide

## 问题分析

您的自定义插件出现错误的主要原因：

### 1. **模块系统混用**
原始代码混用了 CommonJS 和 ES 模块语法：
```javascript
// ES 模块导入
import path from 'path';

// CommonJS 导出
module.exports = function rspackPlugin() {
```

这种混用会导致 Docusaurus 在加载插件时出现模块解析错误。

### 2. **__dirname 在 ES 模块中不可用**
如果文件被识别为 ES 模块，`__dirname` 变量将不存在，可能导致运行时错误。

### 3. **可能的配置对象问题**
插件可能在某些情况下没有正确返回配置对象。

## 解决方案

### 方案 1：使用纯 CommonJS（推荐）
```javascript
// rspack-plugin-fixed.js
const path = require('path');

module.exports = function rspackPlugin() {
  return {
    name: 'custom-rspack-plugin',
    configureWebpack(config, isServer) {
      console.log('isServer :>> ', isServer, 'process.env.NODE_ENV', process.env.NODE_ENV, 'rspack');
      console.log('output :>> ', config.output);
      return config;
    },
  };
};
```

### 方案 2：使用纯 ES 模块
如果您的 Docusaurus 配置支持 ES 模块：
```javascript
// rspack-plugin-esm.js
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function rspackPlugin() {
  return {
    name: 'custom-rspack-plugin',
    configureWebpack(config, isServer) {
      console.log('isServer :>> ', isServer, 'process.env.NODE_ENV', process.env.NODE_ENV, 'rspack');
      console.log('output :>> ', config.output);
      return config;
    },
  };
}
```

### 方案 3：增强的错误处理版本
```javascript
// rspack-plugin-robust.js
const path = require('path');

module.exports = function rspackPlugin() {
  return {
    name: 'custom-rspack-plugin',
    configureWebpack(config, isServer) {
      try {
        console.log('=== Rspack Plugin Debug Info ===');
        console.log('isServer:', isServer);
        console.log('NODE_ENV:', process.env.NODE_ENV);
        
        if (config && config.output) {
          console.log('Output config:', {
            path: config.output.path,
            filename: config.output.filename,
            publicPath: config.output.publicPath
          });
        } else {
          console.warn('Warning: config.output is not defined');
        }
        
        return config || {};
      } catch (error) {
        console.error('Error in rspack plugin:', error);
        return config || {};
      }
    },
  };
};
```

## 如何使用

1. 选择上述任一方案的代码
2. 在 `docusaurus.config.js` 中引入插件：

```javascript
// 对于 CommonJS 版本
const rspackPlugin = require('./path/to/rspack-plugin-fixed');

// 对于 ES 模块版本
import rspackPlugin from './path/to/rspack-plugin-esm.js';

module.exports = {
  // ... 其他配置
  plugins: [
    rspackPlugin(),
    // ... 其他插件
  ],
};
```

## 调试建议

1. 先使用增强错误处理版本，查看具体的错误信息
2. 检查 Docusaurus 版本是否支持您使用的模块系统
3. 确保插件文件路径正确
4. 查看 Docusaurus 的控制台输出，了解插件加载过程

## 注意事项

- Docusaurus v2 默认使用 CommonJS 模块系统
- 如果您的项目配置了 `"type": "module"`，需要使用 ES 模块语法
- 始终确保插件返回有效的配置对象