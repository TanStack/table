import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  './packages/react-table-devtools/vite.config.ts',
  './packages/svelte-table/vite.config.ts',
  './packages/qwik-table/vite.config.ts',
  './packages/lit-table/vite.config.ts',
  './packages/vue-table/vite.config.ts',
  './packages/solid-table/vite.config.ts',
  './packages/react-table/vite.config.ts',
  './packages/table-core/vite.config.ts',
  './packages/angular-table/vite.config.ts',
  './packages/match-sorter-utils/vite.config.ts',
])
