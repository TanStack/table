// @ts-check

import { defineConfig } from 'rollup'
import { buildConfigs } from '../../scripts/getRollupConfig.mjs'

export default defineConfig(
  buildConfigs({
    name: 'match-sorter-utils',
    jsName: 'MatchSorterUtils',
    outputFile: 'index',
    entryFile: 'src/index.ts',
    external: [],
    globals: {},
  })
)
