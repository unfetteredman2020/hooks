// ES modules version
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function rspackPlugin() {
  return {
    name: 'custom-rspack-plugin',
    configureWebpack(config, isServer) {
      console.log('isServer :>> ', isServer, 'process.env.NODE_ENV', process.env.NODE_ENV, 'rspack');
      
      // Print output directory
      console.log('output :>> ', config.output);
      
      // If you need to modify the output path:
      // config.output.path = path.resolve(__dirname, '../dist');
      
      // Always return the config object
      return config;
    },
  };
}