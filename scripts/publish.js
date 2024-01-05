// @ts-check

import { publish } from '@tanstack/config/publish'
import { branchConfigs, packages, rootDir } from './config.js'

try {
  await publish({
    branchConfigs,
    packages,
    rootDir,
    branch: process.env.BRANCH,
    tag: process.env.TAG,
    ghToken: process.env.GH_TOKEN,
  })
} catch (error) {
  console.error(error)
  process.exit(1)
}
