import { describe, expect, it, vi } from 'vitest'
import {
  columnFilteringFeature,
  constructTable,
  filterFn_arrIncludes,
  filterFn_equals,
  filterFn_includesString,
  filterFns,
} from '../../../../src'
import {
  column_getAutoFilterFn,
  column_getCanFilter,
  column_getFilterFn,
  column_getFilterIndex,
  column_getFilterValue,
  column_getIsFiltered,
  column_setFilterValue,
  getDefaultColumnFiltersState,
  shouldAutoRemoveFilter,
  table_resetColumnFilters,
  table_setColumnFilters,
} from '../../../../src/static-functions'
import { testFeatures } from '../../../fixtures/features'
import { getUpdaterResult } from '../../../helpers/testUtils'
import type { ColumnDef, TableOptions } from '../../../../src'

type Sample = {
  tags: Array<string>
  details: { active: boolean }
}

const features = testFeatures({ columnFilteringFeature, filterFns })

const sampleKeys: Array<keyof Sample> = ['tags', 'details']

function generateAutoFilterTestTable(data: Array<Sample>) {
  const columns: Array<ColumnDef<typeof features, Sample, any>> =
    sampleKeys.map((key) => ({ accessorKey: key, id: key }))

  return constructTable<typeof features, Sample>({
    data,
    columns,
    features,
  })
}

describe('column_getAutoFilterFn', () => {
  const data: Array<Sample> = [
    {
      tags: ['a', 'b'],
      details: { active: true },
    },
  ]

  it('selects arrIncludes for array values', () => {
    const table = generateAutoFilterTestTable(data)
    const column = table.getColumn('tags')!

    expect(column_getAutoFilterFn(column)).toBe(filterFn_arrIncludes)
  })

  it('selects equals for non-array object values', () => {
    const table = generateAutoFilterTestTable(data)
    const column = table.getColumn('details')!

    expect(column_getAutoFilterFn(column)).toBe(filterFn_equals)
  })

  it('infers the filter from the first non-null column value', () => {
    type NullableSample = { name: string | null }
    const table = constructTable({
      features,
      columns: [{ accessorKey: 'name', id: 'name' }],
      data: [{ name: null }, { name: 'hello' }] satisfies Array<NullableSample>,
    })

    expect(column_getAutoFilterFn(table.getColumn('name')!)).toBe(
      filterFn_includesString,
    )
  })
})

// ---------------------------------------------------------------------------
// Filter state, filter fn resolution, and column flags
// ---------------------------------------------------------------------------

type Person = {
  firstName: string
  lastName: string
  age: number
}

