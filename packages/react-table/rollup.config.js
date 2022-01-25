import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import size from 'rollup-plugin-size'
import externalDeps from 'rollup-plugin-peer-deps-external'
import resolve from 'rollup-plugin-node-resolve'
import commonJS from 'rollup-plugin-commonjs'
import visualizer from 'rollup-plugin-visualizer'
import replace from '@rollup/plugin-replace'
// import ccompiler from '@ampproject/rollup-plugin-closure-compiler'

const external = ['react', 'react-dom', '@tanstack/react-table']

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  '@tanstack/react-table': 'ReactTable',
}

const inputSrcs = [['src/index.tsx', 'ReactTable', 'react-table']]

const extensions = ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx']
const babelConfig = { extensions }
const resolveConfig = { extensions }

export default inputSrcs
  .map(([input, name, file]) => {
    return [
      {
        input: input,
        output: {
          name,
          file: `dist/${file}.development.js`,
          format: 'umd',
          sourcemap: 'external',
          globals,
        },
        external,
        plugins: [
          replace({
            'process.env.NODE_ENV': `"development"`,
            'process.env.MODE': `"light"`,
            delimiters: ['', ''],
            preventAssignment: true,
          }),
          resolve(resolveConfig),
          babel({ ...babelConfig, plugins: ['babel-plugin-dev-expression'] }),
          commonJS(),
          externalDeps(),
        ],
      },
      {
        input: input,
        output: {
          name,
          file: `dist/${file}.production.min.js`,
          format: 'umd',
          sourcemap: 'external',
          globals,
        },
        external,
        plugins: [
          replace({
            'process.env.NODE_ENV': `"production"`,
            'process.env.MODE': `"light"`,
            delimiters: ['', ''],
            preventAssignment: true,
          }),
          resolve(resolveConfig),
          babel({ ...babelConfig, plugins: ['babel-plugin-dev-expression'] }),
          commonJS(),
          externalDeps(),
          terser({
            mangle: true,
            compress: true,
          }),
          size(),
          visualizer({
            filename: 'stats-react.json',
            json: true,
            gzipSize: true,
          }),
        ],
      },
    ]
  })
  .flat()
