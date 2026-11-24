import { defineConfig } from 'vite'
import solid from '@solidjs/vite-plugin'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

export default defineConfig({
  server: {
    port: 7777,
    allowedHosts: true,
  },
  plugins: [solid(), TanStackRouterVite({ target: 'solid' })],
  build: {
    target: 'esnext',
  },
})
