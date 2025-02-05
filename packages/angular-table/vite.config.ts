import { defineConfig } from 'vitest/config'
import packageJson from './package.json'
import angular from '@analogjs/vite-plugin-angular'

const angularPlugin = angular({ tsconfig: 'tsconfig.test.json', jit: true })

export default defineConfig({
  plugins: [angularPlugin],
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
