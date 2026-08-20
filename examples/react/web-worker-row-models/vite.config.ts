import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __DEV__: JSON.stringify(true),
  },
  server: {
    port: 7777,
    allowedHosts: true,
  },
  plugins: [
    tanstackStart(),
    viteReact(),
    // React Compiler - comment out the next line to disable
    babel({
      presets: [reactCompilerPreset()],
      include: [/\/src\/.*\.[jt]sx?$/],
    }),
  ],
})
