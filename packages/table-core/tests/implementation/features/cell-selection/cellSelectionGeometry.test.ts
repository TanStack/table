import { describe, expect, it } from 'vitest'
import {
  addCellSelectionBounds,
  applyCellSelectionBoundsOperations,
  intersectCellSelectionBounds,
  mergeAdjacentCellSelectionBounds,
  subtractCellSelectionBounds,
} from '../../../../src/features/cell-selection/cellSelectionGeometry'
import type { CellSelectionBounds } from '../../../../src'

const bounds = (
  minRowIndex: number,
  maxRowIndex: number,
  minColumnIndex: number,
  maxColumnIndex: number,
): CellSelectionBounds => ({
  minRowIndex,
  maxRowIndex,
  minColumnIndex,
  maxColumnIndex,
})

describe('cell selection geometry', () => {
  it('intersects inclusive rectangles', () => {
    expect(
      intersectCellSelectionBounds(bounds(0, 2, 0, 2), bounds(1, 3, 2, 4)),
    ).toEqual(bounds(1, 2, 2, 2))
    expect(
      intersectCellSelectionBounds(bounds(0, 0, 0, 0), bounds(1, 1, 1, 1)),
    ).toBeUndefined()
  })

  it('cuts an interior rectangle into four disjoint pieces', () => {
    expect(
      subtractCellSelectionBounds(bounds(0, 4, 0, 4), bounds(1, 3, 1, 3)),
    ).toEqual([
      bounds(0, 0, 0, 4),
      bounds(4, 4, 0, 4),
      bounds(1, 3, 0, 0),
      bounds(1, 3, 4, 4),
    ])
  })

  it('leaves a rectangle unchanged when the exclusion does not overlap', () => {
    const source = bounds(0, 1, 0, 1)
    expect(subtractCellSelectionBounds(source, bounds(3, 4, 3, 4))).toEqual([
      source,
    ])
  })

  it('adds only the uncovered fragments of overlapping rectangles', () => {
    expect(
      addCellSelectionBounds([bounds(0, 1, 0, 1)], bounds(1, 2, 1, 2)),
    ).toEqual([bounds(0, 1, 0, 1), bounds(1, 1, 2, 2), bounds(2, 2, 1, 2)])
  })

  it('merges adjacent rectangles with identical spans', () => {
    expect(
      mergeAdjacentCellSelectionBounds([
        bounds(2, 2, 0, 2),
        bounds(0, 0, 0, 2),
        bounds(1, 1, 0, 2),
      ]),
    ).toEqual([bounds(0, 2, 0, 2)])
  })

  it('applies include and exclude operations in order', () => {
    expect(
      applyCellSelectionBoundsOperations([
        { ...bounds(0, 2, 0, 2), operation: 'include' },
        { ...bounds(1, 1, 1, 1), operation: 'exclude' },
        { ...bounds(1, 1, 1, 1), operation: 'include' },
      ]),
    ).toEqual([bounds(0, 2, 0, 2)])
  })

  it('ignores an exclusion before any matching inclusion', () => {
    expect(
      applyCellSelectionBoundsOperations([
        { ...bounds(0, 2, 0, 2), operation: 'exclude' },
        { ...bounds(1, 1, 1, 1), operation: 'include' },
      ]),
    ).toEqual([bounds(1, 1, 1, 1)])
  })
})
