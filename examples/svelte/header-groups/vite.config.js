import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import rollupReplace from '@rollup/plugin-replace'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 6565,
  },
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
})
