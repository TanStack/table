// @ts-check

/**
 * Measures what each table-core feature, row model, and built-in row model
 * function adds to a bundle, then writes the size table the devtools Features
 * panel displays.
 *
 * Sizes come from the same pipeline as `pnpm size` (size-limit's small-lib
 * preset: rolldown with tree-shaking and minification, then brotli), so the
 * panel and the size-limit report agree.
 *
 * - `core`: `constructTable` with the core features it always installs.
 * - `coreFeatures`: `core` split across the core features in proportion to
 *   each one's standalone size. Core features always ship together, so this
 *   is an allocation, not a removable cost.
 * - `features`: the cost of registering a stock feature on top of `core`.
 * - `rowModels`: the cost of a row model factory on top of `core` and the
 *   feature that owns it.
 * - `filterFns` / `sortFns` / `aggregationFns`: the cost of one built-in
 *   function on top of `core`, its feature, and its row model.
 *
 * Features share code (several column features use the column pinning utils,
 * for example), so these costs overlap and do not add up to a bundle size.
 * The `estimate` section lets the devtools combine them without double
 * counting; see `packages/table-devtools/src/estimateBundleSize.ts`. The
 * script also measures random feature combinations: some fit the estimate's
 * minified-to-brotli curve, and the rest are written as a test fixture that
 * checks the estimate against real bundles.
 *
 * Usage: build table-core first, then run `pnpm size:devtools`.
 */

import { existsSync } from 'node:fs'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import sizeLimit from 'size-limit'
import presetSmallLib from '@size-limit/preset-small-lib'
import * as prettier from 'prettier'

import { rootDir } from './config.js'

const coreDir = resolve(rootDir, 'packages/table-core')
const coreEntry = resolve(coreDir, 'dist/index.js')
const devtoolsDir = resolve(rootDir, 'packages/table-devtools')
const outputPath = resolve(devtoolsDir, 'src/bundleSizes.ts')
const validationPath = resolve(
  devtoolsDir,
  'tests/fixtures/bundleSizeValidation.json',
)

if (!existsSync(coreEntry)) {
  console.error(
    `Missing ${coreEntry}. Build table-core first: pnpm nx build @tanstack/table-core`,
  )
  process.exit(1)
}

// Use the rolldown that size-limit bundles with, so declaration splitting
// sees exactly the tree-shaking result that size-limit measures
const require = createRequire(import.meta.url)
const presetRequire = createRequire(
  require.resolve('@size-limit/preset-small-lib/package.json'),
)
const rolldownRequire = createRequire(
  presetRequire.resolve('@size-limit/rolldown/package.json'),
)
const { build } = await import(rolldownRequire.resolve('rolldown'))
const { minifySync, parseSync } = await import(
  rolldownRequire.resolve('rolldown/utils')
)

const tableCore = await import(coreEntry)
const { version } = JSON.parse(
  await readFile(resolve(coreDir, 'package.json'), 'utf8'),
)

/** Row model slot -> [factory export, features it needs] */
/** @type {Record<string, [string, Array<string>]>} */
const ROW_MODELS = {
  coreRowModel: ['createCoreRowModel', []],
  filteredRowModel: ['createFilteredRowModel', ['columnFilteringFeature']],
  groupedRowModel: ['createGroupedRowModel', ['columnGroupingFeature']],
  sortedRowModel: ['createSortedRowModel', ['rowSortingFeature']],
  expandedRowModel: ['createExpandedRowModel', ['rowExpandingFeature']],
  paginatedRowModel: ['createPaginatedRowModel', ['rowPaginationFeature']],
  facetedRowModel: ['createFacetedRowModel', ['columnFacetingFeature']],
  facetedMinMaxValues: ['createFacetedMinMaxValues', ['columnFacetingFeature']],
  facetedUniqueValues: ['createFacetedUniqueValues', ['columnFacetingFeature']],
}

/** Fn registry slot -> [export prefix, exports a function needs to run, built-in registry] */
/** @type {Record<string, [string, Array<string>, Record<string, unknown>]>} */
const FN_KINDS = {
  filterFns: [
    'filterFn_',
    ['columnFilteringFeature', 'createFilteredRowModel'],
    tableCore.filterFns,
  ],
  sortFns: [
    'sortFn_',
    ['rowSortingFeature', 'createSortedRowModel'],
    tableCore.sortFns,
  ],
  aggregationFns: [
    'aggregationFn_',
    ['rowAggregationFeature'],
    tableCore.aggregationFns,
  ],
}

const coreFeatureNames = Object.keys(tableCore.coreFeatures)
const stockFeatureNames = Object.keys(tableCore.stockFeatures).sort()

