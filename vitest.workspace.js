import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  './packages/angular-table/vite.config.ts',
  './packages/lit-table/vite.config.ts',
  './packages/match-sorter-utils/vite.config.ts',
  './packages/react-table/vite.config.ts',
  './packages/solid-table/vite.config.ts',
  './packages/svelte-table/vite.config.ts',
  './packages/table-core/vite.config.ts',
  './packages/vue-table/vite.config.ts',
])
