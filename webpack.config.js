const path = require('path');

module.exports = {
  optimization: {
    minimize: false
  },
  entry: './src/app.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public'),
  },
};