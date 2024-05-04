import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    watch: false,
    environment: 'jsdom',
    globals: true,
    dir: '__tests__',
  },
})
