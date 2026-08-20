import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import { octane } from 'octane/compiler/vite'
import packageJson from './package.json'

export default defineConfig({
  plugins: [octane({ ssr: false })],
  resolve: {
    alias: {
      [packageJson.name]: fileURLToPath(
        new URL('./src/index.ts', import.meta.url),
      ),
    },
  },
  test: {
    name: packageJson.name,
    dir: './tests',
    exclude: ['**/ssr/**/*.test.ts'],
    watch: false,
    environment: 'jsdom',
    setupFiles: ['./tests/test-setup.ts'],
  },
})
