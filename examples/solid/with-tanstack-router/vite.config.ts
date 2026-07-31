import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

export default defineConfig({
  server: {
    port: 7777,
  },
  plugins: [solidPlugin(), TanStackRouterVite({ target: 'solid' })],
  build: {
    target: 'esnext',
  },
})
