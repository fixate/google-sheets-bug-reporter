const path = require('path');
const webpack = require('webpack');

const conf = require('./gulp/gulpconfig');
const webpackBase = require('./webpack.config.base');

module.exports = Object.assign({}, webpackBase);
