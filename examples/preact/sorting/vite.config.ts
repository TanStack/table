import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 7777,
    allowedHosts: true,
  },
  plugins: [
    // Force the Babel transform path so dev mode avoids the preset's CJS
    // hook-name transform, which currently trips over ESM-only `zimmerframe`.
    preact({ babel: {} }),
  ],
})
