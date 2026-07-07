import { describe, expect, it } from 'vitest'
import {
  aggregationFns,
  columnFilteringFeature,
  columnGroupingFeature,
  columnVisibilityFeature,
  constructTable,
  createFilteredRowModel,
  createGroupedRowModel,
  createSortedRowModel,
  filterFns,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
} from '../../src'
import { testFeatures } from '../fixtures/features'
import type { ColumnDef } from '../../src'

type TestRow = Record<string, unknown>

const features = testFeatures({
  columnFilteringFeature,
  columnGroupingFeature,
  columnVisibilityFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  groupedRowModel: createGroupedRowModel(),
  sortedRowModel: createSortedRowModel(),
  aggregationFns,
  filterFns,
  sortFns,
})

const PROTOTYPE_IDS = [
  'hasOwnProperty',
  'toString',
  'constructor',
  'valueOf',
  '__proto__',
  'isPrototypeOf',
]

const hasOwn = (obj: object, key: string) =>
  Object.prototype.hasOwnProperty.call(obj, key)

function rowFromEntries(entries: Array<[string, unknown]>): TestRow {
  return Object.fromEntries(entries)
}

function prototypeNamedRow(suffix: string): TestRow {
  return rowFromEntries(PROTOTYPE_IDS.map((id) => [id, `${id}-${suffix}`]))
}

function columnsFor(
  columnIds: ReadonlyArray<string>,
): Array<ColumnDef<typeof features, TestRow, any>> {
  return columnIds.map((id) => ({
    id,
    accessorFn: (row) => row[id],
  }))
}

function makeTable({
  columns = columnsFor(PROTOTYPE_IDS),
  data = [prototypeNamedRow('value')],
  getRowId,
  initialState,
}: {
  columns?: Array<ColumnDef<typeof features, TestRow, any>>
  data?: Array<TestRow>
  getRowId?: (row: TestRow, index: number) => string
  initialState?: Record<string, unknown>
} = {}) {
  return constructTable<typeof features, TestRow>({
    features,
    renderFallbackValue: '',
    data,
    columns,
    getRowId,
    initialState: initialState,
  })
}

describe('prototype-safe dictionary keys', () => {
  it('caches row values and unique values for prototype-named column ids', () => {
    const table = makeTable()
    const row = table.getCoreRowModel().rows[0]!

    for (const id of PROTOTYPE_IDS) {
      expect(row.getValue(id)).toBe(`${id}-value`)
      expect(row.getValue(id)).toBe(`${id}-value`)

      expect(row.getUniqueValues(id)).toEqual([`${id}-value`])
      expect(row.getUniqueValues(id)).toEqual([`${id}-value`])
    }
  })

  it('builds own-property lookup maps for prototype-named column ids', () => {
    const table = makeTable()
    const row = table.getCoreRowModel().rows[0]!
    const flatColumnsById = table.getAllFlatColumnsById()
    const leafColumnsById = table.getAllLeafColumnsById()
    const cellsById = row.getAllCellsByColumnId()
    const visibleCellsById = row.getVisibleCellsByColumnId()

    expect(Object.getPrototypeOf(flatColumnsById)).toBeNull()
    expect(Object.getPrototypeOf(leafColumnsById)).toBeNull()
    expect(Object.getPrototypeOf(cellsById)).toBeNull()
    expect(Object.getPrototypeOf(visibleCellsById)).toBeNull()

    for (const id of PROTOTYPE_IDS) {
      expect(hasOwn(flatColumnsById, id)).toBe(true)
      expect(hasOwn(leafColumnsById, id)).toBe(true)
      expect(hasOwn(cellsById, id)).toBe(true)
      expect(hasOwn(visibleCellsById, id)).toBe(true)

      expect(table.getColumn(id)?.id).toBe(id)
      expect(cellsById[id]?.column.id).toBe(id)
      expect(visibleCellsById[id]?.column.id).toBe(id)
    }
  })

  it('filters rows through a __proto__ column id', () => {
    const table = makeTable({
      columns: columnsFor(['__proto__']),
      data: [
        rowFromEntries([['__proto__', 'keep']]),
        rowFromEntries([['__proto__', 'drop']]),
      ],
      initialState: {
        columnFilters: [{ id: '__proto__', value: 'keep' }],
      },
    })

    expect(table.getFilteredRowModel().rows.map((row) => row.original)).toEqual(
      [rowFromEntries([['__proto__', 'keep']])],
    )
  })

  it('sorts rows through a __proto__ column id', () => {
    const table = makeTable({
      columns: columnsFor(['__proto__']),
      data: [
        rowFromEntries([['__proto__', 'b']]),
        rowFromEntries([['__proto__', 'a']]),
      ],
      initialState: {
        sorting: [{ id: '__proto__', desc: false }],
      },
    })

    expect(
      table.getSortedRowModel().rows.map((row) => row.getValue('__proto__')),
    ).toEqual(['a', 'b'])
  })

  it('groups and aggregates through prototype-named column ids', () => {
    const columns: Array<ColumnDef<typeof features, TestRow, any>> = [
      {
        id: 'hasOwnProperty',
        accessorFn: (row) => row.hasOwnProperty,
        getGroupingValue: (row) => row.hasOwnProperty,
      },
      {
        id: 'value',
        accessorFn: (row) => row.value,
        aggregationFn: 'sum',
      },
    ]
    const table = makeTable({
      columns,
      data: [
        rowFromEntries([
          ['hasOwnProperty', 'group-a'],
          ['value', 1],
        ]),
        rowFromEntries([
          ['hasOwnProperty', 'group-b'],
          ['value', 2],
        ]),
      ],
      initialState: {
        grouping: ['hasOwnProperty'],
      },
    })
    const firstCoreRow = table.getCoreRowModel().rows[0]!

    expect(firstCoreRow.getGroupingValue('hasOwnProperty')).toBe('group-a')
    expect(firstCoreRow.getGroupingValue('hasOwnProperty')).toBe('group-a')

    const groupedRows = table.getGroupedRowModel().rows

    expect(groupedRows.map((row) => row.groupingValue)).toEqual([
      'group-a',
      'group-b',
    ])
    expect(groupedRows[0]?.getValue('hasOwnProperty')).toBe('group-a')
    expect(groupedRows[0]?.getValue('value')).toBe(1)
    expect(groupedRows[0]?.getValue('value')).toBe(1)
  })

  it('stores prototype-named row ids as own keys in row models', () => {
    const rowSelection = rowFromEntries([['__proto__', true]])
    const table = makeTable({
      columns: columnsFor(['value']),
      data: [rowFromEntries([['value', 'selected']])],
      getRowId: () => '__proto__',
      initialState: { rowSelection },
    })
    const rowModel = table.getCoreRowModel()
    const row = rowModel.rows[0]!
    const selectedRowModel = table.getSelectedRowModel()

    expect(Object.getPrototypeOf(rowModel.rowsById)).toBeNull()
    expect(hasOwn(rowModel.rowsById, '__proto__')).toBe(true)
    expect(table.getRow('__proto__')).toBe(row)
    expect(row.getIsSelected()).toBe(true)

    expect(Object.getPrototypeOf(selectedRowModel.rowsById)).toBeNull()
    expect(hasOwn(selectedRowModel.rowsById, '__proto__')).toBe(true)
    expect(selectedRowModel.rowsById.__proto__).toBe(row)
  })
})
