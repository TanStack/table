import { defineConfig } from 'vite'
import { octane } from 'octane/compiler/vite'

export default defineConfig({
  server: {
    port: 7786,
    allowedHosts: true,
  },
  plugins: [octane()],
})
