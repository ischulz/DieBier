var path = require('path');
var SRC_DIR = path.join(__dirname, '/client');
var DIST_DIR = path.join(__dirname, '/public');

module.exports = {
  entry: [`babel-polyfill`, `${SRC_DIR}/index.js`],
  output: {
    filename: 'bundle.js',
    path: DIST_DIR,
    publicPath: '/'
  },
  devtool: 'source-map',
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : SRC_DIR,
        loader : 'babel-loader',      
        query: {
          presets: ['react', 'es2015', 'env']
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url-loader?name=pictures/[name]123.[ext]'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
};