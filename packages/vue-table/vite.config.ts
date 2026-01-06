import { defineConfig, mergeConfig } from 'vitest/config'
import { tanstackViteConfig } from '@tanstack/config/vite'
import vue from '@vitejs/plugin-vue'

const config = defineConfig({
  plugins: [vue()],
})

export default mergeConfig(
  config,
  tanstackViteConfig({
    cjs: false,
    entry: './src/index.ts',
    srcDir: './src',
    exclude: ['./src/tests'],
  }),
)
