import * as path from 'path'
import { defineConfig } from 'vite'
import preact from "@preact/preset-vite";
import rollupReplace from '@rollup/plugin-replace'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    rollupReplace({
      preventAssignment: true,
      values: {
        __DEV__: JSON.stringify(true),
        'process.env.NODE_ENV': JSON.stringify('development'),
      },
    }),
    preact(),
  ],
  resolve: process.env.USE_SOURCE
    ? {
        alias: {
          'preact-table': path.resolve(__dirname, '../../../src/index.ts'),
        },
      }
    : {},
})
