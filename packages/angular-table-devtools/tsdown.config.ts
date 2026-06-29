import { defineConfig } from 'tsdown'

export default defineConfig({
  plugins: [],
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
