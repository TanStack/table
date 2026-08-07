import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import rollupReplace from '@rollup/plugin-replace'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['@tanstack/svelte-devtools'],
  },
  server: {
    port: 7777,
    allowedHosts: true,
  },
  plugins: [
    rollupReplace({
      preventAssignment: true,
      values: {
        __DEV__: JSON.stringify(true),
        'process.env.NODE_ENV': JSON.stringify('development'),
      },
    }),
    svelte({
      // This adapter file is already compiled; treating its `.svelte.js`
      // suffix as source makes the Svelte plugin compile it a second time.
      experimental: {
        compileModule: {
          exclude: [/@tanstack\/svelte-devtools\/dist\/esm\/devtools\.svelte\.js/],
        },
      },
    }),
  ],
})
