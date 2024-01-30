import { defineConfig } from 'rollup'
import { buildConfigs } from '../../scripts/getRollupConfig.js'
export default defineConfig(
  buildConfigs({
    name: 'angular-table',
    jsName: 'AngularTable',
    outputFile: 'index',
    entryFile: 'src/index.ts',
    external: ['@angular/core', '@angular/common', '@tanstack/table-core'],
    globals: {
      '@angular/core': 'AngularCore',
      '@angular/common': 'AngularCommon',
    },
  })
)
