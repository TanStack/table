import { describe, expect, it } from 'vitest'
import {
  cellSelectionFeature,
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  constructTable,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import type { ColumnDef, Table } from '../../../../src'

const features = testFeatures({
  cellSelectionFeature,
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns,
  sortFns,
})

interface TestRow {
  id: string
  a: number
  b: number
  c: number
}

// `a` descends while row order ascends, so sorting on `a` reverses the rows
function makeData(count = 6): Array<TestRow> {
  return Array.from({ length: count }, (_, index) => ({
    id: `r${index}`,
    a: (count - index) * 10,
    b: index * 10 + 1,
    c: index * 10 + 2,
  }))
}

const columns: Array<ColumnDef<typeof features, TestRow>> = [
  { id: 'a', accessorKey: 'a' },
  { id: 'b', accessorKey: 'b' },
  { id: 'c', accessorKey: 'c' },
]

function makeTable(
  overrides: Record<string, unknown> = {},
): Table<typeof features, TestRow> {
  return constructTable<typeof features, TestRow>({
    features,
    data: makeData(),
    columns,
    getRowId: (row) => row.id,
    renderFallbackValue: '',
    ...overrides,
  })
}

function rangeOf(
  anchorRowId: string,
  anchorColumnId: string,
  focusRowId: string,
  focusColumnId: string,
) {
  return { anchorRowId, anchorColumnId, focusRowId, focusColumnId }
}

describe('cell selection ranges', () => {
  describe('bounds resolution', () => {
    it('normalizes corners into inclusive index rectangles', () => {
      const table = makeTable()
      table.selectCellRange(rangeOf('r3', 'c', 'r1', 'a'))

      expect(table.getCellSelectionBounds()).toEqual([
        {
          minRowIndex: 1,
          maxRowIndex: 3,
          minColumnIndex: 0,
          maxColumnIndex: 2,
        },
      ])
    })

    it('resolves multiple disjoint rectangles', () => {
      const table = makeTable()
      table.selectCellRange(rangeOf('r0', 'a', 'r0', 'a'))
      table.selectCellRange(rangeOf('r4', 'c', 'r5', 'c'), { additive: true })

      expect(table.getCellSelectionBounds()).toHaveLength(2)
      expect(table.getSelectedCellCount()).toBe(3)
      expect(table.getSelectedCellIds()).toEqual(['r0_a', 'r4_c', 'r5_c'])
    })

    it('deduplicates overlapping rectangles in the row/column rollups', () => {
      const table = makeTable()
      table.selectCellRange(rangeOf('r0', 'a', 'r2', 'b'))
      table.selectCellRange(rangeOf('r1', 'b', 'r3', 'c'), { additive: true })

      expect(table.getCellSelectionRowIds()).toEqual(['r0', 'r1', 'r2', 'r3'])
      expect(table.getCellSelectionColumnIds()).toEqual(['a', 'b', 'c'])
    })

    it('deduplicates overlapping rectangles in cell ids and count', () => {
      const table = makeTable()
      table.selectCellRange(rangeOf('r0', 'a', 'r1', 'b'))
      table.selectCellRange(rangeOf('r1', 'b', 'r2', 'c'), { additive: true })

      expect(table.getSelectedCellIds()).toEqual([
        'r0_a',
        'r0_b',
        'r1_a',
        'r1_b',
        'r1_c',
        'r2_b',
        'r2_c',
      ])
      expect(table.getSelectedCellCount()).toBe(7)
    })

    it('is memoized between reads', () => {
      const table = makeTable()
      table.selectCellRange(rangeOf('r0', 'a', 'r2', 'b'))

      expect(table.getCellSelectionBounds()).toBe(
        table.getCellSelectionBounds(),
      )
    })

    it('recomputes when the selection changes', () => {
      const table = makeTable()
      table.selectCellRange(rangeOf('r0', 'a', 'r2', 'b'))
      const first = table.getCellSelectionBounds()

      table.selectCellRange(rangeOf('r0', 'a', 'r3', 'b'))

      expect(table.getCellSelectionBounds()).not.toBe(first)
      expect(table.getCellSelectionBounds()[0]!.maxRowIndex).toBe(3)
    })
  })

  describe('sorting', () => {
    it('keeps corners pinned to their cells and recomputes contents', () => {
      const table = makeTable()
      // rows r0..r2 in natural order
      table.selectCellRange(rangeOf('r0', 'a', 'r2', 'a'))
      expect(table.getCellSelectionRowIds()).toEqual(['r0', 'r1', 'r2'])

      // sorting ascending on `a` reverses display order to r5..r0, so the same
      // two corners bracket the same three rows in the opposite direction
      table.setSorting([{ id: 'a', desc: false }])

      expect(table.getCellSelectionRowIds()).toEqual(['r2', 'r1', 'r0'])
      // the stored corners are untouched by the reorder
      expect(table.atoms.cellSelection.get()).toEqual([
        rangeOf('r0', 'a', 'r2', 'a'),
      ])
    })

    it('spans the reversed interval after sorting', () => {
      const table = makeTable()
      table.setSorting([{ id: 'a', desc: false }])

      // in sorted order the rows run r5, r4, r3, r2, r1, r0
      table.selectCellRange(rangeOf('r5', 'a', 'r3', 'a'))
      expect(table.getCellSelectionRowIds()).toEqual(['r5', 'r4', 'r3'])

      table.setSorting([])

      // back in natural order the same two corners bracket r3..r5
      expect(table.getCellSelectionRowIds()).toEqual(['r3', 'r4', 'r5'])
    })
  })

  describe('filtering', () => {
    it('goes inert when a corner is filtered out, then returns', () => {
      const table = makeTable()
      table.selectCellRange(rangeOf('r0', 'a', 'r1', 'b'))
      expect(table.getSelectedCellCount()).toBe(4)

      // r0 has a === 60, so an a <= 50 range filter removes the anchor row
      table.setColumnFilters([{ id: 'a', value: [0, 50] }])

      expect(table.getCellSelectionBounds()).toEqual([])
      expect(table.getSelectedCellCount()).toBe(0)
      // the range survives in state rather than being pruned
      expect(table.atoms.cellSelection.get()).toEqual([
        rangeOf('r0', 'a', 'r1', 'b'),
      ])

      table.setColumnFilters([])

      expect(table.getSelectedCellCount()).toBe(4)
    })

    it('keeps a range whose corners both survive the filter', () => {
      const table = makeTable()
      table.selectCellRange(rangeOf('r1', 'a', 'r2', 'a'))

      // keep everything with a <= 50, which drops only r0
      table.setColumnFilters([{ id: 'a', value: [0, 50] }])

      expect(table.getCellSelectionRowIds()).toEqual(['r1', 'r2'])
    })
  })

  describe('pagination', () => {
    it('resolves against pre-pagination indexes so ranges span pages', () => {
      const table = makeTable({
        initialState: { pagination: { pageIndex: 0, pageSize: 2 } },
      })

      // r0 is on page 1 and r4 is on page 3
      table.selectCellRange(rangeOf('r0', 'a', 'r4', 'a'))

      expect(table.getCellSelectionRowIds()).toEqual([
        'r0',
        'r1',
        'r2',
        'r3',
        'r4',
      ])
      expect(table.getSelectedCellCount()).toBe(5)
    })

    it('keeps the same selection while paging', () => {
      const table = makeTable({
        initialState: { pagination: { pageIndex: 0, pageSize: 2 } },
      })
      table.selectCellRange(rangeOf('r0', 'a', 'r4', 'a'))
      const before = table.getSelectedCellIds()

      table.setPageIndex(2)

      expect(table.getSelectedCellIds()).toEqual(before)
    })
  })

  describe('column visibility and order', () => {
    it('drops a range whose corner column is hidden, then restores it', () => {
      const table = makeTable()
      table.selectCellRange(rangeOf('r0', 'a', 'r1', 'c'))
      expect(table.getSelectedCellCount()).toBe(6)

      table.setColumnVisibility({ c: false })

      expect(table.getCellSelectionBounds()).toEqual([])

      table.setColumnVisibility({})

      expect(table.getSelectedCellCount()).toBe(6)
    })

    it('narrows the rectangle when an interior column is hidden', () => {
      const table = makeTable()
      table.selectCellRange(rangeOf('r0', 'a', 'r1', 'c'))

      table.setColumnVisibility({ b: false })

      expect(table.getCellSelectionColumnIds()).toEqual(['a', 'c'])
      expect(table.getSelectedCellCount()).toBe(4)
    })

    it('indexes columns in render order, not definition order, when pinned', () => {
      const table = makeTable()

      // pinning 'c' to the start makes the render order c, a, b, which is what
      // row.getVisibleCells() emits; indexing the unpinned list here would make
      // a dragged rectangle visually non-contiguous
      table.setColumnPinning({ start: ['c'], end: [] })

      expect(table.getCellSelectionColumnIndexes()).toEqual({
        c: 0,
        a: 1,
        b: 2,
      })

      // a range across the two leftmost rendered columns is c and a
      table.selectCellRange(rangeOf('r0', 'c', 'r0', 'a'))
      expect(table.getCellSelectionColumnIds()).toEqual(['c', 'a'])
      expect(table.getSelectedCellIds()).toEqual(['r0_c', 'r0_a'])
    })

    it('keeps a selection contiguous on screen when a column is pinned', () => {
      const table = makeTable()

      // select the two rightmost columns in natural order
      table.selectCellRange(rangeOf('r0', 'b', 'r0', 'c'))
      expect(table.getCellSelectionColumnIds()).toEqual(['b', 'c'])

      // pinning 'a' to the end reorders to b, c, a; the same two corners still
      // bracket exactly b and c, which are still adjacent on screen
      table.setColumnPinning({ start: [], end: ['a'] })

      expect(table.getCellSelectionColumnIds()).toEqual(['b', 'c'])
      expect(table.getSelectedCellIds()).toEqual(['r0_b', 'r0_c'])
    })

    it('resolves end-pinned columns after center ones', () => {
      const table = makeTable()
      table.setColumnPinning({ start: ['b'], end: ['a'] })

      // render order is b, c, a
      expect(table.getCellSelectionColumnIndexes()).toEqual({
        b: 0,
        c: 1,
        a: 2,
      })

      table.selectAllCells()
      expect(table.getCellSelectionColumnIds()).toEqual(['b', 'c', 'a'])
    })

    it('values follow render order under pinning', () => {
      const table = makeTable()
      table.setColumnPinning({ start: ['c'], end: [] })

      table.selectCellRange(rangeOf('r0', 'c', 'r0', 'a'))

      // r0 is { a: 60, b: 1, c: 2 }, and the grid is row-major in render order
      expect(table.getSelectedCellRangesData()).toEqual([[[2, 60]]])
    })

    it('follows the column order rather than definition order', () => {
      const table = makeTable()
      table.setColumnOrder(['c', 'b', 'a'])
      table.selectCellRange(rangeOf('r0', 'c', 'r0', 'b'))

      expect(table.getCellSelectionColumnIds()).toEqual(['c', 'b'])
      expect(table.getSelectedCellIds()).toEqual(['r0_c', 'r0_b'])
    })
  })

  describe('without columnVisibilityFeature registered', () => {
    it('still resolves column indexes through the static fallback', () => {
      const minimalFeatures = testFeatures({ cellSelectionFeature })

      const table = constructTable<typeof minimalFeatures, TestRow>({
        features: minimalFeatures,
        data: makeData(),
        columns: columns as Array<ColumnDef<typeof minimalFeatures, TestRow>>,
        getRowId: (row) => row.id,
        renderFallbackValue: '',
      })

      table.selectCellRange(rangeOf('r0', 'a', 'r1', 'b'))

      expect(table.getSelectedCellIds()).toEqual([
        'r0_a',
        'r0_b',
        'r1_a',
        'r1_b',
      ])
    })
  })
})
