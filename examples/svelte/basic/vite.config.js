import * as path from 'path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
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
    svelte(),
  ],
  resolve: process.env.USE_SOURCE
    ? {
        alias: {
          'svelte-table': path.resolve(__dirname, '../../../src/index.ts'),
        },
      }
    : {},
})
