// Webpack configuration for the frontend Web application

var path = require('path');
var webpack = require('webpack');

var appConfig = require('./config');

// resolve path to minified angular dist
var pathToAngular = path.resolve(__dirname, 'node_modules/angular/angular.min.js');

// extract css in non watch mode (don't extract in watch mode as we want hot reloading of css)
if (!appConfig.watch) {

  // the extract-text-webpack-plugin for extracting stylesheets in a separate css file
  var ExtractTextPlugin = require('extract-text-webpack-plugin');

}

// require the html-webpack-plugin for automatic generation of the index.html file
// of the web application
var HtmlWebpackPlugin = require('html-webpack-plugin');

// require CSS autoprefixer for PostCSS
var autoprefixer = require('autoprefixer');

var webpackPlugins = [
  // Automatically loaded modules available in all source files of the application
  // (no need to explicitely import them)
  new webpack.ProvidePlugin({
    '$': 'jquery',
    'jQuery': 'jquery',
    '_': 'lodash'
  })
];

if (!appConfig.test) {
  webpackPlugins = webpackPlugins.concat([
    // Explicitely generates the vendors bundle
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      minChunks: Infinity
    }),
    // Automatically generate the index.html file including all webpack generated assets
    new HtmlWebpackPlugin({
      title: 'Webpack Angular Test',
      template: 'src/website/index.ejs'
    })
  ]);
}

if (appConfig.watch) {
  webpackPlugins = webpackPlugins.concat([
    // Need to use that plugin in development mode to get hot reloading on source files changes
    new webpack.HotModuleReplacementPlugin({
      quiet: true
    })
  ]);
}

if (!appConfig.watch && !appConfig.test) {
  webpackPlugins = webpackPlugins.concat([
    // Extract stylesheets to separate CSS file in production mode
    new ExtractTextPlugin({
      filename: appConfig.production ? '[name].[contenthash].css' : '[name].css',
      disable: false,
      allChunks: true
    })
  ]);
}

