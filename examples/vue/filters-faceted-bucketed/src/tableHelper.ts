import {
  columnFacetingFeature,
  columnFilteringFeature,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFn_includesString,
  metaHelper,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/vue-table'

export type { Account } from './makeData'
export type { FacetOption } from './buckets'

// allows us to define custom properties for our columns
export interface MyColumnMeta {
  filterVariant?: 'text' | 'facets'
  facetOptions?: ReadonlyArray<import('./buckets').FacetOption>
}

export const appFeatures = tableFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filterFns: {
    includesString: filterFn_includesString,
  },
  columnMeta: metaHelper<MyColumnMeta>(),
})
