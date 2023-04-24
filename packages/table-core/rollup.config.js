require('ts-node').register({
  compilerOptions: {
    esModuleInterop: true,
  },
})

process.chdir('../..')

module.exports = require('../../rollup.config.ts').createRollupConfig(
  'table-core'
)
