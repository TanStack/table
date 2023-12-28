import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  test: {
    watch: false,
    setupFiles: ['test-setup.ts'],
    environment: 'jsdom',
    globals: true,
    dir: '__tests__',
  },
  resolve: {
    alias: {
      '@tanstack/table-core': resolve(__dirname, '../table-core/src'),
    },
  },
})
