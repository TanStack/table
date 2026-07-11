import { defineConfig } from 'vite'
import { ember } from '@nullvoxpopuli/ember-vite'

export default defineConfig({
  server: {
    port: 6565,
  },
  plugins: [ember()],
})
