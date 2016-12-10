var globalBootStrapConfig = require('./bootstrap.config');
globalBootStrapConfig.styleLoader = require('extract-text-webpack-plugin').extract({
  fallbackLoader: 'style-loader',
  loader: ['css-loader', 'postcss-loader', 'less-loader']
});

module.exports = globalBootStrapConfig;
