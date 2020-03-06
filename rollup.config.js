import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import size from 'rollup-plugin-size'
import externalDeps from 'rollup-plugin-peer-deps-external'

const external = ['react']

const globals = {
  react: 'React',
}

export default [
  {
    input: 'src/index.js',
    output: {
      name: 'ReactQuery',
      file: 'dist/react-table.development.js',
      format: 'umd',
      sourcemap: true,
      globals,
    },
    external,
    plugins: [babel(), externalDeps()],
  },
  {
    input: 'src/index.js',
    output: {
      name: 'ReactQuery',
      file: 'dist/react-table.production.min.js',
      format: 'umd',
      sourcemap: true,
      globals,
    },
    external,
    plugins: [
      babel(),
      externalDeps(),
      terser(),
      size({
        writeFile: false,
      }),
    ],
  },
]
