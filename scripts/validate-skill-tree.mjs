import { rootDir } from './config.js'
import { validateSkillTree } from './skill-tree.mjs'

const { errors, skillCount, referenceCount } = await validateSkillTree(rootDir)
if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(
    `Validated ${skillCount} skill entry points and ${referenceCount} references against Intent artifacts`,
  )
}
