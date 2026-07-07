import { describe, expect, it, vi } from 'vitest'
import {
  columnFilteringFeature,
  constructTable,
  createFilteredRowModel,
  filterFn_includesString,
  filterFns,
  globalFilteringFeature,
} from '../../../../src'
import {
  column_getCanGlobalFilter,
  table_getGlobalAutoFilterFn,
  table_getGlobalFilterFn,
  table_resetGlobalFilter,
  table_setGlobalFilter,
} from '../../../../src/static-functions'
import { testFeatures } from '../../../fixtures/features'
import type { ColumnDef, Table, TableOptions } from '../../../../src'

type Sample = {
  firstName: string
  age: number
  active: boolean
}

const features = testFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns,
})

const data: Array<Sample> = [
  { firstName: 'alice', age: 30, active: true },
  { firstName: 'bob', age: 40, active: false },
  { firstName: 'amy', age: 20, active: true },
]

const columns: Array<ColumnDef<typeof features, Sample, any>> = [
  { accessorKey: 'firstName', id: 'firstName' },
  { accessorKey: 'age', id: 'age' },
  { accessorKey: 'active', id: 'active' },
  // display column with no accessor
  { id: 'actions', header: 'Actions' },
]

function makeTable(
  options?: Partial<
    Omit<TableOptions<typeof features, Sample>, 'data' | 'columns' | 'features'>
  >,
): Table<typeof features, Sample> {
  return constructTable({
    features,
    data,
    columns,
    ...options,
  })
}

describe('column_getCanGlobalFilter', () => {
  it('should return true for string and number columns by default', () => {
    const table = makeTable()

    expect(column_getCanGlobalFilter(table.getColumn('firstName')!)).toBe(true)
    expect(column_getCanGlobalFilter(table.getColumn('age')!)).toBe(true)
  })

  it('should return false for non-string, non-number values via the default predicate', () => {
    const table = makeTable()

    expect(column_getCanGlobalFilter(table.getColumn('active')!)).toBe(false)
  })

  it('should return false for display columns without an accessor', () => {
    const table = makeTable()

    expect(column_getCanGlobalFilter(table.getColumn('actions')!)).toBe(false)
  })

  it('should return false when global filtering is disabled for the column', () => {
    const filterColumns: Array<ColumnDef<typeof features, Sample, any>> = [
      { accessorKey: 'firstName', id: 'firstName', enableGlobalFilter: false },
    ]
    const table = constructTable({ features, data, columns: filterColumns })

    expect(column_getCanGlobalFilter(table.getColumn('firstName')!)).toBe(false)
  })

  it('should return false when global filtering is disabled table-wide', () => {
    const table = makeTable({ enableGlobalFilter: false })

    expect(column_getCanGlobalFilter(table.getColumn('firstName')!)).toBe(false)
  })

  it('should return false when all filtering is disabled', () => {
    const table = makeTable({ enableFilters: false })

    expect(column_getCanGlobalFilter(table.getColumn('firstName')!)).toBe(false)
  })

  it('should respect a custom getColumnCanGlobalFilter predicate', () => {
    const table = makeTable({
      getColumnCanGlobalFilter: (column) => column.id === 'age',
    })

    expect(column_getCanGlobalFilter(table.getColumn('firstName')!)).toBe(false)
    expect(column_getCanGlobalFilter(table.getColumn('age')!)).toBe(true)
  })
})

describe('table_getGlobalAutoFilterFn', () => {
  it('should return the includesString filter fn', () => {
    expect(table_getGlobalAutoFilterFn()).toBe(filterFn_includesString)
  })
})

describe('table_getGlobalFilterFn', () => {
  it('should resolve the default "auto" option to includesString', () => {
    const table = makeTable()

    expect(table_getGlobalFilterFn(table)).toBe(filterFn_includesString)
  })

  it('should return a function-valued globalFilterFn directly', () => {
    const customFilterFn = () => true
    const table = makeTable({ globalFilterFn: customFilterFn })

    expect(table_getGlobalFilterFn(table)).toBe(customFilterFn)
  })

  it('should look up registered filter fn names', () => {
    const table = makeTable({ globalFilterFn: 'equalsString' })

    expect(table_getGlobalFilterFn(table)).toBe(filterFns.equalsString)
  })

  it('should return undefined for unknown filter fn names', () => {
    const table = makeTable({
      // cast: deliberately exercises the unregistered-name fallback
      globalFilterFn: 'nope' as any,
    })

    expect(table_getGlobalFilterFn(table)).toBeUndefined()
  })
})

describe('table_setGlobalFilter', () => {
  it('should route the updater through onGlobalFilterChange', () => {
    const onGlobalFilterChange = vi.fn()
    const table = makeTable({ onGlobalFilterChange })

    table_setGlobalFilter(table, 'search text')

    expect(onGlobalFilterChange).toHaveBeenCalledWith('search text')
  })
})

describe('table_resetGlobalFilter', () => {
  it('should reset to undefined when defaultState is true', () => {
    const onGlobalFilterChange = vi.fn()
    const table = makeTable({
      onGlobalFilterChange,
      initialState: { globalFilter: 'initial' },
    })

    table_resetGlobalFilter(table, true)

    expect(onGlobalFilterChange).toHaveBeenCalledWith(undefined)
  })

  it('should reset to the initial global filter by default', () => {
    const onGlobalFilterChange = vi.fn()
    const table = makeTable({
      onGlobalFilterChange,
      initialState: { globalFilter: 'initial' },
    })

    table_resetGlobalFilter(table)

    expect(onGlobalFilterChange).toHaveBeenCalledWith('initial')
  })
})

describe('global filtering through the filtered row model', () => {
  it('should filter rows across globally filterable columns', () => {
    const table = makeTable({
      initialState: { globalFilter: 'ali' },
    })

    expect(
      table.getFilteredRowModel().rows.map((row) => row.original.firstName),
    ).toEqual(['alice'])
  })

  it('should update the filtered rows when the global filter changes', () => {
    const table = makeTable()

    expect(table.getFilteredRowModel().rows).toHaveLength(3)

    table.setGlobalFilter('a')

    expect(
      table.getFilteredRowModel().rows.map((row) => row.original.firstName),
    ).toEqual(['alice', 'amy'])

    table.resetGlobalFilter()

    expect(table.getFilteredRowModel().rows).toHaveLength(3)
  })

  it('should match number columns as strings', () => {
    const table = makeTable({
      initialState: { globalFilter: '40' },
    })

    expect(
      table.getFilteredRowModel().rows.map((row) => row.original.firstName),
    ).toEqual(['bob'])
  })
})
