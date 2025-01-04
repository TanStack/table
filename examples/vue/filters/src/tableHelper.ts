import {
  columnFacetingFeature,
  columnFilteringFeature,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createTableHelper,
  filterFns,
  globalFilteringFeature,
} from '@tanstack/vue-table'

export type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

export const tableHelper = createTableHelper({
  _features: {
    columnFilteringFeature,
    globalFilteringFeature,
    columnFacetingFeature,
  },
  _rowModels: {
    filteredRowModel: createFilteredRowModel(filterFns),
    facetedRowModel: createFacetedRowModel(),
    facetedMinMaxValues: createFacetedMinMaxValues(),
    facetedUniqueValues: createFacetedUniqueValues(),
  },
  TData: {} as Array<Person>,
})
