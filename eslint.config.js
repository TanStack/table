// @ts-check

// @ts-ignore Needed due to moduleResolution Node vs Bundler
import { tanstackConfig } from '@tanstack/config/eslint'

export default [
  ...tanstackConfig,
  {
    name: 'tanstack/temp',
    rules: {
      'no-case-declarations': 'off',
      'no-shadow': 'off',
      'ts/ban-types': 'off',
      'ts/naming-convention': 'off',
      'ts/no-empty-function': 'off',
      'ts/no-unnecessary-condition': 'warn',
    },
  },
]
