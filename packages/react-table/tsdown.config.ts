import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    './src/index.ts',
    './src/legacy.ts',
    './src/static-functions.ts',
    './src/flex-render.ts',
    './src/experimental-worker-plugin.ts',
  ],
  format: ['esm'],
  unbundle: true,
  dts: true,
  sourcemap: false,
  clean: true,
  minify: false,
  fixedExtension: false,
  exports: true,
  publint: {
    strict: true,
  },
})
