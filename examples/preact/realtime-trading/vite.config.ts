import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 7780,
    allowedHosts: true,
  },
  plugins: [preact()],
})
