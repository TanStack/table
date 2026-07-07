import { describe, expect, it, vi } from 'vitest'
import {
  columnGroupingFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  constructTable,
  createCoreRowModel,
} from '../../../../src'
import {
  column_getSize,
  column_resetSize,
  getDefaultColumnSizingColumnDef,
  getDefaultColumnSizingState,
  table_getCenterTotalSize,
  table_getColumnOffsets,
  table_getLeftTotalSize,
  table_getRightTotalSize,
  table_getTotalSize,
  table_resetColumnSizing,
  table_setColumnSizing,
} from '../../../../src/static-functions'
import { testFeatures } from '../../../fixtures/features'
import { getUpdaterResult } from '../../../helpers/testUtils'
import type { ColumnDef, Table, TableOptions } from '../../../../src'

const features = testFeatures({
  columnSizingFeature,
  coreRowModel: createCoreRowModel(),
})

type Item = { id: string; a: string; b: string; c: string; d: string }

const data: Array<Item> = [
  { id: '1', a: 'a1', b: 'b1', c: 'c1', d: 'd1' },
  { id: '2', a: 'a2', b: 'b2', c: 'c2', d: 'd2' },
]

function makeTable(opts: {
  columns: Array<ColumnDef<typeof features, Item, any>>
  columnSizing?: Record<string, number>
}): Table<typeof features, Item> {
  return constructTable({
    features,
    columns: opts.columns,
    data,
    state: opts.columnSizing ? { columnSizing: opts.columnSizing } : undefined,
  })
}

describe('header_getSize', () => {
  it('returns default size for a leaf header', () => {
    const table = makeTable({
      columns: [{ id: 'a', accessorKey: 'a' }],
    })
    const header = table.getHeaderGroups()[0]!.headers[0]!
    expect(header.getSize()).toBe(150)
  })

  it('returns columnDef.size for a leaf header', () => {
    const table = makeTable({
      columns: [{ id: 'a', accessorKey: 'a', size: 200 }],
    })
    const header = table.getHeaderGroups()[0]!.headers[0]!
    expect(header.getSize()).toBe(200)
  })

  it('returns sum of subHeader sizes for a parent header', () => {
    const table = makeTable({
      columns: [
        {
          id: 'group',
          header: 'Group',
          columns: [
            { id: 'a', accessorKey: 'a', size: 100 },
            { id: 'b', accessorKey: 'b', size: 200 },
          ],
        },
      ],
    })
    const groupRow = table.getHeaderGroups()[0]
    const groupHeader = groupRow!.headers[0]!
    expect(groupHeader.getSize()).toBe(300)
  })

  it('respects columnSizing state', () => {
    const table = makeTable({
      columns: [{ id: 'a', accessorKey: 'a', size: 100 }],
      columnSizing: { a: 250 },
    })
    const header = table.getHeaderGroups()[0]!.headers[0]!
    expect(header.getSize()).toBe(250)
  })
})

