import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { glob } from 'tinyglobby'

import { packages, rootDir } from './config.js'

const write = process.argv.includes('--write')
const packageVersions = new Map()
const errors = []

for (const pkg of packages) {
  const packageJsonPath = resolve(rootDir, pkg.packageDir, 'package.json')
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'))
  packageVersions.set(pkg.name, packageJson.version)

  const skillPaths = await glob(`${pkg.packageDir}/skills/**/SKILL.md`, {
    cwd: rootDir,
    absolute: true,
  })

  for (const skillPath of skillPaths) {
    const source = await readFile(skillPath, 'utf8')
    const library = source.match(
      /^\s*library:\s*['"]?([^'",\n]+)['"]?,?\s*$/m,
    )?.[1]
    const version = source.match(
      /^\s*library_version:\s*['"]?([^'",\n]+)['"]?,?\s*$/m,
    )?.[1]

    if (library !== pkg.name) {
      errors.push(
        `${skillPath}: metadata.library is ${library ?? 'missing'}, expected ${pkg.name}`,
      )
      continue
    }
    if (!version) {
      errors.push(`${skillPath}: metadata.library_version is missing`)
      continue
    }
    if (version === packageJson.version) continue

    if (!write) {
      errors.push(
        `${skillPath}: library_version ${version} does not match ${pkg.name}@${packageJson.version}`,
      )
      continue
    }

    const updated = source.replace(
      /^(\s*library_version:\s*)['"]?[^'",\n]+['"]?(,?)\s*$/m,
      `$1'${packageJson.version}'$2`,
    )
    await writeFile(skillPath, updated)
    console.log(`Updated ${skillPath} to ${packageJson.version}`)
  }
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
}

const coreVersion = packageVersions.get('@tanstack/table-core')
const overrides = [...packageVersions]
  .filter(([, version]) => version !== coreVersion)
  .sort(([a], [b]) => a.localeCompare(b))
const overrideBlock = [
  '  package_version_overrides:',
  ...overrides.map(([name, version]) => `    '${name}': '${version}'`),
].join('\n')

for (const artifact of [
  '_artifacts/domain_map.yaml',
  '_artifacts/skill_tree.yaml',
]) {
  const artifactPath = resolve(rootDir, artifact)
  let source = await readFile(artifactPath, 'utf8')
  const artifactVersion = source.match(
    /^  version:\s*['"]?([^'"\n]+)['"]?\s*$/m,
  )?.[1]
  if (artifactVersion !== coreVersion) {
    if (!write) {
      errors.push(
        `${artifact}: library.version ${artifactVersion ?? 'missing'} does not match @tanstack/table-core@${coreVersion}`,
      )
    } else {
      source = source.replace(
        /^(  version:\s*)['"]?[^'"\n]+['"]?\s*$/m,
        `$1'${coreVersion}'`,
      )
    }
  }

  const match = source.match(
    /^  package_version_overrides:\n(?:    ['"][^\n]+\n?)*/m,
  )
  if (!match) {
    errors.push(
      `${artifact}: library.package_version_overrides block is missing`,
    )
    continue
  }

  const current = match[0].trimEnd()
  if (current !== overrideBlock && !write) {
    errors.push(`${artifact}: package_version_overrides is stale`)
  }
  if (write && (current !== overrideBlock || artifactVersion !== coreVersion)) {
    await writeFile(
      artifactPath,
      source.replace(match[0], `${overrideBlock}\n`),
    )
    console.log(`Updated ${artifact} library versions`)
  }
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else if (!write) {
  console.log('Skill library versions match their package versions')
}
