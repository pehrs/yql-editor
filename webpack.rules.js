const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const path = require('path');
const MONACO_DIR = path.resolve(__dirname, './node_modules/monaco-editor');
const APP_DIR = path.resolve(__dirname, './src');

module.exports = [

  // {
  //   test: /\.css$/i,
  //   include: APP_DIR,
  //   use: [
  //     // {
  //     //   loader: 'style-loader',
  //     // }, 
  //     {
  //       loader: 'css-loader',
  //       options: {
  //         modules: false,
  //         namedExport: false,
  //       },
  //     },
  //   ],
  // },  


  // Add support for native node modules  
  {
    // We're specifying native_modules in the test because the asset relocator loader generates a
    // "fake" .node file which is really a cjs file.
    test: /native_modules[/\\].+\.node$/,
    use: 'node-loader',
  },
  // {
  //   test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
  //   parser: { amd: false },
  //   use: {
  //     loader: '@vercel/webpack-asset-relocator-loader',
  //     options: {
  //       outputAssetBase: 'native_modules',
  //     },
  //   },
  // },
  {
    test: /\.jsx?$/,
    use: {
      loader: 'babel-loader',
      options: {
        exclude: /node_modules/,
        presets: ['@babel/preset-react']
      }
    }
  },


  // {
  //   test: /\.css$/,
  //   include: MONACO_DIR,
  //   use: ["style-loader", "css-loader"],    
  // },
  // {
  //   test: /\.ttf$/,
  //   type: 'asset/resource'
  // },

  // {
  //   test: /\.css$/,
  //   include: MONACO_DIR,
  //   use: [
  //     MiniCssExtractPlugin.loader,
  //     "css-loader"
  //   ]
  // },
  // {
  //   test: /\.ttf$/,
  //   include: MONACO_DIR,
  //   use: ['file-loader']
  // },
  // Put your webpack loader rules in this array.  This is where you would put
  // your ts-loader configuration for instance:
  /**
   * Typescript Example:
   *
   * {
   *   test: /\.tsx?$/,
   *   exclude: /(node_modules|.webpack)/,
   *   loaders: [{
   *     loader: 'ts-loader',
   *     options: {
   *       transpileOnly: true
   *     }
   *   }]
   * }
   */
];
