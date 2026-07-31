import { createOctaneCompiler } from 'octane/compiler/bundler'
import { defineConfig } from 'tsdown'

const runtimeEntries = [
  './src/index.ts',
  './src/static-functions.ts',
  './src/flex-render.ts',
  './src/experimental-worker-plugin.ts',
]

function octaneCompiler(environment: 'client' | 'server') {
  const compiler = createOctaneCompiler({
    root: import.meta.dirname,
    environment,
  })

  return {
    name: `octane-${environment}`,
    resolveId: {
      order: 'pre' as const,
      handler(source: string) {
        if (environment === 'server' && source === 'octane') {
          return { id: 'octane/server', external: true }
        }
        return null
      },
    },
    transform(code: string, id: string) {
      const result = compiler.transform(code, id, {
        dev: false,
        environment,
        hmr: false,
      })

      return result && 'code' in result
        ? { code: result.code, map: result.map }
        : null
    },
  }
}

const runtimeConfig = {
  entry: runtimeEntries,
  format: ['esm'] as const,
  unbundle: true,
  dts: false,
  sourcemap: false,
  clean: true,
  minify: false,
  fixedExtension: false,
  banner: {
    js: '// octane-no-slot: this package already contains compiler-assigned hook slots.',
  },
}

export default defineConfig([
  {
    ...runtimeConfig,
    name: 'client',
    outDir: './dist/client',
    platform: 'browser',
    plugins: [octaneCompiler('client')],
  },
  {
    ...runtimeConfig,
    name: 'server',
    outDir: './dist/server',
    platform: 'node',
    plugins: [octaneCompiler('server')],
  },
])
