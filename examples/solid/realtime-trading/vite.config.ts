import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  server: {
    port: 7779,
    allowedHosts: true,
  },
  plugins: [solidPlugin()],
  build: {
    target: 'esnext',
  },
})
