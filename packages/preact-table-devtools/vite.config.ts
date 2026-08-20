import { defineConfig } from 'vitest/config'
import preact from '@preact/preset-vite'
import packageJson from './package.json'

export default defineConfig({
  plugins: [preact()],
  test: {
    name: packageJson.name,
    dir: './tests',
    watch: false,
    environment: 'jsdom',
    globals: true,
  },
})
