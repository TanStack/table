import { defineConfig, mergeConfig } from 'vitest/config'
import { tanstackViteConfig } from '@tanstack/config/vite'
import packageJson from './package.json'

const config = defineConfig({
  test: {
    name: packageJson.name,
    dir: './tests',
    watch: false,
    environment: 'jsdom',
    setupFiles: ['./tests/test-setup.ts'],
  },
})

export default mergeConfig(
  config,
  tanstackViteConfig({
    cjs: false,
    entry: './src/index.ts',
    srcDir: './src',
  }),
)
