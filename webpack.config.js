var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './app/app.js',
  output: { path: __dirname + '/public/js', filename: 'build.js' },
    resolve: {
        alias: {
            "jquery": "jbone"
        }
    },
  module: {
    loaders: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      },
        {
            test: /\.scss$/,
            loaders: ['style', 'css', 'sass']
        }
    ]
  }
};  