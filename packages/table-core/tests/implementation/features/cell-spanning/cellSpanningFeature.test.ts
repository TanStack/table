import { describe, expect, it } from 'vitest'
import {
  cellSelectionFeature,
  cellSpanningFeature,
  columnFilteringFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  constructTable,
  createExpandedRowModel,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  columnGroupingFeature,
  filterFn_includesString,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  rowSortingFeature,
  sortFn_basic,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import type { ColumnDef, Table, TableFeatures } from '../../../../src'

interface TestRow {
  id: string
  region: string
  team: string
  amount: number
  subRows?: Array<TestRow>
}

/** region-major so equal values are adjacent in the natural order. */
function makeData(): Array<TestRow> {
  const rows: Array<TestRow> = []
  const regions = ['North', 'South', 'East']
  for (const region of regions) {
    for (let t = 0; t < 3; t++) {
      rows.push({
        id: `${region}-${t}`,
        region,
        team: `Team ${t}`,
        amount: rows.length,
      })
    }
  }
  return rows
}

function makeColumns<TFeatures extends TableFeatures>(): Array<
  ColumnDef<TFeatures, TestRow>
> {
  return [
    { id: 'region', accessorKey: 'region', spanRows: true },
    { id: 'team', accessorKey: 'team' },
    { id: 'amount', accessorKey: 'amount' },
  ] as Array<ColumnDef<TFeatures, TestRow>>
}

function regionSpans<TFeatures extends TableFeatures>(
  table: Table<TFeatures, TestRow>,
): Array<number> {
  return table
    .getRowModel()
    .rows.map((row) =>
      (row.getAllCellsByColumnId()['region'] as any).getRowSpan(),
    )
}

describe('spanning with sorting', () => {
  const features = testFeatures({
    cellSpanningFeature,
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),
    sortFns: { basic: sortFn_basic },
  })

  function makeTable(
    initialSorting: Array<{ id: string; desc: boolean }> = [],
  ) {
    return constructTable<typeof features, TestRow>({
      features,
      data: makeData(),
      columns: makeColumns(),
      getRowId: (row) => row.id,
      renderFallbackValue: '',
      initialState: { sorting: initialSorting },
    })
  }

  it('recomputes spans when sorting changes adjacency', () => {
    const table = makeTable()

    expect(regionSpans(table)).toEqual([3, 0, 0, 3, 0, 0, 3, 0, 0])

    // Sorting by amount descending reverses the rows; regions stay clustered
    // so runs survive, but sorting by team interleaves the regions.
    table.setSorting([{ id: 'team', desc: false }])
    expect(regionSpans(table)).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1])

    table.setSorting([{ id: 'region', desc: false }])
    const spans = regionSpans(table)
    expect(spans.filter((span) => span > 1).length).toBe(3)
  })
})

describe('spanning with filtering', () => {
  it('merges neighbours when a filter removes the middle of a run', () => {
    const filterFeatures = testFeatures({
      cellSpanningFeature,
      columnFilteringFeature,
      filteredRowModel: createFilteredRowModel(),
      filterFns: { includesString: filterFn_includesString },
    })
    // Middle rows carry a distinct marker so a filter can slice them out of
    // each region's run.
    const data: Array<TestRow> = ['North', 'South', 'East'].flatMap(
      (region, index) => [
        { id: `${region}-0`, region, team: 'keep', amount: index * 3 },
        { id: `${region}-1`, region, team: 'drop', amount: index * 3 + 1 },
        { id: `${region}-2`, region, team: 'keep', amount: index * 3 + 2 },
      ],
    )
    const table = constructTable<typeof filterFeatures, TestRow>({
      features: filterFeatures,
      data,
      columns: [
        { id: 'region', accessorKey: 'region', spanRows: true },
        {
          id: 'team',
          accessorKey: 'team',
          filterFn: 'includesString',
        },
        { id: 'amount', accessorKey: 'amount' },
      ] as Array<ColumnDef<typeof filterFeatures, TestRow>>,
      getRowId: (row) => row.id,
      renderFallbackValue: '',
    })

    expect(regionSpans(table)).toEqual([3, 0, 0, 3, 0, 0, 3, 0, 0])

    // The filter removes the middle row of every region run; the two
    // remaining neighbours become adjacent and still merge.
    table.setColumnFilters([{ id: 'team', value: 'keep' }])
    expect(regionSpans(table)).toEqual([2, 0, 2, 0, 2, 0])

    table.setColumnFilters([])
    expect(regionSpans(table)).toEqual([3, 0, 0, 3, 0, 0, 3, 0, 0])
  })
})

