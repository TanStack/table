import { bundleSizes } from './bundleSizes'

type BundleSizeGroup =
  'features' | 'rowModels' | 'filterFns' | 'sortFns' | 'aggregationFns'

export type BundleSizeSelection = Partial<
  Record<BundleSizeGroup, Iterable<string>>
>

interface BundleSizeEstimateData {
  core: number
  estimate: {
    coreMinified: number
    curve: ReadonlyArray<number>
    chunks: ReadonlyArray<number>
  } & Partial<Record<BundleSizeGroup, Record<string, ReadonlyArray<number>>>>
}

const BUNDLE_SIZE_GROUPS: ReadonlyArray<BundleSizeGroup> = [
  'features',
  'rowModels',
  'filterFns',
  'sortFns',
  'aggregationFns',
]

/**
 * Estimates the brotli size of table-core for a set of registered features,
 * row models, and built-in fns.
 *
 * Per-item sizes overlap because items share code, so summing them
 * overcounts. Instead, take the union of the declarations the items add
 * (shared code counts once), convert that minified size to brotli with the
 * measured size curve, and scale by how the selected items compress compared
 * to the curve's prediction for them. Unknown names (custom features or fns)
 * are ignored.
 */
export function estimateBundleSize(
  selection: BundleSizeSelection,
  data: BundleSizeEstimateData = bundleSizes,
): number {
  const { core } = data
  const { chunks, coreMinified, curve } = data.estimate
  const [coefficient = 0, exponent = 1] = curve

  function curveSize(minified: number) {
    return coefficient * minified ** exponent
  }

  const unionChunks = new Set<number>()
  let measured = 0
  let predicted = 0

  for (const group of BUNDLE_SIZE_GROUPS) {
    const items = data.estimate[group]
    const names = selection[group]
    if (!items || !names) continue

    for (const name of new Set(names)) {
      // [measured size, size the curve predicts, ...chunk indexes]
      const item = items[name]
      if (!item) continue

      measured += item[0] ?? 0
      predicted += item[1] ?? 0
      for (let i = 2; i < item.length; i++) {
        unionChunks.add(item[i]!)
      }
    }
  }

  if (!measured || !predicted) return core + measured

  let unionMinified = 0
  for (const chunk of unionChunks) {
    unionMinified += chunks[chunk] ?? 0
  }

  const compressionScale = measured / predicted
  return Math.round(
    core +
      (curveSize(coreMinified + unionMinified) - curveSize(coreMinified)) *
        compressionScale,
  )
}
