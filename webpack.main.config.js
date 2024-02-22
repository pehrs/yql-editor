//const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
// const path = require('path');
// const MONACO_DIR = path.join(__dirname, 'node_modules/monaco-editor');
// const APP_DIR = path.resolve(__dirname, './src');

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.js',

  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },

};
