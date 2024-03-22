const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const pkg = require('./package.json');


/**
 * @type {import('webpack').Configuration}
 **/
const webpackConfig = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3001,
  },
  output: {
    publicPath: 'auto',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react'],
        },
      },
    ],
  },
  plugins: [
    new webpack.container.ModuleFederationPlugin({
      name: 'app1',
      remotes: {
        app2: 'app2@http://localhost:3002/remoteEntry.js',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: pkg.dependencies['react'],
        },
        // 'react-dom': {
        //   import: 'react-dom', // the "react" package will be used a provided and fallback module
        //   shareKey: 'react-dom', // under this name the shared module will be placed in the share scope
        //   shareScope: 'legacy', // share scope with this name will be used
        //   singleton: true, // only a single version of the shared module is allowed
        // },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};

module.exports = webpackConfig;