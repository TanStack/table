import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  cellSelectionFeature,
  columnFilteringFeature,
  columnGroupingFeature,
  constructTable,
  createExpandedRowModel,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  globalFilteringFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  sparseRowsFeature,
  stockFeatures,
  tableFeatures,
} from '../../../../src'
import {
  row_getUniqueValues,
  row_getValue,
} from '../../../../src/static-functions'
import { testFeatures } from '../../../fixtures/features'
import type {
  Cell,
  CellSelectionRange,
  ColumnDef,
  FilterFn,
  Row,
  RowData,
  SparseRowRange,
  Table,
  TableOptions,
} from '../../../../src'

interface Person {
  id: string
  name: string
  age: number
  children?: Array<Person>
}

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false
type Expect<T extends true> = T

const features = testFeatures({
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  rowSelectionFeature,
  sparseRowsFeature,
  expandedRowModel: createExpandedRowModel(),
})

const paginatedFeatures = {
  ...features,
  paginatedRowModel: createPaginatedRowModel(),
} as typeof features

const columns: Array<ColumnDef<typeof features, Person, any>> = [
  { accessorKey: 'name', id: 'name' },
  { accessorFn: (person) => person.age * 2, id: 'doubleAge' },
]

function makePerson(index: number): Person {
  return { id: `person-${index}`, name: `Person ${index}`, age: 20 + index }
}

function makeSparseData(...ranges: Array<[number, number]>): Array<Person> {
  const data: Array<Person> = []
  for (const [startIndex, endIndex] of ranges) {
    for (let i = startIndex; i <= endIndex; i++) {
      data[i] = makePerson(i)
    }
  }
  return data
}

function makeTable(
  options?: Partial<TableOptions<typeof features, Person>>,
): Table<typeof features, Person> {
  return constructTable<typeof features, Person>({
    features,
    columns,
    data: makeSparseData([2, 4]),
    rowCount: 10,
    getRowId: (person) => person.id,
    manualPagination: true,
    ...options,
  })
}

function setData(table: Table<typeof features, Person>, data: Array<Person>) {
  table.setOptions((old) => ({ ...old, data }))
}

const flushMicrotasks = () => new Promise((resolve) => setTimeout(resolve, 0))

