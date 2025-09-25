// Robust plugin version with error handling
const path = require('path');

module.exports = function rspackPlugin() {
  return {
    name: 'custom-rspack-plugin',
    configureWebpack(config, isServer) {
      try {
        console.log('=== Rspack Plugin Debug Info ===');
        console.log('isServer:', isServer);
        console.log('NODE_ENV:', process.env.NODE_ENV);
        
        // Safely check if output exists
        if (config && config.output) {
          console.log('Output config:', {
            path: config.output.path,
            filename: config.output.filename,
            publicPath: config.output.publicPath
          });
        } else {
          console.warn('Warning: config.output is not defined');
        }
        
        // Make sure to return a valid config object
        if (!config) {
          console.error('Error: config is undefined');
          return {};
        }
        
        return config;
      } catch (error) {
        console.error('Error in rspack plugin:', error);
        // Return the original config in case of error
        return config || {};
      }
    },
  };
};