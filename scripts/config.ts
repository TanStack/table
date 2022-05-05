import path from 'path'
import { BranchConfig, Package } from './types'

// TODO: List your npm packages here. The first package will be used as the versioner.
export const packages: Package[] = [
  { name: '@tanstack/table-core', srcDir: 'packages/table-core/src' },
  {
    name: '@tanstack/react-table',
    srcDir: 'packages/react-table/src',
    dependencies: ['@tanstack/table-core'],
  },
  {
    name: '@tanstack/solid-table',
    srcDir: 'packages/solid-table/src',
    dependencies: ['@tanstack/table-core'],
  },
  {
    name: '@tanstack/vue-table',
    srcDir: 'packages/vue-table/src',
    dependencies: ['@tanstack/table-core'],
  },
  {
    name: '@tanstack/svelte-table',
    srcDir: 'packages/svelte-table/src',
    dependencies: ['@tanstack/table-core'],
  },
  {
    name: '@tanstack/react-table-devtools',
    srcDir: 'packages/react-table-devtools/src',
    peerDependencies: ['@tanstack/react-table'],
  },
]

export const latestBranch = 'main'

export const branchConfigs: Record<string, BranchConfig> = {
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

export const rootDir = path.resolve(__dirname, '..')
export const examplesDir = path.resolve(rootDir, 'examples')
