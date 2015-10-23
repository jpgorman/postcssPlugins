var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
require('babel/register');
var baseUnits = require('./webpack/plugins/post-css/base-unit');

module.exports = {
  entry: {
    homepage: './src/index.js',
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/dist/',
    filename: 'app.js',
  },
  debug: true,
  devtool: 'source-map',

  // Resolve the `./src` directory so we can avoid writing
  // ../../styles/base.css
  resolve: {
    modulesDirectories: ['node_modules', './src'],
    extensions: ['', '.js', '.jsx'],
  },

  // Instruct webpack how to handle each file type that it might encounter
  module: {
    loaders: [
      { test: /\.js[x]?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!cssnext-loader') },
      { test: /\.(png|jpg)$/, loader: 'file-loader?name=images/[name].[ext]' },
      { test: /\.woff$/, loader: 'file-loader?name=fonts/[name].[ext]' },
    ],
  },

  cssnext: {
    browsers: 'last 2 versions',
    plugins: [
      baseUnits({ baseUnit: 8, units: 'px' }),
    ],
  },

  // This plugin moves all the CSS into a separate stylesheet
  plugins: [
    new ExtractTextPlugin('app.css'),
  ],
};
