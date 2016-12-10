// Karma configuration for the frontend unit tests (freely inspired from https://github.com/zyml/es6-karma-jasmine-webpack-boilerplate)

var _ = require('lodash');

// Import webpack frontend configuration
var frontendConfig = require('./webpack-configs').frontendConfig;
frontendConfig.cache = true;
// override sourcemap type
frontendConfig.devtool = 'inline-source-map';
// remove entries as karma-webpack will generate a new one for the tests
frontendConfig.entry = {};

// override preLoaders
var newRules = _.remove(frontendConfig.module.rules, function(r) {
  return r.enforce != 'pre';
});

frontendConfig.module.rules = newRules.concat([
  // process all unit tests files with babel for transpiling them from es2015 to es5
  {
    test: /-test\.js$/,
    exclude: /(node_modules|bower_components)/,
    enforce: 'pre',
    use: [
      {
        loader: 'babel-loader',
        query: {
          cacheDirectory: true
        }
      }
    ]
  }
  // process all project files (except the tests ones) with babel-istanbul for code coverage
  // {
  //   test: /\.js?$/,
  //   exclude: /(node_modules|bower_components|__tests__|tests_utils|bootstrap)/,
  //   enforce: 'pre',
  //   use: [
  //     {
  //       loader: 'babel-istanbul-loader',
  //       query: {
  //         cacheDirectory: true
  //       }
  //     }
  //   ],
  // }
]);

module.exports = function (config) {
  config.set({
    // tests will be executed in PhantomJS
    browsers: ['PhantomJS'],
    client : {
      captureConsole: true
    },
    // code coverage output configuration : open ./coverage/html/index.html to see the report
    coverageReporter: {
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'lcovonly', subdir: '.' },
      ],
    },
    // unit tests entry point
    files: [
      'tests.webpack.frontend.js',
    ],
    // use jasmine framework for the frontend unit tests
    frameworks: [
      'jasmine',
    ],
    // preprocess the unit tests entry point with webpack and generate sourcemap as we transpile es2015 to es5
    preprocessors: {
      'tests.webpack.frontend.js': ['webpack', 'sourcemap'],
    },
    // report tests progress and code coverage status
    reporters: ['progress', 'coverage'],
    // webpack configuration for bundling the tests
    webpack: frontendConfig,
    webpackMiddleware: {
      noInfo: true,
      stats: {
        colors: true
      }
    },
  });
};
