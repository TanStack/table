import { describe, expect, it, vi } from 'vitest'
import {
  aggregationFns,
  rowAggregationFeature,
  columnGroupingFeature,
  constructTable,
  createGroupedRowModel,
} from '../../../../src'
import {
  cell_getIsAggregated,
  cell_getIsGrouped,
  cell_getIsPlaceholder,
  column_getAutoAggregationFn,
  column_getCanGroup,
  column_getGroupedIndex,
  column_getIsGrouped,
  column_getToggleGroupingHandler,
  column_toggleGrouping,
  getDefaultGroupingState,
  row_getGroupingValue,
  row_getIsGrouped,
  table_resetGrouping,
  table_setGrouping,
} from '../../../../src/static-functions'
import { testFeatures } from '../../../fixtures/features'
import { getUpdaterResult } from '../../../helpers/testUtils'
import type { ColumnDef, Table, TableOptions } from '../../../../src'

type Sale = {
  status: string
  label: string
  amount: number
  soldAt: Date
}

const features = testFeatures({
  rowAggregationFeature,
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  aggregationFns,
})

const data: Array<Sale> = [
  { status: 'a', label: 'one', amount: 10, soldAt: new Date('2024-01-01') },
  { status: 'a', label: 'two', amount: 20, soldAt: new Date('2024-02-01') },
  { status: 'b', label: 'one', amount: 30, soldAt: new Date('2024-03-01') },
  { status: 'b', label: 'two', amount: 40, soldAt: new Date('2024-04-01') },
]

const columns: Array<ColumnDef<typeof features, Sale, any>> = [
  { accessorKey: 'status', id: 'status' },
  { accessorKey: 'label', id: 'label' },
  { accessorKey: 'amount', id: 'amount' },
  { accessorKey: 'soldAt', id: 'soldAt' },
  // display column with no accessor
  { id: 'actions', header: 'Actions' },
]

function makeTable(
  options?: Partial<
    Omit<TableOptions<typeof features, Sale>, 'data' | 'columns' | 'features'>
  >,
): Table<typeof features, Sale> {
  return constructTable({
    features,
    data,
    columns,
    ...options,
  })
}

describe('getDefaultGroupingState', () => {
  it('should return an empty array and a new instance each time', () => {
    expect(getDefaultGroupingState()).toEqual([])
    expect(getDefaultGroupingState()).not.toBe(getDefaultGroupingState())
  })
})

describe('column_toggleGrouping', () => {
  it('should append an ungrouped column to the grouping state', () => {
    const onGroupingChange = vi.fn()
    const table = makeTable({ onGroupingChange })

    column_toggleGrouping(table.getColumn('status')!)

    expect(getUpdaterResult(onGroupingChange, ['label'])).toEqual([
      'label',
      'status',
    ])
  })

  it('should remove a grouped column and keep the rest in order', () => {
    const onGroupingChange = vi.fn()
    const table = makeTable({ onGroupingChange })

    column_toggleGrouping(table.getColumn('status')!)

    expect(
      getUpdaterResult(onGroupingChange, ['label', 'status', 'amount']),
    ).toEqual(['label', 'amount'])
  })
})

describe('column_getCanGroup', () => {
  it('should return true for accessor columns by default', () => {
    const table = makeTable()

    expect(column_getCanGroup(table.getColumn('status')!)).toBe(true)
  })

  it('should return false for display columns without an accessor', () => {
    const table = makeTable()

    expect(column_getCanGroup(table.getColumn('actions')!)).toBe(false)
  })

  it('should return true for display columns that provide getGroupingValue', () => {
    const groupableColumns: Array<ColumnDef<typeof features, Sale, any>> = [
      {
        id: 'derived',
        header: 'Derived',
        getGroupingValue: (row) => row.status,
      },
    ]
    const table = constructTable({ features, data, columns: groupableColumns })

    expect(column_getCanGroup(table.getColumn('derived')!)).toBe(true)
  })

  it('should return false when grouping is disabled for the column', () => {
    const groupColumns: Array<ColumnDef<typeof features, Sale, any>> = [
      { accessorKey: 'status', id: 'status', enableGrouping: false },
    ]
    const table = constructTable({ features, data, columns: groupColumns })

    expect(column_getCanGroup(table.getColumn('status')!)).toBe(false)
  })

  it('should return false when grouping is disabled table-wide', () => {
    const table = makeTable({ enableGrouping: false })

    expect(column_getCanGroup(table.getColumn('status')!)).toBe(false)
  })
})

describe('column_getIsGrouped / column_getGroupedIndex', () => {
  it('should read the grouping state for this column', () => {
    const table = makeTable({
      initialState: { grouping: ['label', 'status'] },
    })

    expect(column_getIsGrouped(table.getColumn('status')!)).toBe(true)
    expect(column_getIsGrouped(table.getColumn('amount')!)).toBe(false)
    expect(column_getGroupedIndex(table.getColumn('label')!)).toBe(0)
    expect(column_getGroupedIndex(table.getColumn('status')!)).toBe(1)
    expect(column_getGroupedIndex(table.getColumn('amount')!)).toBe(-1)
  })
})

describe('column_getToggleGroupingHandler', () => {
  it('should toggle grouping for groupable columns', () => {
    const onGroupingChange = vi.fn()
    const table = makeTable({ onGroupingChange })

    column_getToggleGroupingHandler(table.getColumn('status')!)()

    expect(getUpdaterResult(onGroupingChange, [])).toEqual(['status'])
  })

  it('should be a no-op when the column cannot group', () => {
    const onGroupingChange = vi.fn()
    const table = makeTable({ onGroupingChange, enableGrouping: false })

    column_getToggleGroupingHandler(table.getColumn('status')!)()

    expect(onGroupingChange).not.toHaveBeenCalled()
  })
})

