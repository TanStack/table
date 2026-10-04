import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { listIntentSkills, loadIntentSkill } from '@tanstack/intent/core'
import markdownLinks from 'markdown-link-extractor'
import { parse, stringify } from 'yaml'
import { rootDir } from '../config.js'
import { validateSkillTree } from '../skill-tree.mjs'

async function temporaryDirectory(t) {
  const directory = await mkdtemp(join(tmpdir(), 'table-skill-test-'))
  t.after(() => rm(directory, { recursive: true, force: true }))
  return directory
}

async function write(directory, path, content) {
  const target = join(directory, path)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, content)
}

async function artifactFixture(t) {
  const directory = await temporaryDirectory(t)
  const skill = {
    slug: 'core',
    package: 'packages/sample',
    path: 'packages/sample/skills/core/SKILL.md',
    sources: ['TanStack/table:packages/sample/src/index.ts'],
    references: ['references/selection.md'],
  }
  await write(
    directory,
    'packages/sample/package.json',
    JSON.stringify({ name: '@tanstack/sample', files: ['skills'] }),
  )
  await write(directory, 'packages/sample/src/index.ts', 'export {}\n')
  await write(
    directory,
    '_artifacts/skill_tree.yaml',
    stringify({ skills: [skill] }),
  )
  await write(
    directory,
    '_artifacts/domain_map.yaml',
    stringify({
      skills: [
        {
          ...skill,
          package: '@tanstack/sample',
          references: [
            { path: 'references/selection.md', sources: skill.sources },
          ],
        },
      ],
    }),
  )
  await write(
    directory,
    skill.path,
    `---\n${stringify({ name: 'core', description: 'Sample skill', sources: skill.sources })}---\n# Sample\n\nFor selection, read [selection](references/selection.md).\n`,
  )
  await write(
    directory,
    'packages/sample/skills/core/references/selection.md',
    '# Selection\n\nSelection details.\n',
  )
  return directory
}

test('artifact validation accepts a directly linked reference', async (t) => {
  const result = await validateSkillTree(await artifactFixture(t))
  assert.deepEqual(result, { errors: [], skillCount: 1, referenceCount: 1 })
})

test('missing and undiscoverable references fail validation', async (t) => {
  const directory = await artifactFixture(t)
  await rm(
    join(directory, 'packages/sample/skills/core/references/selection.md'),
  )
  let result = await validateSkillTree(directory)
  assert(
    result.errors.some((error) => error.includes('Missing declared document')),
  )
  await write(
    directory,
    'packages/sample/skills/core/references/selection.md',
    '# Selection\n',
  )
  const entry = join(directory, 'packages/sample/skills/core/SKILL.md')
  await writeFile(
    entry,
    (await readFile(entry, 'utf8')).replace(
      '[selection](references/selection.md)',
      'selection',
    ),
  )
  result = await validateSkillTree(directory)
  assert(
    result.errors.some((error) =>
      error.includes('needs a direct Markdown link'),
    ),
  )
})

test('undeclared files and references disguised as skills fail validation', async (t) => {
  const directory = await artifactFixture(t)
  await write(
    directory,
    'packages/sample/skills/selection/SKILL.md',
    '---\nname: selection\ndescription: Accidental extra catalog entry\n---\n',
  )
  await write(
    directory,
    'packages/sample/skills/core/references/selection.md',
    '---\nname: selection\n---\n# Selection\n',
  )
  const { errors } = await validateSkillTree(directory)
  assert(errors.some((error) => error.includes('Undeclared skill document')))
  assert(
    errors.some((error) => error.includes('references must be plain Markdown')),
  )
})

test('removed identities and cyclic prerequisites fail validation', async (t) => {
  const directory = await artifactFixture(t)
  const treePath = join(directory, '_artifacts/skill_tree.yaml')
  const tree = parse(await readFile(treePath, 'utf8'))
  tree.skills[0].requires = ['core', 'removed']
  await writeFile(treePath, stringify(tree))
  const entryPath = join(directory, tree.skills[0].path)
  await writeFile(
    entryPath,
    `${await readFile(entryPath, 'utf8')}\nLoad @tanstack/sample#removed.\n`,
  )
  const { errors } = await validateSkillTree(directory)
  assert(errors.some((error) => error.includes('Cyclic skill prerequisites')))
  assert(
    errors.some((error) =>
      error.includes('missing prerequisite @tanstack/sample#removed'),
    ),
  )
  assert(
    errors.some((error) =>
      error.includes('unknown skill identity @tanstack/sample#removed'),
    ),
  )
})

