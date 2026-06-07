import {
  columnFacetingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/svelte-table'

export const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  columnFacetingFeature,
  rowPaginationFeature,
})
