import { defineConfig } from 'vitest/config'
import packageJson from './package.json'

export default defineConfig(({ mode }) => ({
  test: {
    name: packageJson.name,
    dir: './tests',
    watch: false,
    environment: 'jsdom',
    setupFiles: ['./tests/test-setup.ts'],
    globals: true,
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}))
