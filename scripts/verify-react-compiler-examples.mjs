import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const reactExamplesDir = path.resolve('examples/react')
const entries = await readdir(reactExamplesDir, { withFileTypes: true })
const failures = []
let checked = 0

for (const entry of entries) {
  if (!entry.isDirectory()) continue

  const exampleDir = path.join(reactExamplesDir, entry.name)

  try {
    await readFile(path.join(exampleDir, 'package.json'))
  } catch {
    continue
  }

  let configPath
  let source

  for (const configName of ['vite.config.js', 'vite.config.ts']) {
    const candidate = path.join(exampleDir, configName)

    try {
      source = await readFile(candidate, 'utf8')
      configPath = candidate
      break
    } catch {
      // Try the other supported config extension.
    }
  }

  if (!configPath || !source) {
    failures.push(`${entry.name}: missing vite.config.js or vite.config.ts`)
    continue
  }

  checked++

  const hasPresetImport =
    /^import\s+\w+,\s*\{\s*reactCompilerPreset\s*\}\s+from\s+['"]@vitejs\/plugin-react['"]/m.test(
      source,
    )
  const hasActiveBabelPlugin = /^\s*babel\(\{/m.test(source)
  const hasActiveCompilerPreset =
    /^\s*presets:\s*\[reactCompilerPreset\(\)\]/m.test(source)

  if (!hasPresetImport || !hasActiveBabelPlugin || !hasActiveCompilerPreset) {
    failures.push(
      `${path.relative(process.cwd(), configPath)}: React Compiler is not actively configured`,
    )
  }
}

if (failures.length) {
  console.error('React Compiler example verification failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exitCode = 1
} else {
  console.log(`Verified React Compiler is active in ${checked} React examples.`)
}
