// @ts-check

import rootConfig from '../../eslint.config.js'

/** @type {any} */
const config = [
  ...rootConfig,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {},
  },
]

export default config
