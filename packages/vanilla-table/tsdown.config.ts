import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    './src/index.ts',
    './src/vanillaTable.ts',
    './src/utils/virtualizer.ts',
  ],
  format: ['esm', 'cjs'],
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
