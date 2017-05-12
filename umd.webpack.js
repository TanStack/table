const webpack = require('webpack')
module.exports = {
  entry: './lib/index.js',
  output: {
    filename: './react-story.js',
    libraryTarget: 'umd',
    library: 'ReactStory'
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    }
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
}
