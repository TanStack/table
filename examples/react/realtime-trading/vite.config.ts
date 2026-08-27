import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import rollupReplace from '@rollup/plugin-replace'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  const development = mode === 'development'
  const profiling = mode === 'profile'

  return {
    server: {
      port: 7777,
      allowedHosts: true,
    },
    plugins: [
      rollupReplace({
        preventAssignment: true,
        values: {
          __DEV__: JSON.stringify(development),
          'process.env.NODE_ENV': JSON.stringify(
            development ? 'development' : 'production',
          ),
        },
      }),
      react(),
      babel({
        presets: [reactCompilerPreset()],
        include: [/\/src\/.*\.[jt]sx?$/],
      }),
    ],
    resolve: {
      alias: profiling
        ? [
            {
              find: /^react-dom\/client$/,
              replacement: 'react-dom/profiling',
            },
          ]
        : [],
    },
  }
})
