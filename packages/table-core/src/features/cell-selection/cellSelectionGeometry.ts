import type {
  CellSelectionBounds,
  CellSelectionRangeOperation,
} from './cellSelectionFeature.types'

export interface CellSelectionBoundsOperation extends CellSelectionBounds {
  operation: CellSelectionRangeOperation
}

function compareBounds(a: CellSelectionBounds, b: CellSelectionBounds) {
  return (
    a.minRowIndex - b.minRowIndex ||
    a.minColumnIndex - b.minColumnIndex ||
    a.maxRowIndex - b.maxRowIndex ||
    a.maxColumnIndex - b.maxColumnIndex
  )
}

export function intersectCellSelectionBounds(
  a: CellSelectionBounds,
  b: CellSelectionBounds,
): CellSelectionBounds | undefined {
  const intersection = {
    minRowIndex: Math.max(a.minRowIndex, b.minRowIndex),
    maxRowIndex: Math.min(a.maxRowIndex, b.maxRowIndex),
    minColumnIndex: Math.max(a.minColumnIndex, b.minColumnIndex),
    maxColumnIndex: Math.min(a.maxColumnIndex, b.maxColumnIndex),
  }

  return intersection.minRowIndex <= intersection.maxRowIndex &&
    intersection.minColumnIndex <= intersection.maxColumnIndex
    ? intersection
    : undefined
}

export function subtractCellSelectionBounds(
  source: CellSelectionBounds,
  excluded: CellSelectionBounds,
): Array<CellSelectionBounds> {
  const intersection = intersectCellSelectionBounds(source, excluded)
  if (!intersection) return [source]

  const result: Array<CellSelectionBounds> = []

  if (source.minRowIndex < intersection.minRowIndex) {
    result.push({
      ...source,
      maxRowIndex: intersection.minRowIndex - 1,
    })
  }
  if (intersection.maxRowIndex < source.maxRowIndex) {
    result.push({
      ...source,
      minRowIndex: intersection.maxRowIndex + 1,
    })
  }
  if (source.minColumnIndex < intersection.minColumnIndex) {
    result.push({
      minRowIndex: intersection.minRowIndex,
      maxRowIndex: intersection.maxRowIndex,
      minColumnIndex: source.minColumnIndex,
      maxColumnIndex: intersection.minColumnIndex - 1,
    })
  }
  if (intersection.maxColumnIndex < source.maxColumnIndex) {
    result.push({
      minRowIndex: intersection.minRowIndex,
      maxRowIndex: intersection.maxRowIndex,
      minColumnIndex: intersection.maxColumnIndex + 1,
      maxColumnIndex: source.maxColumnIndex,
    })
  }

  return result
}

function mergePair(
  a: CellSelectionBounds,
  b: CellSelectionBounds,
): CellSelectionBounds | undefined {
  if (
    a.minRowIndex === b.minRowIndex &&
    a.maxRowIndex === b.maxRowIndex &&
    (a.maxColumnIndex + 1 === b.minColumnIndex ||
      b.maxColumnIndex + 1 === a.minColumnIndex)
  ) {
    return {
      minRowIndex: a.minRowIndex,
      maxRowIndex: a.maxRowIndex,
      minColumnIndex: Math.min(a.minColumnIndex, b.minColumnIndex),
      maxColumnIndex: Math.max(a.maxColumnIndex, b.maxColumnIndex),
    }
  }

  if (
    a.minColumnIndex === b.minColumnIndex &&
    a.maxColumnIndex === b.maxColumnIndex &&
    (a.maxRowIndex + 1 === b.minRowIndex || b.maxRowIndex + 1 === a.minRowIndex)
  ) {
    return {
      minRowIndex: Math.min(a.minRowIndex, b.minRowIndex),
      maxRowIndex: Math.max(a.maxRowIndex, b.maxRowIndex),
      minColumnIndex: a.minColumnIndex,
      maxColumnIndex: a.maxColumnIndex,
    }
  }

  return undefined
}

export function mergeAdjacentCellSelectionBounds(
  input: ReadonlyArray<CellSelectionBounds>,
): Array<CellSelectionBounds> {
  const result = input.slice()

  for (let i = 0; i < result.length; i++) {
    for (let j = i + 1; j < result.length; j++) {
      const merged = mergePair(result[i]!, result[j]!)
      if (!merged) continue

      result.splice(j, 1)
      result[i] = merged
      i = -1
      break
    }
  }

  return result.sort(compareBounds)
}

export function addCellSelectionBounds(
  selected: ReadonlyArray<CellSelectionBounds>,
  included: CellSelectionBounds,
): Array<CellSelectionBounds> {
  let fragments = [included]

  for (const existing of selected) {
    fragments = fragments.flatMap((fragment) =>
      subtractCellSelectionBounds(fragment, existing),
    )
    if (!fragments.length) return selected.slice()
  }

  return mergeAdjacentCellSelectionBounds([...selected, ...fragments])
}

/**
 * Grows a rectangle until it fully contains every merged-cell rectangle it
 * touches.
 *
 * Merged cells make plain rectangles insufficient: a selection that clips part
 * of a merge must cover the whole merge, and covering it can bring the
 * rectangle into contact with further merges, so the expansion runs to a fixed
 * point. The loop is bounded by the merge count, since each pass that changes
 * the rectangle consumes at least one merge.
 */
export function expandCellSelectionBounds(
  bounds: CellSelectionBounds,
  merges: ReadonlyArray<CellSelectionBounds>,
): CellSelectionBounds {
  let expanded = bounds
  let changed = true

  while (changed) {
    changed = false

    for (const merge of merges) {
      if (!intersectCellSelectionBounds(expanded, merge)) continue

      const union = {
        minRowIndex: Math.min(expanded.minRowIndex, merge.minRowIndex),
        maxRowIndex: Math.max(expanded.maxRowIndex, merge.maxRowIndex),
        minColumnIndex: Math.min(expanded.minColumnIndex, merge.minColumnIndex),
        maxColumnIndex: Math.max(expanded.maxColumnIndex, merge.maxColumnIndex),
      }

      if (
        union.minRowIndex !== expanded.minRowIndex ||
        union.maxRowIndex !== expanded.maxRowIndex ||
        union.minColumnIndex !== expanded.minColumnIndex ||
        union.maxColumnIndex !== expanded.maxColumnIndex
      ) {
        expanded = union
        changed = true
      }
    }
  }

  return expanded
}

export function applyCellSelectionBoundsOperations(
  operations: ReadonlyArray<CellSelectionBoundsOperation>,
): Array<CellSelectionBounds> {
  let selected: Array<CellSelectionBounds> = []

  for (const operation of operations) {
    const bounds: CellSelectionBounds = {
      minRowIndex: operation.minRowIndex,
      maxRowIndex: operation.maxRowIndex,
      minColumnIndex: operation.minColumnIndex,
      maxColumnIndex: operation.maxColumnIndex,
    }
    if (operation.operation === 'exclude') {
      selected = mergeAdjacentCellSelectionBounds(
        selected.flatMap((bound) => subtractCellSelectionBounds(bound, bounds)),
      )
    } else {
      selected = addCellSelectionBounds(selected, bounds)
    }
  }

  return selected.sort(compareBounds)
}
