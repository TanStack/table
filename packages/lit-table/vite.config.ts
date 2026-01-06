import { defineConfig, mergeConfig } from 'vitest/config'
import { tanstackViteConfig } from '@tanstack/config/vite'

const config = defineConfig({})

export default mergeConfig(
  config,
  tanstackViteConfig({
    cjs: false,
    entry: './src/index.ts',
    srcDir: './src',
  }),
)
