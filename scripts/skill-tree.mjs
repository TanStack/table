import { access, readFile } from 'node:fs/promises'
import { dirname, relative, resolve, sep } from 'node:path'
import markdownLinks from 'markdown-link-extractor'
import { glob } from 'tinyglobby'
import { parse } from 'yaml'

const posix = (path) => path.split(sep).join('/')
const sameMembers = (a = [], b = []) =>
  a.length === b.length && a.every((value) => b.includes(value))

export async function validateSkillTree(rootDir) {
  const errors = []
  const read = (path) => readFile(resolve(rootDir, path), 'utf8')
  const tree = parse(await read('_artifacts/skill_tree.yaml'))
  const domain = parse(await read('_artifacts/domain_map.yaml'))
  const documents = new Map(
    await Promise.all(
      (await glob('packages/*/skills/**/*.md', { cwd: rootDir })).map(
        async (path) => [path, await read(path)],
      ),
    ),
  )
  const domainSkills = new Map()
  for (const skill of domain.skills) {
    const id = `${skill.package}#${skill.slug}`
    if (domainSkills.has(id)) errors.push(`Duplicate domain skill: ${id}`)
    domainSkills.set(id, skill)
  }
  const expected = new Set()
  const dependencies = new Map()
  const packageNames = new Set()
  const sourcePaths = new Set()
  let referenceCount = 0

  for (const skill of tree.skills) {
    const manifest = JSON.parse(await read(`${skill.package}/package.json`))
    const id = `${manifest.name}#${skill.slug}`
    packageNames.add(manifest.name)
    if (dependencies.has(id)) errors.push(`Duplicate tree skill: ${id}`)
    dependencies.set(id, skill.requires ?? [])
    if (skill.path !== `${skill.package}/skills/${skill.slug}/SKILL.md`) {
      errors.push(
        `${id}: entry point must be inside its package skills directory`,
      )
    }
    if (!manifest.files?.includes('skills')) {
      errors.push(`${manifest.name}: package files must include skills`)
    }
    const inventory = domainSkills.get(id)
    if (!inventory) errors.push(`${id}: missing from domain map`)
    if (
      inventory &&
      !sameMembers(
        skill.references,
        inventory.references?.map((reference) => reference.path),
      )
    ) {
      errors.push(`${id}: tree references differ from domain map`)
    }
    if (inventory && !sameMembers(skill.requires, inventory.requires)) {
      errors.push(`${id}: tree prerequisites differ from domain map`)
    }

    expected.add(skill.path)
    const content = documents.get(skill.path)
    if (content === undefined) {
      errors.push(`Missing declared document: ${skill.path}`)
      continue
    }
    const frontmatter = parse(
      content.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '',
    )
    if (!frontmatter) {
      errors.push(`${skill.path}: missing skill frontmatter`)
      continue
    }
    if (!sameMembers(frontmatter.requires, skill.requires)) {
      errors.push(`${id}: frontmatter prerequisites differ from tree`)
    }
    const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---/, '')
    const links = new Set(
      markdownLinks(body).map((link) =>
        resolve(rootDir, dirname(skill.path), link.split('#')[0]),
      ),
    )
    const refs = skill.references ?? []
    if (new Set(refs).size !== refs.length)
      errors.push(`${id}: duplicate references`)
    for (const reference of refs) {
      const path = posix(
        relative(rootDir, resolve(rootDir, dirname(skill.path), reference)),
      )
      if (
        !reference.startsWith('references/') ||
        !reference.endsWith('.md') ||
        reference.split('/').includes('..')
      ) {
        errors.push(`${id}: invalid reference path ${reference}`)
      }
      referenceCount++
      expected.add(path)
      const referenceContent = documents.get(path)
      if (referenceContent === undefined)
        errors.push(`Missing declared document: ${path}`)
      else if (/^---\r?\n/.test(referenceContent))
        errors.push(
          `${path}: references must be plain Markdown without skill frontmatter`,
        )
      if (!links.has(resolve(rootDir, path)))
        errors.push(
          `${id}: reference needs a direct Markdown link: ${reference}`,
        )
      const evidence = inventory?.references?.find(
        (item) => item.path === reference,
      )
      if (!evidence?.sources?.length)
        errors.push(`${path}: domain reference has no sources`)
      for (const source of evidence?.sources ?? []) {
        if (!skill.sources?.includes(source))
          errors.push(`${id}: tree sources omit reference evidence ${source}`)
      }
    }
    for (const source of skill.sources ?? []) {
      if (!frontmatter.sources?.includes(source))
        errors.push(`${id}: frontmatter sources omit tree evidence ${source}`)
      sourcePaths.add(source)
    }
  }

  for (const id of domainSkills.keys()) {
    if (!dependencies.has(id))
      errors.push(`${id}: domain skill missing from tree`)
  }
  for (const [path, content] of documents) {
    if (!expected.has(path)) errors.push(`Undeclared skill document: ${path}`)
    const packageDir = path.slice(0, path.indexOf('/skills/'))
    const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---/, '')
    for (const link of markdownLinks(body)) {
      if (/^(?:[a-z][a-z\d+.-]*:|#|\/\/)/i.test(link)) continue
      const target = resolve(
        rootDir,
        dirname(path),
        decodeURIComponent(link.split(/[?#]/)[0]),
      )
      const inside = relative(resolve(rootDir, packageDir), target)
      if (inside.startsWith('..') || !inside) {
        errors.push(`${path}: local link leaves its published package: ${link}`)
        continue
      }
      try {
        await access(target)
      } catch {
        errors.push(`${path}: broken local link: ${link}`)
      }
    }
    for (const [id] of content.matchAll(/@tanstack\/[\w-]+#[\w/-]+/g)) {
      if (packageNames.has(id.split('#')[0]) && !dependencies.has(id))
        errors.push(`${path}: unknown skill identity ${id}`)
    }
  }
  for (const source of sourcePaths) {
    if (!source.startsWith('TanStack/table:')) continue
    const path = source.slice('TanStack/table:'.length).split('#')[0]
    if (/[*?{]/.test(path)) {
      if (!(await glob(path, { cwd: rootDir })).length)
        errors.push(`Source has no matches: ${source}`)
    } else {
      try {
        await access(resolve(rootDir, path))
      } catch {
        errors.push(`Missing source: ${source}`)
      }
    }
  }

  const visited = new Set()
  const visit = (id, ancestors = []) => {
    if (ancestors.includes(id)) {
      errors.push(
        `Cyclic skill prerequisites: ${[...ancestors, id].join(' -> ')}`,
      )
      return
    }
    if (visited.has(id)) return
    for (const requirement of dependencies.get(id) ?? []) {
      const target = requirement.includes('#')
        ? requirement
        : `${id.split('#')[0]}#${requirement}`
      if (!dependencies.has(target))
        errors.push(`${id}: missing prerequisite ${target}`)
      else visit(target, [...ancestors, id])
    }
    visited.add(id)
  }
  for (const id of dependencies.keys()) visit(id)
  return { errors, skillCount: tree.skills.length, referenceCount }
}
