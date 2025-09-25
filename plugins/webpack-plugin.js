// plugins/webpack-plugin.js
module.exports = function (context, options) {
  return {
    name: 'custom-webpack-plugin',
    configureWebpack(config, isServer, utils) {
      const { getCacheLoader } = utils;
      
      // 示例 1: 添加 DefinePlugin
      const webpack = require('webpack');
      
      return {
        plugins: [
          // 添加 DefinePlugin
          new webpack.DefinePlugin({
            'process.env.CUSTOM_VAR': JSON.stringify('custom-value'),
            'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
          }),
          
          // 示例 2: 添加 BundleAnalyzerPlugin（需要先安装）
          // new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
          //   analyzerMode: 'static',
          //   reportFilename: 'bundle-report.html',
          //   openAnalyzer: false,
          // }),
          
          // 示例 3: 添加 CopyWebpackPlugin
          // new (require('copy-webpack-plugin'))({
          //   patterns: [
          //     {
          //       from: 'static-files',
          //       to: 'static',
          //     },
          //   ],
          // }),
        ],
        
        // 你也可以修改其他 Webpack 配置
        resolve: {
          alias: {
            ...config.resolve.alias,
            '@utils': require('path').resolve(__dirname, '../src/utils'),
          },
        },
        
        // 添加或修改 loader
        module: {
          rules: [
            ...config.module.rules,
            // 示例: 添加自定义 loader
            // {
            //   test: /\.custom$/,
            //   use: ['custom-loader'],
            // },
          ],
        },
      };
    },
  };
};