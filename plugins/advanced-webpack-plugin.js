// plugins/advanced-webpack-plugin.js
const webpack = require('webpack');

module.exports = function (context, options) {
  return {
    name: 'advanced-webpack-plugin',
    
    configureWebpack(config, isServer, utils) {
      const { getCacheLoader, getBabelLoader } = utils;
      
      // 根据是服务端还是客户端来配置
      if (isServer) {
        return {
          // 服务端专用配置
          plugins: [
            new webpack.DefinePlugin({
              'process.env.IS_SERVER': JSON.stringify(true),
            }),
          ],
        };
      }
      
      // 客户端配置
      return {
        plugins: [
          // 1. 环境变量插件
          new webpack.DefinePlugin({
            'process.env.IS_SERVER': JSON.stringify(false),
            'process.env.API_URL': JSON.stringify(process.env.API_URL || 'https://api.example.com'),
          }),
          
          // 2. ProgressPlugin - 显示构建进度
          new webpack.ProgressPlugin({
            activeModules: true,
            entries: true,
            modules: true,
            modulesCount: 5000,
            profile: false,
            dependencies: true,
            dependenciesCount: 10000,
            percentBy: null,
          }),
          
          // 3. IgnorePlugin - 忽略特定模块
          new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/,
          }),
          
          // 4. ContextReplacementPlugin - 限制打包内容
          new webpack.ContextReplacementPlugin(
            /moment[/\\]locale$/,
            /zh-cn|en/
          ),
        ],
        
        // 性能优化
        optimization: {
          ...config.optimization,
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                priority: 10,
              },
              common: {
                minChunks: 2,
                priority: 5,
                reuseExistingChunk: true,
              },
            },
          },
        },
      };
    },
    
    // 也可以在这里添加后处理钩子
    async postBuild(props) {
      // 构建后的处理
      console.log('Build completed!');
    },
  };
};