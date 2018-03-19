const path = require('path');
const webpack = require('webpack');

const ENV = process.env.NODE_ENV || 'development';
const conf = require('./gulp/gulpconfig');

module.exports = {
  context: path.resolve(__dirname, 'src/assets/js'),

  entry: {
    app: './index.js',
  },

  output: {
    path: path.resolve(__dirname, 'build/assets/js'),
    publicPath: '/',
    filename: '[name].bundle.js',
  },

  resolve: {
    extensions: ['.js', '.json'],
    modules: [
      path.resolve(__dirname, 'src/lib'),
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
    ],
  },

  module: {
    rules: [
      {
        test: '/.js$/',
        exclude: path.resolve(__dirname, 'src'),
        enforce: 'pre',
        use: 'source-map-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    // add your specific template in the subfolder's webpack
    // new HtmlWebpackPlugin({
    //   template: `src/index.ejs`,
    //   minify: {collapseWhitespace: true},
    // }),
  ],

  stats: {
    colors: true,
    chunks: false,
    modules: false,
  },

  node: {
    Buffer: false,
  },
};
