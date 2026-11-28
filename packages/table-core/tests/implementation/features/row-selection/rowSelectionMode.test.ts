import { describe, expect, it, vi } from 'vitest'
import {
  columnFilteringFeature,
  columnGroupingFeature,
  constructTable,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import type {
  RowSelectionMode,
  RowSelectionState,
  TableOptions,
  ToggleSelectedOptions,
} from '../../../../src'

interface TestRow {
  id: string
  kind?: string
  value: number
  subRows?: Array<TestRow>
}

const selectionFeatures = testFeatures({ rowSelectionFeature })
const pipelineFeatures = testFeatures({
  columnFilteringFeature,
  columnGroupingFeature,
  filterFns,
  filteredRowModel: createFilteredRowModel(),
  groupedRowModel: createGroupedRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  sortedRowModel: createSortedRowModel(),
})

function makeRows(start: number, length: number): Array<TestRow> {
  return Array.from({ length }, (_, index) => ({
    id: String(start + index),
    kind: (start + index) % 2 ? 'odd' : 'even',
    value: start + index,
  }))
}

const flatData = makeRows(0, 6)

const nestedData: Array<TestRow> = [
  {
    id: 'a',
    value: 0,
    subRows: [
      { id: 'a.1', value: 1 },
      { id: 'a.2', value: 2 },
    ],
  },
  { id: 'b', value: 3, subRows: [{ id: 'b.1', value: 4 }] },
]

const otherNestedData: Array<TestRow> = [
  { id: 'c', value: 5, subRows: [{ id: 'c.1', value: 6 }] },
  { id: 'd', value: 7 },
]

function makeSelectionTable(
  options: Partial<
    Omit<
      TableOptions<typeof selectionFeatures, TestRow>,
      'columns' | 'data' | 'features'
    >
  > = {},
  data: Array<TestRow> = flatData,
) {
  return constructTable<typeof selectionFeatures, TestRow>({
    features: selectionFeatures,
    columns: [{ accessorKey: 'value', id: 'value' }],
    data,
    getRowId: (row) => row.id,
    getSubRows: (row) => row.subRows,
    ...options,
  })
}

function makePipelineTable(
  options: Partial<
    Omit<
      TableOptions<typeof pipelineFeatures, TestRow>,
      'columns' | 'data' | 'features'
    >
  > = {},
  data: Array<TestRow> = flatData,
) {
  return constructTable<typeof pipelineFeatures, TestRow>({
    features: pipelineFeatures,
    columns: [
      { accessorKey: 'id', id: 'id', filterFn: 'includesString' },
      { accessorKey: 'kind', id: 'kind', filterFn: 'equalsString' },
      { accessorKey: 'value', id: 'value' },
    ],
    data,
    getRowId: (row) => row.id,
    getSubRows: (row) => row.subRows,
    ...options,
  })
}

function interact(
  row: {
    getToggleSelectedHandler: (
      opts?: ToggleSelectedOptions,
    ) => (event: unknown) => void
  },
  checked: boolean,
  event: Record<string, unknown> = {},
) {
  row.getToggleSelectedHandler()({ target: { checked }, ...event })
}

function ids(table: { atoms: { rowSelection: { get(): RowSelectionState } } }) {
  return Object.keys(table.atoms.rowSelection.get()).sort()
}

function mode(table: {
  atoms: { rowSelectionMode: { get(): RowSelectionMode } }
}) {
  return table.atoms.rowSelectionMode.get()
}

describe('row selection mode without manualRowSelection', () => {
  it('selects and deselects the loaded row ids and never writes the mode', () => {
    const onRowSelectionModeChange = vi.fn()
    const table = makeSelectionTable({
      onRowSelectionModeChange,
      initialState: { rowSelection: { '99': true } },
    })

    table.toggleAllRowsSelected(true)
    expect(ids(table)).toEqual(['0', '1', '2', '3', '4', '5', '99'])
    expect(table.getIsAllRowsSelected()).toBe(true)
    expect(table.getSelectedRowCount()).toBe(7)

    table.toggleAllRowsSelected(false)
    expect(ids(table)).toEqual(['99'])

    table.getRow('1').toggleSelected(true)
    table.toggleAllPageRowsSelected(false, { deselectAll: true })
    table.resetRowSelection()
    table.resetRowSelection(true)

    expect(mode(table)).toBe('include')
    expect(onRowSelectionModeChange).not.toHaveBeenCalled()
  })

  it('ignores an exclude mode that the option does not allow', () => {
    const table = makeSelectionTable({
      initialState: {
        rowSelection: { '1': true },
        rowSelectionMode: 'exclude',
      },
    })

    expect(table.getRow('1').getIsSelected()).toBe(true)
    expect(table.getRow('2').getIsSelected()).toBe(false)
    expect(table.getIsAllRowsSelected()).toBe(false)
    expect(table.getIsSomeRowsSelected()).toBe(true)
    expect(table.getSelectedRowIds()).toEqual(['1'])
    expect(table.getSelectedRowCount()).toBe(1)
    expect(table.getSelectedRowModel().flatRows.map((row) => row.id)).toEqual([
      '1',
    ])

    table.getRow('2').toggleSelected(true)
    expect(ids(table)).toEqual(['1', '2'])

    table.getRow('1').toggleSelected(false)
    expect(ids(table)).toEqual(['2'])

    table.toggleAllRowsSelected(true)
    expect(ids(table)).toEqual(['0', '1', '2', '3', '4', '5'])
    expect(mode(table)).toBe('exclude')
  })

  it('reads all-selected from the loaded rows', () => {
    const table = makeSelectionTable({
      initialState: {
        rowSelection: Object.fromEntries(
          flatData.map((row) => [row.id, true as const]),
        ),
      },
    })

    expect(table.getIsAllRowsSelected()).toBe(true)
  })
})

describe('toggleAllRowsSelected with manualRowSelection', () => {
  it('selects all rows by switching to exclude mode with no ids', () => {
    const table = makeSelectionTable({
      manualRowSelection: true,
      initialState: { rowSelection: { '1': true, '99': true } },
    })

    table.toggleAllRowsSelected(true)

    expect(mode(table)).toBe('exclude')
    expect(ids(table)).toEqual([])
    expect(table.getIsAllRowsSelected()).toBe(true)
    expect(table.getIsSomeRowsSelected()).toBe(true)
  })

  it('deselects all rows by switching to include mode with no ids', () => {
    const table = makeSelectionTable({
      manualRowSelection: true,
      enableRowSelection: (row) => row.id !== '0',
      initialState: {
        rowSelection: { '0': true, '99': true },
        rowSelectionMode: 'exclude',
      },
    })

    table.toggleAllRowsSelected(false)

    expect(mode(table)).toBe('include')
    expect(ids(table)).toEqual([])
    expect(table.getIsAllRowsSelected()).toBe(false)
    expect(table.getIsSomeRowsSelected()).toBe(false)
  })

  it('toggles from the all-selected state when no value is passed', () => {
    const table = makeSelectionTable({ manualRowSelection: true })

    table.toggleAllRowsSelected()
    expect(mode(table)).toBe('exclude')

    table.toggleAllRowsSelected()
    expect(mode(table)).toBe('include')

    table.toggleAllRowsSelected()
    table.getRow('2').toggleSelected(false)
    table.toggleAllRowsSelected()
    expect(mode(table)).toBe('exclude')
    expect(ids(table)).toEqual([])
  })

  it('follows the checked value of the select-all handler', () => {
    const table = makeSelectionTable({ manualRowSelection: true })

    table.getToggleAllRowsSelectedHandler()({ target: { checked: true } })
    expect(mode(table)).toBe('exclude')

    table.getToggleAllRowsSelectedHandler()({ target: { checked: false } })
    expect(mode(table)).toBe('include')
  })

  it('does not report all-selected in include mode, because loaded rows are not all rows', () => {
    const table = makeSelectionTable({
      manualRowSelection: true,
      initialState: {
        rowSelection: Object.fromEntries(
          flatData.map((row) => [row.id, true as const]),
        ),
      },
    })

    expect(table.getIsAllRowsSelected()).toBe(false)
    expect(table.getIsSomeRowsSelected()).toBe(true)
    expect(table.getIsAllPageRowsSelected()).toBe(true)

    table.toggleAllRowsSelected()
    expect(mode(table)).toBe('exclude')
    expect(ids(table)).toEqual([])
  })

  it('selects nothing when rowCount is 0', () => {
    const table = makeSelectionTable(
      { manualRowSelection: true, rowCount: 0 },
      [],
    )

    table.toggleAllRowsSelected(true)

    expect(mode(table)).toBe('include')
    expect(table.getIsAllRowsSelected()).toBe(false)
    expect(table.getIsSomeRowsSelected()).toBe(false)
    expect(table.getSelectedRowCount()).toBe(0)

    table.toggleAllRowsSelected()
    expect(mode(table)).toBe('include')
  })

  it('selects nothing when row selection is off', () => {
    const table = makeSelectionTable({
      manualRowSelection: true,
      rowCount: 6,
      enableRowSelection: false,
      initialState: { rowSelection: { '0': true } },
    })

    table.toggleAllRowsSelected(true)
    expect(mode(table)).toBe('include')
    expect(ids(table)).toEqual(['0'])

    table.toggleAllRowsSelected()
    expect(mode(table)).toBe('include')
    expect(ids(table)).toEqual(['0'])

    table.toggleAllRowsSelected(false)
    expect(ids(table)).toEqual([])
  })
})

describe('row selection in exclude mode', () => {
  it('matches the example of the proposal', () => {
    const table = makePipelineTable(
      {
        manualPagination: true,
        manualRowSelection: true,
        rowCount: 100_000,
      },
      makeRows(0, 10),
    )

    table.toggleAllRowsSelected(true)
    expect(table.store.state.rowSelectionMode).toBe('exclude')

    table.getRow('7').toggleSelected(false)
    expect(table.store.state.rowSelection['7']).toBe(true)

    expect(table.getIsAllRowsSelected()).toBe(false)
    expect(table.getIsSomeRowsSelected()).toBe(true)
    expect(table.getSelectedRowCount()).toBe(99_999)
  })

  it('reads a row as selected when its id is not in the state', () => {
    const table = makeSelectionTable({
      manualRowSelection: true,
      initialState: {
        rowSelection: { '1': true },
        rowSelectionMode: 'exclude',
      },
    })

    expect(table.getRow('0').getIsSelected()).toBe(true)
    expect(table.getRow('1').getIsSelected()).toBe(false)
  })

  it('adds the id on deselect and removes it on select', () => {
    const table = makeSelectionTable({ manualRowSelection: true })
    table.toggleAllRowsSelected(true)

    table.getRow('2').toggleSelected(false)
    table.getRow('4').toggleSelected()
    expect(ids(table)).toEqual(['2', '4'])

    table.getRow('2').toggleSelected(true)
    table.getRow('4').toggleSelected()
    expect(ids(table)).toEqual([])
    expect(mode(table)).toBe('exclude')
    expect(table.getIsAllRowsSelected()).toBe(true)
  })

  it('shows rows that load later as selected', () => {
    const table = makePipelineTable(
      { manualPagination: true, manualRowSelection: true, rowCount: 12 },
      makeRows(0, 6),
    )
    table.toggleAllRowsSelected(true)
    table.getRow('3').toggleSelected(false)

    table.setOptions((prev) => ({ ...prev, data: makeRows(6, 6) }))

    expect(table.getRowModel().rows.map((row) => row.getIsSelected())).toEqual([
      true,
      true,
      true,
      true,
      true,
      true,
    ])
    expect(table.getIsAllPageRowsSelected()).toBe(true)
    expect(table.getIsAllRowsSelected()).toBe(false)
    expect(table.getSelectedRowCount()).toBe(11)
    expect(ids(table)).toEqual(['3'])
  })

  it('does not select a row that cannot be selected again', () => {
    const table = makeSelectionTable({
      manualRowSelection: true,
      enableRowSelection: (row) => row.id !== '1',
      initialState: {
        rowSelection: { '1': true, '2': true },
        rowSelectionMode: 'exclude',
      },
    })

    table.getRow('1').toggleSelected(true)
    interact(table.getRow('1'), true)
    expect(ids(table)).toEqual(['1', '2'])

    table.getRow('2').toggleSelected(true)
    expect(ids(table)).toEqual(['1'])
  })

  it('reads a loaded row that cannot be selected as selected', () => {
    const table = makeSelectionTable(
      {
        manualRowSelection: true,
        rowCount: 3,
        enableRowSelection: (row) => row.id !== '2',
      },
      makeRows(0, 3),
    )
    table.toggleAllRowsSelected(true)

    interact(table.getRow('0'), false)
    interact(table.getRow('1'), false)
    interact(table.getRow('2'), false)
    table.toggleAllPageRowsSelected(false)

    expect(mode(table)).toBe('exclude')
    expect(ids(table)).toEqual(['0', '1'])
    expect(table.getRow('2').getCanSelect()).toBe(false)
    expect(table.getRow('2').getIsSelected()).toBe(true)
    expect(table.getSelectedRowModel().rows.map((row) => row.id)).toEqual(['2'])
    expect(table.getSelectedRowIds()).toEqual(['2'])
    expect(table.getSelectedRowCount()).toBe(1)
    expect(table.getIsSomeRowsSelected()).toBe(true)
    expect(table.getIsSomePageRowsSelected()).toBe(false)
  })

  it('goes back to include mode with one id when a single-select row is selected', () => {
    const table = makeSelectionTable({
      manualRowSelection: true,
      enableMultiRowSelection: false,
      initialState: {
        rowSelection: { '1': true, '2': true },
        rowSelectionMode: 'exclude',
      },
    })

    table.getRow('2').toggleSelected(true)

    expect(mode(table)).toBe('include')
    expect(ids(table)).toEqual(['2'])
    expect(
      flatData.filter((row) => table.getRow(row.id).getIsSelected()),
    ).toEqual([flatData[2]])
  })

  it('applies a Shift range to the deselected ids', () => {
    const table = makeSelectionTable({ manualRowSelection: true })
    table.toggleAllRowsSelected(true)

    interact(table.getRow('1'), false)
    interact(table.getRow('3'), false, { shiftKey: true })
    expect(ids(table)).toEqual(['1', '2', '3'])

    interact(table.getRow('2'), true, { shiftKey: true })
    expect(ids(table)).toEqual(['1'])
    expect(mode(table)).toBe('exclude')
  })

  it('supports controlled mode state', () => {
    let rowSelection: RowSelectionState = {}
    let rowSelectionMode: RowSelectionMode = 'include'
    const table = makeSelectionTable({
      manualRowSelection: true,
      state: { rowSelection, rowSelectionMode },
      onRowSelectionChange: (updater) => {
        rowSelection =
          typeof updater === 'function' ? updater(rowSelection) : updater
        table.setOptions((prev) => ({
          ...prev,
          state: { ...prev.state, rowSelection },
        }))
      },
      onRowSelectionModeChange: (updater) => {
        rowSelectionMode =
          typeof updater === 'function' ? updater(rowSelectionMode) : updater
        table.setOptions((prev) => ({
          ...prev,
          state: { ...prev.state, rowSelectionMode },
        }))
      },
    })

    table.toggleAllRowsSelected(true)
    table.getRow('5').toggleSelected(false)

    expect(rowSelectionMode).toBe('exclude')
    expect(rowSelection).toEqual({ '5': true })
    expect(table.getRow('5').getIsSelected()).toBe(false)
    expect(table.getRow('0').getIsSelected()).toBe(true)
  })
})

describe('getSelectedRowCount', () => {
  it('counts the ids in include mode', () => {
    const table = makeSelectionTable({
      manualRowSelection: true,
      rowCount: 100,
      initialState: { rowSelection: { '0': true, '1': true, '99': true } },
    })

    expect(table.getSelectedRowCount()).toBe(3)
  })

  it('subtracts the deselected ids from rowCount in exclude mode', () => {
    const table = makeSelectionTable({
      manualRowSelection: true,
      rowCount: 100,
      initialState: {
        rowSelection: { '0': true, '50': true },
        rowSelectionMode: 'exclude',
      },
    })

    expect(table.getSelectedRowCount()).toBe(98)

    table.setOptions((prev) => ({ ...prev, rowCount: 1 }))
    expect(table.getSelectedRowCount()).toBe(0)
  })

  it('counts the selected filtered top-level rows when rowCount is not set', () => {
    const table = makePipelineTable({
      manualRowSelection: true,
      initialState: {
        columnFilters: [{ id: 'kind', value: 'even' }],
        rowSelection: { '0': true, '1': true },
        rowSelectionMode: 'exclude',
      },
    })

    expect(table.getSelectedRowCount()).toBe(2)
  })

  it('does not subtract loaded sub-rows, because rowCount counts top-level rows', () => {
    const table = makeSelectionTable(
      { manualRowSelection: true, rowCount: 20 },
      nestedData,
    )
    table.toggleAllRowsSelected(true)

    table.getRow('a').toggleSelected(false)

    expect(ids(table)).toEqual(['a', 'a.1', 'a.2'])
    expect(table.getSelectedRowCount()).toBe(19)
  })

  it('counts an id that is not loaded as one row', () => {
    const table = makeSelectionTable(
      { manualRowSelection: true, rowCount: 20 },
      nestedData,
    )
    table.toggleAllRowsSelected(true)
    table.getRow('a').toggleSelected(false)

    table.setOptions((prev) => ({ ...prev, data: otherNestedData }))
    expect(table.getSelectedRowCount()).toBe(17)

    table.setOptions((prev) => ({ ...prev, data: nestedData }))
    expect(table.getSelectedRowCount()).toBe(19)
  })

  it('does not count the id of a group row', () => {
    const table = makePipelineTable({
      manualRowSelection: true,
      rowCount: 6,
      initialState: { grouping: ['kind'] },
    })
    table.toggleAllRowsSelected(true)

    table.getRow('kind:even', true).toggleSelected(false)

    expect(ids(table)).toEqual(['0', '2', '4', 'kind:even'])
    expect(table.getSelectedRowCount()).toBe(3)
  })

  it('follows rowCount, the selection, the mode, and the loaded rows', () => {
    const table = makeSelectionTable(
      { manualRowSelection: true, rowCount: 20 },
      nestedData,
    )
    expect(table.getSelectedRowCount()).toBe(0)

    table.setRowSelectionMode('exclude')
    expect(table.getSelectedRowCount()).toBe(20)

    table.setRowSelection({ 'a.1': true, b: true })
    expect(table.getSelectedRowCount()).toBe(19)

    table.setOptions((prev) => ({ ...prev, rowCount: 10 }))
    expect(table.getSelectedRowCount()).toBe(9)

    table.setOptions((prev) => ({ ...prev, data: otherNestedData }))
    expect(table.getSelectedRowCount()).toBe(8)

    table.setOptions((prev) => ({ ...prev, rowCount: undefined }))
    expect(table.getSelectedRowCount()).toBe(2)

    table.setOptions((prev) => ({ ...prev, data: nestedData }))
    expect(table.getSelectedRowCount()).toBe(1)

    table.setOptions((prev) => ({ ...prev, manualRowSelection: false }))
    expect(table.getSelectedRowCount()).toBe(2)
  })
})

describe('selected row models in exclude mode', () => {
  it('contain every loaded row when no id is deselected', () => {
    const table = makePipelineTable({ manualRowSelection: true })
    table.toggleAllRowsSelected(true)

    expect(table.getSelectedRowModel().rows).toHaveLength(6)
    expect(table.getFilteredSelectedRowModel().rows).toHaveLength(6)
    expect(table.getGroupedSelectedRowModel().rows).toHaveLength(6)
    expect(table.getSelectedRowIds()).toEqual(['0', '1', '2', '3', '4', '5'])
  })

  it('contain the loaded rows that are not deselected', () => {
    const table = makePipelineTable({
      manualRowSelection: true,
      initialState: {
        columnFilters: [{ id: 'kind', value: 'even' }],
        rowSelection: { '0': true, '1': true, '99': true },
        rowSelectionMode: 'exclude',
      },
    })

    expect(table.getSelectedRowModel().flatRows.map((row) => row.id)).toEqual([
      '2',
      '3',
      '4',
      '5',
    ])
    expect(Object.keys(table.getSelectedRowModel().rowsById)).toEqual([
      '2',
      '3',
      '4',
      '5',
    ])
    expect(
      table.getFilteredSelectedRowModel().flatRows.map((row) => row.id),
    ).toEqual(['2', '4'])
    expect(
      table.getGroupedSelectedRowModel().flatRows.map((row) => row.id),
    ).toEqual(['2', '4'])
    expect(table.getSelectedRowIds()).toEqual(['2', '3', '4', '5'])
  })

  it('keep selected sub-rows of a deselected parent', () => {
    const table = makeSelectionTable(
      {
        manualRowSelection: true,
        initialState: {
          rowSelection: { a: true, 'a.1': true },
          rowSelectionMode: 'exclude',
        },
      },
      nestedData,
    )
    const selected = table.getSelectedRowModel()

    expect(selected.rows.map((row) => row.id)).toEqual(['b'])
    expect(selected.flatRows.map((row) => row.id)).toEqual(['a.2', 'b', 'b.1'])
  })
})

describe('page selection in exclude mode', () => {
  function makePagedTable() {
    const table = makePipelineTable({
      manualRowSelection: true,
      initialState: { pagination: { pageIndex: 0, pageSize: 2 } },
    })
    table.toggleAllRowsSelected(true)
    return table
  }

  it('reads the page state from the deselected ids', () => {
    const table = makePagedTable()
    expect(table.getIsAllPageRowsSelected()).toBe(true)
    expect(table.getIsSomePageRowsSelected()).toBe(true)

    table.getRow('0').toggleSelected(false)
    expect(table.getIsAllPageRowsSelected()).toBe(false)
    expect(table.getIsSomePageRowsSelected()).toBe(true)

    table.getRow('1').toggleSelected(false)
    expect(table.getIsAllPageRowsSelected()).toBe(false)
    expect(table.getIsSomePageRowsSelected()).toBe(false)
  })

  it('deselects and selects the page rows only', () => {
    const table = makePagedTable()

    table.toggleAllPageRowsSelected(false)
    expect(ids(table)).toEqual(['0', '1'])
    expect(mode(table)).toBe('exclude')
    expect(table.getRow('2').getIsSelected()).toBe(true)

    table.toggleAllPageRowsSelected()
    expect(ids(table)).toEqual([])

    table.toggleAllPageRowsSelected()
    expect(ids(table)).toEqual(['0', '1'])

    table.getToggleAllPageRowsSelectedHandler()({ target: { checked: true } })
    expect(ids(table)).toEqual([])
  })

  it('keeps page rows that cannot be selected out of the deselected ids', () => {
    const table = makePipelineTable({
      manualRowSelection: true,
      enableRowSelection: (row) => row.id !== '0',
      initialState: {
        pagination: { pageIndex: 0, pageSize: 2 },
        rowSelectionMode: 'exclude',
      },
    })

    table.toggleAllPageRowsSelected(false)

    expect(ids(table)).toEqual(['1'])
  })

  it('deselects every row with the deselectAll option', () => {
    const table = makePagedTable()
    table.getRow('4').toggleSelected(false)

    table.toggleAllPageRowsSelected(false, { deselectAll: true })

    expect(mode(table)).toBe('include')
    expect(ids(table)).toEqual([])
  })
})

describe('sub-row selection in exclude mode', () => {
  function makeNestedTable(
    options: Parameters<typeof makeSelectionTable>[0] = {},
  ) {
    const table = makeSelectionTable(
      { manualRowSelection: true, ...options },
      nestedData,
    )
    table.toggleAllRowsSelected(true)
    return table
  }

  it('deselects and selects the sub-rows with their parent', () => {
    const table = makeNestedTable()

    table.getRow('a').toggleSelected(false)
    expect(ids(table)).toEqual(['a', 'a.1', 'a.2'])
    expect(table.getRow('a.1').getIsSelected()).toBe(false)
    expect(table.getRow('b.1').getIsSelected()).toBe(true)

    table.getRow('a').toggleSelected(true)
    expect(ids(table)).toEqual([])
  })

  it('leaves the sub-rows alone when selectChildren is false or sub-row selection is off', () => {
    const table = makeNestedTable()
    table.getRow('a').toggleSelected(false, { selectChildren: false })
    expect(ids(table)).toEqual(['a'])

    const blocked = makeNestedTable({ enableSubRowSelection: false })
    blocked.getRow('a').toggleSelected(false)
    expect(ids(blocked)).toEqual(['a'])
  })

  it('reports the sub-row state of a parent', () => {
    const table = makeNestedTable()
    const parent = table.getRow('a')

    expect(parent.getIsAllSubRowsSelected()).toBe(true)
    expect(parent.getIsSomeSelected()).toBe(false)

    table.getRow('a.1').toggleSelected(false)
    expect(parent.getIsAllSubRowsSelected()).toBe(false)
    expect(parent.getIsSomeSelected()).toBe(true)
    expect(parent.getIsSelected()).toBe(true)

    table.getRow('a.2').toggleSelected(false)
    expect(parent.getIsAllSubRowsSelected()).toBe(false)
    expect(parent.getIsSomeSelected()).toBe(false)
  })

  it('deselects the ancestors with the deselectParents option', () => {
    const table = makeNestedTable()

    table.getRow('a.1').toggleSelected(false, { deselectParents: true })

    expect(ids(table)).toEqual(['a', 'a.1'])
    expect(table.getRow('a').getIsSelected()).toBe(false)
    expect(table.getRow('a.2').getIsSelected()).toBe(true)
  })
})

describe('exclude mode when the deselected rows cover every row', () => {
  it('leaves no row selected after the last row is deselected', () => {
    const table = makeSelectionTable(
      { manualRowSelection: true, rowCount: 3 },
      makeRows(0, 3),
    )
    table.toggleAllRowsSelected(true)

    table.getRow('0').toggleSelected(false)
    table.getRow('1').toggleSelected(false)
    table.getRow('2').toggleSelected(false)

    expect(mode(table)).toBe('include')
    expect(ids(table)).toEqual([])
    expect(table.getIsSomeRowsSelected()).toBe(false)
    expect(table.getSelectedRowCount()).toBe(0)
    expect(table.getRow('0').getIsSelected()).toBe(false)
  })

  it('also applies to page and range deselection', () => {
    const paged = makePipelineTable(
      {
        manualPagination: true,
        manualRowSelection: true,
        rowCount: 3,
      },
      makeRows(0, 3),
    )
    paged.toggleAllRowsSelected(true)
    paged.toggleAllPageRowsSelected(false)
    expect(mode(paged)).toBe('include')
    expect(ids(paged)).toEqual([])

    const ranged = makeSelectionTable(
      { manualRowSelection: true, rowCount: 3 },
      makeRows(0, 3),
    )
    ranged.toggleAllRowsSelected(true)
    interact(ranged.getRow('0'), false)
    interact(ranged.getRow('2'), false, { shiftKey: true })
    expect(mode(ranged)).toBe('include')
    expect(ids(ranged)).toEqual([])
  })

  it('stays in exclude mode when rowCount is not known', () => {
    const table = makeSelectionTable(
      { manualRowSelection: true },
      makeRows(0, 2),
    )
    table.toggleAllRowsSelected(true)

    table.getRow('0').toggleSelected(false)
    table.getRow('1').toggleSelected(false)

    expect(mode(table)).toBe('exclude')
    expect(ids(table)).toEqual(['0', '1'])
    expect(table.getSelectedRowCount()).toBe(0)
  })

  it('does not count loaded sub-rows against rowCount', () => {
    const table = makeSelectionTable(
      { manualRowSelection: true, rowCount: 2 },
      nestedData,
    )
    table.toggleAllRowsSelected(true)

    table.getRow('a').toggleSelected(false)
    expect(mode(table)).toBe('exclude')
    expect(ids(table)).toEqual(['a', 'a.1', 'a.2'])
    expect(table.getRow('b').getIsSelected()).toBe(true)

    table.getRow('b').toggleSelected(false)
    expect(mode(table)).toBe('include')
    expect(ids(table)).toEqual([])
  })

  it('applies across pages when every row of a flat table was deselected', () => {
    const table = makeSelectionTable(
      { manualRowSelection: true, rowCount: 4, getSubRows: undefined },
      makeRows(0, 2),
    )
    table.toggleAllRowsSelected(true)
    table.toggleAllPageRowsSelected(false)

    table.setOptions((prev) => ({ ...prev, data: makeRows(2, 2) }))
    table.getRow('2').toggleSelected(false)
    expect(mode(table)).toBe('exclude')

    table.getRow('3').toggleSelected(false)
    expect(mode(table)).toBe('include')
    expect(ids(table)).toEqual([])
  })

  it('keeps exclude mode while a loaded sub-row is selected', () => {
    const blocked = makeSelectionTable(
      { manualRowSelection: true, rowCount: 2, enableSubRowSelection: false },
      nestedData,
    )
    blocked.toggleAllRowsSelected(true)
    interact(blocked.getRow('a'), false)
    interact(blocked.getRow('b'), false)

    expect(mode(blocked)).toBe('exclude')
    expect(ids(blocked)).toEqual(['a', 'b'])
    expect(blocked.getRow('a.1').getIsSelected()).toBe(true)
    expect(blocked.getSelectedRowIds()).toEqual(['a.1', 'a.2', 'b.1'])

    const parentsOnly = makeSelectionTable(
      { manualRowSelection: true, rowCount: 2 },
      nestedData,
    )
    parentsOnly.toggleAllRowsSelected(true)
    parentsOnly.getRow('a').toggleSelected(false, { selectChildren: false })
    parentsOnly.getRow('b').toggleSelected(false, { selectChildren: false })

    expect(mode(parentsOnly)).toBe('exclude')
    expect(parentsOnly.getRow('b.1').getIsSelected()).toBe(true)

    const pruned = makeSelectionTable(
      { manualRowSelection: true, rowCount: 2 },
      nestedData,
    )
    pruned.toggleAllRowsSelected(true)
    pruned.getRow('a.1').toggleSelected(false, { deselectParents: true })
    pruned.getRow('b.1').toggleSelected(false, { deselectParents: true })

    expect(mode(pruned)).toBe('exclude')
    expect(pruned.getRow('a.2').getIsSelected()).toBe(true)

    pruned.getRow('a.2').toggleSelected(false)
    expect(mode(pruned)).toBe('include')
    expect(ids(pruned)).toEqual([])
  })

  it('keeps exclude mode when ids of an unloaded page reach rowCount', () => {
    const table = makeSelectionTable(
      { manualRowSelection: true, rowCount: 4 },
      nestedData,
    )
    table.toggleAllRowsSelected(true)
    table.getRow('a').toggleSelected(false)

    table.setOptions((prev) => ({ ...prev, data: otherNestedData }))
    table.getRow('c').toggleSelected(false, { selectChildren: false })

    expect(mode(table)).toBe('exclude')
    expect(ids(table)).toEqual(['a', 'a.1', 'a.2', 'c'])
    expect(table.getRow('d').getIsSelected()).toBe(true)
  })

  it('keeps exclude mode when an id that is not loaded can be a sub-row', () => {
    const table = makeSelectionTable(
      { manualRowSelection: true, rowCount: 4 },
      nestedData,
    )
    table.toggleAllRowsSelected(true)
    table.getRow('a').toggleSelected(false)

    table.setOptions((prev) => ({ ...prev, data: [otherNestedData[1]!] }))
    table.getRow('d').toggleSelected(false)

    expect(mode(table)).toBe('exclude')
    expect(ids(table)).toEqual(['a', 'a.1', 'a.2', 'd'])

    table.setOptions((prev) => ({ ...prev, data: nestedData }))
    expect(table.getRow('b').getIsSelected()).toBe(true)
  })

  it('keeps exclude mode when an id that is not loaded can be an old group row', () => {
    const table = makePipelineTable(
      {
        manualPagination: true,
        manualRowSelection: true,
        rowCount: 4,
        getSubRows: undefined,
        initialState: { grouping: ['kind'] },
      },
      makeRows(0, 2),
    )
    table.toggleAllRowsSelected(true)
    table.getRow('kind:even', true).toggleSelected(false)
    table.setGrouping([])

    table.setOptions((prev) => ({ ...prev, data: makeRows(2, 2) }))
    table.getRow('2').toggleSelected(false)
    table.getRow('3').toggleSelected(false)

    expect(mode(table)).toBe('exclude')
    expect(ids(table)).toEqual(['0', '2', '3', 'kind:even'])

    table.setOptions((prev) => ({ ...prev, data: makeRows(0, 2) }))
    expect(table.getRow('1').getIsSelected()).toBe(true)
  })

  it('keeps exclude mode while a row of another group is selected', () => {
    const table = makePipelineTable({
      manualRowSelection: true,
      rowCount: 6,
      initialState: { grouping: ['kind'] },
    })
    table.toggleAllRowsSelected(true)

    table.getRow('kind:even', true).toggleSelected(false)
    table.getRow('1').toggleSelected(false)
    table.getRow('3').toggleSelected(false)

    expect(mode(table)).toBe('exclude')
    expect(table.getRow('5').getIsSelected()).toBe(true)
    expect(table.getSelectedRowCount()).toBe(1)

    table.getRow('5').toggleSelected(false)
    expect(mode(table)).toBe('include')
    expect(ids(table)).toEqual([])
  })

  it('keeps exclude mode when rowCount changed and loaded rows are selected', () => {
    const table = makeSelectionTable(
      { manualRowSelection: true, rowCount: 100 },
      makeRows(0, 10),
    )
    table.toggleAllRowsSelected(true)
    for (const row of table.getRowModel().rows.slice(0, 5)) {
      row.toggleSelected(false)
    }

    table.setOptions((prev) => ({
      ...prev,
      data: makeRows(50, 3),
      rowCount: 3,
    }))
    table.getRow('50').toggleSelected(false)

    expect(mode(table)).toBe('exclude')
    expect(table.getRow('51').getIsSelected()).toBe(true)
    expect(table.getRow('52').getIsSelected()).toBe(true)
  })

  it('does not apply to a selection that setRowSelection writes', () => {
    const table = makeSelectionTable(
      { manualRowSelection: true, rowCount: 3 },
      makeRows(0, 3),
    )
    table.toggleAllRowsSelected(true)

    table.setRowSelection({ '0': true, '1': true, '2': true })

    expect(mode(table)).toBe('exclude')
    expect(table.getSelectedRowCount()).toBe(0)
  })

  it('does not change the mode when a row is selected', () => {
    const table = makeSelectionTable({
      manualRowSelection: true,
      rowCount: 2,
      initialState: {
        rowSelection: { '0': true, '1': true, '2': true },
        rowSelectionMode: 'exclude',
      },
    })

    table.getRow('0').toggleSelected(true)

    expect(mode(table)).toBe('exclude')
    expect(ids(table)).toEqual(['1', '2'])
  })
})

describe('row selection mode state APIs', () => {
  it('resets the mode together with the selection', () => {
    const table = makeSelectionTable({
      manualRowSelection: true,
      initialState: {
        rowSelection: { '1': true },
        rowSelectionMode: 'exclude',
      },
    })
    table.toggleAllRowsSelected(false)
    table.getRow('3').toggleSelected(true)

    table.resetRowSelection()
    expect(mode(table)).toBe('exclude')
    expect(ids(table)).toEqual(['1'])

    table.resetRowSelection(true)
    expect(mode(table)).toBe('include')
    expect(ids(table)).toEqual([])
  })

  it('sets and resets the mode alone', () => {
    const table = makeSelectionTable({
      manualRowSelection: true,
      initialState: { rowSelection: { '1': true } },
    })

    table.setRowSelectionMode('exclude')
    expect(mode(table)).toBe('exclude')
    expect(ids(table)).toEqual(['1'])
    expect(table.getRow('1').getIsSelected()).toBe(false)

    table.setRowSelectionMode((old) =>
      old === 'exclude' ? 'include' : 'exclude',
    )
    expect(mode(table)).toBe('include')

    table.setRowSelectionMode('exclude')
    table.resetRowSelectionMode()
    expect(mode(table)).toBe('include')
    expect(ids(table)).toEqual(['1'])
  })

  it('resets the mode with table.reset', () => {
    const table = makeSelectionTable({ manualRowSelection: true })
    table.toggleAllRowsSelected(true)
    table.getRow('1').toggleSelected(false)

    table.reset()

    expect(mode(table)).toBe('include')
    expect(ids(table)).toEqual([])
  })
})

describe('row selection mode memoization', () => {
  it('recomputes the getters when only the mode changes', () => {
    const table = makePipelineTable(
      { manualRowSelection: true },
      nestedData.concat(makeRows(0, 2)),
    )
    const parent = table.getRow('a')

    expect(table.getIsAllRowsSelected()).toBe(false)
    expect(table.getIsSomeRowsSelected()).toBe(false)
    expect(table.getIsAllPageRowsSelected()).toBe(false)
    expect(table.getIsSomePageRowsSelected()).toBe(false)
    expect(table.getSelectedRowIds()).toEqual([])
    expect(table.getSelectedRowModel().flatRows).toHaveLength(0)
    expect(table.getFilteredSelectedRowModel().flatRows).toHaveLength(0)
    expect(table.getGroupedSelectedRowModel().flatRows).toHaveLength(0)
    expect(parent.getIsAllSubRowsSelected()).toBe(false)

    table.setRowSelectionMode('exclude')

    expect(table.getIsAllRowsSelected()).toBe(true)
    expect(table.getIsSomeRowsSelected()).toBe(true)
    expect(table.getIsAllPageRowsSelected()).toBe(true)
    expect(table.getIsSomePageRowsSelected()).toBe(true)
    expect(table.getSelectedRowIds()).toHaveLength(7)
    expect(table.getSelectedRowModel().flatRows).toHaveLength(7)
    expect(table.getFilteredSelectedRowModel().flatRows).toHaveLength(7)
    expect(table.getGroupedSelectedRowModel().flatRows).toHaveLength(7)
    expect(parent.getIsAllSubRowsSelected()).toBe(true)
  })

  it('recomputes the getters when the option changes', () => {
    const table = makeSelectionTable({
      manualRowSelection: true,
      initialState: { rowSelectionMode: 'exclude' },
    })

    expect(table.getIsAllRowsSelected()).toBe(true)
    expect(table.getSelectedRowModel().flatRows).toHaveLength(6)

    table.setOptions((prev) => ({ ...prev, manualRowSelection: false }))

    expect(table.getIsAllRowsSelected()).toBe(false)
    expect(table.getIsSomeRowsSelected()).toBe(false)
    expect(table.getSelectedRowModel().flatRows).toHaveLength(0)
    expect(table.getRow('0').getIsSelected()).toBe(false)
  })

  it('lists the selected ids of new data in exclude mode', () => {
    const table = makeSelectionTable(
      { manualRowSelection: true },
      makeRows(0, 2),
    )
    table.toggleAllRowsSelected(true)
    expect(table.getSelectedRowIds()).toEqual(['0', '1'])

    table.setOptions((prev) => ({ ...prev, data: makeRows(2, 2) }))

    expect(table.getSelectedRowIds()).toEqual(['2', '3'])
  })
})
