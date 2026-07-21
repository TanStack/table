import { describe, expect, it, vi } from 'vitest'
import {
  columnFilteringFeature,
  columnGroupingFeature,
  constructTable,
  createExpandedRowModel,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import type {
  RowSelectionState,
  TableOptions,
  ToggleSelectedOptions,
  Updater,
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
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  sortedRowModel: createSortedRowModel(),
})

const flatData: Array<TestRow> = Array.from({ length: 6 }, (_, value) => ({
  id: String(value),
  kind: value % 2 ? 'odd' : 'even',
  value,
}))

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
  opts?: ToggleSelectedOptions,
) {
  row.getToggleSelectedHandler(opts)({
    target: { checked },
    ...event,
  })
}

function selected(table: {
  atoms: { rowSelection: { get(): RowSelectionState } }
}) {
  return Object.keys(table.atoms.rowSelection.get()).sort()
}

describe('row selection range event detection', () => {
  it('detects direct and wrapped Shift events but ignores ordinary events', () => {
    const direct = makeSelectionTable()
    interact(direct.getRow('0'), true)
    interact(direct.getRow('2'), true, { shiftKey: true })
    expect(selected(direct)).toEqual(['0', '1', '2'])

    const wrapped = makeSelectionTable()
    interact(wrapped.getRow('0'), true)
    interact(wrapped.getRow('2'), true, {
      nativeEvent: { shiftKey: true },
    })
    expect(selected(wrapped)).toEqual(['0', '1', '2'])

    const ordinary = makeSelectionTable()
    interact(ordinary.getRow('0'), true)
    interact(ordinary.getRow('2'), true)
    expect(selected(ordinary)).toEqual(['0', '2'])
  })

  it('supports custom range event detection', () => {
    const detector = vi.fn(
      (event: unknown) => (event as { range?: boolean }).range === true,
    )
    const table = makeSelectionTable({
      isRowRangeSelectionEvent: detector,
    })

    interact(table.getRow('0'), true)
    interact(table.getRow('2'), true, { shiftKey: true })
    expect(selected(table)).toEqual(['0', '2'])

    interact(table.getRow('4'), true, { range: true })
    expect(selected(table)).toEqual(['0', '2', '3', '4'])
    expect(detector).toHaveBeenCalledTimes(2)
  })
})

describe('row selection ranges', () => {
  it('establishes an anchor and selects forward and reverse inclusive ranges', () => {
    const forward = makeSelectionTable()
    interact(forward.getRow('1'), true)
    expect(forward._lastSelectedRowId).toBe('1')
    interact(forward.getRow('4'), true, { shiftKey: true })
    expect(selected(forward)).toEqual(['1', '2', '3', '4'])

    const reverse = makeSelectionTable()
    interact(reverse.getRow('4'), true)
    interact(reverse.getRow('1'), true, { shiftKey: true })
    expect(selected(reverse)).toEqual(['1', '2', '3', '4'])
  })

  it('uses the checkbox value for inclusive deselection and same-row ranges', () => {
    const table = makeSelectionTable({
      initialState: {
        rowSelection: {
          '0': true,
          '1': true,
          '2': true,
          '3': true,
          '4': true,
          '5': true,
        },
      },
    })
    interact(table.getRow('1'), false)
    interact(table.getRow('4'), false, { shiftKey: true })
    expect(selected(table)).toEqual(['0', '5'])

    interact(table.getRow('5'), true)
    interact(table.getRow('5'), false, { shiftKey: true })
    expect(selected(table)).toEqual(['0'])
  })

  it('preserves selections outside the interval and advances the anchor', () => {
    const table = makeSelectionTable({
      initialState: { rowSelection: { '5': true } },
    })
    interact(table.getRow('0'), true)
    interact(table.getRow('2'), true, { shiftKey: true })
    expect(table._lastSelectedRowId).toBe('2')
    interact(table.getRow('4'), false, { shiftKey: true })

    expect(selected(table)).toEqual(['0', '1', '5'])
    expect(table._lastSelectedRowId).toBe('4')
  })
})

