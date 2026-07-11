import { createHash } from 'node:crypto'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import ts from 'typescript'
import { glob } from 'tinyglobby'

import { packages, rootDir } from './config.js'

const markerPattern = /<!--\s*skill-snippet:check(?:\s+([^]*?))?\s*-->/
const skillPaths = await glob('packages/*/skills/**/SKILL.md', {
  cwd: rootDir,
  absolute: true,
})
const workspacePaths = Object.fromEntries(
  packages.flatMap((pkg) => [
    [pkg.name, [resolve(rootDir, pkg.packageDir, 'src/index.ts')]],
    [`${pkg.name}/*`, [resolve(rootDir, pkg.packageDir, 'src/*')]],
  ]),
)
const diagnostics = []
let checked = 0
const formatHost = {
  getCanonicalFileName: (fileName) => fileName,
  getCurrentDirectory: () => rootDir,
  getNewLine: () => '\n',
}

function attributes(raw = '') {
  return Object.fromEntries(
    [...raw.matchAll(/([\w-]+)=([^\s]+)/g)].map((match) => [
      match[1],
      match[2],
    ]),
  )
}

for (const skillPath of skillPaths) {
  const source = await readFile(skillPath, 'utf8')
  const lines = source.split('\n')

  for (let index = 0; index < lines.length; index++) {
    const marker = lines[index].match(markerPattern)
    if (!marker) continue
    const options = attributes(marker[1])
    let fenceIndex = index + 1
    while (lines[fenceIndex]?.trim() === '') fenceIndex++
    const fence = lines[fenceIndex]?.match(/^```(ts|tsx)$/)
    if (!fence) {
      diagnostics.push(
        `${skillPath}:${index + 1}: check marker must precede a ts/tsx fence`,
      )
      continue
    }

    const body = []
    let cursor = fenceIndex + 1
    while (cursor < lines.length && lines[cursor] !== '```') {
      body.push(lines[cursor])
      cursor++
    }
    if (cursor === lines.length) {
      diagnostics.push(
        `${skillPath}:${fenceIndex + 1}: unterminated checked fence`,
      )
      continue
    }

    let code = body.join('\n')
    if (options.prelude) {
      code = `${await readFile(resolve(rootDir, options.prelude), 'utf8')}\n${code}`
    }

    const packageRoot = skillPath.slice(0, skillPath.indexOf('/skills/'))
    const cacheDir = resolve(
      packageRoot,
      'node_modules/.cache/intent-skill-snippets',
    )
    await mkdir(cacheDir, { recursive: true })
    const id = createHash('sha1')
      .update(`${skillPath}:${fenceIndex}`)
      .digest('hex')
      .slice(0, 10)
    const extension = fence[1] === 'tsx' ? '.tsx' : '.ts'
    const filePath = resolve(cacheDir, `${id}${extension}`)
    await writeFile(filePath, code)

    const configPath = options.tsconfig
      ? resolve(rootDir, options.tsconfig)
      : resolve(packageRoot, 'tsconfig.json')
    const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
    if (configFile.error) {
      diagnostics.push(...ts.formatDiagnostics([configFile.error], formatHost))
      continue
    }
    const parsed = ts.parseJsonConfigFileContent(
      configFile.config,
      ts.sys,
      dirname(configPath),
      {
        baseUrl: rootDir,
        ignoreDeprecations: '6.0',
        noEmit: true,
        paths: {
          ...(configFile.config.compilerOptions?.paths ?? {}),
          ...workspacePaths,
        },
        types: ['node'],
      },
      configPath,
    )
    const program = ts.createProgram([filePath], parsed.options)
    const snippetDiagnostics = ts.getPreEmitDiagnostics(program)
    if (snippetDiagnostics.length) {
      diagnostics.push(
        `${skillPath}:${fenceIndex + 1}\n${ts.formatDiagnosticsWithColorAndContext(snippetDiagnostics, formatHost)}`,
      )
    }
    checked++
    await rm(filePath, { force: true })
    index = cursor
  }
}

if (!checked) diagnostics.push('No skill snippets are marked for typechecking')

if (diagnostics.length) {
  console.error(diagnostics.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Typechecked ${checked} annotated skill snippets`)
}
