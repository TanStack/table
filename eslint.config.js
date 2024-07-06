// @ts-check

// @ts-ignore Needed due to moduleResolution Node vs Bundler
import { tanstackConfig } from '@tanstack/config/eslint'

export default [
  ...tanstackConfig,
  {
    name: 'tanstack/temp',
    rules: {
      'ts/ban-types': 'off',
      'ts/no-empty-function': 'off',
      'no-case-declarations': 'off',
      'ts/naming-convention': 'off',
    },
  },
]
