import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // React Compiler - comment out the next line to disable
    babel({
      presets: [reactCompilerPreset()],
      include: [/\/src\/.*\.[jt]sx?$/],
    }),
  ],
})
