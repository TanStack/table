import { defineConfig } from 'vitest/config'
import packageJson from './package.json'

export default defineConfig({
  test: {
    name: packageJson.name,
    dir: './tests',
    watch: false,
    environment: 'node',
    // environment: 'jsdom',
    // setupFiles: ['./tests/test-setup.ts'],
    globals: true,
  },
})