function spyOnDevWarnings() {
  vi.stubEnv('NODE_ENV', 'development')
  return vi.spyOn(console, 'warn').mockImplementation(() => {})
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('sparseRowsFeature types', () => {
  it('should type the API of the proposal when only the feature is registered', () => {
    const sparseFeatures = tableFeatures({ sparseRowsFeature })
    type Options = TableOptions<typeof sparseFeatures, Person>
    type SparseTable = Table<typeof sparseFeatures, Person>
    type SparseRow = Row<typeof sparseFeatures, Person>

    true satisfies Expect<Equal<Options['rowCount'], number | undefined>>
    true satisfies Expect<
      Equal<ReturnType<SparseRow['getIsPlaceholder']>, boolean>
    >
    true satisfies Expect<
      Equal<
        ReturnType<SparseTable['getMissingRowRanges']>,
        Array<SparseRowRange>
      >
    >

    const options: Omit<Options, 'features'> = {
      columns: [],
      data: makeSparseData([99_950, 99_999]),
      rowCount: 100_000,
      getRowId: (row) => row.id,
    }
    expect(options.rowCount).toBe(100_000)
  })

  it('should keep rowCount typed when row pagination is registered too', () => {
    const combinedFeatures = tableFeatures({
      rowPaginationFeature,
      sparseRowsFeature,
    })
    true satisfies Expect<
      Equal<
        TableOptions<typeof combinedFeatures, Person>['rowCount'],
        number | undefined
      >
    >
    expect(Object.keys(combinedFeatures)).toContain('sparseRowsFeature')
  })

  it('should not type the row API without the feature', () => {
    const coreOnlyFeatures = tableFeatures({})
    const getIsPlaceholder = (row: Row<typeof coreOnlyFeatures, Person>) =>
      // @ts-expect-error - getIsPlaceholder needs sparseRowsFeature
      row.getIsPlaceholder
    expect(getIsPlaceholder).toBeTypeOf('function')
  })

  it('should let any-typed filter functions be cast for a table without the feature', () => {
    function getStockFilterFns<TData extends RowData>() {
      return { ...filterFns } as Record<
        string,
        FilterFn<typeof stockFeatures, TData>
      >
    }
    expect(getStockFilterFns()).toHaveProperty('includesString')
  })
})

describe('sparse core row model', () => {
  it('should hold rowCount rows with the absolute index of each row', () => {
    const table = makeTable()
    const { rows, flatRows, rowsById } = table.getRowModel()

    expect(rows).toHaveLength(10)
    expect(flatRows).toHaveLength(10)
    expect(Object.keys(rowsById)).toHaveLength(10)
    rows.forEach((row, index) => expect(row.index).toBe(index))
    expect(table.getCoreRowModel()).toBe(table.getRowModel())
  })

  it('should make placeholder rows for the indexes without data', () => {
    const table = makeTable()
    const { rows } = table.getRowModel()

    expect(rows.map((row) => row.getIsPlaceholder())).toEqual([
      true,
      true,
      false,
      false,
      false,
      true,
      true,
      true,
      true,
      true,
    ])
    expect(rows[3]!.original).toEqual(makePerson(3))
    expect(rows[0]!.original).toBeUndefined()
    expect(rows[9]!.original).toBeUndefined()
  })

  it('should treat holes and undefined entries as missing rows', () => {
    const data = makeSparseData([0, 3])
    delete data[1]
    data[2] = undefined as unknown as Person
    const table = makeTable({ data, rowCount: 4 })

    expect(
      table.getRowModel().rows.map((row) => row.getIsPlaceholder()),
    ).toEqual([false, true, true, false])
  })

  it('should give placeholder rows a temporary id and loaded rows the id from getRowId', () => {
    const getRowId = vi.fn((person: Person) => person.id)
    const table = makeTable({ getRowId })
    const { rows, rowsById } = table.getRowModel()

    expect(rows.map((row) => row.id)).toEqual([
      '__placeholder_0',
      '__placeholder_1',
      'person-2',
      'person-3',
      'person-4',
      '__placeholder_5',
      '__placeholder_6',
      '__placeholder_7',
      '__placeholder_8',
      '__placeholder_9',
    ])
    expect(rowsById['__placeholder_7']).toBe(rows[7])
    expect(table.getRow('person-3')).toBe(rows[3])
    expect(getRowId).toHaveBeenCalledTimes(3)
  })

  it('should not collide with the default index ids', () => {
    const table = makeTable({ getRowId: undefined })

    expect(table.getRowModel().rows.map((row) => row.id)).toEqual([
      '__placeholder_0',
      '__placeholder_1',
      '2',
      '3',
      '4',
      '__placeholder_5',
      '__placeholder_6',
      '__placeholder_7',
      '__placeholder_8',
      '__placeholder_9',
    ])
  })

  it('should jump to the last rows of a large table without the rows before them', () => {
    const table = makeTable({
      data: makeSparseData([99_950, 99_999]),
      rowCount: 100_000,
    })
    const { rows } = table.getRowModel()

    expect(rows).toHaveLength(100_000)
    expect(rows[99_999]!.getIsPlaceholder()).toBe(false)
    expect(rows[99_999]!.index).toBe(99_999)
    expect(rows[99_999]!.original).toEqual(makePerson(99_999))
    expect(rows[99_949]!.getIsPlaceholder()).toBe(true)
    expect(
      table.getMissingRowRanges({ startIndex: 99_950, endIndex: 99_999 }),
    ).toEqual([])
  })

  it('should default rowCount to data.length', () => {
    const table = makeTable({ rowCount: undefined })

    expect(table.getRowModel().rows).toHaveLength(5)
  })

  it.each([Number.NaN, Infinity, -1])(
    'should fall back to data.length when rowCount is %s',
    (rowCount) => {
      const table = makeTable({ rowCount })

      expect(table.getRowModel().rows).toHaveLength(5)
    },
  )

  it('should round a fractional rowCount down', () => {
    const table = makeTable({ rowCount: 3.7 })

    expect(table.getRowModel().rows.map((row) => row.index)).toEqual([0, 1, 2])
  })

  it('should ignore data after rowCount', () => {
    const table = makeTable({ data: makeSparseData([0, 9]), rowCount: 4 })

    expect(table.getRowModel().rows.map((row) => row.id)).toEqual([
      'person-0',
      'person-1',
      'person-2',
      'person-3',
    ])
  })

  it('should return the same row model until data or rowCount changes', () => {
    const table = makeTable()
    const rowModel = table.getRowModel()

    expect(table.getRowModel()).toBe(rowModel)

    table.setOptions((old) => ({ ...old, rowCount: 12 }))
    expect(table.getRowModel()).not.toBe(rowModel)
    expect(table.getRowModel().rows).toHaveLength(12)
  })

  it('should replace placeholder rows when their data is loaded', () => {
    const table = makeTable()
    const before = table.getRowModel().rows

    setData(table, makeSparseData([2, 4], [7, 8]))
    const after = table.getRowModel().rows

    expect(after[7]!.getIsPlaceholder()).toBe(false)
    expect(after[7]!.id).toBe('person-7')
    expect(after[7]).not.toBe(before[7])
    expect(after[6]!.getIsPlaceholder()).toBe(true)
  })

  it('should use the same placeholder row again when data changes', () => {
    const table = makeTable()
    const before = table.getRowModel().rows

    setData(table, makeSparseData([2, 4], [7, 8]))
    const loaded = table.getRowModel().rows
    setData(table, makeSparseData([2, 4]))
    const evicted = table.getRowModel().rows

    expect(loaded[0]).toBe(before[0])
    expect(loaded[9]).toBe(before[9])
    expect(evicted[7]).toBe(before[7])
    expect(evicted[7]!.getIsPlaceholder()).toBe(true)
  })

  it('should build sub rows for loaded rows only', () => {
    const data = makeSparseData([1, 1])
    data[1]!.children = [makePerson(100), makePerson(101)]
    const getSubRows = vi.fn((person: Person) => person.children)
    const table = makeTable({ data, rowCount: 3, getSubRows })
    const { rows, flatRows, rowsById } = table.getRowModel()

    expect(getSubRows).toHaveBeenCalledTimes(3)
    expect(rows).toHaveLength(3)
    expect(flatRows.map((row) => row.id)).toEqual([
      '__placeholder_0',
      'person-1',
      'person-100',
      'person-101',
      '__placeholder_2',
    ])
    expect(rows[1]!.subRows.map((row) => row.id)).toEqual([
      'person-100',
      'person-101',
    ])
    expect(rowsById['person-101']!.depth).toBe(1)
    expect(rowsById['person-101']!.parentId).toBe('person-1')
    expect(rowsById['person-101']!.getIsPlaceholder()).toBe(false)
  })

  it('should not reset the page index or expanded state when rows load', async () => {
    const table = makeTable({
      features: paginatedFeatures,
      manualPagination: false,
      getRowCanExpand: () => true,
      initialState: { pagination: { pageIndex: 2, pageSize: 2 } },
    })
    table.getRowModel()
    await flushMicrotasks()
    table.getRowModel().rows[0]!.toggleExpanded(true)

    setData(table, makeSparseData([2, 7]))
    table.getRowModel()
    await flushMicrotasks()

    expect(table.atoms.pagination.get().pageIndex).toBe(2)
    expect(table.atoms.expanded.get()).toEqual({ 'person-4': true })
  })

  it('should paginate the sparse rows on the client', () => {
    const table = makeTable({
      features: paginatedFeatures,
      manualPagination: false,
      initialState: { pagination: { pageIndex: 2, pageSize: 2 } },
    })

    expect(table.getRowCount()).toBe(10)
    expect(table.getPageCount()).toBe(5)
    expect(table.getRowModel().rows.map((row) => row.id)).toEqual([
      'person-4',
      '__placeholder_5',
    ])
    expect(table.getRowModel().rows.map((row) => row.index)).toEqual([4, 5])
  })

  it('should not cut pages when pagination is manual', () => {
    const table = makeTable({
      features: paginatedFeatures,
      manualPagination: true,
      initialState: { pagination: { pageIndex: 2, pageSize: 2 } },
    })

    expect(table.getRowModel().rows.map((row) => row.index)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    ])
    expect(table.getPageCount()).toBe(5)
  })

  it('should let a custom coreRowModel slot replace the sparse row model', () => {
    const customRowModel = { rows: [], flatRows: [], rowsById: {} }
    const customFeatures = {
      ...features,
      coreRowModel: () => () => customRowModel,
    } as typeof features
    const table = makeTable({ features: customFeatures })

    expect(table.getCoreRowModel()).toBe(customRowModel)
  })
})

