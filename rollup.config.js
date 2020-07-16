import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import size from 'rollup-plugin-size'
import externalDeps from 'rollup-plugin-peer-deps-external'
import replace from '@rollup/plugin-replace'

const external = ['react']

const globals = {
  react: 'React',
}

export default [
  {
    input: 'src/index.js',
    output: {
      name: 'ReactTable',
      file: 'dist/react-table.development.js',
      format: 'umd',
      sourcemap: true,
      globals,
    },
    external,
    plugins: [
      replace({ 'process.env.NODE_ENV': `"development"`, delimiters: ['', ''] }),
      babel(),
      externalDeps(),
    ],
  },
  {
    input: 'src/index.js',
    output: {
      name: 'ReactTable',
      file: 'dist/react-table.production.min.js',
      format: 'umd',
      sourcemap: true,
      globals,
    },
    external,
    plugins: [
      replace({ 'process.env.NODE_ENV': `"production"`, delimiters: ['', ''] }),
      babel(),
      externalDeps(),
      terser(),
      size({
        writeFile: false,
      }),
    ],
  },
]
