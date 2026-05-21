import { defineConfig, mergeConfig } from 'vitest/config'
import packageJson from './package.json'

const config = defineConfig({
  plugins: [],
  test: {
    name: packageJson.name,
    dir: './',
    watch: false,
    environment: 'jsdom',
    globals: true,
  },
})

export default config