describe('header_getStart', () => {
  it('returns 0 for the first header', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
      ],
    })
    const headers = table.getHeaderGroups()[0]!.headers
    expect(headers[0]!.getStart()).toBe(0)
  })

  it('returns size of preceding header for the second header', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
      ],
    })
    const headers = table.getHeaderGroups()[0]!.headers
    expect(headers[1]!.getStart()).toBe(100)
  })

  it('returns running sum of preceding sizes', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
        { id: 'c', accessorKey: 'c', size: 50 },
        { id: 'd', accessorKey: 'd', size: 75 },
      ],
    })
    const headers = table.getHeaderGroups()[0]!.headers
    expect(headers[0]!.getStart()).toBe(0)
    expect(headers[1]!.getStart()).toBe(100)
    expect(headers[2]!.getStart()).toBe(300)
    expect(headers[3]!.getStart()).toBe(350)
  })

  it('respects columnSizing state', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
      ],
      columnSizing: { a: 75 },
    })
    const headers = table.getHeaderGroups()[0]!.headers
    expect(headers[1]!.getStart()).toBe(75)
  })

  it('updates getStart when columnSizing changes (memo invalidation)', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
      ],
    })
    let headers = table.getHeaderGroups()[0]!.headers
    expect(headers[1]!.getStart()).toBe(100)

    table.setColumnSizing({ a: 500 })
    headers = table.getHeaderGroups()[0]!.headers
    expect(headers[1]!.getStart()).toBe(500)
  })

  it('returns running sum across nested header groups (parent row)', () => {
    const table = makeTable({
      columns: [
        {
          id: 'g1',
          header: 'g1',
          columns: [
            { id: 'a', accessorKey: 'a', size: 100 },
            { id: 'b', accessorKey: 'b', size: 200 },
          ],
        },
        {
          id: 'g2',
          header: 'g2',
          columns: [
            { id: 'c', accessorKey: 'c', size: 50 },
            { id: 'd', accessorKey: 'd', size: 75 },
          ],
        },
      ],
    })
    const groups = table.getHeaderGroups()
    const parentRow = groups[0]!.headers
    expect(parentRow[0]!.getStart()).toBe(0)
    // group 2 starts after group 1 (100 + 200)
    expect(parentRow[1]!.getStart()).toBe(300)

    const leafRow = groups[1]!.headers
    expect(leafRow[0]!.getStart()).toBe(0)
    expect(leafRow[1]!.getStart()).toBe(100)
    expect(leafRow[2]!.getStart()).toBe(300)
    expect(leafRow[3]!.getStart()).toBe(350)
  })

  it('returns 0 for a single-header group', () => {
    const table = makeTable({
      columns: [{ id: 'a', accessorKey: 'a', size: 100 }],
    })
    const headers = table.getHeaderGroups()[0]!.headers
    expect(headers[0]!.getStart()).toBe(0)
  })
})

describe('column_getStart', () => {
  it('returns 0 for the first column', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
      ],
    })
    const cols = table.getAllLeafColumns()
    expect(cols[0]!.getStart()).toBe(0)
  })

  it('returns size of preceding column for the second column', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
      ],
    })
    const cols = table.getAllLeafColumns()
    expect(cols[1]!.getStart()).toBe(100)
  })

  it('returns running sum of preceding column sizes', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
        { id: 'c', accessorKey: 'c', size: 50 },
        { id: 'd', accessorKey: 'd', size: 75 },
      ],
    })
    const cols = table.getAllLeafColumns()
    expect(cols[0]!.getStart()).toBe(0)
    expect(cols[1]!.getStart()).toBe(100)
    expect(cols[2]!.getStart()).toBe(300)
    expect(cols[3]!.getStart()).toBe(350)
  })

  it('respects columnSizing state', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
        { id: 'c', accessorKey: 'c', size: 50 },
      ],
      columnSizing: { a: 75, b: 30 },
    })
    const cols = table.getAllLeafColumns()
    expect(cols[2]!.getStart()).toBe(105)
  })

  it('updates getStart when columnSizing changes (memo invalidation)', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
      ],
    })
    let cols = table.getAllLeafColumns()
    expect(cols[1]!.getStart()).toBe(100)

    table.setColumnSizing({ a: 500 })
    cols = table.getAllLeafColumns()
    expect(cols[1]!.getStart()).toBe(500)
  })
})

describe('column_getAfter', () => {
  it('returns 0 for the last column', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
      ],
    })
    const cols = table.getAllLeafColumns()
    expect(cols[1]!.getAfter()).toBe(0)
  })

  it('returns size of following column for the second-to-last column', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
      ],
    })
    const cols = table.getAllLeafColumns()
    expect(cols[0]!.getAfter()).toBe(200)
  })

  it('returns running sum of following column sizes', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
        { id: 'c', accessorKey: 'c', size: 50 },
        { id: 'd', accessorKey: 'd', size: 75 },
      ],
    })
    const cols = table.getAllLeafColumns()
    expect(cols[0]!.getAfter()).toBe(325)
    expect(cols[1]!.getAfter()).toBe(125)
    expect(cols[2]!.getAfter()).toBe(75)
    expect(cols[3]!.getAfter()).toBe(0)
  })

  it('respects columnSizing state', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
        { id: 'c', accessorKey: 'c', size: 50 },
      ],
      columnSizing: { b: 30, c: 25 },
    })
    const cols = table.getAllLeafColumns()
    expect(cols[0]!.getAfter()).toBe(55)
  })

  it('updates getAfter when columnSizing changes (memo invalidation)', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
      ],
    })
    let cols = table.getAllLeafColumns()
    expect(cols[0]!.getAfter()).toBe(200)

    table.setColumnSizing({ b: 500 })
    cols = table.getAllLeafColumns()
    expect(cols[0]!.getAfter()).toBe(500)
  })
})