describe('placeholder row values', () => {
  it('should return undefined without calling the accessor', () => {
    const accessorFn = vi.fn((person: Person) => person.name.toUpperCase())
    const table = makeTable({
      columns: [...columns, { accessorFn, id: 'upperName' }],
    })
    const [placeholderRow, , loadedRow] = table.getRowModel().rows

    expect(placeholderRow!.getValue('name')).toBeUndefined()
    expect(placeholderRow!.getValue('doubleAge')).toBeUndefined()
    expect(placeholderRow!.getValue('upperName')).toBeUndefined()
    expect(accessorFn).not.toHaveBeenCalled()
    expect(loadedRow!.getValue('name')).toBe('Person 2')
    expect(loadedRow!.getValue('doubleAge')).toBe(44)
    expect(loadedRow!.getValue('upperName')).toBe('PERSON 2')
  })

  it('should give placeholder cells for each column', () => {
    const table = makeTable({ renderFallbackValue: '...' })
    const placeholderRow = table.getRowModel().rows[0]!
    const cells = placeholderRow.getAllCells()

    expect(cells.map((cell) => cell.column.id)).toEqual(['name', 'doubleAge'])
    expect(cells.map((cell) => cell.getValue())).toEqual([undefined, undefined])
    expect(cells.map((cell) => cell.renderValue())).toEqual(['...', '...'])
    expect(placeholderRow.renderValue('name')).toBe('...')
  })

  it('should not call getUniqueValues for a placeholder row', () => {
    const getUniqueValues = vi.fn((person: Person) => [person.name])
    const table = makeTable({
      columns: [{ accessorKey: 'name', id: 'name', getUniqueValues }],
    })
    const [placeholderRow, , loadedRow] = table.getRowModel().rows

    expect(placeholderRow!.getUniqueValues('name')).toEqual([])
    expect(getUniqueValues).not.toHaveBeenCalled()
    expect(loadedRow!.getUniqueValues('name')).toEqual(['Person 2'])
  })

  it('should give the static row functions the same results', () => {
    const getUniqueValues = vi.fn((person: Person) => [person.name])
    const table = makeTable({
      columns: [
        { accessorKey: 'name', id: 'name' },
        { accessorKey: 'age', id: 'age', getUniqueValues },
      ],
    })
    const [placeholderRow, , loadedRow] = table.getRowModel().rows

    expect(row_getValue(placeholderRow!, 'name')).toBeUndefined()
    expect(row_getUniqueValues(placeholderRow!, 'name')).toEqual([])
    expect(row_getUniqueValues(placeholderRow!, 'age')).toEqual([])
    expect(getUniqueValues).not.toHaveBeenCalled()
    expect(row_getValue(loadedRow!, 'name')).toBe('Person 2')
    expect(row_getUniqueValues(loadedRow!, 'name')).toEqual(['Person 2'])
  })
})

describe('row selection with placeholder rows', () => {
  it('should not let a placeholder row be selected or pass it to the predicates', () => {
    const enableRowSelection = vi.fn((row: Row<typeof features, Person>) =>
      row.original.name.startsWith('Person'),
    )
    const enableMultiRowSelection = vi.fn(
      (row: Row<typeof features, Person>) => row.original.age > 0,
    )
    const enableSubRowSelection = vi.fn(
      (row: Row<typeof features, Person>) => row.original.age > 0,
    )
    const table = makeTable({
      enableRowSelection,
      enableMultiRowSelection,
      enableSubRowSelection,
    })
    const [placeholderRow, , loadedRow] = table.getRowModel().rows

    expect(placeholderRow!.getCanSelect()).toBe(false)
    expect(placeholderRow!.getCanMultiSelect()).toBe(false)
    expect(placeholderRow!.getCanSelectSubRows()).toBe(false)
    expect(enableRowSelection).not.toHaveBeenCalled()
    expect(enableMultiRowSelection).not.toHaveBeenCalled()
    expect(enableSubRowSelection).not.toHaveBeenCalled()
    expect(loadedRow!.getCanSelect()).toBe(true)
    expect(loadedRow!.getCanMultiSelect()).toBe(true)
    expect(loadedRow!.getCanSelectSubRows()).toBe(true)
  })

  it('should keep no selection state when a placeholder row is toggled', () => {
    const onRowSelectionChange = vi.fn()
    const table = makeTable({ onRowSelectionChange })
    const placeholderRow = table.getRowModel().rows[0]!

    placeholderRow.toggleSelected()
    placeholderRow.toggleSelected(true)
    placeholderRow.getToggleSelectedHandler()({ target: { checked: true } })

    expect(onRowSelectionChange).not.toHaveBeenCalled()
    expect(placeholderRow.getIsSelected()).toBe(false)
  })

  it('should not clear a single selection when a placeholder row is toggled', () => {
    const table = makeTable({
      enableMultiRowSelection: false,
      initialState: { rowSelection: { 'person-3': true } },
    })

    table.getRowModel().rows[0]!.toggleSelected(true)

    expect(table.atoms.rowSelection.get()).toEqual({ 'person-3': true })
  })

  it('should select only the loaded rows with select all', () => {
    const table = makeTable()

    table.toggleAllRowsSelected(true)

    expect(table.atoms.rowSelection.get()).toEqual({
      'person-2': true,
      'person-3': true,
      'person-4': true,
    })
    expect(table.getIsAllRowsSelected()).toBe(true)
    expect(table.getSelectedRowModel().rows.map((row) => row.id)).toEqual([
      'person-2',
      'person-3',
      'person-4',
    ])

    table.toggleAllRowsSelected(false)
    expect(table.atoms.rowSelection.get()).toEqual({})
  })

  it('should select only the loaded rows of the page with select all on the page', () => {
    const table = makeTable({ enableMultiRowSelection: false })

    table.toggleAllPageRowsSelected(true)

    expect(table.atoms.rowSelection.get()).toEqual({ 'person-4': true })
  })

  it('should not keep a placeholder row as the anchor of a Shift range', () => {
    const table = makeTable()
    const { rows } = table.getRowModel()

    rows[3]!.getToggleSelectedHandler()({ target: { checked: true } })
    rows[6]!.getToggleSelectedHandler()({
      target: { checked: true },
      shiftKey: true,
    })

    expect(table._lastSelectedRowId).toBe('person-3')
    expect(table.atoms.rowSelection.get()).toEqual({ 'person-3': true })
  })

  it('should keep the selection of a row that is no longer loaded', () => {
    const table = makeTable({
      initialState: { rowSelection: { 'person-3': true } },
    })
    expect(table.getRowModel().rows[3]!.getIsSelected()).toBe(true)

    setData(table, makeSparseData([7, 8]))

    expect(table.atoms.rowSelection.get()).toEqual({ 'person-3': true })
    expect(table.getRowModel().rows[3]!.getIsSelected()).toBe(false)
    expect(table.getSelectedRowModel().rows).toEqual([])
    expect(table.getIsSomeRowsSelected()).toBe(true)

    setData(table, makeSparseData([2, 4]))

    expect(table.getRowModel().rows[3]!.getIsSelected()).toBe(true)
    expect(table.getSelectedRowModel().rows.map((row) => row.id)).toEqual([
      'person-3',
    ])
  })

  it('should not report all rows selected when no row is loaded', () => {
    const table = makeTable({
      initialState: { rowSelection: { 'person-3': true } },
    })
    expect(table.getIsAllRowsSelected()).toBe(false)

    table.toggleAllRowsSelected(true)
    expect(table.getIsAllRowsSelected()).toBe(true)

    setData(table, [])

    expect(table.getRowModel().rows).toHaveLength(10)
    expect(table.getIsAllRowsSelected()).toBe(false)
    expect(table.getIsAllPageRowsSelected()).toBe(false)
    expect(table.getIsSomeRowsSelected()).toBe(true)
  })
})

