import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  server: {
    port: 7777,
    allowedHosts: true,
  },
  plugins: [vue(), vueJsx()],
})