describe('column offsets with grouping (memo invalidation)', () => {
  const groupedFeatures = testFeatures({
    columnGroupingFeature,
    columnSizingFeature,
    columnVisibilityFeature,
    coreRowModel: createCoreRowModel(),
  })

  function makeGroupedTable(): Table<typeof groupedFeatures, Item> {
    return constructTable({
      features: groupedFeatures,
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
        { id: 'c', accessorKey: 'c', size: 50 },
      ],
      data,
    })
  }

  it('reorders visible leaf columns, headers, and cells in lockstep after setGrouping', () => {
    const table = makeGroupedTable()

    // prime the memos before grouping changes
    expect(table.getVisibleLeafColumns().map((c) => c.id)).toEqual([
      'a',
      'b',
      'c',
    ])
    expect(table.getHeaderGroups()[0]!.headers.map((h) => h.column.id)).toEqual(
      ['a', 'b', 'c'],
    )

    // default groupedColumnMode 'reorder' moves the grouped column first
    table.setGrouping(['b'])

    const visibleIds = table.getVisibleLeafColumns().map((c) => c.id)
    const headerIds = table
      .getHeaderGroups()[0]!
      .headers.map((h) => h.column.id)
    const cellIds = table
      .getRowModel()
      .rows[0]!.getAllCells()
      .map((cell) => cell.column.id)
    expect(visibleIds).toEqual(['b', 'a', 'c'])
    expect(headerIds).toEqual(visibleIds)
    expect(cellIds).toEqual(visibleIds)
  })

  it('updates getStart and getAfter after setGrouping', () => {
    const table = makeGroupedTable()

    // prime the memos before grouping changes
    expect(table.getColumn('c')!.getStart()).toBe(300)
    expect(table.getColumn('b')!.getAfter()).toBe(50)

    table.setGrouping(['b'])

    // new order: b (200), a (100), c (50)
    expect(table.getColumn('b')!.getStart()).toBe(0)
    expect(table.getColumn('a')!.getStart()).toBe(200)
    expect(table.getColumn('c')!.getStart()).toBe(300)
    expect(table.getColumn('b')!.getAfter()).toBe(150)
    expect(table.getColumn('a')!.getAfter()).toBe(50)
    expect(table.getColumn('c')!.getAfter()).toBe(0)
  })
})

describe('sizing state defaults', () => {
  it('getDefaultColumnSizingState should return an empty map and a new instance each time', () => {
    expect(getDefaultColumnSizingState()).toEqual({})
    expect(getDefaultColumnSizingState()).not.toBe(
      getDefaultColumnSizingState(),
    )
  })

  it('getDefaultColumnSizingColumnDef should return the built-in sizing defaults', () => {
    expect(getDefaultColumnSizingColumnDef()).toEqual({
      size: 150,
      minSize: 20,
      maxSize: Number.MAX_SAFE_INTEGER,
    })
  })
})

describe('column_getSize', () => {
  it('should fall back to the built-in default size', () => {
    const table = makeTable({ columns: [{ id: 'a', accessorKey: 'a' }] })

    expect(column_getSize(table.getColumn('a')!)).toBe(150)
  })

  it('should prefer committed sizing state over the columnDef size', () => {
    const table = makeTable({
      columns: [{ id: 'a', accessorKey: 'a', size: 100 }],
      columnSizing: { a: 250 },
    })

    expect(column_getSize(table.getColumn('a')!)).toBe(250)
  })

  it('should clamp to minSize', () => {
    const table = makeTable({
      columns: [{ id: 'a', accessorKey: 'a', minSize: 50 }],
      columnSizing: { a: 5 },
    })

    expect(column_getSize(table.getColumn('a')!)).toBe(50)
  })

  it('should clamp to maxSize', () => {
    const table = makeTable({
      columns: [{ id: 'a', accessorKey: 'a', size: 500, maxSize: 300 }],
    })

    expect(column_getSize(table.getColumn('a')!)).toBe(300)
  })
})