describe('spanning with pagination (the display-order regression tests)', () => {
  const features = testFeatures({
    cellSpanningFeature,
    rowPaginationFeature,
    paginatedRowModel: createPaginatedRowModel(),
  })

  function makeTable(pageSize: number) {
    return constructTable<typeof features, TestRow>({
      features,
      data: makeData(),
      columns: makeColumns(),
      getRowId: (row) => row.id,
      renderFallbackValue: '',
      initialState: { pagination: { pageIndex: 0, pageSize } },
    })
  }

  it('splits a run at the page boundary', () => {
    // Page size 4 slices the 3-row North run after row 3: page one holds
    // North x3 + South x1, page two holds South x2 + East x1...
    const table = makeTable(4)

    expect(regionSpans(table)).toEqual([3, 0, 0, 1])

    table.setPageIndex(1)
    // Page two holds South x2 and East x2. The South run continues from page
    // one, but page two opens its own anchor rather than inheriting a span
    // from an unrendered row.
    expect(regionSpans(table)).toEqual([2, 0, 2, 0])
  })

  it('invalidates the memoized index when only the page changes', () => {
    const table = makeTable(4)
    const first = (table as any).getCellSpanIndex()

    expect((table as any).getCellSpanIndex()).toBe(first)

    table.setPageIndex(1)
    const second = (table as any).getCellSpanIndex()

    expect(second).not.toBe(first)
    expect(second.rows).toBe(table.getRowModel().rows)
  })
})

describe('spanning with row pinning', () => {
  const features = testFeatures({
    cellSpanningFeature,
    rowPinningFeature,
    columnVisibilityFeature,
  })

  function makeTable(overrides: Record<string, unknown> = {}) {
    return constructTable<typeof features, TestRow>({
      features,
      data: makeData(),
      columns: makeColumns(),
      getRowId: (row) => row.id,
      renderFallbackValue: '',
      ...overrides,
    })
  }

  it('breaks runs at pinned section boundaries and indexes every section', () => {
    const table = makeTable({
      initialState: {
        rowPinning: { top: ['North-1'], bottom: ['East-2'] },
      },
    })

    const sectionRows = [
      ...table.getTopRows(),
      ...table.getCenterRows(),
      ...table.getBottomRows(),
    ]
    const spans = sectionRows.map((row) =>
      (row.getAllCellsByColumnId()['region'] as any).getRowSpan(),
    )

    // Top: [North-1]. Center: North-0, North-2 merge (adjacent after the
    // pinned row leaves the center), then South x3, East x2. Bottom: [East-2].
    expect(spans).toEqual([1, 2, 0, 3, 0, 0, 2, 0, 1])
  })

  it('spans without rowPinningFeature registered', () => {
    const bare = testFeatures({ cellSpanningFeature })
    const table = constructTable<typeof bare, TestRow>({
      features: bare,
      data: makeData(),
      columns: makeColumns(),
      getRowId: (row) => row.id,
      renderFallbackValue: '',
    })

    expect(regionSpans(table)).toEqual([3, 0, 0, 3, 0, 0, 3, 0, 0])
  })
})

