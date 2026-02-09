// @ts-check

// @ts-ignore Needed due to moduleResolution Node vs Bundler
import { tanstackConfig } from '@tanstack/eslint-config'

/** @type {any} */
const config = [
  ...tanstackConfig,
  {
    name: 'tanstack/temp',
    rules: {
      'no-case-declarations': 'off',
      'no-shadow': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'off',
    },
  },
]

export default config
