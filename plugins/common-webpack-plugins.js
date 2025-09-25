// plugins/common-webpack-plugins.js
const webpack = require('webpack');
const path = require('path');

module.exports = function (context, options) {
  return {
    name: 'common-webpack-plugins',
    
    configureWebpack(config, isServer, utils) {
      // 只在客户端构建时添加这些插件
      if (!isServer) {
        return {
          plugins: [
            // 1. 提供全局变量
            new webpack.ProvidePlugin({
              $: 'jquery',
              jQuery: 'jquery',
              'window.jQuery': 'jquery',
            }),
            
            // 2. 限制 bundle 大小
            new webpack.optimize.LimitChunkCountPlugin({
              maxChunks: 5,
            }),
            
            // 3. 压缩选项（Docusaurus 默认已配置，这里是自定义示例）
            // new (require('terser-webpack-plugin'))({
            //   terserOptions: {
            //     compress: {
            //       drop_console: true,
            //       drop_debugger: true,
            //     },
            //   },
            // }),
            
            // 4. HTML 插件选项（如果需要修改）
            // new (require('html-webpack-plugin'))({
            //   template: path.join(__dirname, '../src/custom-template.html'),
            //   inject: true,
            //   minify: {
            //     removeComments: true,
            //     collapseWhitespace: true,
            //   },
            // }),
            
            // 5. 生成 manifest 文件
            // new (require('webpack-manifest-plugin').WebpackManifestPlugin)({
            //   fileName: 'asset-manifest.json',
            //   publicPath: '/',
            // }),
          ],
          
          // 额外的优化配置
          optimization: {
            ...config.optimization,
            moduleIds: 'deterministic',
            runtimeChunk: 'single',
            splitChunks: {
              chunks: 'all',
              maxInitialRequests: 25,
              minSize: 20000,
              cacheGroups: {
                default: false,
                vendors: false,
                // 第三方库
                vendor: {
                  name: 'vendor',
                  test: /[\\/]node_modules[\\/]/,
                  chunks: 'all',
                  priority: 20,
                },
                // React 相关
                react: {
                  name: 'react',
                  test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                  chunks: 'all',
                  priority: 30,
                },
                // 公共模块
                common: {
                  name: 'common',
                  minChunks: 2,
                  chunks: 'async',
                  priority: 10,
                  reuseExistingChunk: true,
                  enforce: true,
                },
              },
            },
          },
        };
      }
      
      return {};
    },
  };
};