describe('spanning with column pinning and visibility', () => {
  const features = testFeatures({
    cellSpanningFeature,
    columnPinningFeature,
    columnVisibilityFeature,
  })

  function makeTable(overrides: Record<string, unknown> = {}) {
    return constructTable<typeof features, TestRow>({
      features,
      data: makeData(),
      columns: [
        {
          id: 'region',
          accessorKey: 'region',
          spanRows: true,
          spanColumns: Infinity,
        },
        { id: 'team', accessorKey: 'team' },
        { id: 'amount', accessorKey: 'amount' },
      ] as Array<ColumnDef<typeof features, TestRow>>,
      getRowId: (row) => row.id,
      renderFallbackValue: '',
      ...overrides,
    })
  }

  it('clamps a column span at the pinned region boundary', () => {
    // With `team` end-pinned, cells render [region, amount, team], and the
    // region cell's Infinity span may only reach the end of the center region.
    const table = makeTable({
      initialState: { columnPinning: { start: [], end: ['team'] } },
    })
    const cells = table
      .getRowModel()
      .rows[0]!.getAllCellsByColumnId() as Record<string, any>

    expect(cells['region'].getColSpan()).toBe(2)
    expect(cells['amount'].getColSpan()).toBe(0)
    expect(cells['team'].getColSpan()).toBe(1)
  })

  it('shrinks a column span when a covered column is hidden', () => {
    const table = makeTable({
      initialState: { columnVisibility: { amount: false } },
    })
    const cells = table
      .getRowModel()
      .rows[0]!.getAllCellsByColumnId() as Record<string, any>

    expect(cells['region'].getColSpan()).toBe(2)

    table.setColumnVisibility({ amount: false, team: false })
    expect(
      (
        table.getRowModel().rows[0]!.getAllCellsByColumnId() as Record<
          string,
          any
        >
      )['region'].getColSpan(),
    ).toBe(1)
  })

  it('keeps row spans keyed by column id across reordering', () => {
    const orderable = testFeatures({
      cellSpanningFeature,
      columnVisibilityFeature,
    })
    const table = constructTable<typeof orderable, TestRow>({
      features: orderable,
      data: makeData(),
      columns: makeColumns(),
      getRowId: (row) => row.id,
      renderFallbackValue: '',
    })

    expect(regionSpans(table)).toEqual([3, 0, 0, 3, 0, 0, 3, 0, 0])
  })
})

describe('spanning with expanded sub-rows', () => {
  const features = testFeatures({
    cellSpanningFeature,
    rowExpandingFeature,
    expandedRowModel: createExpandedRowModel(),
  })

  it('never merges a parent with its children, but merges true siblings', () => {
    const data: Array<TestRow> = [
      {
        id: 'p0',
        region: 'North',
        team: 'Parent',
        amount: 0,
        subRows: [
          { id: 'c0', region: 'North', team: 'Child', amount: 1 },
          { id: 'c1', region: 'North', team: 'Child', amount: 2 },
        ],
      },
      { id: 'p1', region: 'North', team: 'Parent', amount: 3 },
    ]
    const table = constructTable<typeof features, TestRow>({
      features,
      data,
      columns: makeColumns(),
      getRowId: (row) => row.id,
      getSubRows: (row) => row.subRows,
      renderFallbackValue: '',
      initialState: { expanded: true },
    })

    const spans = table
      .getRowModel()
      .rows.map((row) => [
        row.id,
        (row.getAllCellsByColumnId()['region'] as any).getRowSpan(),
      ])

    // Order: p0, c0, c1, p1. The two children merge with each other; the
    // parent merges with neither its children nor the following root row
    // (the tree position changes in between).
    expect(spans).toEqual([
      ['p0', 1],
      ['c0', 2],
      ['c1', 0],
      ['p1', 1],
    ])
  })
})

