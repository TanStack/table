import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateReferenceDocs } from '@tanstack/config/typedoc'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/** @type {import('@tanstack/config/typedoc').Package[]} */
const packages = [
  {
    name: 'table-core',
    entryPoints: [resolve(__dirname, '../packages/table-core/src/index.ts')],
    tsconfig: resolve(__dirname, '../packages/table-core/tsconfig.json'),
    outputDir: resolve(__dirname, '../docs/reference'),
  },
  {
    name: 'react-table',
    entryPoints: [resolve(__dirname, '../packages/react-table/src/index.ts')],
    tsconfig: resolve(__dirname, '../packages/react-table/tsconfig.json'),
    outputDir: resolve(__dirname, '../docs/framework/react/reference'),
    exclude: ['packages/table-core/**/*'],
  },
]

await generateReferenceDocs({ packages })

process.exit(0)
