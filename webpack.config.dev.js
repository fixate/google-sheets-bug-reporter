const path = require('path');
const webpack = require('webpack');

const conf = require('./gulp/gulpconfig');
const webpackBase = require('./webpack.config.base');

module.exports = Object.assign({}, webpackBase, {
  devServer: {
    port: process.env.PORT || 8080,
    host: 'localhost',
    publicPath: '/',
    contentBase: './src',
    historyApiFallback: true,
    open: true,
    openPage: '',
  },

  mode: 'development',
});
