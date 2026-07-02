import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import rollupReplace from '@rollup/plugin-replace'

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
    // NOTE: kept disabled here because the compiler memoizes getter calls like
    // `header.getSize()` on stable table objects, which breaks live column
    // resizing in extracted components
    // babel({
    //   presets: [reactCompilerPreset()],
    //   include: [/\/src\/.*\.[jt]sx?$/],
    // }),
  ],
})
