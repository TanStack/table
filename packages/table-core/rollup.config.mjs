// @ts-check

import { defineConfig } from 'rollup'
import { buildConfigs } from '../../scripts/getRollupConfig.mjs'

export default defineConfig(
  buildConfigs({
    name: 'table-core',
    jsName: 'TableCore',
    outputFile: 'index',
    entryFile: 'src/index.ts',
    external: [],
    globals: {},
  })
)
