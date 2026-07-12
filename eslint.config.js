// @ts-check

// @ts-ignore Needed due to moduleResolution Node vs Bundler
import { tanstackConfig } from '@tanstack/eslint-config'

/** @type {any} */
const config = [
  ...tanstackConfig,
  {
    name: 'tanstack/temp',
    // Anchor type-aware linting to the repo root so `project: true` does not
    // fall back to process.cwd() (e.g. packages/ember-table in the IDE).
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'no-case-declarations': 'off',
      'no-shadow': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/prefer-for-of': 'off',
    },
  },
]

export default config
