var path = require('path');

// var APP_DIR = path.resolve(__dirname, 'public/js/orders');
// var BUILD_DIR = path.resolve(__dirname, 'public/dist');
//
// var config = {
//   entry: `${APP_DIR}/index.jsx`,
//   output: {
//     path: BUILD_DIR,
//     filename: 'bundle.js'
//   },
//   module: {
//     loaders: [
//       {
//         test: /\.jsx?/,
//         include: APP_DIR,
//         loader: 'babel'
//       }
//     ]
//   },
//   resolve: {
//     extensions: ['', '.js', '.jsx'],
//   }
// };
//
// module.exports = config;

var ASYNC_DIR = path.resolve(__dirname, 'public/js/async');
var ASYNC_BUILD = path.resolve(__dirname, 'public/asyncDist');

var asyncConfig = {
  entry: `${ASYNC_DIR}/index.jsx`,
  output: {
    path: ASYNC_BUILD,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: ASYNC_DIR,
        loader: 'babel'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  }
};

module.exports = asyncConfig;