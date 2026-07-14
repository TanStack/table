import { describe, expect, it } from 'vitest'
import {
  columnFacetingFeature,
  columnFilteringFeature,
  constructTable,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  filterFns,
  globalFilteringFeature,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import type { ColumnDef } from '../../../../src'

interface Person {
  name: string
  age: number | string | null
  team: string
  tags: Array<string>
}

const features = testFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  facetedMinMaxValues: createFacetedMinMaxValues(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filteredRowModel: createFilteredRowModel(),
  filterFns,
})

const columns: Array<ColumnDef<typeof features, Person, any>> = [
  { accessorKey: 'name', id: 'name', filterFn: 'includesString' },
  { accessorKey: 'age', id: 'age' },
  { accessorKey: 'team', id: 'team', filterFn: 'equalsString' },
  {
    id: 'tags',
    accessorFn: (row) => row.tags,
    filterFn: 'arrIncludes',
    // without this, row.getUniqueValues wraps the whole array as one value
    getUniqueValues: (row) => row.tags,
  },
]

const data: Array<Person> = [
  { name: 'Alice', age: 30, team: 'red', tags: ['a', 'b'] },
  { name: 'Bob', age: 25, team: 'blue', tags: ['b'] },
  { name: 'Carol', age: '40', team: 'red', tags: ['a', 'c'] },
  { name: 'Dave', age: null, team: 'blue', tags: [] },
]

function makeTable(
  overrides: Partial<{
    data: Array<Person>
    columnFilters: Array<{ id: string; value: unknown }>
    globalFilter: string
  }> = {},
) {
  return constructTable<typeof features, Person>({
    data: overrides.data ?? data,
    columns,
    features,
    initialState: {
      columnFilters: overrides.columnFilters ?? [],
      globalFilter: overrides.globalFilter,
    },
  })
}

describe('getFacetedMinMaxValues (real implementation)', () => {
  it('should return min and max for a numeric column', () => {
    const table = makeTable()
    // '40' coerces via Number(); null coerces to 0
    expect(table.getColumn('age')!.getFacetedMinMaxValues()).toEqual([0, 40])
  })

  it('should coerce numeric strings with Number()', () => {
    const table = makeTable({
      data: [
        { name: 'A', age: '5', team: 'red', tags: [] },
        { name: 'B', age: '15', team: 'red', tags: [] },
      ],
    })
    expect(table.getColumn('age')!.getFacetedMinMaxValues()).toEqual([5, 15])
  })

  it('should skip NaN values from non-numeric cells', () => {
    const table = makeTable({
      data: [
        { name: 'A', age: 'not-a-number', team: 'red', tags: [] },
        { name: 'B', age: 7, team: 'red', tags: [] },
        { name: 'C', age: 3, team: 'red', tags: [] },
      ],
    })
    expect(table.getColumn('age')!.getFacetedMinMaxValues()).toEqual([3, 7])
  })

  it('should return undefined when no cell is numeric', () => {
    const table = makeTable()
    // every name coerces to NaN
    expect(table.getColumn('name')!.getFacetedMinMaxValues()).toBeUndefined()
  })

  it('should return undefined for empty data', () => {
    const table = makeTable({ data: [] })
    expect(table.getColumn('age')!.getFacetedMinMaxValues()).toBeUndefined()
  })

  it('should return [x, x] for a single row', () => {
    const table = makeTable({
      data: [{ name: 'A', age: 42, team: 'red', tags: [] }],
    })
    expect(table.getColumn('age')!.getFacetedMinMaxValues()).toEqual([42, 42])
  })
})

describe('faceted row model semantics under active filters', () => {
  it('should exclude its own filter but apply other column filters', () => {
    const table = makeTable({
      columnFilters: [
        { id: 'team', value: 'red' },
        { id: 'name', value: 'Bob' },
      ],
    })
    // faceting the name column: name filter ignored, team filter applied
    const rows = table
      .getColumn('name')!
      .getFacetedRowModel()
      .rows.map((row) => row.original.name)
    expect(rows).toEqual(['Alice', 'Carol'])
  })

  it('should apply the global filter to a column faceted row model', () => {
    const table = makeTable({ globalFilter: 'Bo' })
    const rows = table
      .getColumn('team')!
      .getFacetedRowModel()
      .rows.map((row) => row.original.name)
    expect(rows).toEqual(['Bob'])
  })

  it('should be identical to the pre-filtered model when only the faceted column is filtered', () => {
    const table = makeTable({ columnFilters: [{ id: 'team', value: 'red' }] })
    expect(table.getColumn('team')!.getFacetedRowModel()).toBe(
      table.getPreFilteredRowModel(),
    )
  })

  it('should return the pre-filtered model for empty data', () => {
    const table = makeTable({
      data: [],
      columnFilters: [{ id: 'team', value: 'red' }],
      globalFilter: 'x',
    })
    expect(table.getColumn('name')!.getFacetedRowModel()).toBe(
      table.getPreFilteredRowModel(),
    )
  })
})

