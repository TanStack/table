import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import rollupReplace from '@rollup/plugin-replace'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    rollupReplace({
      preventAssignment: true,
      values: {
        __DEV__: JSON.stringify(true),
        'process.env.NODE_ENV': JSON.stringify('development'),
      },
    }),
    react(),
    // React Compiler - comment out the next line to disable
    babel({
      presets: [reactCompilerPreset()],
      include: [/\/src\/.*\.[jt]sx?$/],
    }),
    TanStackRouterVite(),
  ],
})
