import { defineConfig } from 'vitest/config'
import packageJson from './package.json'
import angular from '@analogjs/vite-plugin-angular'
import path from 'node:path'

const tsconfig = path.join(import.meta.dirname, 'tsconfig.test.json')

const angularPlugin = angular({ tsconfig, jit: true })

export default defineConfig({
  plugins: [
    // @ts-expect-error Fix types
    angularPlugin,
  ],
  test: {
    name: packageJson.name,
    watch: false,
    pool: 'threads',
    environment: 'jsdom',
    setupFiles: ['./tests/test-setup.ts'],
    globals: true,
    reporters: 'default',
    disableConsoleIntercept: true,
  },
})
