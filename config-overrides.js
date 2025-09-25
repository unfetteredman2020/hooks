const path = require('path');

module.exports = function override(config) {
  // Add support for importing without extensions
  config.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', ...config.resolve.extensions];
  
  // Ensure module resolution works for desktop-kit
  config.resolve.alias = {
    ...config.resolve.alias,
    'desktop-kit': path.resolve(__dirname, 'desktop-kit'),
  };

  return config;
};