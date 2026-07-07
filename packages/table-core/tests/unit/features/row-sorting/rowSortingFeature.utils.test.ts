import { describe, expect, it, vi } from 'vitest'
import {
  constructTable,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  sortFns,
} from '../../../../src'
import {
  column_clearSorting,
  column_getAutoSortDir,
  column_getAutoSortFn,
  column_getCanMultiSort,
  column_getCanSort,
  column_getFirstSortDir,
  column_getIsSorted,
  column_getNextSortingOrder,
  column_getSortFn,
  column_getSortIndex,
  column_getToggleSortingHandler,
  column_toggleSorting,
  getDefaultSortingState,
  table_resetSorting,
  table_setSorting,
} from '../../../../src/static-functions'
import { testFeatures } from '../../../fixtures/features'
import { getUpdaterResult } from '../../../helpers/testUtils'
import type { ColumnDef, SortingState, TableOptions } from '../../../../src'

type Sample = {
  plainText: string
  alphaNum: string
  createdAt: Date
  amount: number
}

const features = testFeatures({ rowSortingFeature, sortFns })

const sampleKeys: Array<keyof Sample> = [
  'plainText',
  'alphaNum',
  'createdAt',
  'amount',
]

function generateAutoSortTestTable(data: Array<Sample>) {
  const columns: Array<ColumnDef<typeof features, Sample, any>> =
    sampleKeys.map((key) => ({ accessorKey: key, id: key }))

  return constructTable<typeof features, Sample>({
    data,
    columns,
    features,
  })
}

describe('column_getAutoSortFn', () => {
  const data: Array<Sample> = [
    {
      plainText: 'apple',
      alphaNum: 'item1',
      createdAt: new Date('2024-01-01'),
      amount: 1,
    },
    {
      plainText: 'banana',
      alphaNum: 'item10',
      createdAt: new Date('2024-02-01'),
      amount: 2,
    },
  ]

  it('selects datetime for Date values', () => {
    const table = generateAutoSortTestTable(data)
    const column = table.getColumn('createdAt')!

    expect(column_getAutoSortFn(column)).toBe(sortFn_datetime)
  })

  it('selects alphanumeric for strings mixing text and numbers', () => {
    // Regression: the text fallback used to clobber the alphanumeric match
    const table = generateAutoSortTestTable(data)
    const column = table.getColumn('alphaNum')!

    expect(column_getAutoSortFn(column)).toBe(sortFn_alphanumeric)
  })

  it('selects text for plain strings', () => {
    const table = generateAutoSortTestTable(data)
    const column = table.getColumn('plainText')!

    expect(column_getAutoSortFn(column)).toBe(sortFn_text)
  })

  it('falls back to basic for non-string, non-date values', () => {
    const table = generateAutoSortTestTable(data)
    const column = table.getColumn('amount')!

    expect(column_getAutoSortFn(column)).toBe(sortFn_basic)
  })

  it('falls back to basic when no rows exist', () => {
    const table = generateAutoSortTestTable([])
    const column = table.getColumn('plainText')!

    expect(column_getAutoSortFn(column)).toBe(sortFn_basic)
  })

  it('falls back to text when alphanumeric is not registered', () => {
    const table = generateAutoSortTestTable(data)
    table._rowModelFns.sortFns = { text: sortFn_text }
    const column = table.getColumn('alphaNum')!

    expect(column_getAutoSortFn(column)).toBe(sortFn_text)
  })
})

// ---------------------------------------------------------------------------
// Sorting state, toggle cycle, and column flags
// ---------------------------------------------------------------------------

type Person = {
  firstName: string
  lastName: string
  age: number
}

const people: Array<Person> = [
  { firstName: 'amy', lastName: 'zulu', age: 20 },
  { firstName: 'bob', lastName: 'young', age: 40 },
  { firstName: 'alice', lastName: 'xi', age: 30 },
]

const personColumns: Array<ColumnDef<typeof features, Person, any>> = [
  { accessorKey: 'firstName', id: 'firstName' },
  { accessorKey: 'lastName', id: 'lastName' },
  { accessorKey: 'age', id: 'age' },
  // display column with no accessor
  { id: 'actions', header: 'Actions' },
]

function makeTable(
  options?: Partial<
    Omit<TableOptions<typeof features, Person>, 'data' | 'columns' | 'features'>
  >,
) {
  return constructTable<typeof features, Person>({
    data: people,
    columns: personColumns,
    features,
    ...options,
  })
}

function makeTableWithMockOnSortingChange(
  options?: Partial<
    Omit<TableOptions<typeof features, Person>, 'data' | 'columns' | 'features'>
  >,
) {
  const onSortingChange = vi.fn()
  const table = makeTable({ onSortingChange, ...options })
  return { table, onSortingChange }
}

