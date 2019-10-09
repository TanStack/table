import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'

export default [
  {
    input: 'src/index.js',
    output: {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [external(), babel(), resolve(), commonjs(), terser()],
  },
  {
    input: 'src/index.js',
    output: {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
    plugins: [external(), babel()],
  },
]
