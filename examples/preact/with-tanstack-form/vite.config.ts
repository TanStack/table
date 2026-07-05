import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

export default defineConfig({
  server: {
    port: 6565,
  },
  plugins: [preact()],
})
