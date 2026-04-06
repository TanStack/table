import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

export default defineConfig({
  plugins: [solidPlugin(), TanStackRouterVite({ target: 'solid' })],
  build: {
    target: 'esnext',
  },
})