describe('getDefaultSortingState', () => {
  it('should return an empty array and a new instance each time', () => {
    expect(getDefaultSortingState()).toEqual([])
    expect(getDefaultSortingState()).not.toBe(getDefaultSortingState())
  })
})

describe('table_setSorting', () => {
  it('should route the updater through onSortingChange', () => {
    const { table, onSortingChange } = makeTableWithMockOnSortingChange()
    const newSorting: SortingState = [{ id: 'age', desc: true }]

    table_setSorting(table, newSorting)

    expect(onSortingChange).toHaveBeenCalledWith(newSorting)
  })
})

describe('table_resetSorting', () => {
  it('should reset to an empty array when defaultState is true', () => {
    const { table, onSortingChange } = makeTableWithMockOnSortingChange({
      initialState: { sorting: [{ id: 'age', desc: true }] },
    })

    table_resetSorting(table, true)

    expect(onSortingChange).toHaveBeenCalledWith([])
  })

  it('should reset to the initial state by default', () => {
    const initialSorting: SortingState = [{ id: 'age', desc: true }]
    const { table, onSortingChange } = makeTableWithMockOnSortingChange({
      initialState: { sorting: initialSorting },
    })

    table_resetSorting(table)

    expect(onSortingChange).toHaveBeenCalledWith(initialSorting)
  })
})

describe('column_getIsSorted', () => {
  it('should return false when the column is not sorted', () => {
    const table = makeTable()

    expect(column_getIsSorted(table.getColumn('firstName')!)).toBe(false)
  })

  it('should return the sort direction when sorted', () => {
    const table = makeTable({
      initialState: {
        sorting: [
          { id: 'firstName', desc: false },
          { id: 'age', desc: true },
        ],
      },
    })

    expect(column_getIsSorted(table.getColumn('firstName')!)).toBe('asc')
    expect(column_getIsSorted(table.getColumn('age')!)).toBe('desc')
  })
})

describe('column_getSortIndex', () => {
  it('should return the position in the sorting state', () => {
    const table = makeTable({
      initialState: {
        sorting: [
          { id: 'age', desc: true },
          { id: 'firstName', desc: false },
        ],
      },
    })

    expect(column_getSortIndex(table.getColumn('age')!)).toBe(0)
    expect(column_getSortIndex(table.getColumn('firstName')!)).toBe(1)
    expect(column_getSortIndex(table.getColumn('lastName')!)).toBe(-1)
  })
})

describe('column_getCanSort', () => {
  it('should return true for accessor columns by default', () => {
    const table = makeTable()

    expect(column_getCanSort(table.getColumn('firstName')!)).toBe(true)
  })

  it('should return false for display columns without an accessor', () => {
    const table = makeTable()

    expect(column_getCanSort(table.getColumn('actions')!)).toBe(false)
  })

  it('should return false when sorting is disabled globally', () => {
    const table = makeTable({ enableSorting: false })

    expect(column_getCanSort(table.getColumn('firstName')!)).toBe(false)
  })

  it('should return false when sorting is disabled for the column', () => {
    const columns: Array<ColumnDef<typeof features, Person, any>> = [
      { accessorKey: 'firstName', id: 'firstName', enableSorting: false },
    ]
    const table = constructTable({ data: people, columns, features })

    expect(column_getCanSort(table.getColumn('firstName')!)).toBe(false)
  })
})

describe('column_getCanMultiSort', () => {
  it('should return true for accessor columns by default', () => {
    const table = makeTable()

    expect(column_getCanMultiSort(table.getColumn('firstName')!)).toBe(true)
  })

  it('should respect the table-level enableMultiSort option', () => {
    const table = makeTable({ enableMultiSort: false })

    expect(column_getCanMultiSort(table.getColumn('firstName')!)).toBe(false)
  })

  it('should let the columnDef win over the table option', () => {
    const columns: Array<ColumnDef<typeof features, Person, any>> = [
      { accessorKey: 'firstName', id: 'firstName', enableMultiSort: true },
    ]
    const table = constructTable({
      data: people,
      columns,
      features,
      enableMultiSort: false,
    })

    expect(column_getCanMultiSort(table.getColumn('firstName')!)).toBe(true)
  })
})

describe('column_getAutoSortDir', () => {
  it('should return asc for string columns', () => {
    const table = makeTable()

    expect(column_getAutoSortDir(table.getColumn('firstName')!)).toBe('asc')
  })

  it('should return desc for non-string columns', () => {
    const table = makeTable()

    expect(column_getAutoSortDir(table.getColumn('age')!)).toBe('desc')
  })

  it('should return desc when there are no rows', () => {
    const table = constructTable<typeof features, Person>({
      data: [],
      columns: personColumns,
      features,
    })

    expect(column_getAutoSortDir(table.getColumn('firstName')!)).toBe('desc')
  })
})

