import { describe, expect, it, vi } from 'vitest'
import {
  columnFacetingFeature,
  columnFilteringFeature,
  constructTable,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  filterFns,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import {
  column_getFacetedMinMaxValues,
  column_getFacetedRowModel,
  column_getFacetedUniqueValues,
  table_getGlobalFacetedMinMaxValues,
  table_getGlobalFacetedRowModel,
  table_getGlobalFacetedUniqueValues,
} from '../../../../src/static-functions'
import type { ColumnDef } from '../../../../src'

type Person = {
  firstName: string
  status: string | undefined
  tags?: Array<string>
}

const features = testFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  facetedMinMaxValues: createFacetedMinMaxValues(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filteredRowModel: createFilteredRowModel(),
  filterFns,
})

const columns: Array<ColumnDef<typeof features, Person, any>> = [
  {
    accessorKey: 'firstName',
    id: 'firstName',
  },
  {
    accessorKey: 'status',
    filterFn: 'equalsString',
    id: 'status',
  },
  {
    accessorKey: 'tags',
    id: 'tags',
  },
]

const data: Array<Person> = [
  { firstName: 'Alice', status: 'active', tags: ['a', 'b'] },
  { firstName: 'Bob', status: undefined, tags: ['a', 'b'] },
  { firstName: 'Carol', status: 'active', tags: ['c'] },
]

function makeTable(columnFilters: Array<{ id: string; value: unknown }>) {
  return constructTable<typeof features, Person>({
    data,
    columns,
    features,
    initialState: {
      columnFilters,
    },
  })
}

describe('column faceting row model', () => {
  it('reuses the pre-filtered row model when only the faceted column is filtered', () => {
    const table = makeTable([{ id: 'status', value: 'active' }])
    const statusColumn = table.getColumn('status')!

    expect(statusColumn.getFacetedRowModel()).toBe(
      table.getPreFilteredRowModel(),
    )
  })

  it('still applies filters from other columns', () => {
    const table = makeTable([{ id: 'status', value: 'active' }])
    const firstNameColumn = table.getColumn('firstName')!

    expect(
      firstNameColumn.getFacetedRowModel().rows.map((row) => row.original),
    ).toEqual([
      { firstName: 'Alice', status: 'active', tags: ['a', 'b'] },
      { firstName: 'Carol', status: 'active', tags: ['c'] },
    ])
  })

  it('counts unique values without dropping undefined facet values', () => {
    const table = makeTable([])
    const statusColumn = table.getColumn('status')!

    expect(statusColumn.getFacetedUniqueValues()).toEqual(
      new Map<any, number>([
        ['active', 2],
        [undefined, 1],
      ]),
    )
  })

  it('counts array cell values by content rather than reference', () => {
    const table = makeTable([])
    const tagsColumn = table.getColumn('tags')!

    // ['a','b'] appears in two rows with different array references —
    // without JSON.stringify as the map key both would get count 1
    expect(tagsColumn.getFacetedUniqueValues()).toEqual(
      new Map<any, number>([
        [JSON.stringify(['a', 'b']), 2],
        [JSON.stringify(['c']), 1],
      ]),
    )
  })

  it('caches faceted factory functions per column and global context', () => {
    const facetedRowModel = vi.fn(
      (table: any, _columnId: string) => () => table.getPreFilteredRowModel(),
    )
    const facetedMinMaxValues = vi.fn(
      (_table: any, _columnId: string) => () => [1, 2] as [number, number],
    )
    const facetedUniqueValues = vi.fn(
      (_table: any, _columnId: string) => () =>
        new Map<any, number>([['cached', 1]]),
    )

    const cacheFeatures = testFeatures({
      columnFacetingFeature,
      columnFilteringFeature,
      facetedMinMaxValues,
      facetedRowModel,
      facetedUniqueValues,
    })

    const cacheColumns: Array<ColumnDef<typeof cacheFeatures, Person, any>> = [
      { accessorKey: 'firstName', id: 'firstName' },
      { accessorKey: 'status', id: 'status' },
    ]
    const table = constructTable<typeof cacheFeatures, Person>({
      data,
      columns: cacheColumns,
      features: cacheFeatures,
    })
    const statusColumn = table.getColumn('status')!

    column_getFacetedRowModel(statusColumn, table)
    column_getFacetedRowModel(statusColumn, table)
    table_getGlobalFacetedRowModel(table)
    table_getGlobalFacetedRowModel(table)

    column_getFacetedMinMaxValues(statusColumn, table)
    column_getFacetedMinMaxValues(statusColumn, table)
    table_getGlobalFacetedMinMaxValues(table)
    table_getGlobalFacetedMinMaxValues(table)

    column_getFacetedUniqueValues(statusColumn, table)
    column_getFacetedUniqueValues(statusColumn, table)
    table_getGlobalFacetedUniqueValues(table)
    table_getGlobalFacetedUniqueValues(table)

    expect(facetedRowModel).toHaveBeenCalledTimes(2)
    expect(facetedRowModel).toHaveBeenNthCalledWith(1, table, 'status')
    expect(facetedRowModel).toHaveBeenNthCalledWith(2, table, '__global__')
    expect(facetedMinMaxValues).toHaveBeenCalledTimes(2)
    expect(facetedUniqueValues).toHaveBeenCalledTimes(2)
  })
})
