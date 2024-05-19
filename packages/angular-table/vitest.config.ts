import { defineConfig } from 'vitest/config'
import packageJson from './package.json'

export default defineConfig(({ mode }) => ({
  test: {
    name: packageJson.name,
    globals: true,
    setupFiles: ['src/__tests__/test-setup.ts'],
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}))