describe('row pinning with placeholder rows', () => {
  it('should not let a placeholder row be pinned or pass it to the predicate', () => {
    const enableRowPinning = vi.fn(
      (row: Row<typeof features, Person>) => row.original.age > 0,
    )
    const table = makeTable({ enableRowPinning })
    const [placeholderRow, , loadedRow] = table.getRowModel().rows

    expect(placeholderRow!.getCanPin()).toBe(false)
    expect(enableRowPinning).not.toHaveBeenCalled()
    expect(loadedRow!.getCanPin()).toBe(true)
  })

  it('should keep no pinning state when a placeholder row is pinned', () => {
    const onRowPinningChange = vi.fn()
    const table = makeTable({ onRowPinningChange })
    const placeholderRow = table.getRowModel().rows[0]!

    placeholderRow.pin('top')
    placeholderRow.pin('bottom')
    placeholderRow.pin(false)

    expect(onRowPinningChange).not.toHaveBeenCalled()
    expect(placeholderRow.getIsPinned()).toBe(false)
  })

  it('should leave out a pinned row while it is not loaded', () => {
    const table = makeTable()
    table.getRowModel().rows[3]!.pin('top')
    expect(table.getTopRows().map((row) => row.id)).toEqual(['person-3'])

    setData(table, makeSparseData([7, 8]))

    expect(table.atoms.rowPinning.get()).toEqual({
      top: ['person-3'],
      bottom: [],
    })
    expect(table.getTopRows()).toEqual([])
    expect(table.getCenterRows()).toHaveLength(10)

    setData(table, makeSparseData([2, 4]))

    expect(table.getTopRows().map((row) => row.id)).toEqual(['person-3'])
  })
})

describe('row expanding with placeholder rows', () => {
  it('should not let a placeholder row expand or pass it to the predicates', () => {
    const getRowCanExpand = vi.fn(
      (row: Row<typeof features, Person>) => row.original.age > 0,
    )
    const getIsRowExpanded = vi.fn(
      (row: Row<typeof features, Person>) => row.original.age > 0,
    )
    const table = makeTable({ getRowCanExpand, getIsRowExpanded })
    const [placeholderRow, , loadedRow] = table.getRowModel().rows

    expect(placeholderRow!.getCanExpand()).toBe(false)
    expect(placeholderRow!.getIsExpanded()).toBe(false)
    expect(getRowCanExpand).not.toHaveBeenCalled()
    expect(getIsRowExpanded).not.toHaveBeenCalled()
    expect(loadedRow!.getCanExpand()).toBe(true)
    expect(loadedRow!.getIsExpanded()).toBe(true)
  })

  it('should keep no expanded state when a placeholder row is toggled', () => {
    const onExpandedChange = vi.fn()
    const table = makeTable({
      getRowCanExpand: () => true,
      onExpandedChange,
    })
    const placeholderRow = table.getRowModel().rows[0]!

    placeholderRow.toggleExpanded()
    placeholderRow.toggleExpanded(true)
    placeholderRow.getToggleExpandedHandler()()

    expect(onExpandedChange).not.toHaveBeenCalled()
  })

  it('should not expand placeholder rows when all rows are expanded', () => {
    const table = makeTable({ getRowCanExpand: () => true })

    table.toggleAllRowsExpanded(true)
    expect(table.atoms.expanded.get()).toBe(true)

    const [placeholderRow, , loadedRow] = table.getRowModel().rows
    expect(placeholderRow!.getIsExpanded()).toBe(false)
    expect(loadedRow!.getIsExpanded()).toBe(true)

    placeholderRow!.toggleExpanded(false)
    expect(table.atoms.expanded.get()).toBe(true)

    loadedRow!.toggleExpanded(false)
    expect(table.atoms.expanded.get()).toEqual({
      'person-3': true,
      'person-4': true,
    })
  })
})

