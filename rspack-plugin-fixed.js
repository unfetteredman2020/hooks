// Fixed version using CommonJS syntax consistently
const path = require('path');

module.exports = function rspackPlugin() {
  return {
    name: 'custom-rspack-plugin',
    configureWebpack(config, isServer) {
      console.log('isServer :>> ', isServer, 'process.env.NODE_ENV', process.env.NODE_ENV, 'rspack');
      
      // Print output directory
      console.log('output :>> ', config.output);
      
      // Always return the config object
      return config;
    },
  };
};