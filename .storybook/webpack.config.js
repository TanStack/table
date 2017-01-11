const path = require('path')

// load the default config generator.
const genDefaultConfig = require('@kadira/storybook/dist/server/config/defaults/webpack.config.js')

module.exports = (config, env) => {
  config = genDefaultConfig(config, env)

  Object.assign(config, {
    module: Object.assign(config.module, {
      loaders: config.module.loaders.concat([{
        test: /\.md$/,
        loader: 'html!markdown',
        include: path.resolve(__dirname, '../')
      }, {
        test: /\.html$/,
        loader: 'html',
        query: {
          minimize: true
        },
        include: path.resolve(__dirname, '../')
      }])
    })
  })

  return config
}
