import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

export default defineConfig({
  server: { port: 7777, allowedHosts: true },
  plugins: [svelte()],
})
