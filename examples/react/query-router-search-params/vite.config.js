import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import rollupReplace from '@rollup/plugin-replace'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
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
    react(),
    TanStackRouterVite(),
  ],
})
