// @ts-check

import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * List your npm packages here. The first package will be used as the versioner.
 * @type {import('./types').Package[]}
 */
export const packages = [
  {
    name: '@tanstack/table-core',
    packageDir: 'table-core',
    entries: ['main', 'module', 'types'],
  },
  {
    name: '@tanstack/react-table',
    packageDir: 'react-table',
    entries: ['main', 'module', 'types'],
  },
  {
    name: '@tanstack/solid-table',
    packageDir: 'solid-table',
    entries: ['main', 'module', 'types'],
  },
  {
    name: '@tanstack/vue-table',
    packageDir: 'vue-table',
    entries: ['main', 'module', 'types'],
  },
  {
    name: '@tanstack/svelte-table',
    packageDir: 'svelte-table',
    entries: ['main', 'module', 'types'],
  },
  {
    name: '@tanstack/react-table-devtools',
    packageDir: 'react-table-devtools',
    entries: ['main', 'module', 'types'],
  },
  {
    name: '@tanstack/match-sorter-utils',
    packageDir: 'match-sorter-utils',
    entries: ['main', 'module', 'types'],
  },
]

/**
 * Contains config for publishable branches.
 * @type {Record<string, import('./types').BranchConfig>}
 */
export const branchConfigs = {
  main: {
    prerelease: false,
  },
  next: {
    prerelease: true,
  },
  beta: {
    prerelease: true,
  },
  alpha: {
    prerelease: true,
  },
}

const __dirname = fileURLToPath(new URL('.', import.meta.url))
export const rootDir = resolve(__dirname, '..')

export const examplesDirs = [
  'examples/react',
  'examples/solid',
  'examples/svelte',
  'examples/vue',
]
