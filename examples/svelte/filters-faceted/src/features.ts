import {
  columnFacetingFeature,
  columnFilteringFeature,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFn_inNumberRange,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/svelte-table'

export const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  columnFacetingFeature,
  rowPaginationFeature,
  facetedRowModel: createFacetedRowModel(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
  },
})
