import { defineConfig } from 'tsdown'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