describe('getFacetedUniqueValues (real implementation)', () => {
  it('should count unique values from the other-filtered faceted rows', () => {
    const table = makeTable({ columnFilters: [{ id: 'team', value: 'red' }] })
    // name facet reflects only Alice and Carol (red team)
    expect(table.getColumn('name')!.getFacetedUniqueValues()).toEqual(
      new Map<any, number>([
        ['Alice', 1],
        ['Carol', 1],
      ]),
    )
  })

  it('should count duplicate values correctly', () => {
    const table = makeTable()
    expect(table.getColumn('team')!.getFacetedUniqueValues()).toEqual(
      new Map<any, number>([
        ['red', 2],
        ['blue', 2],
      ]),
    )
  })

  it('should yield one entry per array element for array-valued cells', () => {
    const table = makeTable()
    expect(table.getColumn('tags')!.getFacetedUniqueValues()).toEqual(
      new Map<any, number>([
        ['a', 2],
        ['b', 2],
        ['c', 1],
      ]),
    )
  })
})

describe('global faceted models (real factories)', () => {
  it('should apply column filters but not the global filter in the global faceted row model', () => {
    const table = makeTable({
      columnFilters: [{ id: 'team', value: 'blue' }],
      globalFilter: 'Bob',
    })
    // the global faceted model excludes the global filter itself (mirroring
    // how a column's faceted model excludes that column's own filter) while
    // still applying column filters, so both blue-team rows survive
    const rows = table
      .getGlobalFacetedRowModel()
      .rows.map((row) => row.original.name)
    expect(rows).toEqual(['Bob', 'Dave'])
  })

  it('should aggregate unique values across globally filterable columns', () => {
    const table = makeTable({ columnFilters: [{ id: 'team', value: 'red' }] })
    // faceted rows are the red-team rows (Alice, Carol); the tags column is
    // not globally filterable (array values), so name, age, and team
    // contribute values. Raw cell values are not coerced, so '40' stays a
    // string
    expect(table.getGlobalFacetedUniqueValues()).toEqual(
      new Map<any, number>([
        ['Alice', 1],
        ['Carol', 1],
        [30, 1],
        ['40', 1],
        ['red', 2],
      ]),
    )
  })

  it('should return an empty Map for global faceted unique values with empty data', () => {
    const table = makeTable({ data: [] })
    expect(table.getGlobalFacetedUniqueValues()).toEqual(new Map())
  })

  it('should aggregate min max values across globally filterable columns', () => {
    const table = makeTable()
    // name and team coerce to NaN and are skipped; the age column yields
    // 30, 25, 40 ('40' coerced) and 0 (Number(null) is 0, existing behavior)
    expect(table.getGlobalFacetedMinMaxValues()).toEqual([0, 40])
  })
})

describe('recompute and reference stability', () => {
  it('should return the same references on repeated calls when nothing changed', () => {
    const table = makeTable({ columnFilters: [{ id: 'team', value: 'red' }] })
    const nameColumn = table.getColumn('name')!

    expect(nameColumn.getFacetedRowModel()).toBe(
      nameColumn.getFacetedRowModel(),
    )
    expect(nameColumn.getFacetedUniqueValues()).toBe(
      nameColumn.getFacetedUniqueValues(),
    )
    expect(table.getColumn('age')!.getFacetedMinMaxValues()).toBe(
      table.getColumn('age')!.getFacetedMinMaxValues(),
    )
  })

  it('should recompute after a runtime filter change on another column', () => {
    const table = makeTable()
    const nameColumn = table.getColumn('name')!
    const ageColumn = table.getColumn('age')!

    expect(nameColumn.getFacetedUniqueValues().size).toBe(4)
    expect(ageColumn.getFacetedMinMaxValues()).toEqual([0, 40])

    table.setColumnFilters([{ id: 'team', value: 'red' }])

    expect(nameColumn.getFacetedUniqueValues()).toEqual(
      new Map<any, number>([
        ['Alice', 1],
        ['Carol', 1],
      ]),
    )
    expect(ageColumn.getFacetedMinMaxValues()).toEqual([30, 40])
  })
})

describe('no-factory fallbacks', () => {
  const fallbackFeatures = testFeatures({
    columnFacetingFeature,
    columnFilteringFeature,
    filteredRowModel: createFilteredRowModel(),
    filterFns,
  })

  const fallbackColumns: Array<
    ColumnDef<typeof fallbackFeatures, Person, any>
  > = [
    { accessorKey: 'name', id: 'name' },
    { accessorKey: 'age', id: 'age' },
  ]

  it('should fall back to the pre-filtered model, empty Map, and undefined', () => {
    const table = constructTable<typeof fallbackFeatures, Person>({
      data,
      columns: fallbackColumns,
      features: fallbackFeatures,
      initialState: { columnFilters: [{ id: 'name', value: 'Alice' }] },
    })
    const ageColumn = table.getColumn('age')!

    expect(ageColumn.getFacetedRowModel()).toBe(table.getPreFilteredRowModel())
    expect(ageColumn.getFacetedUniqueValues()).toEqual(new Map())
    expect(ageColumn.getFacetedUniqueValues().size).toBe(0)
    expect(ageColumn.getFacetedMinMaxValues()).toBeUndefined()
  })
})
