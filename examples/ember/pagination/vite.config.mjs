import { defineConfig } from 'vite'
import { ember } from '@nullvoxpopuli/ember-vite'

export default defineConfig({
  server: {
    port: 7777,
    allowedHosts: true,
  },
  plugins: [ember()],
})
