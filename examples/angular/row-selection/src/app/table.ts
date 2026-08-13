import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createTableHook,
  filterFn_inNumberRange,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  tableFeatures,
} from '@tanstack/angular-table'

export const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
  },
})

export const {
  injectAppTable: injectTable,
  injectTableContext,
  createAppColumnHelper,
  injectFlexRenderCellContext,
  injectFlexRenderHeaderContext,
} = createTableHook({
  features,
  debugTable: true,
})
