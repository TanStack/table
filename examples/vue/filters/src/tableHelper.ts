import {
  columnFacetingFeature,
  columnFilteringFeature,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createTableHook,
  filterFn_inDateRange,
  filterFn_inNumberRange,
  filterFn_includesString,
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
  birthDate: Date
}

export const { appFeatures, createAppColumnHelper, useAppTable } =
  createTableHook({
    features: {
      columnFilteringFeature,
      globalFilteringFeature,
      columnFacetingFeature,
      rowPaginationFeature,
      filteredRowModel: createFilteredRowModel(),
      paginatedRowModel: createPaginatedRowModel(),
      facetedRowModel: createFacetedRowModel(),
      facetedMinMaxValues: createFacetedMinMaxValues(),
      facetedUniqueValues: createFacetedUniqueValues(),
      filterFns: {
        includesString: filterFn_includesString,
        inNumberRange: filterFn_inNumberRange,
        inDateRange: filterFn_inDateRange,
      },
    },
  })
