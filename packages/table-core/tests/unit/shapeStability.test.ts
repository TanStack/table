import { describe, expect, it } from 'vitest'
import {
  aggregationFns,
  columnFilteringFeature,
  columnGroupingFeature,
  columnPinningFeature,
  constructTable,
  createFilteredRowModel,
  createGroupedRowModel,
  createSortedRowModel,
  rowAggregationFeature,
  rowPinningFeature,
  rowSortingFeature,
} from '../../src'
import { testFeatures } from '../fixtures/features'
import type { ColumnDef, Row, TableOptions } from '../../src'

// Every instance kind (row, cell, column, header) must keep the same own
// properties, in the same insertion order, for its entire lifetime. Own-key
// order equality is the observable proxy for hidden-class (shape) equality:
// two objects created from the same prototype whose own keys were inserted in
// the same order share a hidden class in V8. These tests guard against
// post-construction property additions (Object.assign on group rows, lazy
// `_memo_*`/cache installs, pinned `position` marks) that previously forked
// instance shapes and made property access megamorphic.

function ownKeys(obj: object): string {
  return Object.keys(obj).join()
}

function expectSameOwnKeys(objects: Array<object>) {
  expect(objects.length).toBeGreaterThan(1)
  const expected = ownKeys(objects[0]!)
  for (let i = 1; i < objects.length; i++) {
    expect(ownKeys(objects[i]!)).toBe(expected)
  }
}

describe('row shape stability with grouping, aggregation, and sorting', () => {
  type Sale = {
    status: string
    label: string
    amount: number
  }

  const features = testFeatures({
    rowAggregationFeature,
    columnGroupingFeature,
    rowSortingFeature,
    groupedRowModel: createGroupedRowModel(),
    sortedRowModel: createSortedRowModel(),
    aggregationFns,
  })

  const data: Array<Sale> = [
    { status: 'a', label: 'one', amount: 10 },
    { status: 'a', label: 'two', amount: 20 },
    { status: 'b', label: 'one', amount: 30 },
    { status: 'b', label: 'two', amount: 40 },
  ]

  const columns: Array<ColumnDef<typeof features, Sale, any>> = [
    { accessorKey: 'status', id: 'status' },
    {
      accessorKey: 'label',
      id: 'label',
      sortFn: (rowA, rowB, columnId) =>
        String(rowA.getValue(columnId) ?? '').localeCompare(
          String(rowB.getValue(columnId) ?? ''),
        ),
    },
    { accessorKey: 'amount', id: 'amount' },
    { id: 'actions', header: 'Actions' },
  ]

  function makeTable(
    options?: Partial<
      Omit<TableOptions<typeof features, Sale>, 'data' | 'columns' | 'features'>
    >,
  ) {
    return constructTable({ features, data, columns, ...options })
  }

  it('group rows, leaf rows, and sorted clones share one own-key order', () => {
    const table = makeTable({
      initialState: {
        grouping: ['status'],
        sorting: [{ id: 'label', desc: true }],
      },
    })

    const flatRows = table.getRowModel().flatRows
    const groupRows = flatRows.filter((row) => row.getIsGrouped())
    const leafRows = flatRows.filter((row) => !row.getIsGrouped())

    // Sorting desc flips each group's sub-row order, so group parents are
    // clones rebuilt by the sorted row model.
    expect(groupRows.length).toBeGreaterThan(0)
    expect(leafRows.length).toBeGreaterThan(0)

    expectSameOwnKeys(flatRows)
  })

  it('group rows resolve getValue through the prototype, not an own closure', () => {
    const table = makeTable({ initialState: { grouping: ['status'] } })

    const groupRow = table
      .getRowModel()
      .flatRows.find((row) => row.getIsGrouped())!

    expect(Object.getOwnPropertyNames(groupRow)).not.toContain('getValue')
    // The prototype override resolves for every row in the table.
    expect(groupRow.getValue).toBe(
      table.getRowModel().flatRows.find((row) => !row.getIsGrouped())!.getValue,
    )
  })

  it('grouped getValue semantics: grouping values, aggregates, and caching', () => {
    const table = makeTable({ initialState: { grouping: ['status'] } })

    const rows = table.getRowModel().rows
    const groupA = rows.find((row) => row.groupingValue === 'a')!
    const groupB = rows.find((row) => row.groupingValue === 'b')!

    // The active grouping column exposes the shared grouping value.
    expect(groupA.getValue('status')).toBe('a')
    expect(groupB.getValue('status')).toBe('b')
    // Number columns auto-aggregate with sum.
    expect(groupA.getValue('amount')).toBe(30)
    expect(groupB.getValue('amount')).toBe(70)
    // Cached reads return the same value.
    expect(groupA.getValue('amount')).toBe(30)
    // Display columns with no accessor and no aggregation stay undefined.
    expect(groupA.getValue('actions')).toBeUndefined()
  })

  it('calling every row API never changes a row shape', () => {
    const table = makeTable({
      initialState: {
        grouping: ['status'],
        sorting: [{ id: 'label', desc: true }],
      },
    })

    const flatRows = table.getRowModel().flatRows
    const before = flatRows.map((row) => ownKeys(row))

    for (const row of flatRows) {
      row.getValue('amount')
      row.renderValue('label')
      row.getUniqueValues('status')
      row.getIsGrouped()
      row.getGroupingValue('status')
      row.getLeafRows()
      row.getParentRow()
      row.getParentRows()
      row.getAllCells()
      row.getAllCellsByColumnId()
    }

    flatRows.forEach((row, index) => {
      expect(ownKeys(row)).toBe(before[index])
    })
    expectSameOwnKeys(flatRows)
  })

  it('memoized row APIs still cache through the _memos holder', () => {
    const table = makeTable({ initialState: { grouping: ['status'] } })

    const row = table.getRowModel().rows[0]!
    const first = row.getAllCells()

    expect(row.getAllCells()).toBe(first)
    expect(ownKeys(row)).toContain('_memos')
  })
})

