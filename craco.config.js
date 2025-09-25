// craco.config.js
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // 添加 resolve 扩展名
      webpackConfig.resolve.extensions = [
        ...webpackConfig.resolve.extensions,
        '.js',
        '.jsx',
        '.ts',
        '.tsx',
        '.json'
      ];
      
      // 配置模块解析
      webpackConfig.resolve.modules = [
        ...webpackConfig.resolve.modules,
        'node_modules'
      ];
      
      // 添加别名
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'desktop-kit/components/clipboard-text': path.resolve(
          __dirname,
          'node_modules/desktop-kit/components/clipboard-text/index.js'
        ),
      };
      
      // 配置 mainFields 来优先查找 index.js
      webpackConfig.resolve.mainFields = ['browser', 'module', 'main', 'index'];
      
      // 配置 mainFiles 来指定默认文件
      webpackConfig.resolve.mainFiles = ['index'];
      
      return webpackConfig;
    },
  },
};