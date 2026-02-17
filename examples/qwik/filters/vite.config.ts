import { defineConfig } from 'vite'
import { qwikVite } from '@builder.io/qwik/optimizer'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    allowedHosts: true,
  },
  plugins: [
    qwikVite({
      csr: true,
    }),
  ],
})
