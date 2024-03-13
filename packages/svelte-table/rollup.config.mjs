// @ts-check

import { defineConfig } from 'rollup'
import { buildConfigs } from '../../scripts/getRollupConfig.js'

export default defineConfig(
  buildConfigs({
    name: 'svelte-table',
    jsName: 'SvelteTable',
    outputFile: 'index',
    entryFile: 'src/index.ts',
    external: [
      'svelte',
      'svelte/store',
      'svelte/internal',
      '@tanstack/table-core',
    ],
    globals: {
      svelte: 'Svelte',
      'svelte/store': 'SvelteStore',
      'svelte/internal': 'SvelteInternal',
    },
  })
)
