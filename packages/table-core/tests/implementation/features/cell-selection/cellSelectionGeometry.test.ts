import { describe, expect, it } from 'vitest'
import {
  addCellSelectionBounds,
  expandCellSelectionBounds,
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

describe('expandCellSelectionBounds', () => {
  it('returns the rectangle unchanged with no merges or contained merges', () => {
    expect(expandCellSelectionBounds(bounds(0, 2, 0, 2), [])).toEqual(
      bounds(0, 2, 0, 2),
    )
    expect(
      expandCellSelectionBounds(bounds(0, 4, 0, 4), [bounds(1, 2, 1, 1)]),
    ).toEqual(bounds(0, 4, 0, 4))
    // A disjoint merge never grows the rectangle.
    expect(
      expandCellSelectionBounds(bounds(0, 1, 0, 1), [bounds(5, 7, 0, 0)]),
    ).toEqual(bounds(0, 1, 0, 1))
  })

  it('grows the rectangle to enclose a clipped merge', () => {
    // The rectangle clips the top row of a three-row merge.
    expect(
      expandCellSelectionBounds(bounds(0, 1, 0, 2), [bounds(1, 3, 0, 0)]),
    ).toEqual(bounds(0, 3, 0, 2))
  })

  it('cascades to a fixed point across chained merges', () => {
    // Enclosing the first merge grows the rectangle down to row 3, which
    // brings the second merge into contact, and enclosing that reaches the
    // third.
    const merges = [bounds(1, 3, 0, 0), bounds(3, 5, 2, 2), bounds(5, 7, 1, 1)]

    expect(expandCellSelectionBounds(bounds(1, 1, 0, 2), merges)).toEqual(
      bounds(1, 7, 0, 2),
    )
  })

  it('keeps merges all-or-nothing through the operations algebra', () => {
    // Include a block, then exclude a rectangle that clips a merge. With both
    // operations pre-expanded, the merge disappears entirely.
    const merges = [bounds(2, 4, 0, 0)]
    const include = expandCellSelectionBounds(bounds(0, 5, 0, 2), merges)
    const exclude = expandCellSelectionBounds(bounds(3, 3, 0, 0), merges)

    const selected = applyCellSelectionBoundsOperations([
      { ...include, operation: 'include' },
      { ...exclude, operation: 'exclude' },
    ])

    for (let row = 2; row <= 4; row++) {
      const inside = selected.some(
        (bound) =>
          row >= bound.minRowIndex &&
          row <= bound.maxRowIndex &&
          bound.minColumnIndex <= 0 &&
          bound.maxColumnIndex >= 0,
      )
      expect({ row, inside }).toEqual({ row, inside: false })
    }
  })
})
