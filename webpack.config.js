var path = require('path');

var APP_DIR = path.resolve(__dirname, 'public/js/orders');
var BUILD_DIR = path.resolve(__dirname, 'public/dist');

var config = {
  entry: {
   orders: `${APP_DIR}/index.jsx`,
  },
  output: {
    path: BUILD_DIR,
    filename: "[name].bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: APP_DIR,
        loader: 'babel'
      },
      {
        test: /\.less$/,
        loader: "style!css!autoprefixer!less"
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  }
};

module.exports = config;