module.exports = {
  webpackConfig: {
    // Cache generated modules and chunks to improve performance for multiple incremental builds.
    cache: true,
    resolve: {
      // Replace modules by other modules or paths.
      alias: {
        // set angular to the minified dist for faster build
        'angular': pathToAngular,

        // define aliases for jquery-ui modules in order to use gridstack with freshly released jquery-ui 1.12
        'jquery-ui/core': path.resolve(__dirname, 'node_modules/jquery-ui/ui/core.js'),
        'jquery-ui/data': path.resolve(__dirname, 'node_modules/jquery-ui/ui/data.js'),
        'jquery-ui/disable-selection': path.resolve(__dirname, 'node_modules/jquery-ui/ui/data.js'),
        'jquery-ui/focusable': path.resolve(__dirname, 'node_modules/jquery-ui/ui/focusable.js'),
        'jquery-ui/form': path.resolve(__dirname, 'node_modules/jquery-ui/ui/form.js'),
        'jquery-ui/ie': path.resolve(__dirname, 'node_modules/jquery-ui/ui/ie.js'),
        'jquery-ui/keycode': path.resolve(__dirname, 'node_modules/jquery-ui/ui/keycode.js'),
        'jquery-ui/labels': path.resolve(__dirname, 'node_modules/jquery-ui/ui/labels.js'),
        'jquery-ui/jquery-1-7': path.resolve(__dirname, 'node_modules/jquery-ui/ui/jquery-1-7.js'),
        'jquery-ui/plugin': path.resolve(__dirname, 'node_modules/jquery-ui/ui/plugin.js'),
        'jquery-ui/safe-active-element': path.resolve(__dirname, 'node_modules/jquery-ui/ui/safe-active-element.js'),
        'jquery-ui/safe-blur': path.resolve(__dirname, 'node_modules/jquery-ui/ui/safe-blur.js'),
        'jquery-ui/scroll-parent': path.resolve(__dirname, 'node_modules/jquery-ui/ui/scroll-parent.js'),
        'jquery-ui/tabbable': path.resolve(__dirname, 'node_modules/jquery-ui/ui/tabbable.js'),
        'jquery-ui/unique-id': path.resolve(__dirname, 'node_modules/jquery-ui/ui/unique-id.js'),
        'jquery-ui/version': path.resolve(__dirname, 'node_modules/jquery-ui/ui/version.js'),
        'jquery-ui/widget': path.resolve(__dirname, 'node_modules/jquery-ui/ui/widget.js'),
        'jquery-ui/widgets/draggable': path.resolve(__dirname, 'node_modules/jquery-ui/ui/widgets/draggable.js'),
        'jquery-ui/widgets/droppable': path.resolve(__dirname, 'node_modules/jquery-ui/ui/widgets/droppable.js'),
        'jquery-ui/widgets/mouse': path.resolve(__dirname, 'node_modules/jquery-ui/ui/widgets/mouse.js'),
        'jquery-ui/widgets/resizable': path.resolve(__dirname, 'node_modules/jquery-ui/ui/widgets/resizable.js')
      },
      // The root directory (absolute path) that contains the application modules,
      // enables to import modules relatively to it
      modules: [path.resolve(__dirname, 'src/website'), path.resolve(__dirname, 'node_modules')]
    },
    // Application entry points
    entry: {
      // Generate a vendors bundle containing external modules used in every part of the application.
      // It is a good practice to do so as the code it contains is unlikely to change during the application lifetime.
      // This will allow you to do updates to your application, without requiring the users to download the vendors bundle again
      // See http://dmachat.github.io/angular-webpack-cookbook/Split-app-and-vendors.html for more details
      vendors: ['angular', 'angular-ui-router', 'jquery', 'jquery-ui', 'lodash', 'd3',
                !appConfig.watch ? 'bootstrap-webpack!./bootstrap.config.extract.js' :
                                   'bootstrap-webpack!./bootstrap.config.js',
               'bootstrap_dropdowns_enhancement/dist/js/dropdowns-enhancement',
               'admin-lte/dist/js/app'

      ],
      // The frontend application entry point (bootstrapApp.js)
      // In development mode, we also add webpack-dev-server specific entry points
      app: (!appConfig.watch ? [] : ['webpack/hot/dev-server',
        'webpack-dev-server/client?http://localhost:' + appConfig.ports.devServer
      ]).concat(['./src/website/bootstrapApp.js'])
    },
    // The output configuration of the build process
    output: {
      // Directory that will contain the frontend application assets
      // (except when using the webpack-dev-server in development as all generated files are stored in the dev-server memory)
      path: path.join(__dirname, 'build/website'),
      // Patterns of the names of the files to generate.
      // In production, we concatenate the content hash of each file for long term caching
      // See https://medium.com/@okonetchnikov/long-term-caching-of-static-assets-with-webpack-1ecb139adb95#.rgsrbt29e
      filename: appConfig.production ? "[name].[chunkhash].js" : "[name].js",
      chunkFilename: appConfig.production ? "[id].[chunkhash].js" : "[id].js"
    },
    // Specific module loaders for the frontend
    module: {
      rules: [
        // Load html files as raw strings
        {
          test: /\.html$/,
          use: [
            {
              loader: 'raw-loader'
            }
          ]
        },
        // Load css files through the PostCSS preprocessor first, then through the classical css and style loader.
        // In production mode, extract all the stylesheets to a separate css file (improve loading performances of the application)
        {
          test: /\.css$/,
          loader: (!appConfig.watch && !appConfig.test) ? ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: 'css-loader!postcss-loader'
          }) : undefined,
          use: (!appConfig.watch && !appConfig.test) ? undefined :
          [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader'
            }
          ]
        },
        {
          test: /\.less$/,
          loader: (!appConfig.watch && !appConfig.test) ? ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: 'css-loader!postcss-loader!less-loader'
          }) : undefined,
          use: (!appConfig.watch && !appConfig.test) ? undefined :
          [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'less-loader'
            }
          ]
        },

        // Loaders for the font files (bootstrap, font-awesome, ...)
        {
          test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                mimetype: 'application/font-woff'
              }
            }
          ]
        }, {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                mimetype: 'application/octet-stream'
              }
            }
          ]
        }, {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader'
            }
          ]
        }, {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                mimetype: 'image/svg+xml'
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192
              }
            }
          ]
        },

      ],
      // Disable parsing of the minified angular dist as it is not needed and it speeds up the webpack build
      noParse: [new RegExp(pathToAngular)]
    },
    // to avoid errors when bundling unit tests
    node: {
      fs: "empty"
    },
    // Webpack plugins used for the frontend
    plugins: webpackPlugins
  },
  loadersOptions: {
    options: {
      // Options for jshint
      jshint: {
        // don't warn about undefined variables as they are provided
        // to the global scope by webpack ProvidePlugin
        globals: {
          '_': false,
          '$': false,
          'jQuery': false,
          'angular': false,
        }
      },
      // CSS preprocessor configuration (PostCSS)
      postcss: [
        // use autoprefixer feature (enable to write your CSS rules without vendor prefixes)
        // see https://github.com/postcss/autoprefixer
        autoprefixer()
      ],
    }
  }
};
