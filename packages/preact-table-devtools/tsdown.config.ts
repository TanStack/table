import { defineConfig } from 'tsdown'
import preact from '@preact/preset-vite'

export default defineConfig({
  plugins: [preact({ prefreshEnabled: false })],
  entry: ['./src/index.ts', './src/production.ts'],
  format: ['esm'],
  unbundle: true,
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  fixedExtension: false,
  exports: true,
  publint: {
    strict: true,
  },
})