describe('column_getFirstSortDir', () => {
  it('should derive from the auto sort direction by default', () => {
    const table = makeTable()

    expect(column_getFirstSortDir(table.getColumn('firstName')!)).toBe('asc')
    expect(column_getFirstSortDir(table.getColumn('age')!)).toBe('desc')
  })

  it('should respect the table-level sortDescFirst option', () => {
    const table = makeTable({ sortDescFirst: true })

    expect(column_getFirstSortDir(table.getColumn('firstName')!)).toBe('desc')
  })

  it('should let columnDef.sortDescFirst win over the table option', () => {
    const columns: Array<ColumnDef<typeof features, Person, any>> = [
      { accessorKey: 'firstName', id: 'firstName', sortDescFirst: false },
    ]
    const table = constructTable({
      data: people,
      columns,
      features,
      sortDescFirst: true,
    })

    expect(column_getFirstSortDir(table.getColumn('firstName')!)).toBe('asc')
  })
})

describe('column_getSortFn', () => {
  it('should return a function-valued sortFn directly', () => {
    const customSortFn = () => 0
    const columns: Array<ColumnDef<typeof features, Person, any>> = [
      { accessorKey: 'firstName', id: 'firstName', sortFn: customSortFn },
    ]
    const table = constructTable({ data: people, columns, features })

    expect(column_getSortFn(table.getColumn('firstName')!)).toBe(customSortFn)
  })

  it('should delegate to the auto sort fn for "auto"', () => {
    const columns: Array<ColumnDef<typeof features, Person, any>> = [
      { accessorKey: 'firstName', id: 'firstName', sortFn: 'auto' },
    ]
    const table = constructTable({ data: people, columns, features })

    expect(column_getSortFn(table.getColumn('firstName')!)).toBe(sortFns.text)
  })

  it('should look up registered sort fn names', () => {
    const columns: Array<ColumnDef<typeof features, Person, any>> = [
      { accessorKey: 'firstName', id: 'firstName', sortFn: 'datetime' },
    ]
    const table = constructTable({ data: people, columns, features })

    expect(column_getSortFn(table.getColumn('firstName')!)).toBe(
      sortFns.datetime,
    )
  })

  it('should fall back to basic for unknown sort fn names', () => {
    const columns: Array<ColumnDef<typeof features, Person, any>> = [
      // cast: deliberately exercises the unregistered-name fallback
      { accessorKey: 'firstName', id: 'firstName', sortFn: 'nope' as any },
    ]
    const table = constructTable({ data: people, columns, features })

    expect(column_getSortFn(table.getColumn('firstName')!)).toBe(sortFn_basic)
  })
})

describe('column_getNextSortingOrder', () => {
  it('should return the first sort direction when unsorted', () => {
    const table = makeTable()

    expect(column_getNextSortingOrder(table.getColumn('firstName')!)).toBe(
      'asc',
    )
    expect(column_getNextSortingOrder(table.getColumn('age')!)).toBe('desc')
  })

  it('should flip direction after the first sort direction', () => {
    const table = makeTable({
      initialState: { sorting: [{ id: 'firstName', desc: false }] },
    })

    expect(column_getNextSortingOrder(table.getColumn('firstName')!)).toBe(
      'desc',
    )
  })

  it('should return false (remove) after the full cycle', () => {
    const table = makeTable({
      initialState: { sorting: [{ id: 'firstName', desc: true }] },
    })

    expect(column_getNextSortingOrder(table.getColumn('firstName')!)).toBe(
      false,
    )
  })

  it('should keep flipping when sorting removal is disabled', () => {
    const table = makeTable({
      enableSortingRemoval: false,
      initialState: { sorting: [{ id: 'firstName', desc: true }] },
    })

    expect(column_getNextSortingOrder(table.getColumn('firstName')!)).toBe(
      'asc',
    )
  })

  it('should not remove in multi mode when enableMultiRemove is false', () => {
    const table = makeTable({
      enableMultiRemove: false,
      initialState: { sorting: [{ id: 'firstName', desc: true }] },
    })

    expect(
      column_getNextSortingOrder(table.getColumn('firstName')!, true),
    ).toBe('asc')
  })
})

