const rules = require('./webpack.rules');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');


rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});


module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins: [
    //  new MiniCssExtractPlugin(),
    new MonacoWebpackPlugin({
      // languages: ["typescript", "javascript", "css", "html", "kotlin", "swift", "java", "python", "csharp", "cpp", "rust", "go", "php", "ruby", "scala", "lua", "perl", "sql", "json", "yaml", "xml", "markdown", "plaintext"]
      languages: ["json"]
    })
  ],
};
