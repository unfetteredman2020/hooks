// 修复版本1: 使用CommonJS语法
const path = require('path');
const { rspack } = require('@rspack/core');

module.exports = function rspackPlugin() {
  return {
    name: 'custom-rspack-plugin',
    configureWebpack(config, isServer) {
      console.log('isServer :>> ', isServer, 'process.env.NODE_ENV', process.env.NODE_ENV, 'rspack');
      
      // 打印输出目录
      console.log('output before :>> ', config.output);
      
      // 如果需要修改输出路径，确保路径正确
      if (config.output && !config.output.path) {
        config.output.path = path.resolve(process.cwd(), 'dist');
      }
      
      console.log('output after :>> ', config.output);

      return config;
    },
  };
};