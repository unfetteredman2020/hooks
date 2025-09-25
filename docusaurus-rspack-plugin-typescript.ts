// 修复版本3: TypeScript版本
import path from 'path';
import type { Configuration } from 'webpack';

interface PluginOptions {
  // 可以在这里定义插件选项的类型
}

export default function rspackPlugin(options: PluginOptions = {}) {
  return {
    name: 'custom-rspack-plugin',
    configureWebpack(config: Configuration, isServer: boolean) {
      console.log('isServer :>> ', isServer, 'process.env.NODE_ENV', process.env.NODE_ENV, 'rspack');
      
      // 打印输出目录
      console.log('output before :>> ', config.output);
      
      // 安全地修改配置
      if (config.output && !config.output.path) {
        config.output.path = path.resolve(process.cwd(), 'dist');
      }
      
      console.log('output after :>> ', config.output);

      return config;
    },
  };
}