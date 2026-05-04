import {
  columnFacetingFeature,
  columnFilteringFeature,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createTableHook,
  filterFns,
  globalFilteringFeature,
  rowPaginationFeature,
} from '@tanstack/vue-table'

export type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

export const { appFeatures, createAppColumnHelper, useAppTable } =
  createTableHook({
    _features: {
      columnFilteringFeature,
      globalFilteringFeature,
      columnFacetingFeature,
      rowPaginationFeature,
    },
    _rowModels: {
      filteredRowModel: createFilteredRowModel(filterFns),
      paginatedRowModel: createPaginatedRowModel(),
      facetedRowModel: createFacetedRowModel(),
      facetedMinMaxValues: createFacetedMinMaxValues(),
      facetedUniqueValues: createFacetedUniqueValues(),
    },
  })
