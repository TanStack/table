import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import resolve from 'rollup-plugin-node-resolve'
import { uglify } from 'rollup-plugin-uglify'

import pkg from './package.json'

export default [
  {
    input: 'src/index.js',
    output: {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    plugins: [
      external(),
      babel({
        exclude: 'node_modules/**'
      }),
      resolve(),
      commonjs(),
      uglify()
    ]
  },
  {
    input: 'src/index.js',
    external: Object.keys(pkg.peerDependencies),
    output: {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    },
    plugins: [
      babel({
        exclude: ['/**/node_modules/**']
      })
    ]
  }
]
