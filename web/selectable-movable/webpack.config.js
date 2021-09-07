const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  output: {
    filename: 'select-moveable.umd.js',
    path: path.resolve(__dirname, 'build'),
    library: {
      name: 'SelectableMovable',
      type: 'umd'
    }
  }
}
