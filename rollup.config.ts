import { RollupOptions } from 'rollup'
import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import size from 'rollup-plugin-size'
import visualizer from 'rollup-plugin-visualizer'
import replace from '@rollup/plugin-replace'
import nodeResolve from '@rollup/plugin-node-resolve'
import * as path from 'path'
import dts from 'rollup-plugin-dts'

type Options = {
  input: string
  packageDir: string
  external: RollupOptions['external']
  banner: string
  jsName: string
  outputFile: string
  // Globals for UMD bundle, we want to skip monorepo deps to make sure we would not need to import core as well
  globals: Record<string, string>
}

const umdDevPlugin = (type: 'development' | 'production') =>
  replace({
    'process.env.NODE_ENV': `"${type}"`,
    delimiters: ['', ''],
    preventAssignment: true,
  })

const babelPlugin = babel({
  babelHelpers: 'bundled',
  exclude: /node_modules/,
  extensions: ['.ts', '.tsx'],
})

export default function rollup(options: RollupOptions): RollupOptions[] {
  return [
    ...buildConfigs({
      name: 'table-core',
      packageDir: 'packages/table-core',
      jsName: 'TableCore',
      outputFile: 'index',
      entryFile: 'src/index.ts',
      external: [],
      globals: {},
    }),
    ...buildConfigs({
      name: 'react-table',
      packageDir: 'packages/react-table',
      jsName: 'ReactTable',
      outputFile: 'index',
      entryFile: 'src/index.tsx',
      external: ['react', '@baishu/table-core'],
      globals: {
        react: 'React',
      },
    }),
  ]
}

function buildConfigs(opts: {
  packageDir: string
  name: string
  jsName: string
  outputFile: string
  entryFile: string
  // Globals for UMD bundle, we want to skip monorepo deps to make sure we would not need to import core as well
  globals: Record<string, string>
  // Externals for cjs, esm, mjs
  external: string[]
}): RollupOptions[] {
  const input = path.resolve(opts.packageDir, opts.entryFile)

  const external = moduleName => opts.external.includes(moduleName)
  const umdExternal = Object.keys(opts.globals)
  const banner = createBanner(opts.name)

  const options: Options = {
    input,
    jsName: opts.jsName,
    outputFile: opts.outputFile,
    packageDir: opts.packageDir,
    external,
    banner,
    globals: opts.globals,
  }

  return [
    mjs(options),
    esm(options),
    cjs(options),
    umdDev({ ...options, external: umdExternal }),
    umdProd({ ...options, external: umdExternal }),
    // types(options),
  ]
}

function mjs({
  input,
  packageDir,
  external,
  banner,
  outputFile,
}: Options): RollupOptions {
  return {
    // ESM
    external,
    input,
    output: {
      format: 'esm',
      sourcemap: true,
      file: `${packageDir}/build/lib/${outputFile}.mjs`,
      banner,
    },
    plugins: [
      babelPlugin,
      nodeResolve({ extensions: ['.ts', '.tsx'] }),
    ],
  }
}

function esm({
  input,
  packageDir,
  external,
  banner,
  outputFile,
}: Options): RollupOptions {
  return {
    // ESM
    external,
    input,
    output: {
      format: 'esm',
      sourcemap: true,
      file: `${packageDir}/build/lib/${outputFile}.esm.js`,
      banner,
    },
    plugins: [
      babelPlugin,
      nodeResolve({ extensions: ['.ts', '.tsx'] }),
    ],
  }
}

function cjs({ input, external, packageDir, banner }: Options): RollupOptions {
  return {
    // CJS
    external,
    input,
    output: {
      format: 'cjs',
      sourcemap: true,
      dir: `${packageDir}/build/lib`,
      preserveModules: true,
      exports: 'named',
      banner,
    },
    plugins: [
      babelPlugin,
      nodeResolve({ extensions: ['.ts', '.tsx'] }),
    ],
  }
}

function umdDev({
  input,
  external,
  packageDir,
  outputFile,
  globals,
  banner,
  jsName,
}: Options): RollupOptions {
  return {
    // UMD (Dev)
    external,
    input,
    output: {
      format: 'umd',
      sourcemap: true,
      file: `${packageDir}/build/umd/index.development.js`,
      name: jsName,
      globals,
      banner,
    },
    plugins: [
      babelPlugin,
      nodeResolve({ extensions: ['.ts', '.tsx'] }),
      umdDevPlugin('development'),
    ],
  }
}

function umdProd({
  input,
  external,
  packageDir,
  outputFile,
  globals,
  banner,
  jsName,
}: Options): RollupOptions {
  return {
    // UMD (Prod)
    external,
    input,
    output: {
      format: 'umd',
      sourcemap: true,
      file: `${packageDir}/build/umd/index.production.js`,
      name: jsName,
      globals,
      banner,
    },
    plugins: [
      babelPlugin,
      nodeResolve({ extensions: ['.ts', '.tsx'] }),
      umdDevPlugin('production'),
      terser({
        mangle: true,
        compress: true,
      }),
      size({}),
      visualizer({
        filename: `${packageDir}/build/stats-html.html`,
        gzipSize: true,
      }),
      visualizer({
        filename: `${packageDir}/build/stats-react.json`,
        json: true,
        gzipSize: true,
      }),
    ],
  }
}

function types({
  input,
  packageDir,
  external,
  banner,
}: Options): RollupOptions {
  return {
    // TYPES
    external,
    input,
    output: {
      format: 'es',
      file: `${packageDir}/build/types/index.d.ts`,
      banner,
    },
    plugins: [dts()],
  }
}

function createBanner(libraryName: string) {
  return `/**
 * ${libraryName}
 *
 * Copyright (c) TanStack
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */`
}
