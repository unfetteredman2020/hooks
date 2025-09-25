// 修复版本2: 使用ES Module语法
import path from 'path';
import { fileURLToPath } from 'url';
import { rspack } from '@rspack/core';

// 在ES Module中获取__dirname的等价物
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function rspackPlugin() {
  return {
    name: 'custom-rspack-plugin',
    configureWebpack(config, isServer) {
      console.log('isServer :>> ', isServer, 'process.env.NODE_ENV', process.env.NODE_ENV, 'rspack');
      
      // 打印输出目录
      console.log('output before :>> ', config.output);
      
      // 如果需要修改输出路径，使用正确的ES Module路径解析
      if (config.output && !config.output.path) {
        config.output.path = path.resolve(process.cwd(), 'dist');
      }
      
      console.log('output after :>> ', config.output);

      return config;
    },
  };
}