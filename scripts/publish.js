// @ts-check

import { publish } from '@tanstack/publish-config'
import { branchConfigs, packages, rootDir } from './config.js'

await publish({
  branchConfigs,
  packages,
  rootDir,
  branch: process.env.BRANCH,
  tag: process.env.TAG,
  ghToken: process.env.GH_TOKEN,
})

process.exit(0)