describe('row selection range performance', () => {
  it('does not resolve display order for ordinary clicks but does for ranges', () => {
    const table = makeSelectionTable()
    const getRowsInDisplayOrder = vi.spyOn(table, 'getRowsInDisplayOrder')

    interact(table.getRow('0'), true)
    expect(getRowsInDisplayOrder).not.toHaveBeenCalled()

    interact(table.getRow('2'), true, { shiftKey: true })
    expect(getRowsInDisplayOrder).toHaveBeenCalled()
  })

  it('uses one selection change and never calls row.toggleSelected per interval row', () => {
    let rowSelection: RowSelectionState = {}
    const onRowSelectionChange = vi.fn(
      (updater: Updater<RowSelectionState>) => {
        rowSelection =
          typeof updater === 'function' ? updater(rowSelection) : updater
      },
    )
    const table = makeSelectionTable({ onRowSelectionChange })
    const toggleSelected = vi.spyOn(table.getRow('1'), 'toggleSelected')

    interact(table.getRow('0'), true)
    onRowSelectionChange.mockClear()
    interact(table.getRow('4'), true, { shiftKey: true })

    expect(onRowSelectionChange).toHaveBeenCalledOnce()
    expect(toggleSelected).not.toHaveBeenCalled()
    expect(Object.keys(rowSelection).sort()).toEqual(['0', '1', '2', '3', '4'])
  })
})

describe('row selection range options and invalid anchors', () => {
  it('can disable range selection', () => {
    const table = makeSelectionTable({ enableRowRangeSelection: false })
    interact(table.getRow('0'), true)
    interact(table.getRow('3'), true, { shiftKey: true })
    expect(selected(table)).toEqual(['0', '3'])
  })

  it('falls back to ordinary selection when the current row cannot multi-select', () => {
    const table = makeSelectionTable({ enableMultiRowSelection: false })
    interact(table.getRow('0'), true)
    interact(table.getRow('3'), true, { shiftKey: true })
    expect(selected(table)).toEqual(['3'])
  })

  it('respects per-row multi-select predicates at endpoints and inside ranges', () => {
    const endpoint = makeSelectionTable({
      enableMultiRowSelection: (row) => row.id !== '3',
    })
    interact(endpoint.getRow('0'), true)
    interact(endpoint.getRow('3'), true, { shiftKey: true })
    expect(selected(endpoint)).toEqual(['3'])

    const inside = makeSelectionTable({
      enableMultiRowSelection: (row) => row.id !== '2',
    })
    interact(inside.getRow('0'), true)
    interact(inside.getRow('4'), true, { shiftKey: true })
    expect(selected(inside)).toEqual(['0', '1', '3', '4'])
  })

  it('skips non-selectable rows inside a range', () => {
    const table = makeSelectionTable({
      enableRowSelection: (row) => row.id !== '2',
    })
    interact(table.getRow('0'), true)
    interact(table.getRow('4'), true, { shiftKey: true })
    expect(selected(table)).toEqual(['0', '1', '3', '4'])
  })

  it('falls back to an ordinary toggle for invalid and removed anchor ids', () => {
    const invalid = makeSelectionTable()
    invalid._lastSelectedRowId = 'missing'
    interact(invalid.getRow('3'), true, { shiftKey: true })
    expect(selected(invalid)).toEqual(['3'])
    expect(invalid._lastSelectedRowId).toBe('3')

    const removed = makePipelineTable()
    interact(removed.getRow('0'), true)
    removed.setColumnFilters([{ id: 'id', value: '2' }])
    interact(removed.getRow('2'), true, { shiftKey: true })
    expect(selected(removed)).toEqual(['0', '2'])
    expect(removed._lastSelectedRowId).toBe('2')
  })
})

describe('range child selection semantics', () => {
  const nestedData: Array<TestRow> = [
    { id: 'a', value: 0 },
    {
      id: 'parent',
      value: 1,
      subRows: [
        { id: 'child-1', value: 11 },
        { id: 'child-2', value: 12 },
      ],
    },
    { id: 'z', value: 2 },
  ]

  it('selects collapsed descendants by default and can limit selection to displayed rows', () => {
    const recursive = makePipelineTable({}, nestedData)
    interact(recursive.getRow('a'), true)
    interact(recursive.getRow('z'), true, { shiftKey: true })
    expect(selected(recursive)).toEqual([
      'a',
      'child-1',
      'child-2',
      'parent',
      'z',
    ])

    const displayedOnly = makePipelineTable({}, nestedData)
    interact(displayedOnly.getRow('a'), true)
    interact(
      displayedOnly.getRow('z'),
      true,
      { shiftKey: true },
      { selectChildren: false },
    )
    expect(selected(displayedOnly)).toEqual(['a', 'parent', 'z'])
  })

  it('respects boolean and per-row sub-selection options', () => {
    const disabled = makePipelineTable(
      { enableSubRowSelection: false },
      nestedData,
    )
    interact(disabled.getRow('a'), true)
    interact(disabled.getRow('z'), true, { shiftKey: true })
    expect(selected(disabled)).toEqual(['a', 'parent', 'z'])

    const predicate = makePipelineTable(
      { enableSubRowSelection: (row) => row.id !== 'parent' },
      nestedData,
    )
    interact(predicate.getRow('a'), true)
    interact(predicate.getRow('z'), true, { shiftKey: true })
    expect(selected(predicate)).toEqual(['a', 'parent', 'z'])
  })

  it('changes expanded descendants explicitly when child recursion is disabled', () => {
    const table = makePipelineTable(
      { initialState: { expanded: { parent: true } } },
      nestedData,
    )
    interact(table.getRow('a'), true)
    interact(
      table.getRow('z'),
      true,
      { shiftKey: true },
      { selectChildren: false },
    )
    expect(selected(table)).toEqual(['a', 'child-1', 'child-2', 'parent', 'z'])
  })
})

