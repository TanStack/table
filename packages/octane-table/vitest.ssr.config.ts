import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import { octane } from 'octane/compiler/vite'
import packageJson from './package.json'

export default defineConfig({
  plugins: [octane({ ssr: true })],
  resolve: {
    alias: {
      [packageJson.name]: fileURLToPath(
        new URL('./src/index.ts', import.meta.url),
      ),
    },
  },
  test: {
    name: `${packageJson.name}:ssr`,
    include: ['tests/ssr/**/*.test.ts'],
    watch: false,
    environment: 'node',
  },
})
