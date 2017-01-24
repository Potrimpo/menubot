const path = require('path');

const JSX_DIR = path.resolve(__dirname, './public/jsx'),
      JS_DIR = path.resolve(__dirname, './public/js'),
      BUILD_DIR = path.resolve(__dirname, './dist/js');

const config = {
  entry: {
    configuration: `${JSX_DIR}/configuration/index`,
    orders: `${JSX_DIR}/orders/index`,
    jquery: `${JS_DIR}/submit`,
  },
  output: {
    path: BUILD_DIR,
    filename: "[name].bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: [JSX_DIR, JS_DIR],
        loader: 'babel'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  }
};

module.exports = config;
