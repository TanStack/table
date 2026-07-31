import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  server: {
    port: 7777,
  },
  plugins: [solidPlugin()],
  build: { target: 'esnext' },
})
