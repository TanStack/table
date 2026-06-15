import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = fileURLToPath(
  new URL('../packages/table-core/', import.meta.url),
)
const distDir = join(packageRoot, 'dist')
const forbiddenTypeNames = ['Table_Internal', 'Column_Internal']

function walkDeclarationFiles(dir) {
  const files = []

  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    const stat = statSync(path)

    if (stat.isDirectory()) {
      files.push(...walkDeclarationFiles(path))
      continue
    }

    if (path.endsWith('.d.ts') || path.endsWith('.d.cts')) {
      files.push(path)
    }
  }

  return files
}

function removeExportedInterface(source, interfaceName) {
  let start = source.indexOf(`export interface ${interfaceName}`)

  if (start === -1) {
    start = source.indexOf(`interface ${interfaceName}`)
  }

  if (start === -1) {
    return source
  }

  const bodyStart = source.indexOf('{', start)

  if (bodyStart === -1) {
    throw new Error(`Could not find body for ${interfaceName}`)
  }

  let depth = 0

  for (let i = bodyStart; i < source.length; i++) {
    const char = source[i]

    if (char === '{') {
      depth++
    } else if (char === '}') {
      depth--

      if (depth === 0) {
        let end = i + 1

        while (source[end] === '\n' || source[end] === '\r') {
          end++
        }

        return source.slice(0, start) + source.slice(end)
      }
    }
  }

  throw new Error(`Could not find end of ${interfaceName}`)
}

function removeTypeAlias(source, typeName) {
  const aliasPattern = new RegExp(
    String.raw`\b(?:export\s+)?type\s+${typeName}\b`,
  )
  const match = aliasPattern.exec(source)

  if (!match) {
    return source
  }

  const start = match.index
  const end = source.indexOf(';', start)

  if (end === -1) {
    throw new Error(`Could not find end of ${typeName}`)
  }

  return source.slice(0, start) + source.slice(end + 1)
}

function getSpecifierName(specifier) {
  return specifier
    .replace(/^type\s+/, '')
    .split(/\s+as\s+/)[0]
    ?.trim()
}

function removeNamedSpecifiers(source, names) {
  return source
    .replace(
      /\b(import|export)(\s+type)?\s+\{([^}]+)\}\s+from\s+([^;\n]+);/g,
      (statement, kind, typeKeyword = '', specifiers, fromClause) => {
        const nextSpecifiers = specifiers
          .split(',')
          .map((specifier) => specifier.trim())
          .filter(Boolean)
          .filter((specifier) => {
            const importedName = getSpecifierName(specifier)
            return importedName && !names.includes(importedName)
          })

        if (!nextSpecifiers.length) {
          return ''
        }

        return `${kind}${typeKeyword} { ${nextSpecifiers.join(
          ', ',
        )} } from ${fromClause};`
      },
    )
    .replace(
      /\bexport(\s+type)?\s+\{([^}]+)\};/g,
      (statement, typeKeyword = '', specifiers) => {
        const nextSpecifiers = specifiers
          .split(',')
          .map((specifier) => specifier.trim())
          .filter(Boolean)
          .filter((specifier) => {
            const exportedName = getSpecifierName(specifier)
            return exportedName && !names.includes(exportedName)
          })

        if (!nextSpecifiers.length) {
          return ''
        }

        return `export${typeKeyword} { ${nextSpecifiers.join(', ')} };`
      },
    )
}

function rewriteDeclaration(source) {
  let next = source

  for (const typeName of forbiddenTypeNames) {
    next = removeExportedInterface(next, typeName)
  }

  next = removeTypeAlias(next, 'Table_InternalBroadenedKeys')
  next = removeNamedSpecifiers(next, forbiddenTypeNames)

  next = next.replaceAll('Table_Internal<', 'Table<')
  next = next.replaceAll('Column_Internal<', 'Column<')
  next = next.replaceAll('Table_Internal', 'Table')
  next = next.replaceAll('Column_Internal', 'Column')

  return next
}

const files = walkDeclarationFiles(distDir)

for (const file of files) {
  const source = readFileSync(file, 'utf8')
  const next = rewriteDeclaration(source)

  if (next !== source) {
    writeFileSync(file, next)
  }
}

const leaks = []

for (const file of files) {
  const source = readFileSync(file, 'utf8')

  for (const typeName of forbiddenTypeNames) {
    if (source.includes(typeName)) {
      leaks.push(`${file}: ${typeName}`)
    }
  }
}

if (leaks.length) {
  throw new Error(
    `Internal table-core types leaked into emitted declarations:\n${leaks.join(
      '\n',
    )}`,
  )
}
