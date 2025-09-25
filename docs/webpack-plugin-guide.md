---
sidebar_position: 2
---

# Webpack 插件配置指南

本指南介绍如何在 Docusaurus 项目中添加和配置 Webpack 插件。

## 基本概念

Docusaurus 使用 Webpack 作为构建工具，但不直接暴露 webpack 配置文件。要修改 Webpack 配置，需要通过 Docusaurus 的插件系统。

## 方法 1：创建自定义插件

### 步骤 1：创建插件文件

在项目根目录创建 `plugins` 文件夹，并创建插件文件：

```javascript
// plugins/my-webpack-plugin.js
module.exports = function (context, options) {
  return {
    name: 'my-webpack-plugin',
    configureWebpack(config, isServer, utils) {
      const webpack = require('webpack');
      
      return {
        plugins: [
          new webpack.DefinePlugin({
            'process.env.MY_VAR': JSON.stringify('my-value'),
          }),
        ],
      };
    },
  };
};
```

### 步骤 2：在配置中注册插件

```javascript
// docusaurus.config.js
module.exports = {
  // ... 其他配置
  plugins: [
    './plugins/my-webpack-plugin',
  ],
};
```

## 方法 2：内联插件配置

直接在 `docusaurus.config.js` 中定义插件：

```javascript
module.exports = {
  plugins: [
    function myPlugin(context, options) {
      return {
        name: 'my-inline-plugin',
        configureWebpack(config, isServer) {
          return {
            plugins: [
              // 添加你的 webpack 插件
            ],
          };
        },
      };
    },
  ],
};
```

## 常用 Webpack 插件示例

### 1. DefinePlugin - 定义全局常量

```javascript
new webpack.DefinePlugin({
  'process.env.API_URL': JSON.stringify('https://api.example.com'),
  'process.env.VERSION': JSON.stringify(require('./package.json').version),
})
```

### 2. BundleAnalyzerPlugin - 分析包大小

首先安装依赖：
```bash
npm install --save-dev webpack-bundle-analyzer
```

然后配置：
```javascript
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

new BundleAnalyzerPlugin({
  analyzerMode: 'static',
  openAnalyzer: false,
})
```

### 3. CompressionPlugin - 生成压缩文件

```bash
npm install --save-dev compression-webpack-plugin
```

```javascript
const CompressionPlugin = require('compression-webpack-plugin');

new CompressionPlugin({
  algorithm: 'gzip',
  test: /\.(js|css|html|svg)$/,
  threshold: 10240,
  minRatio: 0.8,
})
```

### 4. CopyWebpackPlugin - 复制静态文件

```bash
npm install --save-dev copy-webpack-plugin
```

```javascript
const CopyPlugin = require('copy-webpack-plugin');

new CopyPlugin({
  patterns: [
    { from: 'static-files', to: 'static' },
  ],
})
```

## 高级配置

### 区分客户端和服务端

```javascript
configureWebpack(config, isServer, utils) {
  if (isServer) {
    // 服务端特定配置
    return {
      plugins: [/* 服务端插件 */],
    };
  }
  
  // 客户端配置
  return {
    plugins: [/* 客户端插件 */],
  };
}
```

### 修改现有配置

```javascript
configureWebpack(config, isServer, utils) {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        // 添加新的 loader
      ],
    },
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        '@components': path.resolve(__dirname, '../src/components'),
      },
    },
  };
}
```

## 环境变量

使用环境变量来控制插件行为：

```javascript
const isProduction = process.env.NODE_ENV === 'production';
const isAnalyze = process.env.ANALYZE === 'true';

if (isProduction) {
  // 生产环境插件
}

if (isAnalyze) {
  // 添加分析插件
}
```

运行分析：
```bash
ANALYZE=true npm run build
```

## 注意事项

1. **性能影响**：某些插件可能会显著增加构建时间
2. **兼容性**：确保插件与 Docusaurus 使用的 Webpack 版本兼容
3. **服务端渲染**：某些插件可能不适用于服务端构建
4. **缓存**：修改插件配置后，可能需要清除缓存：
   ```bash
   npm run clear
   ```

## 调试技巧

1. 查看完整的 Webpack 配置：
   ```javascript
   configureWebpack(config, isServer) {
     console.log(JSON.stringify(config, null, 2));
     return {};
   }
   ```

2. 使用 `webpack-merge` 安全合并配置：
   ```bash
   npm install --save-dev webpack-merge
   ```
   
   ```javascript
   const { merge } = require('webpack-merge');
   
   configureWebpack(config, isServer) {
     return merge(config, {
       // 你的配置
     });
   }
   ```

## 完整示例

这是一个包含多个插件的完整示例：

```javascript
// plugins/webpack-config.js
const webpack = require('webpack');
const path = require('path');

module.exports = function (context, options) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    name: 'webpack-config-plugin',
    
    configureWebpack(config, isServer, utils) {
      if (isServer) return {};
      
      return {
        plugins: [
          // 环境变量
          new webpack.DefinePlugin({
            'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
          }),
          
          // 生产环境优化
          ...(isProduction ? [
            new CompressionPlugin({
              algorithm: 'gzip',
            }),
          ] : []),
        ],
        
        resolve: {
          alias: {
            '@': path.resolve(__dirname, '../src'),
          },
        },
        
        optimization: {
          splitChunks: {
            chunks: 'all',
          },
        },
      };
    },
  };
};
```