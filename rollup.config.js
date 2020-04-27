import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import size from 'rollup-plugin-size'
import json from '@rollup/plugin-json'
import externalDeps from 'rollup-plugin-peer-deps-external'
import resolve from 'rollup-plugin-node-resolve'
import commonJS from 'rollup-plugin-commonjs'
import visualizer from 'rollup-plugin-visualizer'
import replace from '@rollup/plugin-replace'

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
    plugins: [
      resolve(),
      babel(),
      commonJS(),
      externalDeps(),
      json(),
      visualizer(),
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
    plugins: [
      replace({ 'process.env.NODE_ENV': `"production"`, delimiters: ['', ''] }),
      resolve(),
      babel(),
      commonJS(),
      json(),
      externalDeps(),
      terser(),
      size(),
      visualizer(),
    ],
  },
]
