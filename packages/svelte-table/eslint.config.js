// @ts-check

import pluginSvelte from 'eslint-plugin-svelte'
import rootConfig from '../../eslint.config.js'

export default [
  ...rootConfig,
  ...pluginSvelte.configs['flat/recommended'],
  {
    files: ['**/*.svelte', '**/*.svelte.ts'],
    rules: {
      'svelte/block-lang': ['error', { script: ['ts'] }],
      'svelte/no-svelte-internal': 'error',
      'svelte/valid-compile': 'off',
      // These rules don't work well with the svelte parser context
      '@typescript-eslint/no-unnecessary-condition': 'off',
      'import/newline-after-import': 'off',
    },
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  },
]