describe('cell selection with placeholder rows', () => {
  const cellFeatures = testFeatures({
    cellSelectionFeature,
    sparseRowsFeature,
  })

  function makeCellTable(
    options?: Partial<TableOptions<typeof cellFeatures, Person>>,
  ) {
    return constructTable<typeof cellFeatures, Person>({
      features: cellFeatures,
      columns: [
        { accessorKey: 'name', id: 'name' },
        { accessorKey: 'age', id: 'age' },
      ],
      data: makeSparseData([2, 4], [7, 8]),
      rowCount: 10,
      getRowId: (person) => person.id,
      ...options,
    })
  }

  function rangeOf(
    anchorRowId: string,
    anchorColumnId: string,
    focusRowId: string,
    focusColumnId: string,
  ): CellSelectionRange {
    return { anchorRowId, anchorColumnId, focusRowId, focusColumnId }
  }

  function makeFakeDocument() {
    return {
      addEventListener: () => {},
      removeEventListener: () => {},
    } as unknown as Document
  }

  it('should not let a placeholder cell be selected or pass it to the predicate', () => {
    const enableCellSelection = vi.fn(
      (cell: Cell<typeof cellFeatures, Person>) =>
        cell.row.original.name.startsWith('Person'),
    )
    const table = makeCellTable({ enableCellSelection })
    const [placeholderRow, , loadedRow] = table.getRowModel().rows

    expect(placeholderRow!.getAllCells()[0]!.getCanSelect()).toBe(false)
    expect(enableCellSelection).not.toHaveBeenCalled()
    expect(loadedRow!.getAllCells()[0]!.getCanSelect()).toBe(true)
  })

  it('should keep no selection state when a placeholder cell gets a pointer event', () => {
    const table = makeCellTable()
    const { rows } = table.getRowModel()
    const fakeDocument = makeFakeDocument()

    rows[5]!.getAllCells()[0]!.getSelectionStartHandler(fakeDocument)({})
    expect(table.atoms.cellSelection.get()).toEqual([])

    rows[4]!.getAllCells()[0]!.getSelectionStartHandler(fakeDocument)({})
    rows[5]!.getAllCells()[1]!.getSelectionExtendHandler()({})

    expect(table.atoms.cellSelection.get()).toEqual([
      rangeOf('person-4', 'name', 'person-4', 'name'),
    ])

    rows[3]!.getAllCells()[1]!.getSelectionExtendHandler()({})

    expect(table.atoms.cellSelection.get()).toEqual([
      rangeOf('person-4', 'name', 'person-3', 'age'),
    ])
  })

  it('should not select a range that starts or ends on a placeholder row', () => {
    const table = makeCellTable()
    const placeholderId = table.getRowModel().rows[6]!.id

    table.selectCellRange(rangeOf('person-3', 'name', placeholderId, 'age'))
    table.selectCellRange(rangeOf(placeholderId, 'name', 'person-3', 'age'))
    table.selectCellRange(rangeOf(placeholderId, 'name', placeholderId, 'age'))

    expect(table.atoms.cellSelection.get()).toEqual([])

    table.selectCellRange(rangeOf('person-3', 'name', 'person-4', 'age'))
    table.selectCellRange(rangeOf('person-7', 'name', placeholderId, 'age'), {
      additive: true,
    })

    expect(table.atoms.cellSelection.get()).toEqual([
      rangeOf('person-3', 'name', 'person-4', 'age'),
    ])
  })

  it('should leave out the placeholder rows of a range that spans a gap', () => {
    const table = makeCellTable()
    const { rows } = table.getRowModel()
    const getPlaceholderCells = vi.spyOn(rows[5]!, 'getAllCellsByColumnId')

    table.selectCellRange(rangeOf('person-3', 'name', 'person-7', 'age'))

    const selectedCellIds = [
      'person-3_name',
      'person-3_age',
      'person-4_name',
      'person-4_age',
      'person-7_name',
      'person-7_age',
    ]
    expect(table.getSelectedCellIds()).toEqual(selectedCellIds)
    expect(table.getSelectedCellCount()).toBe(selectedCellIds.length)
    expect(table.getCellSelectionRowIds()).toEqual([
      'person-3',
      'person-4',
      'person-7',
    ])
    const [grid] = table.getSelectedCellRangesData()
    expect(grid).toHaveLength(5)
    expect(Object.entries(grid!)).toEqual([
      ['0', ['Person 3', 23]],
      ['1', ['Person 4', 24]],
      ['4', ['Person 7', 27]],
    ])
    expect(getPlaceholderCells).not.toHaveBeenCalled()
    expect(rows[5]!.getAllCells()[0]!.getIsSelected()).toBe(false)
    expect(rows[4]!.getAllCells()[0]!.getIsSelected()).toBe(true)

    table.setOptions((old) => ({ ...old, data: makeSparseData([2, 8]) }))

    expect(table.atoms.cellSelection.get()).toEqual([
      rangeOf('person-3', 'name', 'person-7', 'age'),
    ])
    expect(table.getSelectedCellCount()).toBe(10)
    expect(table.getSelectedCellIds()).toHaveLength(10)
  })

  it('should remove a range with a placeholder corner from setCellSelection', () => {
    const table = makeCellTable()
    const placeholderId = table.getRowModel().rows[6]!.id
    const loadedRange = rangeOf('person-2', 'name', 'person-3', 'age')

    table.setCellSelection([
      rangeOf('person-3', 'name', placeholderId, 'age'),
      rangeOf(placeholderId, 'name', placeholderId, 'name'),
      loadedRange,
    ])

    expect(table.atoms.cellSelection.get()).toEqual([loadedRange])

    table.setCellSelection((old) => [
      ...old,
      rangeOf(placeholderId, 'name', 'person-7', 'age'),
    ])

    expect(table.atoms.cellSelection.get()).toEqual([loadedRange])
    expect(table.getSelectedCellCount()).toBe(4)

    table.setCellSelection((old) => [
      ...old,
      rangeOf(placeholderId, 'age', placeholderId, 'age'),
    ])

    expect(table.atoms.cellSelection.get()).toEqual([
      loadedRange,
      rangeOf(placeholderId, 'age', placeholderId, 'age'),
    ])
    expect(table.getSelectedCellCount()).toBe(4)
  })

  it('should not resolve a placeholder corner that is in the state', () => {
    const placeholderRange = rangeOf(
      'person-3',
      'name',
      '__placeholder_6',
      'age',
    )
    const table = makeCellTable({
      initialState: { cellSelection: [placeholderRange] },
    })

    expect(table.getCellSelectionBounds()).toEqual([])
    expect(table.getSelectedCellCount()).toBe(0)
    expect(table.getSelectedCellIds()).toEqual([])

    table.setOptions((old) => ({ ...old, data: makeSparseData([2, 8]) }))

    expect(table.atoms.cellSelection.get()).toEqual([placeholderRange])
    expect(table.getCellSelectionBounds()).toEqual([])
    expect(table.getSelectedCellCount()).toBe(0)
  })

  it('should move the focus from the last loaded row onto placeholder rows', () => {
    const table = makeCellTable()
    const { rows } = table.getRowModel()

    table.setFocusedCell('person-4', 'age')
    table.moveCellSelection('down')

    expect(table.atoms.cellSelection.get()).toEqual([
      rangeOf('__placeholder_5', 'age', '__placeholder_5', 'age'),
    ])
    expect(table.getFocusedCell()).toBe(rows[5]!.getAllCells()[1])
    expect(rows[5]!.getAllCells()[1]!.getIsFocused()).toBe(true)
    expect(rows[5]!.getAllCells()[1]!.getTabIndex()).toBe(0)
    expect(rows[5]!.getAllCells()[0]!.getIsFocused()).toBe(false)
    expect(rows[5]!.getAllCells()[1]!.getCanSelect()).toBe(false)
    expect(rows[5]!.getAllCells()[1]!.getIsSelected()).toBe(false)
    expect(table.getCellSelectionBounds()).toEqual([])
    expect(table.getSelectedCellCount()).toBe(0)

    table.moveCellSelection('down')
    table.moveCellSelection('left')

    expect(table.atoms.cellSelection.get()).toEqual([
      rangeOf('__placeholder_6', 'name', '__placeholder_6', 'name'),
    ])

    table.moveCellSelection('down')

    expect(table.atoms.cellSelection.get()).toEqual([
      rangeOf('person-7', 'name', 'person-7', 'name'),
    ])
    expect(table.getSelectedCellCount()).toBe(1)
  })

  it('should start keyboard navigation on the first row when it is a placeholder row', () => {
    const table = makeCellTable()

    table.moveCellSelection('down')

    expect(table.atoms.cellSelection.get()).toEqual([
      rangeOf('__placeholder_0', 'name', '__placeholder_0', 'name'),
    ])

    table.moveCellSelection('up')

    expect(table.atoms.cellSelection.get()).toEqual([
      rangeOf('__placeholder_0', 'name', '__placeholder_0', 'name'),
    ])
  })

  it('should jump the focus to a placeholder row', () => {
    const table = makeCellTable()
    const { rows } = table.getRowModel()

    table.selectCellRange(rangeOf('person-2', 'name', 'person-4', 'age'))
    table.setFocusedCell(rows[9]!.id, 'age')

    expect(table.atoms.cellSelection.get()).toEqual([
      rangeOf('__placeholder_9', 'age', '__placeholder_9', 'age'),
    ])
    expect(table.getFocusedCell()!.row.index).toBe(9)
    expect(table.getSelectedCellCount()).toBe(0)

    table.moveCellSelection('down')
    table.setFocusedCell(rows[0]!.id, 'name')

    expect(table.atoms.cellSelection.get()).toEqual([
      rangeOf('__placeholder_0', 'name', '__placeholder_0', 'name'),
    ])
  })

  it('should let the focus follow the row when the row is loaded', () => {
    const table = makeCellTable()
    const focusRange = rangeOf(
      '__placeholder_5',
      'age',
      '__placeholder_5',
      'age',
    )

    table.setFocusedCell('__placeholder_5', 'age')
    table.setOptions((old) => ({ ...old, data: makeSparseData([2, 8]) }))

    const loadedCell = table.getRowModel().rows[5]!.getAllCells()[1]!

    expect(table.atoms.cellSelection.get()).toEqual([focusRange])
    expect(loadedCell.row.id).toBe('person-5')
    expect(table.getFocusedCell()).toBe(loadedCell)
    expect(loadedCell.getIsFocused()).toBe(true)
    expect(loadedCell.getTabIndex()).toBe(0)
    expect(loadedCell.getIsSelected()).toBe(true)
    expect(table.getSelectedCellIds()).toEqual(['person-5_age'])

    table.moveCellSelection('down')

    expect(table.atoms.cellSelection.get()).toEqual([
      rangeOf('person-6', 'age', 'person-6', 'age'),
    ])
  })

  it('should use the id of the loaded row when a range starts at a focus that followed its row', () => {
    const fakeDocument = makeFakeDocument()
    const table = makeCellTable()

    table.setFocusedCell('__placeholder_5', 'age')
    table.setOptions((old) => ({ ...old, data: makeSparseData([2, 8]) }))
    table.extendCellSelection('down')

    expect(table.atoms.cellSelection.get()).toEqual([
      rangeOf('person-5', 'age', 'person-6', 'age'),
    ])

    table.setOptions((old) => ({ ...old, data: makeSparseData([2, 4]) }))
    table.setFocusedCell('__placeholder_5', 'age')
    table.setOptions((old) => ({ ...old, data: makeSparseData([2, 8]) }))
    table
      .getRowModel()
      .rows[7]!.getAllCells()[0]!
      .getSelectionStartHandler(fakeDocument)({ shiftKey: true })

    expect(table.atoms.cellSelection.get()).toEqual([
      rangeOf('person-5', 'age', 'person-7', 'name'),
    ])

    table.setOptions((old) => ({ ...old, data: makeSparseData([2, 4]) }))
    table.setFocusedCell('__placeholder_5', 'age')
    table.setOptions((old) => ({ ...old, data: makeSparseData([2, 8]) }))
    table.selectCellRange(rangeOf('person-2', 'name', 'person-2', 'name'), {
      additive: true,
    })

    expect(table.atoms.cellSelection.get()).toEqual([
      rangeOf('person-5', 'age', 'person-5', 'age'),
      rangeOf('person-2', 'name', 'person-2', 'name'),
    ])
  })

  it('should stop a keyboard extension at the last loaded row', () => {
    const table = makeCellTable()

    table.setFocusedCell('person-3', 'name')
    table.extendCellSelection('down')
    table.extendCellSelection('down')

    expect(table.atoms.cellSelection.get()).toEqual([
      rangeOf('person-3', 'name', 'person-4', 'name'),
    ])

    table.extendCellSelection('up')
    table.extendCellSelection('up')
    table.extendCellSelection('up')

    expect(table.atoms.cellSelection.get()).toEqual([
      rangeOf('person-3', 'name', 'person-2', 'name'),
    ])
  })

  it('should not start a range from a focused cell in a placeholder row', () => {
    const fakeDocument = makeFakeDocument()
    const table = makeCellTable()
    const { rows } = table.getRowModel()
    const focusRange = rangeOf(
      '__placeholder_6',
      'name',
      '__placeholder_6',
      'name',
    )

    table.setFocusedCell('__placeholder_6', 'name')
    table.extendCellSelection('up')
    table.extendCellSelection('down')
    table.extendCellSelection('right')

    expect(table.atoms.cellSelection.get()).toEqual([focusRange])

    rows[7]!.getAllCells()[1]!.getSelectionStartHandler(fakeDocument)({
      shiftKey: true,
    })

    expect(table.atoms.cellSelection.get()).toEqual([
      rangeOf('person-7', 'age', 'person-7', 'age'),
    ])
  })

  it('should read a focused placeholder id as an index after data is replaced', () => {
    const table = makeCellTable()

    table.setFocusedCell('__placeholder_5', 'age')
    table.setOptions((old) => ({
      ...old,
      data: Array.from({ length: 10 }, (_, index) => makePerson(index + 100)),
    }))

    expect(table.getFocusedCell()!.row.id).toBe('person-105')

    table.resetCellSelection(true)

    expect(table.getFocusedCell()).toBeUndefined()
  })

  it('should select from the first to the last loaded row with select all', () => {
    const table = makeCellTable()

    table.selectAllCells()

    expect(table.atoms.cellSelection.get()).toEqual([
      rangeOf('person-2', 'name', 'person-8', 'age'),
    ])
    expect(table.getSelectedCellCount()).toBe(10)

    table.resetCellSelection(true)
    table.setOptions((old) => ({ ...old, data: [] }))
    table.selectAllCells()

    expect(table.atoms.cellSelection.get()).toEqual([])
  })

  it('should keep the cell selection of a row that is no longer loaded', async () => {
    const table = makeCellTable()

    table.selectCellRange(rangeOf('person-3', 'name', 'person-4', 'age'))
    table.setOptions((old) => ({ ...old, data: makeSparseData([7, 8]) }))
    table.getRowModel()
    await flushMicrotasks()

    expect(table.atoms.cellSelection.get()).toEqual([
      rangeOf('person-3', 'name', 'person-4', 'age'),
    ])
    expect(table.getSelectedCellCount()).toBe(0)
    expect(table.getSelectedCellIds()).toEqual([])

    table.setOptions((old) => ({ ...old, data: makeSparseData([2, 4]) }))

    expect(table.getSelectedCellCount()).toBe(4)
  })
})

