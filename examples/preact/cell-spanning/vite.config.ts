import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 7777,
    allowedHosts: true,
  },
  plugins: [preact()],
})