const people: Array<Person> = [
  { firstName: 'alice', lastName: 'xi', age: 30 },
  { firstName: 'bob', lastName: 'young', age: 40 },
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

describe('getDefaultColumnFiltersState', () => {
  it('should return an empty array and a new instance each time', () => {
    expect(getDefaultColumnFiltersState()).toEqual([])
    expect(getDefaultColumnFiltersState()).not.toBe(
      getDefaultColumnFiltersState(),
    )
  })
})

describe('column_getFilterFn', () => {
  it('should return a function-valued filterFn directly', () => {
    const customFilterFn = () => true
    const columns: Array<ColumnDef<typeof features, Person, any>> = [
      { accessorKey: 'firstName', id: 'firstName', filterFn: customFilterFn },
    ]
    const table = constructTable({ data: people, columns, features })

    expect(column_getFilterFn(table.getColumn('firstName')!)).toBe(
      customFilterFn,
    )
  })

  it('should delegate to the auto filter fn for "auto"', () => {
    const columns: Array<ColumnDef<typeof features, Person, any>> = [
      { accessorKey: 'firstName', id: 'firstName', filterFn: 'auto' },
    ]
    const table = constructTable({ data: people, columns, features })

    expect(column_getFilterFn(table.getColumn('firstName')!)).toBe(
      filterFns.includesString,
    )
  })

  it('should look up registered filter fn names', () => {
    const columns: Array<ColumnDef<typeof features, Person, any>> = [
      { accessorKey: 'firstName', id: 'firstName', filterFn: 'equals' },
    ]
    const table = constructTable({ data: people, columns, features })

    expect(column_getFilterFn(table.getColumn('firstName')!)).toBe(
      filterFns.equals,
    )
  })

  it('should return undefined for unknown filter fn names', () => {
    const columns: Array<ColumnDef<typeof features, Person, any>> = [
      // cast: deliberately exercises the unregistered-name fallback
      { accessorKey: 'firstName', id: 'firstName', filterFn: 'nope' as any },
    ]
    const table = constructTable({ data: people, columns, features })

    expect(column_getFilterFn(table.getColumn('firstName')!)).toBeUndefined()
  })
})

describe('column_getCanFilter', () => {
  it('should return true for accessor columns by default', () => {
    const table = makeTable()

    expect(column_getCanFilter(table.getColumn('firstName')!)).toBe(true)
  })

  it('should return false for display columns without an accessor', () => {
    const table = makeTable()

    expect(column_getCanFilter(table.getColumn('actions')!)).toBe(false)
  })

  it('should return false when filtering is disabled for the column', () => {
    const columns: Array<ColumnDef<typeof features, Person, any>> = [
      { accessorKey: 'firstName', id: 'firstName', enableColumnFilter: false },
    ]
    const table = constructTable({ data: people, columns, features })

    expect(column_getCanFilter(table.getColumn('firstName')!)).toBe(false)
  })

  it('should return false when column filters are disabled table-wide', () => {
    const table = makeTable({ enableColumnFilters: false })

    expect(column_getCanFilter(table.getColumn('firstName')!)).toBe(false)
  })

  it('should return false when all filtering is disabled', () => {
    const table = makeTable({ enableFilters: false })

    expect(column_getCanFilter(table.getColumn('firstName')!)).toBe(false)
  })
})

describe('column filter state readers', () => {
  it('should read filter presence, value, and index from the state', () => {
    const table = makeTable({
      initialState: {
        columnFilters: [
          { id: 'lastName', value: 'y' },
          { id: 'firstName', value: 'ali' },
        ],
      },
    })

    expect(column_getIsFiltered(table.getColumn('firstName')!)).toBe(true)
    expect(column_getIsFiltered(table.getColumn('age')!)).toBe(false)

    expect(column_getFilterValue(table.getColumn('firstName')!)).toBe('ali')
    expect(column_getFilterValue(table.getColumn('age')!)).toBeUndefined()

    expect(column_getFilterIndex(table.getColumn('lastName')!)).toBe(0)
    expect(column_getFilterIndex(table.getColumn('firstName')!)).toBe(1)
    expect(column_getFilterIndex(table.getColumn('age')!)).toBe(-1)
  })
})

describe('column_setFilterValue', () => {
  it('should add a filter entry for an unfiltered column', () => {
    const onColumnFiltersChange = vi.fn()
    const table = makeTable({ onColumnFiltersChange })

    column_setFilterValue(table.getColumn('firstName')!, 'ali')

    expect(getUpdaterResult(onColumnFiltersChange, [])).toEqual([
      { id: 'firstName', value: 'ali' },
    ])
  })

  it('should update an existing entry in place', () => {
    const onColumnFiltersChange = vi.fn()
    const table = makeTable({ onColumnFiltersChange })

    column_setFilterValue(table.getColumn('firstName')!, 'z')

    expect(
      getUpdaterResult(onColumnFiltersChange, [
        { id: 'firstName', value: 'a' },
        { id: 'lastName', value: 'b' },
      ]),
    ).toEqual([
      { id: 'firstName', value: 'z' },
      { id: 'lastName', value: 'b' },
    ])
  })

  it('should resolve functional updaters against the previous filter value', () => {
    const onColumnFiltersChange = vi.fn()
    const table = makeTable({ onColumnFiltersChange })

    column_setFilterValue(
      table.getColumn('firstName')!,
      (old: string | undefined) => `${old}-updated`,
    )

    expect(
      getUpdaterResult(onColumnFiltersChange, [
        { id: 'firstName', value: 'a' },
      ]),
    ).toEqual([{ id: 'firstName', value: 'a-updated' }])
  })

  it('should remove the filter when the new value should auto-remove', () => {
    const onColumnFiltersChange = vi.fn()
    const table = makeTable({
      onColumnFiltersChange,
      state: {
        columnFilters: [
          { id: 'firstName', value: 'a' },
          { id: 'lastName', value: 'b' },
        ],
      },
    })

    column_setFilterValue(table.getColumn('firstName')!, '')

    expect(
      getUpdaterResult(onColumnFiltersChange, [
        { id: 'firstName', value: 'a' },
        { id: 'lastName', value: 'b' },
      ]),
    ).toEqual([{ id: 'lastName', value: 'b' }])
  })

  it('should keep an empty-string filter when a custom autoRemove allows it', () => {
    const onColumnFiltersChange = vi.fn()
    const emptyAwareFilterFn: any = (row: any, columnId: string, value: any) =>
      row.getValue(columnId) === value
    emptyAwareFilterFn.autoRemove = (val: any) => val === undefined

    const table = constructTable<typeof features, Person>({
      data: people,
      columns: [
        {
          accessorKey: 'firstName',
          id: 'firstName',
          filterFn: emptyAwareFilterFn,
        },
      ],
      features,
      onColumnFiltersChange,
    })

    column_setFilterValue(table.getColumn('firstName')!, '')

    expect(getUpdaterResult(onColumnFiltersChange, [])).toEqual([
      { id: 'firstName', value: '' },
    ])
  })
})

describe('table_setColumnFilters', () => {
  it('should drop filters that should auto-remove for known columns', () => {
    const onColumnFiltersChange = vi.fn()
    const table = makeTable({ onColumnFiltersChange })

    table_setColumnFilters(table, [
      { id: 'firstName', value: '' },
      { id: 'lastName', value: 'b' },
    ])

    expect(getUpdaterResult(onColumnFiltersChange, [])).toEqual([
      { id: 'lastName', value: 'b' },
    ])
  })

  it('should keep filters for unknown column ids', () => {
    const onColumnFiltersChange = vi.fn()
    const table = makeTable({ onColumnFiltersChange })

    table_setColumnFilters(table, [{ id: 'not-a-column', value: 'x' }])

    expect(getUpdaterResult(onColumnFiltersChange, [])).toEqual([
      { id: 'not-a-column', value: 'x' },
    ])
  })
})

describe('table_resetColumnFilters', () => {
  it('should reset to an empty array when defaultState is true', () => {
    const onColumnFiltersChange = vi.fn()
    const table = makeTable({
      onColumnFiltersChange,
      initialState: { columnFilters: [{ id: 'firstName', value: 'a' }] },
    })

    table_resetColumnFilters(table, true)

    expect(getUpdaterResult(onColumnFiltersChange, [])).toEqual([])
  })

  it('should reset to the initial filters by default', () => {
    const onColumnFiltersChange = vi.fn()
    const table = makeTable({
      onColumnFiltersChange,
      initialState: { columnFilters: [{ id: 'firstName', value: 'a' }] },
      state: { columnFilters: [] },
    })

    table_resetColumnFilters(table)

    expect(getUpdaterResult(onColumnFiltersChange, [])).toEqual([
      { id: 'firstName', value: 'a' },
    ])
  })
})

describe('shouldAutoRemoveFilter', () => {
  it('should remove undefined and empty-string values', () => {
    expect(shouldAutoRemoveFilter(undefined, undefined)).toBe(true)
    expect(shouldAutoRemoveFilter(undefined, '')).toBe(true)
  })

  it('should keep falsy-but-meaningful values', () => {
    expect(shouldAutoRemoveFilter(undefined, 0)).toBe(false)
    expect(shouldAutoRemoveFilter(undefined, false)).toBe(false)
    expect(shouldAutoRemoveFilter(undefined, null)).toBe(false)
  })

  it("should consult the filter fn's autoRemove hook", () => {
    expect(shouldAutoRemoveFilter(filterFn_arrIncludes, [])).toBe(true)
    expect(shouldAutoRemoveFilter(filterFn_arrIncludes, ['a'])).toBe(false)
  })

  it('should treat a provided autoRemove as authoritative for defined values', () => {
    const customFilterFn: any = () => true
    customFilterFn.autoRemove = (val: any) => val === null

    // A custom autoRemove that keeps empty strings wins over the default
    // empty-string heuristic, so filtering for '' becomes possible
    expect(shouldAutoRemoveFilter(customFilterFn, '')).toBe(false)
    expect(shouldAutoRemoveFilter(customFilterFn, null)).toBe(true)
    expect(shouldAutoRemoveFilter(customFilterFn, 'x')).toBe(false)
  })

  it('should always remove undefined even when autoRemove would keep it', () => {
    const customFilterFn: any = () => true
    customFilterFn.autoRemove = () => false

    expect(shouldAutoRemoveFilter(customFilterFn, undefined)).toBe(true)
  })
})
