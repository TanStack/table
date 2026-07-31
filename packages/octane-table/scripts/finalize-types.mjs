import {
  copyFileSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { join, resolve } from 'node:path'

const packageRoot = resolve(import.meta.dirname, '..')
const sourceRoot = join(packageRoot, 'src')
const typesRoot = join(packageRoot, 'dist/types')

for (const [source, target] of [
  ['Subscribe.tsrx.d.ts', 'Subscribe.d.ts'],
  ['createTableHook.tsrx.d.ts', 'createTableHook.d.ts'],
  ['useTable.tsrx.d.ts', 'useTable.d.ts'],
]) {
  copyFileSync(join(sourceRoot, source), join(typesRoot, target))
}

const indexPath = join(typesRoot, 'index.d.ts')
writeFileSync(
  indexPath,
  readFileSync(indexPath, 'utf8').replaceAll(
    /(Subscribe|createTableHook|useTable)\.tsrx/g,
    '$1',
  ),
)

for (const file of readdirSync(typesRoot)) {
  if (!file.endsWith('.d.ts')) continue
  const source = readFileSync(join(typesRoot, file), 'utf8')
  if (/(?:from\s+|import\s*\()['"][^'"]*\.tsrx['"]/.test(source)) {
    throw new Error(`Declaration output retained a TSRX import: ${file}`)
  }
}

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

const clientRoot = join(packageRoot, 'dist/client')
const serverRoot = join(packageRoot, 'dist/server')
const runtimeFiles = [...walk(clientRoot), ...walk(serverRoot)]

for (const file of runtimeFiles) {
  if (file.endsWith('.map')) {
    throw new Error(`Build emitted a source map: ${file}`)
  }
  if (!file.endsWith('.js')) continue

  const source = readFileSync(file, 'utf8')
  if (/(?:from\s+|import\s*\()['"][^'"]*\.tsrx['"]/.test(source)) {
    throw new Error(`Runtime output retained a TSRX import: ${file}`)
  }
  if (
    file.startsWith(clientRoot) &&
    /from\s+['"]octane\/server['"]/.test(source)
  ) {
    throw new Error(`Client output imported the Octane server runtime: ${file}`)
  }
  if (file.startsWith(serverRoot) && /from\s+['"]octane['"]/.test(source)) {
    throw new Error(`Server output imported the Octane client runtime: ${file}`)
  }
}