describe('column_resetSize', () => {
  it('should remove only this column from the sizing state', () => {
    const onColumnSizingChange = vi.fn()
    const table = constructTable({
      features,
      columns: [
        { id: 'a', accessorKey: 'a' },
        { id: 'b', accessorKey: 'b' },
      ] as Array<ColumnDef<typeof features, Item, any>>,
      data,
      onColumnSizingChange,
    })

    column_resetSize(table.getColumn('a')!)

    expect(getUpdaterResult(onColumnSizingChange, { a: 250, b: 300 })).toEqual({
      b: 300,
    })
  })
})

describe('table_setColumnSizing / table_resetColumnSizing', () => {
  function makeSizingTable(
    options?: Partial<
      Omit<TableOptions<typeof features, Item>, 'data' | 'columns' | 'features'>
    >,
  ) {
    return constructTable({
      features,
      columns: [{ id: 'a', accessorKey: 'a' }] as Array<
        ColumnDef<typeof features, Item, any>
      >,
      data,
      ...options,
    })
  }

  it('should route the updater through onColumnSizingChange', () => {
    const onColumnSizingChange = vi.fn()
    const table = makeSizingTable({ onColumnSizingChange })

    table_setColumnSizing(table, { a: 123 })

    expect(onColumnSizingChange).toHaveBeenCalledWith({ a: 123 })
  })

  it('should reset to an empty map when defaultState is true', () => {
    const onColumnSizingChange = vi.fn()
    const table = makeSizingTable({
      onColumnSizingChange,
      initialState: { columnSizing: { a: 250 } },
    })

    table_resetColumnSizing(table, true)

    expect(onColumnSizingChange).toHaveBeenCalledWith({})
  })

  it('should reset to the initial sizing by default', () => {
    const onColumnSizingChange = vi.fn()
    const table = makeSizingTable({
      onColumnSizingChange,
      initialState: { columnSizing: { a: 250 } },
    })

    table_resetColumnSizing(table)

    expect(onColumnSizingChange).toHaveBeenCalledWith({ a: 250 })
  })
})

describe('table_getColumnOffsets', () => {
  it('should build start and after offsets per column', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
        { id: 'c', accessorKey: 'c', size: 50 },
      ],
    })

    const offsets = table_getColumnOffsets(table)

    expect(offsets.all.starts).toEqual({ a: 0, b: 100, c: 300 })
    expect(offsets.all.afters).toEqual({ a: 250, b: 50, c: 0 })
    // nothing pinned: the center region matches the full visible list
    expect(offsets.center.starts).toEqual(offsets.all.starts)
    expect(offsets.left.starts).toEqual({})
    expect(offsets.right.starts).toEqual({})
  })
})

describe('total sizes', () => {
  const pinnedFeatures = testFeatures({
    columnPinningFeature,
    columnSizingFeature,
    coreRowModel: createCoreRowModel(),
  })

  function makePinnedTable() {
    return constructTable({
      features: pinnedFeatures,
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
        { id: 'c', accessorKey: 'c', size: 50 },
      ] as Array<ColumnDef<typeof pinnedFeatures, Item, any>>,
      data,
      initialState: {
        columnPinning: { left: ['a'], right: ['c'] },
      },
    })
  }

  it('table_getTotalSize should sum the full header row', () => {
    const table = makeTable({
      columns: [
        { id: 'a', accessorKey: 'a', size: 100 },
        { id: 'b', accessorKey: 'b', size: 200 },
      ],
    })

    expect(table_getTotalSize(table)).toBe(300)
  })

  it('should sum each pinning region separately', () => {
    const table = makePinnedTable()

    expect(table_getLeftTotalSize(table)).toBe(100)
    expect(table_getCenterTotalSize(table)).toBe(200)
    expect(table_getRightTotalSize(table)).toBe(50)
    expect(table_getTotalSize(table)).toBe(350)
  })

  it('should return 0 for empty pinning regions', () => {
    const table = makeTable({
      columns: [{ id: 'a', accessorKey: 'a', size: 100 }],
    })

    expect(table_getLeftTotalSize(table)).toBe(0)
    expect(table_getRightTotalSize(table)).toBe(0)
    expect(table_getCenterTotalSize(table)).toBe(100)
  })
})
