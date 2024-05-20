import { defineConfig, mergeConfig } from 'vitest/config'
import { tanstackBuildConfig } from '@tanstack/config/build'
import solid from 'vite-plugin-solid'

const config = defineConfig({
  plugins: [solid()],
})

export default mergeConfig(
  config,
  tanstackBuildConfig({
    entry: './src/index.tsx',
    srcDir: './src',
  })
)
