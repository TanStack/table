// @ts-check

import solid from 'eslint-plugin-solid/configs/recommended'
import rootConfig from '../../eslint.config.js'

/** @type {any} */
const config = [...rootConfig, solid]

export default config
