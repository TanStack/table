import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'react-table',
    watch: false,
    globals: true,
    environment: 'jsdom',
    setupFiles: ['../../test-setup.ts'],
  },
  resolve: {
    alias: {
      '@tanstack/table-core': resolve(__dirname, '..', 'table-core', 'src'),
    },
  },
})