describe('global filtering with placeholder rows', () => {
  const globalFeatures = testFeatures({
    columnFilteringFeature,
    globalFilteringFeature,
    sparseRowsFeature,
  })

  function makeGlobalTable(
    options?: Partial<TableOptions<typeof globalFeatures, Person>>,
  ) {
    return constructTable<typeof globalFeatures, Person>({
      features: globalFeatures,
      columns: [
        { accessorKey: 'name', id: 'name' },
        { accessorKey: 'children', id: 'children' },
      ],
      data: makeSparseData([2, 4]),
      rowCount: 10,
      getRowId: (person) => person.id,
      manualFiltering: true,
      ...options,
    })
  }

  it('should read the column value of the first loaded row without the cells of placeholder rows', () => {
    const table = makeGlobalTable()
    const getPlaceholderCells = vi.spyOn(
      table.getCoreRowModel().rows[0]!,
      'getAllCellsByColumnId',
    )

    expect(table.getColumn('name')!.getCanGlobalFilter()).toBe(true)
    expect(table.getColumn('children')!.getCanGlobalFilter()).toBe(false)
    expect(getPlaceholderCells).not.toHaveBeenCalled()
  })

  it('should not let a column be filtered globally when no row is loaded', () => {
    const table = makeGlobalTable({ data: [] })

    expect(table.getColumn('name')!.getCanGlobalFilter()).toBe(false)
  })
})

