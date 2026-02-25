import { defineConfig, mergeConfig } from 'vitest/config'
import { tanstackViteConfig } from '@tanstack/vite-config'
import react from '@vitejs/plugin-react'
import packageJson from './package.json'

const config = defineConfig({
  plugins: [react()],
  test: {
    name: packageJson.name,
    dir: './tests',
    watch: false,
    environment: 'jsdom',
    globals: true,
  },
})

export default mergeConfig(
  config,
  tanstackViteConfig({
    cjs: false,
    entry: ['./src/index.ts', './src/production.ts'],
    srcDir: './src',
  }),
)
