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
  filterFns: {
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
  },
  columnMeta: metaHelper<MyColumnMeta>(),
})