describe('sparseRowsFeature development warnings', () => {
  const clientFeatures = testFeatures({
    columnFilteringFeature,
    rowSortingFeature,
    sparseRowsFeature,
    filteredRowModel: createFilteredRowModel(),
    sortedRowModel: createSortedRowModel(),
    filterFns,
    sortFns,
  })

  function makeClientTable(
    options?: Partial<TableOptions<typeof clientFeatures, Person>>,
  ) {
    return constructTable<typeof clientFeatures, Person>({
      features: clientFeatures,
      columns: [{ accessorKey: 'name', id: 'name' }],
      data: makeSparseData([2, 4]),
      rowCount: 10,
      getRowId: (person) => person.id,
      ...options,
    })
  }

  it('should warn once when a client-side row model is active', () => {
    const warn = spyOnDevWarnings()
    const table = makeClientTable({ manualFiltering: true })

    table.getRowModel()
    table.setOptions((old) => ({ ...old, data: makeSparseData([2, 6]) }))
    table.getRowModel()

    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0]![0]).toContain('manualSorting')
  })

  it('should warn when only the filtered row model runs on the client', () => {
    const warn = spyOnDevWarnings()
    const table = makeClientTable({ manualSorting: true })

    table.getRowModel()

    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0]![0]).toContain('manualFiltering')
  })

  it('should warn when only the grouped row model runs on the client', () => {
    const groupedFeatures = testFeatures({
      columnGroupingFeature,
      sparseRowsFeature,
      groupedRowModel: createGroupedRowModel(),
    })
    const makeGroupedTable = (manualGrouping: boolean) =>
      constructTable<typeof groupedFeatures, Person>({
        features: groupedFeatures,
        columns: [{ accessorKey: 'name', id: 'name' }],
        data: makeSparseData([2, 4]),
        rowCount: 10,
        getRowId: (person) => person.id,
        manualGrouping,
      })
    const warn = spyOnDevWarnings()

    makeGroupedTable(true).getRowModel()
    expect(warn).not.toHaveBeenCalled()

    makeGroupedTable(false).getRowModel()
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0]![0]).toContain('manualGrouping')
  })

  it('should not warn when filtering, grouping and sorting are manual', () => {
    const allClientFeatures = testFeatures({
      columnFilteringFeature,
      columnGroupingFeature,
      rowSortingFeature,
      sparseRowsFeature,
      filteredRowModel: createFilteredRowModel(),
      groupedRowModel: createGroupedRowModel(),
      sortedRowModel: createSortedRowModel(),
      filterFns,
      sortFns,
    })
    const warn = spyOnDevWarnings()
    const table = constructTable<typeof allClientFeatures, Person>({
      features: allClientFeatures,
      columns: [{ accessorKey: 'name', id: 'name' }],
      data: makeSparseData([2, 4]),
      rowCount: 10,
      getRowId: (person) => person.id,
      manualFiltering: true,
      manualGrouping: true,
      manualSorting: true,
    })

    expect(table.getRowModel().rows).toHaveLength(10)
    expect(warn).not.toHaveBeenCalled()
  })

  it('should not warn when filtering and sorting are manual', () => {
    const warn = spyOnDevWarnings()
    const table = makeClientTable({
      manualFiltering: true,
      manualSorting: true,
    })

    expect(table.getRowModel().rows).toHaveLength(10)
    expect(warn).not.toHaveBeenCalled()
  })

  it('should warn when getRowId returns the same id for two loaded rows', () => {
    const warn = spyOnDevWarnings()
    const data = makeSparseData([2, 4])
    data[6] = makePerson(3)
    const table = makeTable({ data })

    table.getRowModel()
    setData(table, [...data])
    table.getRowModel()

    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0]![0]).toContain("'person-3'")

    setData(table, makeSparseData([2, 4]))
    table.getRowModel()
    setData(table, data)
    table.getRowModel()

    expect(warn).toHaveBeenCalledTimes(2)
  })

  it('should not warn about a client-side row model while every row is loaded', () => {
    const warn = spyOnDevWarnings()
    const table = makeClientTable({ data: makeSparseData([0, 9]) })

    table.getRowModel()

    expect(warn).not.toHaveBeenCalled()

    table.setOptions((old) => ({ ...old, data: makeSparseData([0, 4]) }))
    table.getRowModel()

    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0]![0]).toContain('manualFiltering')
  })

  it('should warn once when a loaded row has an id with the placeholder prefix', () => {
    const warn = spyOnDevWarnings()
    const data = makeSparseData([2, 4])
    data[3] = { ...makePerson(3), id: '__placeholder_7' }
    const table = makeTable({ data })

    table.getRowModel()
    setData(table, [...data])
    table.getRowModel()

    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0]![0]).toContain("'__placeholder_7'")
    expect(warn.mock.calls[0]![0]).toContain('reserved')
  })

  it('should not report an id with the placeholder prefix as an overlap of loaded ranges', () => {
    const warn = spyOnDevWarnings()
    const data = makeSparseData([2, 4])
    data[3] = { ...makePerson(3), id: '__placeholder_1' }

    makeTable({ data }).getRowModel()

    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0]![0]).toContain('reserved')
  })

  it('should not warn outside of development', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const data = makeSparseData([2, 4])
    data[6] = makePerson(3)

    makeClientTable({ data }).getRowModel()

    expect(warn).not.toHaveBeenCalled()
  })
})