describe('column_getAutoAggregationFn', () => {
  it('should choose sum for number columns', () => {
    const table = makeTable()

    expect(column_getAutoAggregationFn(table.getColumn('amount')!)).toBe(
      aggregationFns.sum,
    )
  })

  it('should choose extent for date columns', () => {
    const table = makeTable()

    expect(column_getAutoAggregationFn(table.getColumn('soldAt')!)).toBe(
      aggregationFns.extent,
    )
  })

  it('should leave other value types unspecified', () => {
    const table = makeTable()

    expect(
      column_getAutoAggregationFn(table.getColumn('status')!),
    ).toBeUndefined()
  })
})

describe('table_setGrouping / table_resetGrouping', () => {
  it('should route the updater through onGroupingChange', () => {
    const onGroupingChange = vi.fn()
    const table = makeTable({ onGroupingChange })

    table_setGrouping(table, ['status'])

    expect(onGroupingChange).toHaveBeenCalledWith(['status'])
  })

  it('should reset to an empty array when defaultState is true', () => {
    const onGroupingChange = vi.fn()
    const table = makeTable({
      onGroupingChange,
      initialState: { grouping: ['status'] },
    })

    table_resetGrouping(table, true)

    expect(onGroupingChange).toHaveBeenCalledWith([])
  })

  it('should reset to the initial grouping by default', () => {
    const onGroupingChange = vi.fn()
    const table = makeTable({
      onGroupingChange,
      initialState: { grouping: ['status'] },
      state: { grouping: [] },
    })

    table_resetGrouping(table)

    expect(onGroupingChange).toHaveBeenCalledWith(['status'])
  })
})

describe('row_getIsGrouped', () => {
  it('should distinguish grouped rows from leaf rows', () => {
    const table = makeTable({ initialState: { grouping: ['status'] } })
    const groupRow = table.getGroupedRowModel().rows[0]!
    const leafRow = groupRow.subRows[0]!

    expect(row_getIsGrouped(groupRow)).toBe(true)
    expect(row_getIsGrouped(leafRow)).toBe(false)
  })
})

describe('row_getGroupingValue', () => {
  it('should fall back to the accessor value', () => {
    const table = makeTable()
    const row = table.getCoreRowModel().rows[0]!

    expect(row_getGroupingValue(row, 'status')).toBe('a')
  })

  it('should prefer getGroupingValue and cache the result per row', () => {
    const getGroupingValue = vi.fn((original: Sale) =>
      original.status.toUpperCase(),
    )
    const groupColumns: Array<ColumnDef<typeof features, Sale, any>> = [
      { accessorKey: 'status', id: 'status', getGroupingValue },
    ]
    const table = constructTable({ features, data, columns: groupColumns })
    const row = table.getCoreRowModel().rows[0]!

    expect(row_getGroupingValue(row, 'status')).toBe('A')
    expect(row_getGroupingValue(row, 'status')).toBe('A')
    expect(getGroupingValue).toHaveBeenCalledTimes(1)
  })
})

describe('cell grouping states', () => {
  // grouped by status and label: the first-level group rows carry
  // groupingColumnId 'status', so their label cells are placeholders
  function makeGroupedTable() {
    return makeTable({ initialState: { grouping: ['status', 'label'] } })
  }

  it('cell_getIsGrouped should be true only for the row grouping column cell', () => {
    const table = makeGroupedTable()
    const groupRow = table.getGroupedRowModel().rows[0]!
    const cells = groupRow.getAllCells()

    expect(
      cell_getIsGrouped(cells.find((c) => c.column.id === 'status')!),
    ).toBe(true)
    expect(cell_getIsGrouped(cells.find((c) => c.column.id === 'label')!)).toBe(
      false,
    )
    expect(
      cell_getIsGrouped(cells.find((c) => c.column.id === 'amount')!),
    ).toBe(false)
  })

  it('cell_getIsPlaceholder should be true for other grouped column cells', () => {
    const table = makeGroupedTable()
    const groupRow = table.getGroupedRowModel().rows[0]!
    const cells = groupRow.getAllCells()

    expect(
      cell_getIsPlaceholder(cells.find((c) => c.column.id === 'label')!),
    ).toBe(true)
    expect(
      cell_getIsPlaceholder(cells.find((c) => c.column.id === 'status')!),
    ).toBe(false)
    expect(
      cell_getIsPlaceholder(cells.find((c) => c.column.id === 'amount')!),
    ).toBe(false)
  })

  it('cell_getIsAggregated should be true for ungrouped cells on rows with subRows', () => {
    const table = makeGroupedTable()
    const groupRow = table.getGroupedRowModel().rows[0]!
    const cells = groupRow.getAllCells()

    expect(
      cell_getIsAggregated(cells.find((c) => c.column.id === 'amount')!),
    ).toBe(true)
    expect(
      cell_getIsAggregated(cells.find((c) => c.column.id === 'status')!),
    ).toBe(false)
  })

  it('should report no aggregated cells on leaf rows', () => {
    const table = makeGroupedTable()
    const groupRow = table.getGroupedRowModel().rows[0]!
    const leafRow = groupRow.subRows[0]!.subRows[0]!
    const cells = leafRow.getAllCells()

    expect(
      cell_getIsGrouped(cells.find((c) => c.column.id === 'status')!),
    ).toBe(false)
    expect(
      cell_getIsAggregated(cells.find((c) => c.column.id === 'amount')!),
    ).toBe(false)
  })
})
