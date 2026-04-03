import path from 'node:path'
import { defineConfig } from 'vite'
import angular from '@analogjs/vite-plugin-angular'

export default defineConfig({
  root: import.meta.dirname,
  plugins: [
    angular({
      tsconfig: path.join(import.meta.dirname, 'tsconfig.build.json'),
    }),
  ],
  resolve: {
    mainFields: ['module'],
  },
  build: {
    target: ['esnext'],
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      fileName: `fesm2022/tanstack-angular-table`,
      formats: ['es'],
    },
    rolldownOptions: {
      external: [/^@angular\/.*/, /^@tanstack\/.*/, 'rxjs', 'rxjs/operators'],
      output: {
        preserveModules: false,
      },
    },
    minify: false,
  },
})