describe('spanning with grouping', () => {
  const features = testFeatures({
    cellSpanningFeature,
    columnGroupingFeature,
    groupedRowModel: createGroupedRowModel(),
    rowExpandingFeature,
    expandedRowModel: createExpandedRowModel(),
  })

  it('ignores spanRows on the grouped column and never merges group rows', () => {
    const table = constructTable<typeof features, TestRow>({
      features,
      data: makeData(),
      columns: makeColumns(),
      getRowId: (row) => row.id,
      renderFallbackValue: '',
      initialState: { grouping: ['region'], expanded: true },
    })

    const spans = table
      .getRowModel()
      .rows.map((row) =>
        (row.getAllCellsByColumnId()['region'] as any).getRowSpan(),
      )

    expect(spans.every((span) => span === 1)).toBe(true)
  })
})

describe('stale rows and data swaps', () => {
  it('reports one for a cell whose row left the row model', () => {
    const filterFeatures = testFeatures({
      cellSpanningFeature,
      columnFilteringFeature,
      filteredRowModel: createFilteredRowModel(),
      filterFns: { includesString: filterFn_includesString },
    })
    const table = constructTable<typeof filterFeatures, TestRow>({
      features: filterFeatures,
      data: makeData(),
      columns: [
        { id: 'region', accessorKey: 'region', spanRows: true },
        { id: 'team', accessorKey: 'team', filterFn: 'includesString' },
        { id: 'amount', accessorKey: 'amount' },
      ] as Array<ColumnDef<typeof filterFeatures, TestRow>>,
      getRowId: (row) => row.id,
      renderFallbackValue: '',
    })

    const heldCell = table
      .getRowModel()
      .rowsById['North-0']!.getAllCellsByColumnId()['region'] as any
    expect(heldCell.getRowSpan()).toBe(3)

    table.setColumnFilters([{ id: 'team', value: 'Team 2' }])
    expect(table.getRowModel().rows.map((row) => row.id)).not.toContain(
      'North-0',
    )

    // The held cell's row keeps a stale position; the identity guard rejects
    // it instead of reading another row's slot.
    expect(heldCell.getRowSpan()).toBe(1)
  })

  it('recomputes after the data array is replaced', () => {
    const swapFeatures = testFeatures({ cellSpanningFeature })
    const table = constructTable<typeof swapFeatures, TestRow>({
      features: swapFeatures,
      data: makeData(),
      columns: makeColumns(),
      getRowId: (row) => row.id,
      renderFallbackValue: '',
    })

    expect(regionSpans(table)).toEqual([3, 0, 0, 3, 0, 0, 3, 0, 0])

    table.setOptions((options) => ({
      ...options,
      data: [
        { id: 'x0', region: 'West', team: 'a', amount: 0 },
        { id: 'x1', region: 'West', team: 'b', amount: 1 },
      ],
    }))

    expect(regionSpans(table)).toEqual([2, 0])
  })
})

describe('cell selection composes with spanning', () => {
  const features = testFeatures({
    cellSelectionFeature,
    cellSpanningFeature,
    columnVisibilityFeature,
  })

  it('expands the selection to enclose a spanned rectangle and counts it once', () => {
    const table = constructTable<typeof features, TestRow>({
      features,
      data: makeData(),
      columns: makeColumns(),
      getRowId: (row) => row.id,
      renderFallbackValue: '',
    })

    table.setCellSelection([
      {
        anchorRowId: 'North-1',
        anchorColumnId: 'region',
        focusRowId: 'North-1',
        focusColumnId: 'team',
      },
    ])

    // The range clips the North merge, so the derived bounds expand to the
    // merge's full extent, and the merge counts as one rendered cell.
    expect(table.getCellSelectionBounds()).toEqual([
      { minRowIndex: 0, maxRowIndex: 2, minColumnIndex: 0, maxColumnIndex: 1 },
    ])

    const covered = table
      .getRowModel()
      .rowsById['North-1']!.getAllCellsByColumnId() as Record<string, any>
    expect(covered['region'].getRowSpan()).toBe(0)
    expect(covered['region'].getIsSelected()).toBe(true)

    // 1 merge + 3 team cells, not 6 lattice cells.
    expect(table.getSelectedCellCount()).toBe(4)
    expect(table.getSelectedCellIds()).not.toContain('North-1_region')
  })
})
