import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { glob } from 'tinyglobby'

import { packages, rootDir } from './config.js'

const skillPaths = await glob('packages/*/skills/**/SKILL.md', {
  cwd: rootDir,
  absolute: true,
})
const workspacePackages = new Set(packages.map((pkg) => pkg.name))
const lockfile = await readFile(resolve(rootDir, 'pnpm-lock.yaml'), 'utf8')
const errors = []

function tableColumns(line) {
  let separators = 0
  for (let index = 0; index < line.length; index++) {
    if (line[index] !== '|') continue
    let slashes = 0
    for (
      let cursor = index - 1;
      cursor >= 0 && line[cursor] === '\\';
      cursor--
    ) {
      slashes++
    }
    if (slashes % 2 === 0) separators++
  }
  return separators - (line.trimStart().startsWith('|') ? 1 : 0)
}

function validateTables(path, lines) {
  for (let index = 0; index < lines.length - 1; index++) {
    if (!lines[index].trimStart().startsWith('|')) continue
    if (!lines[index + 1].trimStart().startsWith('|')) continue
    if (!/^\|?(?:\s*:?-{3,}:?\s*\|)+\s*$/.test(lines[index + 1].trim())) {
      continue
    }

    const expected = tableColumns(lines[index + 1])
    let cursor = index
    while (cursor < lines.length && lines[cursor].trimStart().startsWith('|')) {
      const actual = tableColumns(lines[cursor])
      if (actual !== expected) {
        errors.push(
          `${path}:${cursor + 1}: Markdown table has ${actual} columns; expected ${expected}. Escape literal pipes as \\|.`,
        )
      }
      cursor++
    }
    index = cursor - 1
  }
}

function codeBlocks(source) {
  const lines = source.split('\n')
  const blocks = []
  let heading = ''
  for (let index = 0; index < lines.length; index++) {
    const headingMatch = lines[index].match(/^#{2,4}\s+(.+)$/)
    if (headingMatch) heading = headingMatch[1]
    const fence = lines[index].match(/^```([\w-]*)\s*$/)
    if (!fence) continue
    const start = index + 1
    const body = []
    index++
    while (index < lines.length && lines[index] !== '```') {
      body.push(lines[index])
      index++
    }
    blocks.push({
      body: body.join('\n'),
      heading,
      language: fence[1],
      line: start + 1,
    })
  }
  return blocks
}

function validateWrongCorrect(path, source) {
  const pairs = source.matchAll(
    /Wrong:\s*\n+```[^\n]*\n([\s\S]*?)\n```[\s\S]*?Correct:\s*\n+```[^\n]*\n([\s\S]*?)\n```/g,
  )
  for (const pair of pairs) {
    const normalize = (value) => value.replace(/\s+/g, ' ').trim()
    if (normalize(pair[1]) === normalize(pair[2])) {
      errors.push(`${path}: Wrong and Correct snippets are identical`)
    }
  }
}

for (const skillPath of skillPaths) {
  const relativePath = skillPath.slice(rootDir.length + 1)
  const source = await readFile(skillPath, 'utf8')
  const lines = source.split('\n')
  validateTables(relativePath, lines)
  validateWrongCorrect(relativePath, source)

  for (const block of codeBlocks(source)) {
    if (/^wrong\b/i.test(block.heading)) continue

    for (const match of block.body.matchAll(
      /(?:from\s+|import\s*\()['"](@tanstack\/[^'"/]+(?:-[^'"/]+)*)['"]/g,
    )) {
      const packageName = match[1]
      if (
        !workspacePackages.has(packageName) &&
        !lockfile.includes(`'${packageName}@`)
      ) {
        errors.push(
          `${relativePath}:${block.line}: package ${packageName} is neither a workspace package nor present in pnpm-lock.yaml`,
        )
      }
    }

    if (
      /getResizeHandler\(\)/.test(block.body) &&
      /pointerdown/.test(block.body)
    ) {
      errors.push(
        `${relativePath}:${block.line}: getResizeHandler must be wired to mouse and touch start events, not pointerdown`,
      )
    }
    if (
      (relativePath.startsWith('packages/react-table/') ||
        relativePath.startsWith('packages/preact-table/')) &&
      /<table\.Subscribe\s*>/.test(block.body)
    ) {
      errors.push(
        `${relativePath}:${block.line}: table.Subscribe over table.store requires a selector`,
      )
    }
    if (
      /get\s+data\s*\(\)\s*{[\s\S]*?return[^\n]*\?\?\s*\[\]/.test(block.body)
    ) {
      errors.push(
        `${relativePath}:${block.line}: table data getter returns a fresh empty-array fallback`,
      )
    }
    if (
      relativePath.includes('lit-table/skills/with-tanstack-virtual') &&
      /columns:\s*\[\.\.\./.test(block.body)
    ) {
      errors.push(
        `${relativePath}:${block.line}: Lit render options recreate columns with an inline spread`,
      )
    }
    if (
      /Alpine\.reactive<Array<[^>]+>>/.test(block.body) &&
      /get\s+data\s*\(\)\s*{\s*return\s+local\s*}/.test(block.body)
    ) {
      errors.push(
        `${relativePath}:${block.line}: Alpine getter returns a reactive array without a tracked property read`,
      )
    }
    if (
      /tableFeatures\(\{\s*}\)/.test(block.body) &&
      /(getVisibleCells|getVisibleLeafColumns)\(/.test(block.body)
    ) {
      errors.push(
        `${relativePath}:${block.line}: visibility-aware API is used without columnVisibilityFeature`,
      )
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Validated content invariants for ${skillPaths.length} skills`)
}
