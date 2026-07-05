import {
  columnFacetingFeature,
  columnFilteringFeature,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFns,
  metaHelper,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/vue-table'

export type { Person } from './makeData'

// allows us to define custom properties for our columns
export interface MyColumnMeta {
  filterVariant?: 'text' | 'range' | 'select'
}

export const appFeatures = tableFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filterFns,
  columnMeta: metaHelper<MyColumnMeta>(),
})