describe('tables without sparseRowsFeature', () => {
  it('should not be part of stockFeatures', () => {
    expect(Object.keys(stockFeatures)).not.toContain('sparseRowsFeature')
  })

  it('should keep rowCount out of the core row model', () => {
    const table = constructTable({
      features: testFeatures(stockFeatures),
      columns: [{ accessorKey: 'name', id: 'name' }],
      data: [makePerson(0), makePerson(1), makePerson(2)],
      rowCount: 100,
      manualPagination: true,
      getRowId: (person: Person) => person.id,
    })
    const { rows } = table.getRowModel()

    expect(rows.map((row) => row.id)).toEqual([
      'person-0',
      'person-1',
      'person-2',
    ])
    expect(table.getRowCount()).toBe(100)
    expect('getIsPlaceholder' in rows[0]!).toBe(false)
    expect('getMissingRowRanges' in table).toBe(false)
  })

  it('should keep the selection, pinning and expanding APIs of stock tables', () => {
    const table = constructTable({
      features: testFeatures(stockFeatures),
      columns: [{ accessorKey: 'name', id: 'name' }],
      data: [makePerson(0), makePerson(1)],
      getRowId: (person: Person) => person.id,
      getRowCanExpand: () => true,
    })
    const row = table.getRowModel().rows[0]!

    expect(row.getCanSelect()).toBe(true)
    expect(row.getCanMultiSelect()).toBe(true)
    expect(row.getCanSelectSubRows()).toBe(true)
    expect(row.getCanPin()).toBe(true)
    expect(row.getCanExpand()).toBe(true)

    row.toggleSelected(true)
    row.pin('top')
    row.toggleExpanded(true)

    expect(table.atoms.rowSelection.get()).toEqual({ 'person-0': true })
    expect(table.atoms.rowPinning.get()).toEqual({
      top: ['person-0'],
      bottom: [],
    })
    expect(table.atoms.expanded.get()).toEqual({ 'person-0': true })
    expect(row.getIsExpanded()).toBe(true)
  })

  it('should not read the row model when a cell range is selected', () => {
    const table = constructTable({
      features: testFeatures({ cellSelectionFeature }),
      columns: [{ accessorKey: 'name', id: 'name' }],
      data: [makePerson(0), makePerson(1)],
      getRowId: (person: Person) => person.id,
    })
    const getCoreRowModel = vi.spyOn(table, 'getCoreRowModel')
    const range = {
      anchorRowId: 'person-0',
      anchorColumnId: 'name',
      focusRowId: 'person-1',
      focusColumnId: 'name',
    }

    table.setFocusedCell('person-0', 'name')
    table.selectCellRange(range)

    expect(getCoreRowModel).not.toHaveBeenCalled()
    expect(table.atoms.cellSelection.get()).toEqual([range])
    expect(table.getSelectedCellCount()).toBe(2)
  })

  it('should run the auto resets of the default core row model', async () => {
    const denseFeatures = testFeatures({
      rowPaginationFeature,
      paginatedRowModel: createPaginatedRowModel(),
    })
    const table = constructTable<typeof denseFeatures, Person>({
      features: denseFeatures,
      columns: [{ accessorKey: 'name', id: 'name' }],
      data: makeSparseData([0, 9]),
      initialState: { pagination: { pageIndex: 2, pageSize: 2 } },
    })
    table.getRowModel()
    await flushMicrotasks()

    table.setOptions((old) => ({ ...old, data: makeSparseData([0, 9]) }))
    table.getRowModel()
    await flushMicrotasks()

    expect(table.atoms.pagination.get().pageIndex).toBe(0)
  })
})
