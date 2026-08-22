import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 7781,
    allowedHosts: true,
  },
  plugins: [vue(), vueJsx()],
})
