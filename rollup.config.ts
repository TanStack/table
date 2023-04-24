import { RollupOptions } from 'rollup'
import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
// @ts-ignore
import size from 'rollup-plugin-size'
import visualizer from 'rollup-plugin-visualizer'
import replace from '@rollup/plugin-replace'
import nodeResolve from '@rollup/plugin-node-resolve'
import path from 'path'
import svelte from 'rollup-plugin-svelte'
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

interface BuildConfigOptions {
  packageDir: string
  name: string
  jsName: string
  outputFile: string
  entryFile: string
  // Globals for UMD bundle, we want to skip monorepo deps to make sure we would not need to import core as well
  globals: Record<string, string>
  // Externals for cjs, esm, mjs
  external: string[]
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

const buildConfigOptions: Record<string, BuildConfigOptions> = {
  'table-core': {
    name: 'table-core',
    packageDir: 'packages/table-core',
    jsName: 'TableCore',
    outputFile: 'index',
    entryFile: 'src/index.ts',
    external: [],
    globals: {},
  },
  'react-table': {
    name: 'react-table',
    packageDir: 'packages/react-table',
    jsName: 'ReactTable',
    outputFile: 'index',
    entryFile: 'src/index.tsx',
    external: ['react', '@tanstack/table-core'],
    globals: {
      react: 'React',
    },
  },
  'solid-table': {
    name: 'solid-table',
    packageDir: 'packages/solid-table',
    jsName: 'SolidTable',
    outputFile: 'index',
    entryFile: 'src/index.tsx',
    external: ['solid-js', 'solid-js/store', '@tanstack/table-core'],
    globals: {
      'solid-js': 'Solid',
      'solid-js/store': 'SolidStore',
    },
  },
  'vue-table': {
    name: 'vue-table',
    packageDir: 'packages/vue-table',
    jsName: 'VueTable',
    outputFile: 'index',
    entryFile: 'src/index.ts',
    external: ['vue', '@tanstack/table-core'],
    globals: {
      vue: 'Vue',
    },
  },
  'svelte-table': {
    name: 'svelte-table',
    packageDir: 'packages/svelte-table',
    jsName: 'SvelteTable',
    outputFile: 'index',
    entryFile: 'src/index.ts',
    external: [
      'svelte',
      'svelte/internal',
      'svelte/store',
      '@tanstack/table-core',
    ],
    globals: {
      svelte: 'Svelte',
      'svelte/internal': 'SvelteInternal',
      'svelte/store': 'SvelteStore',
    },
  },
  'react-table-devtools': {
    name: 'react-table-devtools',
    packageDir: 'packages/react-table-devtools',
    jsName: 'ReactTableDevtools',
    outputFile: 'index',
    entryFile: 'src/index.tsx',
    external: ['react', '@tanstack/react-table'],
    globals: {
      react: 'React',
      '@tanstack/react-table': 'ReactTable',
    },
  },
  'match-sorter-utils': {
    name: 'match-sorter-utils',
    packageDir: 'packages/match-sorter-utils',
    jsName: 'MatchSorterUtils',
    outputFile: 'index',
    entryFile: 'src/index.ts',
    external: [],
    globals: {},
  },
}

export function createRollupConfig(packageName: string): () => RollupOptions[] {
  const options = buildConfigOptions[packageName]
  if (!options) {
    throw new Error(
      `Package "${packageName}" not found - check the package name given in your package's rollup.config.js file.`
    )
  }
  return () => buildConfigs(options)
}

function buildConfigs(opts: BuildConfigOptions): RollupOptions[] {
  const input = path.resolve(opts.packageDir, opts.entryFile)

  const external = (moduleName: any) => opts.external.includes(moduleName)
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
    types(options),
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
      svelte({
        compilerOptions: {
          hydratable: true,
        },
      }),
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
      svelte({
        compilerOptions: {
          hydratable: true,
        },
      }),
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
      svelte(),
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
      svelte(),
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
      svelte(),
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
      file: `${packageDir}/build/lib/index.d.ts`,
      banner,
    },
    plugins: [dts({ compilerOptions: { preserveSymlinks: false } })],
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
