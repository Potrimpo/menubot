const path = require('path');

const JSX_DIR = path.resolve(__dirname, './public/jsx/orders'),
      JS_DIR = path.resolve(__dirname, './public/js'),
      BUILD_DIR = path.resolve(__dirname, './dist/js');

const config = {
  entry: {
    orders: `${JSX_DIR}/index`,
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
