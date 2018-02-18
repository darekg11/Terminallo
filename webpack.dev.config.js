const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: ['babel-polyfill', './src/app/App.js'],
  target: 'electron',
  devtool: 'source-map',

  output: {
    path: path.join(__dirname, '/public/built'),
    filename: 'bundle.js',
    publicPath: '/built/',
  },

  devServer: {
    port: 12000,
    contentBase: './public',
    publicPath: '/built/',
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.ExternalsPlugin('commonjs', ['node-pty'])],
};
