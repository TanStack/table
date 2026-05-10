import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateReferenceDocs } from '@tanstack/typedoc-config'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

await generateReferenceDocs({
  packages: [
    {
      name: 'table-core',
      entryPoints: [
        resolve(__dirname, '../packages/table-core/src/index.ts'),
        resolve(__dirname, '../packages/table-core/src/static-functions.ts'),
      ],
      tsconfig: resolve(__dirname, '../packages/table-core/tsconfig.json'),
      outputDir: resolve(__dirname, '../docs/reference'),
    },
    {
      name: 'react-table',
      entryPoints: [
        resolve(__dirname, '../packages/react-table/src/index.ts'),
        resolve(__dirname, '../packages/react-table/src/legacy.ts'),
      ],
      tsconfig: resolve(__dirname, '../packages/react-table/tsconfig.json'),
      outputDir: resolve(__dirname, '../docs/framework/react/reference'),
      exclude: ['packages/table-core/**/*'],
    },
    {
      name: 'preact-table',
      entryPoints: [
        resolve(__dirname, '../packages/preact-table/src/index.ts'),
      ],
      tsconfig: resolve(__dirname, '../packages/preact-table/tsconfig.json'),
      outputDir: resolve(__dirname, '../docs/framework/preact/reference'),
      exclude: ['packages/table-core/**/*'],
    },
    {
      name: 'solid-table',
      entryPoints: [
        resolve(__dirname, '../packages/solid-table/src/index.tsx'),
      ],
      tsconfig: resolve(__dirname, '../packages/solid-table/tsconfig.json'),
      outputDir: resolve(__dirname, '../docs/framework/solid/reference'),
      exclude: ['packages/table-core/**/*'],
    },
    {
      name: 'svelte-table',
      entryPoints: [
        resolve(__dirname, '../packages/svelte-table/src/index.ts'),
      ],
      tsconfig: resolve(__dirname, '../packages/svelte-table/tsconfig.json'),
      outputDir: resolve(__dirname, '../docs/framework/svelte/reference'),
      exclude: ['packages/table-core/**/*'],
    },
    {
      name: 'vue-table',
      entryPoints: [resolve(__dirname, '../packages/vue-table/src/index.ts')],
      tsconfig: resolve(__dirname, '../packages/vue-table/tsconfig.json'),
      outputDir: resolve(__dirname, '../docs/framework/vue/reference'),
      exclude: ['packages/table-core/**/*'],
    },
    {
      name: 'angular-table',
      entryPoints: [
        resolve(__dirname, '../packages/angular-table/src/index.ts'),
      ],
      tsconfig: resolve(__dirname, '../packages/angular-table/tsconfig.json'),
      outputDir: resolve(__dirname, '../docs/framework/angular/reference'),
      exclude: ['packages/table-core/**/*'],
    },
    {
      name: 'lit-table',
      entryPoints: [resolve(__dirname, '../packages/lit-table/src/index.ts')],
      tsconfig: resolve(__dirname, '../packages/lit-table/tsconfig.json'),
      outputDir: resolve(__dirname, '../docs/framework/lit/reference'),
      exclude: ['packages/table-core/**/*'],
    },
  ],
})

console.log('\n✅ All markdown files have been processed!')

process.exit(0)
