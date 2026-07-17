import { describe, expect, it, vi } from 'vitest'
import {
  constructTable,
  createPaginatedRowModel,
  rowPaginationFeature,
  rowSelectionFeature,
} from '../../../../src'
import {
  getDefaultRowSelectionState,
  row_getCanMultiSelect,
  row_getCanSelect,
  row_getCanSelectSubRows,
  row_getIsAllSubRowsSelected,
  row_getIsSelected,
  row_getIsSomeSelected,
  row_getToggleSelectedHandler,
  row_toggleSelected,
  table_getIsAllPageRowsSelected,
  table_getIsAllRowsSelected,
  table_getIsSomePageRowsSelected,
  table_getIsSomeRowsSelected,
  table_getPreSelectedRowModel,
  table_getSelectedRowIds,
  table_getToggleAllPageRowsSelectedHandler,
  table_getToggleAllRowsSelectedHandler,
  table_resetRowSelection,
  table_setRowSelection,
  table_toggleAllPageRowsSelected,
  table_toggleAllRowsSelected,
} from '../../../../src/static-functions'
import { testFeatures } from '../../../fixtures/features'
import { generateTestColumnDefs } from '../../../fixtures/data/generateTestColumnDefs'
import { generateTestData } from '../../../fixtures/data/generateTestData'
import { getUpdaterResult } from '../../../helpers/testUtils'
import type { Table, TableOptions } from '../../../../src'
import type { Person } from '../../../fixtures/data/types'

const features = testFeatures({
  rowSelectionFeature,
})

