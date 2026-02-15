// @ts-check

import { defineConfig } from 'rollup'
import { buildConfigs } from '../../scripts/getRollupConfig.js'

export default defineConfig(
  buildConfigs({
    name: 'preact-table',
    jsName: 'PreactTable',
    outputFile: 'index',
    entryFile: 'src/index.ts',
    external: ['preact', 'preact/hooks', '@tanstack/table-core'],
    globals: {
      preact: 'preact',
      'preact/hooks': 'preactHooks',
    },
  }),
)
