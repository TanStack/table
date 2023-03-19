import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
      name: 'tanstack-table',
      watch: false,
      setupFiles: ['test-setup.ts'],
    environment: 'jsdom',
    globals: true,
    coverage: { provider: 'istanbul' },
    dir: 'packages'
  }
})