/**
 * Everything the devtools can find on a table. `exports` is what the item
 * adds and `base` is what it needs to be useful, so each item is measured
 * on top of its base: a row model on top of its feature, a fn on top of its
 * feature and row model.
 *
 * @typedef {{ group: string, name: string, exports: Array<string>, base: Array<string> }} Item
 * @type {Array<Item>}
 */
const items = [
  ...stockFeatureNames.map((name) => ({
    group: 'features',
    name,
    exports: [name],
    base: [],
  })),
  ...Object.entries(ROW_MODELS).map(([name, [factory, owners]]) => ({
    group: 'rowModels',
    name,
    exports: [factory],
    base: owners,
  })),
  ...Object.entries(FN_KINDS).flatMap(([group, [prefix, base, registry]]) =>
    Object.keys(registry)
      .sort()
      .map((name) => ({ group, name, exports: [`${prefix}${name}`], base })),
  ),
]

/** Items that provide an export, for pulling in an item's base */
const itemsByExport = new Map(
  items
    .filter((item) => item.group === 'features' || item.group === 'rowModels')
    .map((item) => [item.exports[0], item]),
)

/** @param {Iterable<string>} values */
function sum(values) {
  let total = 0
  for (const value of values) total += Number(value)
  return total
}

/** @param {Array<string>} exports */
function importKey(exports) {
  return [...new Set(['constructTable', ...exports])].sort().join(', ')
}

// Brotli sizes, measured by size-limit itself

/** @type {Map<string, number>} */
const brotliSizes = new Map()

/** @param {Array<string>} keys import lists, or a bare file path for the whole package */
async function measureBrotli(keys) {
  const pending = [...new Set(keys)].filter((key) => !brotliSizes.has(key))
  const BATCH_SIZE = 8
  for (let i = 0; i < pending.length; i += BATCH_SIZE) {
    const batch = pending.slice(i, i + BATCH_SIZE)
    const results = await sizeLimit([presetSmallLib], {
      checks: batch.map((key) =>
        key === coreEntry
          ? { files: [coreEntry] }
          : { files: [], import: { [coreEntry]: `{ ${key} }` } },
      ),
    })
    batch.forEach((key, index) => {
      const size = results[index]?.size
      if (typeof size !== 'number') {
        throw new Error(`size-limit returned no size for ${key}`)
      }
      brotliSizes.set(key, size)
    })
  }
}

/** @param {Array<string>} exports */
function brotliOf(exports) {
  const size = brotliSizes.get(importKey(exports))
  if (size === undefined) throw new Error(`Not measured: ${importKey(exports)}`)
  return size
}

/**
 * Brotli output is not additive, so code that is already in the base can
 * measure a few bytes negative. Clamp those to zero.
 *
 * @param {Array<string>} withExports
 * @param {Array<string>} baseExports
 */
function marginal(withExports, baseExports) {
  return Math.max(0, brotliOf(withExports) - brotliOf(baseExports))
}

// Declarations, for combining items without double counting shared code

const tempDir = await mkdtemp(join(tmpdir(), 'table-bundle-sizes-'))
let tempFileCount = 0

/**
 * Bundles `exports` like size-limit does, minus minification, and returns
 * the minified size of every top-level declaration keyed by module + name.
 *
 * @param {Array<string>} exports
 * @returns {Promise<Map<string, number>>}
 */
