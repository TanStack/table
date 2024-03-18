// @ts-check

import { defineConfig } from 'rollup'
import { buildConfigs } from '../../scripts/getRollupConfig.js'

export default defineConfig(
  buildConfigs({
    name: 'qwik-table',
    jsName: 'QwikTable',
    outputFile: 'index',
    entryFile: 'src/index.tsx',
    external: ['react', '@tanstack/table-core', '@builder.io/qwik'],
    globals: {
      react: 'React',
      '@builder.io/qwik': '@builder.io/qwik',
    },
  })
)