describe('range selection follows the display pipeline', () => {
  it('uses the latest sorting order between interactions', () => {
    const table = makePipelineTable()
    interact(table.getRow('0'), true)
    table.setSorting([{ id: 'value', desc: true }])
    interact(table.getRow('3'), true, { shiftKey: true })
    expect(selected(table)).toEqual(['0', '1', '2', '3'])
  })

  it('uses the latest filtered order while a visible anchor remains valid', () => {
    const table = makePipelineTable()
    interact(table.getRow('0'), true)
    table.setColumnFilters([{ id: 'kind', value: 'even' }])
    interact(table.getRow('4'), true, { shiftKey: true })
    expect(selected(table)).toEqual(['0', '2', '4'])
  })

  it('includes grouped rows in display order', () => {
    const table = makePipelineTable()
    table.setGrouping(['kind'])

    interact(table.getRow('kind:even'), true, {}, { selectChildren: false })
    interact(
      table.getRow('kind:odd'),
      true,
      { shiftKey: true },
      { selectChildren: false },
    )

    expect(selected(table)).toEqual(['kind:even', 'kind:odd'])
  })

  it('selects across client-side pages', () => {
    const table = makePipelineTable({
      initialState: { pagination: { pageIndex: 0, pageSize: 2 } },
    })
    interact(table.getRow('0'), true)
    table.setPageIndex(2)
    interact(table.getRow('4'), true, { shiftKey: true })
    expect(selected(table)).toEqual(['0', '1', '2', '3', '4'])
  })

  it.each([true, false])(
    'includes expanded rows when paginateExpandedRows is %s',
    (paginateExpandedRows) => {
      const data: Array<TestRow> = [
        {
          id: 'parent',
          value: 0,
          subRows: [
            { id: 'child-1', value: 1 },
            { id: 'child-2', value: 2 },
          ],
        },
        { id: 'z', value: 3 },
      ]
      const table = makePipelineTable(
        {
          paginateExpandedRows,
          initialState: {
            expanded: { parent: true },
            pagination: { pageIndex: 0, pageSize: 1 },
          },
        },
        data,
      )

      interact(table.getRow('child-1'), true)
      interact(
        table.getRow('z'),
        true,
        { shiftKey: true },
        { selectChildren: false },
      )
      expect(selected(table)).toEqual(['child-1', 'child-2', 'z'])
    },
  )

  it('preserves anchors across data replacement only when the id remains loaded', () => {
    const preserved = makePipelineTable()
    interact(preserved.getRow('1'), true)
    preserved.setOptions((old) => ({
      ...old,
      data: flatData.map((row) => ({ ...row, value: row.value + 10 })),
    }))
    interact(preserved.getRow('3'), true, { shiftKey: true })
    expect(selected(preserved)).toEqual(['1', '2', '3'])

    const removed = makePipelineTable()
    interact(removed.getRow('1'), true)
    removed.setOptions((old) => ({
      ...old,
      data: flatData.filter((row) => row.id !== '1'),
    }))
    interact(removed.getRow('3'), true, { shiftKey: true })
    expect(selected(removed)).toEqual(['1', '3'])
  })
})

describe('row selection anchor lifecycle', () => {
  function establishAnchor() {
    const table = makeSelectionTable()
    interact(table.getRow('1'), true)
    expect(table._lastSelectedRowId).toBe('1')
    return table
  }

  it('is not changed by direct row or table state APIs', () => {
    const table = makeSelectionTable()
    table.getRow('0').toggleSelected(true)
    table.setRowSelection({ '1': true })
    expect(table._lastSelectedRowId).toBeNull()
  })

  it('clears through every selection reset and select-all path', () => {
    const resetSelection = establishAnchor()
    resetSelection.resetRowSelection()
    expect(resetSelection._lastSelectedRowId).toBeNull()

    const allRows = establishAnchor()
    allRows.toggleAllRowsSelected()
    expect(allRows._lastSelectedRowId).toBeNull()

    const allPageRows = establishAnchor()
    allPageRows.toggleAllPageRowsSelected()
    expect(allPageRows._lastSelectedRowId).toBeNull()

    const globalReset = establishAnchor()
    globalReset.reset()
    expect(globalReset._lastSelectedRowId).toBeNull()
  })
})
