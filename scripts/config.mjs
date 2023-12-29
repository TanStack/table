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
    srcDir: 'src',
  },
  {
    name: '@tanstack/react-table',
    packageDir: 'react-table',
    srcDir: 'src',
    dependencies: ['@tanstack/table-core'],
  },
  {
    name: '@tanstack/solid-table',
    packageDir: 'solid-table',
    srcDir: 'src',
    dependencies: ['@tanstack/table-core'],
  },
  {
    name: '@tanstack/vue-table',
    packageDir: 'vue-table',
    srcDir: 'src',
    dependencies: ['@tanstack/table-core'],
  },
  {
    name: '@tanstack/svelte-table',
    packageDir: 'svelte-table',
    srcDir: 'src',
    dependencies: ['@tanstack/table-core'],
  },
  {
    name: '@tanstack/react-table-devtools',
    packageDir: 'react-table-devtools',
    srcDir: 'src',
    peerDependencies: ['@tanstack/react-table'],
  },
  {
    name: '@tanstack/match-sorter-utils',
    packageDir: 'match-sorter-utils',
    srcDir: 'src',
  },
]

export const latestBranch = 'main'

/**
 * Contains config for publishable branches.
 * @type {Record<string, import('./types').BranchConfig>}
 */
export const branchConfigs = {
  main: {
    prerelease: false,
    ghRelease: true,
  },
  next: {
    prerelease: true,
    ghRelease: true,
  },
  beta: {
    prerelease: true,
    ghRelease: true,
  },
  alpha: {
    prerelease: true,
    ghRelease: true,
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
