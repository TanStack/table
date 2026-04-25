import { defineConfig } from 'tsdown'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  entry: [
    './src/index.tsx',
    './src/static-functions.ts',
    './src/flex-render.tsx',
  ],
  format: ['esm', 'cjs'],
  unbundle: true,
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  fixedExtension: false,
  exports: false,
  publint: {
    strict: true,
  },
})