test('reference evidence must remain in the owning skill for staleness checks', async (t) => {
  const directory = await artifactFixture(t)
  const entryPath = join(directory, 'packages/sample/skills/core/SKILL.md')
  await writeFile(
    entryPath,
    (await readFile(entryPath, 'utf8')).replace(
      'sources:\n  - TanStack/table:packages/sample/src/index.ts\n',
      '',
    ),
  )
  const { errors } = await validateSkillTree(directory)
  assert(
    errors.some((error) =>
      error.includes('frontmatter sources omit tree evidence'),
    ),
  )
})

test('Intent discovers eight React/core entry points and leaves references unloaded', async (t) => {
  const directory = await temporaryDirectory(t)
  const adapter = JSON.parse(
    await readFile(join(rootDir, 'packages/react-table/package.json'), 'utf8'),
  )
  await write(
    directory,
    'package.json',
    JSON.stringify({
      name: 'skill-consumer',
      version: '1.0.0',
      dependencies: { '@tanstack/react-table': adapter.version },
      intent: { skills: ['@tanstack/react-table', '@tanstack/table-core'] },
    }),
  )
  for (const name of ['table-core', 'react-table']) {
    const target = join(directory, 'node_modules/@tanstack', name)
    await mkdir(target, { recursive: true })
    await cp(
      join(rootDir, 'packages', name, 'package.json'),
      join(target, 'package.json'),
    )
    await cp(
      join(rootDir, 'packages', name, 'skills'),
      join(target, 'skills'),
      { recursive: true },
    )
  }
  const listed = listIntentSkills({ cwd: directory })
  assert.deepEqual(listed.skills.map((skill) => skill.use).sort(), [
    '@tanstack/react-table#getting-started',
    '@tanstack/react-table#migrate-v8-to-v9',
    '@tanstack/react-table#table-state',
    '@tanstack/table-core#core',
    '@tanstack/table-core#custom-features',
    '@tanstack/table-core#migrate-v8-to-v9',
    '@tanstack/table-core#table-features',
    '@tanstack/table-core#table-state',
  ])
  const referencePath =
    'node_modules/@tanstack/table-core/skills/table-features/references/row-selection.md'
  await write(
    directory,
    referencePath,
    '# Reference sentinel: read only for selection\n',
  )
  const corePath = join(
    directory,
    'node_modules/@tanstack/table-core/skills/core/SKILL.md',
  )
  await writeFile(
    corePath,
    `${await readFile(corePath, 'utf8')}\nPrerequisite sentinel: separate core read\n`,
  )
  const loaded = loadIntentSkill('@tanstack/table-core#table-features', {
    cwd: directory,
  })
  assert(!loaded.content.includes('Reference sentinel'))
  assert(!loaded.content.includes('Prerequisite sentinel'))
  const referenceLink = markdownLinks(loaded.content).find((link) =>
    link.endsWith('/references/row-selection.md'),
  )
  assert(referenceLink, 'Intent load must preserve the reference link')
  assert.match(
    await readFile(resolve(directory, referenceLink), 'utf8'),
    /Reference sentinel/,
  )

  const cli = fileURLToPath(
    new URL('cli.mjs', import.meta.resolve('@tanstack/intent')),
  )
  const run = (...args) =>
    execFileSync(process.execPath, [cli, ...args], {
      cwd: directory,
      encoding: 'utf8',
    })
  const defaults = run('install', '--dry-run')
  assert(!defaults.includes('  - id:'))
  const mappings = run('install', '--map', '--dry-run')
  const block = mappings.match(
    /<!-- intent-skills:start -->\n([\s\S]*?)<!-- intent-skills:end -->/,
  )[1]
  const mappedIds = parse(block)
    .tanstackIntent.map((mapping) => mapping.id)
    .sort()
  assert.deepEqual(mappedIds, listed.skills.map((skill) => skill.use).sort())
  t.diagnostic(
    `React/core: ${listed.skills.length} catalog entries; ${block.length} characters in mapped guidance`,
  )
})

test('every declared reference ships in its npm package', async () => {
  const tree = parse(
    await readFile(join(rootDir, '_artifacts/skill_tree.yaml'), 'utf8'),
  )
  for (const packageDir of new Set(
    tree.skills
      .filter((skill) => skill.references?.length)
      .map((skill) => skill.package),
  )) {
    const packed = JSON.parse(
      execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
        cwd: join(rootDir, packageDir),
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      }),
    )[0]
    const paths = new Set(packed.files.map((file) => file.path))
    for (const skill of tree.skills.filter(
      (entry) => entry.package === packageDir,
    )) {
      for (const reference of skill.references ?? []) {
        const path = relative(packageDir, join(dirname(skill.path), reference))
        assert(paths.has(path), `${packageDir} tarball is missing ${path}`)
      }
    }
  }
})
