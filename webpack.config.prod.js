const path = require('path');
const webpack = require('webpack');

const conf = require('./gulp/gulpconfig');
const webpackBase = require('./webpack.config.base');

module.exports = Object.assign({}, webpackBase, {
  plugins: webpackBase.plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false,
      },
      compress: {
        unsafe_comps: true,
        properties: true,
        keep_fargs: false,
        pure_getters: true,
        collapse_vars: true,
        unsafe: true,
        warnings: false,
        screw_ie8: true,
        sequences: true,
        dead_code: true,
        drop_debugger: true,
        comparisons: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        if_return: true,
        join_vars: true,
        cascade: true,
        drop_console: true,
      },
    }),
  ]),

  devtool: 'source-map',
});
