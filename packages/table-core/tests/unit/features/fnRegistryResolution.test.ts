import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  columnFilteringFeature,
  columnGroupingFeature,
  constructTable,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowSortingFeature,
  sortFn_text,
} from '../../../src'
import { testFeatures } from '../../fixtures/features'

interface Person {
  name: string
  age: number
}

const data: Array<Person> = [
  { name: 'bob', age: 40 },
  { name: 'amy', age: 20 },
]

// The registry warnings only fire in development builds.
function spyOnDevWarnings() {
  vi.stubEnv('NODE_ENV', 'development')
  return vi.spyOn(console, 'warn').mockImplementation(() => {})
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('filter fn registry resolution', () => {
  function makeFilterTable(
    filterFns: Record<string, any> | undefined,
    filterFn?: any,
  ) {
    const features = testFeatures({
      columnFilteringFeature,
      filteredRowModel: createFilteredRowModel(),
      ...(filterFns ? { filterFns } : {}),
    })
    return constructTable<typeof features, Person>({
      features,
      data,
      columns: [
        { accessorKey: 'name', id: 'name', ...(filterFn ? { filterFn } : {}) },
      ],
      initialState: { columnFilters: [{ id: 'name', value: 'a' }] },
    })
  }

  it('warns and ignores the filter when the auto filter fn is not registered', () => {
    const warn = spyOnDevWarnings()
    const table = makeFilterTable(undefined)

    expect(table.getFilteredRowModel().rows).toHaveLength(2)
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining(`'includesString'`),
    )
  })

  it('warns with the missing name for unregistered string filter fns', () => {
    const warn = spyOnDevWarnings()
    const table = makeFilterTable(undefined, 'doesNotExist')

    expect(table.getFilteredRowModel().rows).toHaveLength(2)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining(`'doesNotExist'`))
  })

  it('resolves individually registered filter fns without warning', () => {
    const warn = spyOnDevWarnings()
    const table = makeFilterTable({ includesString: filterFn_includesString })

    expect(
      table.getFilteredRowModel().rows.map((row) => row.original.name),
    ).toEqual(['amy'])
    expect(warn).not.toHaveBeenCalled()
  })
})

describe('sort fn registry resolution', () => {
  function makeSortTable(
    sortFns: Record<string, any> | undefined,
    sortFn?: any,
  ) {
    const features = testFeatures({
      rowSortingFeature,
      sortedRowModel: createSortedRowModel(),
      ...(sortFns ? { sortFns } : {}),
    })
    return constructTable<typeof features, Person>({
      features,
      data,
      columns: [
        { accessorKey: 'name', id: 'name', ...(sortFn ? { sortFn } : {}) },
      ],
      initialState: { sorting: [{ id: 'name', desc: false }] },
    })
  }

  it('warns and falls back to basic when the auto sort fn is not registered', () => {
    const warn = spyOnDevWarnings()
    const table = makeSortTable(undefined)

    // basic and text agree on plain strings, so sorting still works
    expect(
      table.getSortedRowModel().rows.map((row) => row.original.name),
    ).toEqual(['amy', 'bob'])
    expect(warn).toHaveBeenCalledWith(expect.stringContaining(`'text'`))
  })

  it('warns with the missing name for unregistered string sort fns', () => {
    const warn = spyOnDevWarnings()
    const table = makeSortTable(undefined, 'doesNotExist')

    expect(
      table.getSortedRowModel().rows.map((row) => row.original.name),
    ).toEqual(['amy', 'bob'])
    expect(warn).toHaveBeenCalledWith(expect.stringContaining(`'doesNotExist'`))
  })

  it('resolves individually registered sort fns without warning', () => {
    const warn = spyOnDevWarnings()
    const table = makeSortTable({ text: sortFn_text })

    expect(
      table.getSortedRowModel().rows.map((row) => row.original.name),
    ).toEqual(['amy', 'bob'])
    expect(warn).not.toHaveBeenCalled()
  })
})

describe('aggregation fn registry resolution', () => {
  it('warns and returns undefined when the auto aggregation fn is not registered', () => {
    const warn = spyOnDevWarnings()
    const features = testFeatures({ columnGroupingFeature })
    const table = constructTable<typeof features, Person>({
      features,
      data,
      columns: [{ accessorKey: 'age', id: 'age' }],
    })

    expect(table.getColumn('age')!.getAutoAggregationFn()).toBeUndefined()
    expect(warn).toHaveBeenCalledWith(expect.stringContaining(`'sum'`))
  })

  it('leaves non-aggregatable value types unspecified without warning', () => {
    const warn = spyOnDevWarnings()
    const features = testFeatures({ columnGroupingFeature })
    const table = constructTable<typeof features, Person>({
      features,
      data,
      columns: [{ accessorKey: 'name', id: 'name' }],
    })

    expect(table.getColumn('name')!.getAutoAggregationFn()).toBeUndefined()
    expect(warn).not.toHaveBeenCalled()
  })
})
