import { defineConfig } from 'vite'
import rollupReplace from '@rollup/plugin-replace'

export default defineConfig({
  server: {
    port: 7777,
  },
  plugins: [
    rollupReplace({
      preventAssignment: true,
      values: {
        __DEV__: JSON.stringify(true),
        'process.env.NODE_ENV': JSON.stringify('development'),
      },
    }),
  ],
})
