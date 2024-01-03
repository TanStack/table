import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    watch: false,
    setupFiles: ['test-setup.ts'],
    environment: 'jsdom',
    globals: true,
    dir: '__tests__',
  },
})