const featuresWithPagination = testFeatures({
  rowPaginationFeature,
  rowSelectionFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

function makeTable(
  options?: Partial<
    Omit<TableOptions<typeof features, Person>, 'data' | 'columns' | 'features'>
  >,
  lengths: Array<number> = [5],
): Table<typeof features, Person> {
  const data = generateTestData(...lengths)
  return constructTable({
    features,
    data,
    columns: generateTestColumnDefs<typeof features>(data),
    getSubRows: (row) => row.subRows,
    ...options,
  })
}

function makePaginatedTable(
  options?: Partial<
    Omit<
      TableOptions<typeof featuresWithPagination, Person>,
      'data' | 'columns' | 'features'
    >
  >,
): Table<typeof featuresWithPagination, Person> {
  const data = generateTestData(5)
  return constructTable({
    features: featuresWithPagination,
    data,
    columns: generateTestColumnDefs<typeof featuresWithPagination>(data),
    ...options,
  })
}

describe('getDefaultRowSelectionState', () => {
  it('should return an empty map and a new instance each time', () => {
    expect(getDefaultRowSelectionState()).toEqual({})
    expect(getDefaultRowSelectionState()).not.toBe(
      getDefaultRowSelectionState(),
    )
  })
})

describe('table_setRowSelection', () => {
  it('should route the updater through onRowSelectionChange', () => {
    const onRowSelectionChange = vi.fn()
    const table = makeTable({ onRowSelectionChange })

    table_setRowSelection(table, { '0': true })

    expect(onRowSelectionChange).toHaveBeenCalledWith({ '0': true })
  })
})

describe('table_resetRowSelection', () => {
  it('should reset to an empty map when defaultState is true', () => {
    const onRowSelectionChange = vi.fn()
    const table = makeTable({
      onRowSelectionChange,
      initialState: { rowSelection: { '0': true } },
    })

    table_resetRowSelection(table, true)

    expect(onRowSelectionChange).toHaveBeenCalledWith({})
  })

  it('should reset to the initial selection by default', () => {
    const onRowSelectionChange = vi.fn()
    const table = makeTable({
      onRowSelectionChange,
      initialState: { rowSelection: { '0': true, '2': true } },
    })

    table_resetRowSelection(table)

    expect(onRowSelectionChange).toHaveBeenCalledWith({ '0': true, '2': true })
  })
})

describe('table_getPreSelectedRowModel', () => {
  it('should return the core row model', () => {
    const table = makeTable()

    expect(table_getPreSelectedRowModel(table)).toBe(table.getCoreRowModel())
  })
})

describe('table_getSelectedRowIds', () => {
  it('should list the selected row ids', () => {
    const table = makeTable({
      initialState: { rowSelection: { '0': true, '3': true } },
    })

    expect(table_getSelectedRowIds(table)).toEqual(['0', '3'])
  })

  it('should return an empty array with no selection', () => {
    expect(table_getSelectedRowIds(makeTable())).toEqual([])
  })
})

describe('table_getIsSomeRowsSelected', () => {
  it('should return false with no selection', () => {
    expect(table_getIsSomeRowsSelected(makeTable())).toBe(false)
  })

  it('should return true when any row id is selected', () => {
    const table = makeTable({ initialState: { rowSelection: { '0': true } } })

    expect(table_getIsSomeRowsSelected(table)).toBe(true)
  })
})

describe('table_getIsAllRowsSelected', () => {
  it('should return true when every selectable row is selected', () => {
    const table = makeTable({
      initialState: {
        rowSelection: { '0': true, '1': true, '2': true, '3': true, '4': true },
      },
    })

    expect(table_getIsAllRowsSelected(table)).toBe(true)
  })

  it('should return false when a selectable row is unselected', () => {
    const table = makeTable({
      initialState: {
        rowSelection: { '0': true, '1': true, '2': true, '3': true },
      },
    })

    expect(table_getIsAllRowsSelected(table)).toBe(false)
  })

  it('should ignore rows that cannot be selected', () => {
    const table = makeTable({
      enableRowSelection: (row) => row.id !== '0',
      initialState: {
        rowSelection: { '1': true, '2': true, '3': true, '4': true },
      },
    })

    expect(table_getIsAllRowsSelected(table)).toBe(true)
  })

  it('should return false with an empty selection', () => {
    expect(table_getIsAllRowsSelected(makeTable())).toBe(false)
  })
})

describe('table_getIsAllPageRowsSelected', () => {
  it('should only consider rows on the current page', () => {
    const table = makePaginatedTable({
      initialState: {
        pagination: { pageIndex: 0, pageSize: 2 },
        rowSelection: { '0': true, '1': true },
      },
    })

    expect(table_getIsAllPageRowsSelected(table)).toBe(true)
  })

  it('should return false when a page row is unselected', () => {
    const table = makePaginatedTable({
      initialState: {
        pagination: { pageIndex: 0, pageSize: 2 },
        rowSelection: { '0': true },
      },
    })

    expect(table_getIsAllPageRowsSelected(table)).toBe(false)
  })
})

describe('table_getIsSomePageRowsSelected', () => {
  it('should return true when a current-page row is selected', () => {
    const table = makePaginatedTable({
      initialState: {
        pagination: { pageIndex: 0, pageSize: 2 },
        rowSelection: { '0': true },
      },
    })

    expect(table_getIsSomePageRowsSelected(table)).toBe(true)
  })

  it('should return false when only off-page rows are selected', () => {
    const table = makePaginatedTable({
      initialState: {
        pagination: { pageIndex: 0, pageSize: 2 },
        rowSelection: { '4': true },
      },
    })

    expect(table_getIsSomePageRowsSelected(table)).toBe(false)
  })
})

describe('table_toggleAllPageRowsSelected', () => {
  it('should select only the current page rows', () => {
    const onRowSelectionChange = vi.fn()
    const table = makePaginatedTable({
      onRowSelectionChange,
      initialState: { pagination: { pageIndex: 0, pageSize: 2 } },
    })

    table_toggleAllPageRowsSelected(table, true)

    expect(getUpdaterResult(onRowSelectionChange, {})).toEqual({
      '0': true,
      '1': true,
    })
  })

  it('should deselect page rows while preserving off-page selection', () => {
    const onRowSelectionChange = vi.fn()
    const table = makePaginatedTable({
      onRowSelectionChange,
      initialState: {
        pagination: { pageIndex: 0, pageSize: 2 },
        rowSelection: { '0': true, '1': true, '4': true },
      },
    })

    table_toggleAllPageRowsSelected(table, false)

    expect(
      getUpdaterResult(onRowSelectionChange, {
        '0': true,
        '1': true,
        '4': true,
      }),
    ).toEqual({ '4': true })
  })
})

describe('row_toggleSelected', () => {
  it('should select an unselected row', () => {
    const onRowSelectionChange = vi.fn()
    const table = makeTable({ onRowSelectionChange })

    row_toggleSelected(table.getRow('0'))

    expect(getUpdaterResult(onRowSelectionChange, {})).toEqual({ '0': true })
  })

  it('should deselect a selected row', () => {
    const onRowSelectionChange = vi.fn()
    const table = makeTable({
      onRowSelectionChange,
      initialState: { rowSelection: { '0': true, '1': true } },
    })

    row_toggleSelected(table.getRow('0'))

    expect(
      getUpdaterResult(onRowSelectionChange, { '0': true, '1': true }),
    ).toEqual({ '1': true })
  })

  it('should select children recursively by default', () => {
    const onRowSelectionChange = vi.fn()
    const table = makeTable({ onRowSelectionChange }, [3, 2])

    row_toggleSelected(table.getRow('0'), true)

    expect(getUpdaterResult(onRowSelectionChange, {})).toEqual({
      '0': true,
      '0.0': true,
      '0.1': true,
    })
  })

  it('should not select children when selectChildren is false', () => {
    const onRowSelectionChange = vi.fn()
    const table = makeTable({ onRowSelectionChange }, [3, 2])

    row_toggleSelected(table.getRow('0'), true, { selectChildren: false })

    expect(getUpdaterResult(onRowSelectionChange, {})).toEqual({ '0': true })
  })

  it('should not select children when sub-row selection is disabled', () => {
    const onRowSelectionChange = vi.fn()
    const table = makeTable(
      { onRowSelectionChange, enableSubRowSelection: false },
      [3, 2],
    )

    row_toggleSelected(table.getRow('0'), true)

    expect(getUpdaterResult(onRowSelectionChange, {})).toEqual({ '0': true })
  })

  it('should clear other selections when multi-select is disabled', () => {
    const onRowSelectionChange = vi.fn()
    const table = makeTable({
      onRowSelectionChange,
      enableMultiRowSelection: false,
      initialState: { rowSelection: { '1': true } },
    })

    row_toggleSelected(table.getRow('0'), true)

    expect(getUpdaterResult(onRowSelectionChange, { '1': true })).toEqual({
      '0': true,
    })
  })

  it('should select the clicked parent row when multi-select is disabled', () => {
    const onRowSelectionChange = vi.fn()
    const table = makeTable(
      { onRowSelectionChange, enableMultiRowSelection: false },
      [3, 2],
    )

    row_toggleSelected(table.getRow('0'), true)

    expect(getUpdaterResult(onRowSelectionChange, {})).toEqual({
      '0': true,
    })
  })
})

describe('row_getIsSomeSelected / row_getIsAllSubRowsSelected', () => {
  it('should report a partial child selection', () => {
    const table = makeTable(
      { initialState: { rowSelection: { '0.0': true } } },
      [3, 2],
    )
    const parent = table.getRow('0')

    expect(row_getIsSomeSelected(parent)).toBe(true)
    expect(row_getIsAllSubRowsSelected(parent)).toBe(false)
  })

  it('should report a full child selection', () => {
    const table = makeTable(
      { initialState: { rowSelection: { '0.0': true, '0.1': true } } },
      [3, 2],
    )
    const parent = table.getRow('0')

    expect(row_getIsSomeSelected(parent)).toBe(false)
    expect(row_getIsAllSubRowsSelected(parent)).toBe(true)
  })

  it('should report nothing for rows without subRows', () => {
    const table = makeTable()
    const row = table.getRow('0')

    expect(row_getIsSomeSelected(row)).toBe(false)
    expect(row_getIsAllSubRowsSelected(row)).toBe(false)
  })
})

describe('row selection flags', () => {
  it('row_getCanSelect should default to true and respect boolean options', () => {
    expect(row_getCanSelect(makeTable().getRow('0'))).toBe(true)
    expect(
      row_getCanSelect(makeTable({ enableRowSelection: false }).getRow('0')),
    ).toBe(false)
  })

  it('row_getCanSelect should support row predicates', () => {
    const table = makeTable({ enableRowSelection: (row) => row.id === '1' })

    expect(row_getCanSelect(table.getRow('0'))).toBe(false)
    expect(row_getCanSelect(table.getRow('1'))).toBe(true)
  })

  it('row_getCanSelectSubRows should default to true and respect options', () => {
    expect(row_getCanSelectSubRows(makeTable().getRow('0'))).toBe(true)
    expect(
      row_getCanSelectSubRows(
        makeTable({ enableSubRowSelection: false }).getRow('0'),
      ),
    ).toBe(false)
  })

  it('row_getCanMultiSelect should default to true and respect options', () => {
    expect(row_getCanMultiSelect(makeTable().getRow('0'))).toBe(true)
    expect(
      row_getCanMultiSelect(
        makeTable({ enableMultiRowSelection: false }).getRow('0'),
      ),
    ).toBe(false)
  })
})

describe('selection handlers', () => {
  it('row_getToggleSelectedHandler should read event.target.checked', () => {
    const onRowSelectionChange = vi.fn()
    const table = makeTable({ onRowSelectionChange })

    row_getToggleSelectedHandler(table.getRow('0'))({
      target: { checked: true },
    })

    expect(getUpdaterResult(onRowSelectionChange, {})).toEqual({ '0': true })
  })

  it('row_getToggleSelectedHandler should be a no-op when the row cannot be selected', () => {
    const onRowSelectionChange = vi.fn()
    const table = makeTable({
      onRowSelectionChange,
      enableRowSelection: false,
    })

    row_getToggleSelectedHandler(table.getRow('0'))({
      target: { checked: true },
    })

    expect(onRowSelectionChange).not.toHaveBeenCalled()
  })

  it('table_getToggleAllRowsSelectedHandler should select all rows from the checkbox state', () => {
    const onRowSelectionChange = vi.fn()
    const table = makeTable({ onRowSelectionChange })

    table_getToggleAllRowsSelectedHandler(table)({
      target: { checked: true },
    })

    expect(getUpdaterResult(onRowSelectionChange, {})).toEqual({
      '0': true,
      '1': true,
      '2': true,
      '3': true,
      '4': true,
    })
  })

  it('table_getToggleAllPageRowsSelectedHandler should select page rows from the checkbox state', () => {
    const onRowSelectionChange = vi.fn()
    const table = makePaginatedTable({
      onRowSelectionChange,
      initialState: { pagination: { pageIndex: 0, pageSize: 2 } },
    })

    table_getToggleAllPageRowsSelectedHandler(table)({
      target: { checked: true },
    })

    expect(getUpdaterResult(onRowSelectionChange, {})).toEqual({
      '0': true,
      '1': true,
    })
  })
})

describe('row_getIsSelected', () => {
  it('should read the selection state for this row id', () => {
    const table = makeTable({ initialState: { rowSelection: { '0': true } } })

    expect(row_getIsSelected(table.getRow('0'))).toBe(true)
    expect(row_getIsSelected(table.getRow('1'))).toBe(false)
  })
})

describe('table_toggleAllRowsSelected', () => {
  it('should select every selectable row', () => {
    const onRowSelectionChange = vi.fn()
    const table = makeTable({ onRowSelectionChange })

    table_toggleAllRowsSelected(table, true)

    expect(getUpdaterResult(onRowSelectionChange, {})).toEqual({
      '0': true,
      '1': true,
      '2': true,
      '3': true,
      '4': true,
    })
  })

  it('should skip rows that cannot be selected', () => {
    const onRowSelectionChange = vi.fn()
    const table = makeTable({
      onRowSelectionChange,
      enableRowSelection: (row) => row.id !== '0',
    })

    table_toggleAllRowsSelected(table, true)

    expect(getUpdaterResult(onRowSelectionChange, {})).toEqual({
      '1': true,
      '2': true,
      '3': true,
      '4': true,
    })
  })

  it('should toggle based on the current selection when no value is passed', () => {
    const onRowSelectionChange = vi.fn()
    const table = makeTable({ onRowSelectionChange })

    table_toggleAllRowsSelected(table)

    const result = getUpdaterResult(onRowSelectionChange, {})
    expect(Object.keys(result)).toHaveLength(5)
  })
})
