import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@tanstack/react-table': resolve(__dirname, '../../../packages/react-table/src'),
      '@tanstack/table-core': resolve(__dirname, '../../../packages/table-core/src'),
    },
  },
})