describe('row and cell shape stability with pinning, filtering, and sub-rows', () => {
  type TreeNode = {
    id: string
    name: string
    size: number
    children?: Array<TreeNode>
  }

  const features = testFeatures({
    columnFilteringFeature,
    columnPinningFeature,
    rowPinningFeature,
    filteredRowModel: createFilteredRowModel(),
  })

  const data: Array<TreeNode> = [
    {
      id: 'r1',
      name: 'alpha',
      size: 1,
      children: [
        { id: 'r1a', name: 'alpha-child', size: 2 },
        { id: 'r1b', name: 'beta-child', size: 3 },
      ],
    },
    { id: 'r2', name: 'beta', size: 4 },
    { id: 'r3', name: 'gamma', size: 5 },
  ]

  const columns: Array<ColumnDef<typeof features, TreeNode, any>> = [
    {
      accessorKey: 'name',
      id: 'name',
      filterFn: (row, columnId, filterValue: string) =>
        String(row.getValue(columnId)).includes(filterValue),
    },
    { accessorKey: 'size', id: 'size' },
  ]

  function makeTable(
    options?: Partial<
      Omit<
        TableOptions<typeof features, TreeNode>,
        'data' | 'columns' | 'features'
      >
    >,
  ) {
    return constructTable({
      features,
      data,
      columns,
      getRowId: (node) => node.id,
      getSubRows: (node) => node.children,
      ...options,
    })
  }

  it('filter clones and rows with originalSubRows share one own-key order', () => {
    const table = makeTable({
      initialState: { columnFilters: [{ id: 'name', value: 'a' }] },
    })

    const flatRows = table.getRowModel().flatRows
    // The root-down filter keeps the passing parent and clones it because it
    // has sub-rows; leaf rows are reused as-is.
    expect(flatRows.length).toBeGreaterThan(1)

    expectSameOwnKeys(flatRows)
    expectSameOwnKeys([...flatRows, ...table.getCoreRowModel().flatRows])
  })

  it('pinning a row marks position without changing its shape', () => {
    const table = makeTable({
      initialState: { rowPinning: { top: ['r2'], bottom: [] } },
    })

    const flatRows = table.getRowModel().flatRows
    const before = flatRows.map((row) => ownKeys(row))

    const topRows = table.getTopRows()
    expect(topRows.map((row) => row.id)).toEqual(['r2'])
    expect(topRows[0]!.position).toBe('top')

    flatRows.forEach((row, index) => {
      expect(ownKeys(row)).toBe(before[index])
    })
    expectSameOwnKeys(flatRows)
  })

  it('pinned and center cells share one own-key order across cell APIs', () => {
    const table = makeTable({
      initialState: { columnPinning: { start: ['name'], end: [] } },
    })

    const row = table.getRowModel().rows[0]!
    const startCells = row.getStartVisibleCells()
    const centerCells = row.getCenterVisibleCells()

    expect(startCells.length).toBeGreaterThan(0)
    expect(centerCells.length).toBeGreaterThan(0)
    expect((startCells[0] as any).position).toBe('start')
    expect((centerCells[0] as any).position).toBeUndefined()

    const allCells = [...startCells, ...centerCells]
    const before = allCells.map((cell) => ownKeys(cell))

    for (const cell of allCells) {
      cell.getValue()
      cell.renderValue()
      cell.getContext()
    }

    allCells.forEach((cell, index) => {
      expect(ownKeys(cell)).toBe(before[index])
    })
    expectSameOwnKeys(allCells)
  })

  it('column and header APIs never change column or header shapes', () => {
    const table = makeTable({
      initialState: { columnPinning: { start: ['name'], end: [] } },
    })

    const allColumns = table.getAllLeafColumns()
    const columnKeysBefore = allColumns.map((column) => ownKeys(column))

    for (const column of allColumns) {
      column.getIsPinned()
      column.getFlatColumns()
      column.getLeafColumns()
    }

    allColumns.forEach((column, index) => {
      expect(ownKeys(column)).toBe(columnKeysBefore[index])
    })
    expectSameOwnKeys(allColumns)

    const headers = table.getFlatHeaders()
    const headerKeysBefore = headers.map((header) => ownKeys(header))

    for (const header of headers) {
      header.getContext()
      header.getLeafHeaders()
    }

    headers.forEach((header, index) => {
      expect(ownKeys(header)).toBe(headerKeysBefore[index])
    })
    expectSameOwnKeys(headers)
  })
})

describe('shape stability across interaction histories', () => {
  type Item = { id: string; name: string }

  const features = testFeatures({})

  const data: Array<Item> = [
    { id: '1', name: 'one' },
    { id: '2', name: 'two' },
    { id: '3', name: 'three' },
  ]

  const columns: Array<ColumnDef<typeof features, Item, any>> = [
    { accessorKey: 'name', id: 'name' },
  ]

  it('rows keep one shape regardless of which APIs ran first', () => {
    const table = constructTable({ features, data, columns })
    const rows = table.getRowModel().rows as Array<Row<typeof features, Item>>

    // Different call orders per row previously forked hidden-class
    // transition chains; with the `_memos` holder the own keys stay fixed.
    rows[0]!.getAllCells()
    rows[0]!.getValue('name')
    rows[1]!.getValue('name')
    rows[1]!.getLeafRows()
    rows[1]!.getAllCells()
    // rows[2] never touched.

    expectSameOwnKeys(rows)
  })
})
