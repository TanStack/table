// @ts-check

import pluginReact from '@eslint-react/eslint-plugin'
import pluginReactCompiler from 'eslint-plugin-react-compiler'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import rootConfig from '../../eslint.config.js'

/** @type {any} */
const config = [
  ...rootConfig,
  {
    files: ['**/*.{ts,tsx}'],
    ...pluginReact.configs.recommended,
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
      'react-compiler': pluginReactCompiler,
    },
    rules: {
      '@eslint-react/dom/no-missing-button-type': 'off',
      'react-compiler/react-compiler': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/rules-of-hooks': 'error',
    },
  },
  {
    files: ['**/plugin.tsx'],
    rules: {
      '@eslint-react/component-hook-factories': 'off',
    },
  },
]

export default config
