// @ts-check

import { defineConfig } from 'rollup'
import { buildConfigs } from '../../scripts/getRollupConfig.js'

export default defineConfig(
  buildConfigs({
    name: 'lit-table',
    jsName: 'LitTable',
    outputFile: 'index',
    entryFile: 'src/index.ts',
    external: ['lit'],
    globals: {
      lit: 'lit',
    },
  })
)
