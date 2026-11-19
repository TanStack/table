import { defineConfig } from 'vite'
import solid from '@solidjs/vite-plugin'

export default defineConfig({
  server: {
    port: 7777,
    allowedHosts: true,
  },
  plugins: [solid()],
  build: {
    target: 'esnext',
  },
})
