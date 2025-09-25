// plugins/env-webpack-plugin.js
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = function (context, options = {}) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  const isAnalyze = process.env.ANALYZE === 'true';
  
  return {
    name: 'env-webpack-plugin',
    
    configureWebpack(config, isServer, utils) {
      const plugins = [];
      
      // 开发环境专用插件
      if (isDevelopment) {
        plugins.push(
          // 热更新相关
          new webpack.HotModuleReplacementPlugin(),
          
          // 显示模块相对路径
          new webpack.NamedModulesPlugin(),
        );
      }
      
      // 生产环境专用插件
      if (isProduction && !isServer) {
        plugins.push(
          // Gzip 压缩
          new CompressionPlugin({
            filename: '[path][base].gz',
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8,
          }),
          
          // Brotli 压缩
          new CompressionPlugin({
            filename: '[path][base].br',
            algorithm: 'brotliCompress',
            test: /\.(js|css|html|svg)$/,
            compressionOptions: {
              level: 11,
            },
            threshold: 10240,
            minRatio: 0.8,
          }),
        );
      }
      
      // 分析模式
      if (isAnalyze && !isServer) {
        plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: 'bundle-report.html',
            openAnalyzer: false,
            generateStatsFile: true,
            statsFilename: 'bundle-stats.json',
          })
        );
      }
      
      return {
        plugins,
        
        // 根据环境设置不同的 source map
        devtool: isDevelopment 
          ? 'eval-source-map' 
          : isProduction 
            ? 'source-map' 
            : false,
      };
    },
  };
};