async function measureDeclarations(exports) {
  const imports = importKey(exports)
  const input = join(tempDir, `entry-${tempFileCount++}.js`)
  await writeFile(
    input,
    `import { ${imports} } from ${JSON.stringify(coreEntry)}\nconsole.log(${imports})\n`,
  )
  const { output } = await build({
    input,
    write: false,
    treeshake: true,
    transform: { define: { 'process.env.NODE_ENV': '"production"' } },
    output: { comments: false },
    logLevel: 'silent',
  })
  const code = output[0].code
  const regions = [...code.matchAll(/^\/\/#region (.*)$/gm)].map(
    (match) => /** @type {const} */ ([match.index, match[1]]),
  )

  /** @type {Map<string, number>} */
  const declarations = new Map()
  for (const node of parseSync('bundle.js', code).program.body) {
    if (
      node.type === 'ImportDeclaration' ||
      node.type === 'ExportNamedDeclaration'
    ) {
      continue
    }
    const source = code.slice(node.start, node.end)
    if (source.startsWith('console.log(')) continue

    const region = regions.findLast(([index]) => index <= node.start)?.[1] ?? ''
    const moduleId = region.replace(/^.*?(?:packages|node_modules)\//, '')
    // Rolldown suffixes names that collide in one bundle (`toString$1`), and
    // collisions differ between bundles, so drop the suffix from the key
    const name = (
      node.type === 'FunctionDeclaration' || node.type === 'ClassDeclaration'
        ? node.id?.name
        : node.type === 'VariableDeclaration'
          ? node.declarations
              .map((d) => (d.id.type === 'Identifier' ? d.id.name : '?'))
              .join(',')
          : source.slice(0, 60)
    )?.replace(/\$\d+\b/g, '')
    declarations.set(
      `${moduleId}#${name}`,
      minifySync('declaration.js', source).code.length,
    )
  }
  return declarations
}

/**
 * Deterministic pseudo-random combinations of items, so regenerating with an
 * unchanged table-core produces an unchanged file.
 *
 * @param {number} count
 * @param {number} seed
 * @returns {Array<Array<Item>>}
 */
function sampleCombinations(count, seed) {
  let state = seed
  function random() {
    // mulberry32
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return Array.from({ length: count }, (_, i) => {
    const probability = 0.05 + (0.9 * i) / Math.max(1, count - 1)
    return items.filter(() => random() < probability)
  })
}

/**
 * Real tables register an item's base along with it, so a combination
 * includes the features and row models its fns and row models need.
 *
 * @param {Array<Item>} combination
 * @returns {Array<Item>}
 */
function withBases(combination) {
  const result = new Set(combination)
  for (const item of combination) {
    for (const name of item.base) {
      const baseItem = itemsByExport.get(name)
      if (baseItem) result.add(baseItem)
    }
  }
  return [...result]
}

/** @param {Array<Item>} combination */
function combinationExports(combination) {
  return combination.flatMap((item) => item.exports)
}

const fitCombinations = sampleCombinations(16, 1).map(withBases)
const validationCombinations = sampleCombinations(12, 2).map(withBases)

await measureBrotli([
  coreEntry,
  importKey([]),
  ...coreFeatureNames,
  ...items.flatMap((item) => [
    importKey(item.base),
    importKey([...item.base, ...item.exports]),
  ]),
  ...[...fitCombinations, ...validationCombinations].map((combination) =>
    importKey(combinationExports(combination)),
  ),
])

const core = brotliOf([])

/** @type {Map<string, Map<string, number>>} */
const declarationCache = new Map()

/** @param {Array<string>} exports */
async function declarationsOf(exports) {
  const key = importKey(exports)
  let declarations = declarationCache.get(key)
  if (!declarations) {
    declarations = await measureDeclarations(exports)
    declarationCache.set(key, declarations)
  }
  return declarations
}

const coreDeclarations = await declarationsOf([])
const coreMinified = sum(coreDeclarations.values())

/** @type {Map<string, number>} declaration key -> chunk index */
const chunkIndexes = new Map()
/** @type {Array<number>} */
const chunks = []
/** @type {Array<[number, number]>} [total minified, brotli] per bundle */
const curvePoints = [[coreMinified, core]]
/**
 * @type {Array<{ item: Item, size: number, baseMinified: number, minified: number, chunks: Array<number> }>}
 */
const itemMeasurements = []

for (const item of items) {
  const all = [...item.base, ...item.exports]
  const baseDeclarations = await declarationsOf(item.base)
  const declarations = await declarationsOf(all)
  /** @type {Array<number>} */
  const itemChunks = []
  for (const [key, minified] of declarations) {
    if (coreDeclarations.has(key) || baseDeclarations.has(key)) continue
    let index = chunkIndexes.get(key)
    if (index === undefined) {
      index = chunks.length
      chunkIndexes.set(key, index)
      chunks.push(minified)
    }
    itemChunks.push(index)
  }
  curvePoints.push([sum(declarations.values()), brotliOf(all)])
  itemMeasurements.push({
    item,
    size: marginal(all, item.base),
    baseMinified: sum(baseDeclarations.values()),
    minified: sum(declarations.values()),
    chunks: itemChunks.sort((a, b) => a - b),
  })
}

for (const combination of fitCombinations) {
  const exports = combinationExports(combination)
  const declarations = await declarationsOf(exports)
  curvePoints.push([sum(declarations.values()), brotliOf(exports)])
}
await rm(tempDir, { recursive: true, force: true })

// The estimate converts minified bytes to brotli bytes with a power curve,
// a * minified^b. Pick b to best estimate real combinations of items, then a
// by least squares in log space so curve sizes read as brotli bytes.

/**
 * Mirrors `estimateBundleSize` in the devtools.
 *
 * @param {Array<Item>} combination
 * @param {(minified: number) => number} curveSize
 */
function estimateCombination(combination, curveSize) {
  /** @type {Set<number>} */
  const union = new Set()
  let measured = 0
  let predicted = 0
  for (const item of combination) {
    const measurement = itemMeasurements.find((m) => m.item === item)
    if (!measurement) continue
    measured += measurement.size
    predicted +=
      curveSize(measurement.minified) - curveSize(measurement.baseMinified)
    for (const chunk of measurement.chunks) union.add(chunk)
  }
  if (!measured || !predicted) return core + measured
  const unionMinified = sum([...union].map((chunk) => chunks[chunk] ?? 0))
  return (
    core +
    (curveSize(coreMinified + unionMinified) - curveSize(coreMinified)) *
      (measured / predicted)
  )
}

/** @param {Array<Array<Item>>} combinations @param {(minified: number) => number} curveSize */
function relativeErrors(combinations, curveSize) {
  return combinations.map((combination) => {
    const actual = brotliOf(combinationExports(combination))
    return estimateCombination(combination, curveSize) / actual - 1
  })
}

const logMinified = curvePoints.map(([minified]) => Math.log(minified))
const logBrotli = curvePoints.map(([, brotli]) => Math.log(brotli))
let exponent = 1
let bestError = Infinity
for (let candidate = 0.5; candidate <= 1.2; candidate += 0.005) {
  const error = sum(
    relativeErrors(fitCombinations, (minified) => minified ** candidate).map(
      (e) => e * e,
    ),
  )
  if (error < bestError) {
    bestError = error
    exponent = Number(candidate.toFixed(3))
  }
}
const coefficient = Math.exp(
  sum(logBrotli.map((y, i) => y - exponent * (logMinified[i] ?? 0))) /
    logBrotli.length,
)

/** @param {number} minified */
function curveSize(minified) {
  return coefficient * minified ** exponent
}

const validationErrors = relativeErrors(validationCombinations, curveSize)

// Split `core` across the core features by standalone size
const standaloneCoreSizes = coreFeatureNames.map(
  (name) => brotliSizes.get(name) ?? 0,
)
const standaloneCoreTotal = sum(standaloneCoreSizes)
const coreFeatures = Object.fromEntries(
  coreFeatureNames.map((name, index) => [
    name,
    Math.round(
      (core * (standaloneCoreSizes[index] ?? 0)) / standaloneCoreTotal,
    ),
  ]),
)

/** @type {Record<string, Record<string, number>>} */
const sizesByGroup = {}
/** @type {Record<string, Record<string, Array<number>>>} */
const estimate = {}
for (const {
  item,
  size,
  baseMinified,
  minified,
  chunks: itemChunks,
} of itemMeasurements) {
  ;(sizesByGroup[item.group] ??= {})[item.name] = size
  // What the curve predicts this item costs on top of its base. The ratio
  // of measured to predicted sizes calibrates the curve for a selection.
  const predicted = Math.round(curveSize(minified) - curveSize(baseMinified))
  ;(estimate[item.group] ??= {})[item.name] = [size, predicted, ...itemChunks]
}

const data = {
  tableCoreVersion: version,
  package: brotliSizes.get(coreEntry),
  core,
  coreFeatures,
  ...sizesByGroup,
  estimate: {
    coreMinified,
    curve: [Number(coefficient.toFixed(4)), Number(exponent.toFixed(4))],
    chunks,
    ...estimate,
  },
}

const source = `// Generated by scripts/generate-bundle-sizes.mjs. Do not edit by hand;
// rebuild table-core and run \`pnpm size:devtools\` to refresh.
//
// Sizes are bytes after minification and brotli compression, the metric
// \`pnpm size\` (size-limit) reports. \`coreFeatures\` splits \`core\` by each
// core feature's standalone size. Other entries are the cost of adding that
// item: features on top of \`core\`, row models on top of their feature, and
// fns on top of their feature and row model.
//
// \`estimate\` combines items without double counting shared code. Each item
// is [measured size, size the curve predicts, ...indexes into chunks], where
// a chunk is the minified size of one top-level declaration the item adds.

export const bundleSizes = ${JSON.stringify(data)}
`

const validation = validationCombinations.map((combination) => {
  /** @type {Record<string, Array<string>>} */
  const selection = {}
  for (const item of combination) {
    ;(selection[item.group] ??= []).push(item.name)
  }
  return { selection, actual: brotliOf(combinationExports(combination)) }
})

const prettierConfig = await prettier.resolveConfig(outputPath)
await writeFile(
  outputPath,
  await prettier.format(source, { ...prettierConfig, filepath: outputPath }),
)
await writeFile(
  validationPath,
  await prettier.format(JSON.stringify(validation), {
    ...prettierConfig,
    filepath: validationPath,
  }),
)

console.log(
  `table-core ${version}: package ${data.package} B, core ${core} B, ${chunks.length} chunks, curve ${data.estimate.curve.join(' ')}`,
)
console.log(
  `Estimate error on ${validationErrors.length} held-out combinations: worst ${(
    Math.max(...validationErrors.map(Math.abs)) * 100
  ).toFixed(1)}%`,
)
console.log(`Wrote ${outputPath}`)
console.log(`Wrote ${validationPath}`)