describe('column_toggleSorting', () => {
  it('should sort by the first direction from an unsorted state', () => {
    const { table, onSortingChange } = makeTableWithMockOnSortingChange()

    column_toggleSorting(table.getColumn('firstName')!)

    expect(getUpdaterResult(onSortingChange, [])).toEqual([
      { id: 'firstName', desc: false },
    ])
  })

  it('should flip the direction when already sorted by the first direction', () => {
    const sorting: SortingState = [{ id: 'firstName', desc: false }]
    const { table, onSortingChange } = makeTableWithMockOnSortingChange({
      initialState: { sorting },
    })

    column_toggleSorting(table.getColumn('firstName')!)

    expect(getUpdaterResult(onSortingChange, sorting)).toEqual([
      { id: 'firstName', desc: true },
    ])
  })

  it('should remove the sort at the end of the cycle', () => {
    const sorting: SortingState = [{ id: 'firstName', desc: true }]
    const { table, onSortingChange } = makeTableWithMockOnSortingChange({
      initialState: { sorting },
    })

    column_toggleSorting(table.getColumn('firstName')!)

    expect(getUpdaterResult(onSortingChange, sorting)).toEqual([])
  })

  it('should apply an explicit desc value without cycling', () => {
    const { table, onSortingChange } = makeTableWithMockOnSortingChange()

    column_toggleSorting(table.getColumn('firstName')!, true)

    expect(getUpdaterResult(onSortingChange, [])).toEqual([
      { id: 'firstName', desc: true },
    ])
  })

  it('should replace the existing sort in single-sort mode', () => {
    const sorting: SortingState = [{ id: 'age', desc: true }]
    const { table, onSortingChange } = makeTableWithMockOnSortingChange({
      initialState: { sorting },
    })

    column_toggleSorting(table.getColumn('firstName')!)

    expect(getUpdaterResult(onSortingChange, sorting)).toEqual([
      { id: 'firstName', desc: false },
    ])
  })

  it('should append to the sorting state in multi mode', () => {
    const sorting: SortingState = [{ id: 'age', desc: true }]
    const { table, onSortingChange } = makeTableWithMockOnSortingChange({
      initialState: { sorting },
    })

    column_toggleSorting(table.getColumn('firstName')!, undefined, true)

    expect(getUpdaterResult(onSortingChange, sorting)).toEqual([
      { id: 'age', desc: true },
      { id: 'firstName', desc: false },
    ])
  })

  it('should keep only the latest maxMultiSortColCount columns', () => {
    const sorting: SortingState = [
      { id: 'age', desc: true },
      { id: 'lastName', desc: false },
    ]
    const { table, onSortingChange } = makeTableWithMockOnSortingChange({
      maxMultiSortColCount: 2,
      initialState: { sorting },
    })

    column_toggleSorting(table.getColumn('firstName')!, undefined, true)

    expect(getUpdaterResult(onSortingChange, sorting)).toEqual([
      { id: 'lastName', desc: false },
      { id: 'firstName', desc: false },
    ])
  })
})

describe('column_clearSorting', () => {
  it('should remove only this column from the sorting state', () => {
    const sorting: SortingState = [
      { id: 'age', desc: true },
      { id: 'firstName', desc: false },
    ]
    const { table, onSortingChange } = makeTableWithMockOnSortingChange({
      initialState: { sorting },
    })

    column_clearSorting(table.getColumn('firstName')!)

    expect(getUpdaterResult(onSortingChange, sorting)).toEqual([
      { id: 'age', desc: true },
    ])
  })
})

describe('column_getToggleSortingHandler', () => {
  it('should toggle sorting and persist synthetic events', () => {
    const { table, onSortingChange } = makeTableWithMockOnSortingChange()
    const persist = vi.fn()
    const handler = column_getToggleSortingHandler(
      table.getColumn('firstName')!,
    )

    handler({ persist })

    expect(persist).toHaveBeenCalled()
    expect(getUpdaterResult(onSortingChange, [])).toEqual([
      { id: 'firstName', desc: false },
    ])
  })

  it('should be a no-op when the column cannot sort', () => {
    const { table, onSortingChange } = makeTableWithMockOnSortingChange({
      enableSorting: false,
    })
    const handler = column_getToggleSortingHandler(
      table.getColumn('firstName')!,
    )

    handler({})

    expect(onSortingChange).not.toHaveBeenCalled()
  })

  it('should consult isMultiSortEvent to decide on multi sorting', () => {
    const sorting: SortingState = [{ id: 'age', desc: true }]
    const { table, onSortingChange } = makeTableWithMockOnSortingChange({
      isMultiSortEvent: (e) => (e as { shiftKey?: boolean }).shiftKey === true,
      initialState: { sorting },
    })
    const handler = column_getToggleSortingHandler(
      table.getColumn('firstName')!,
    )

    handler({ shiftKey: true })

    expect(getUpdaterResult(onSortingChange, sorting)).toEqual([
      { id: 'age', desc: true },
      { id: 'firstName', desc: false },
    ])
  })
})
