import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createTableHook,
  filterFns,
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
})

export const {
  injectAppTable: injectTable,
  injectTableContext,
  createAppColumnHelper,
  injectFlexRenderCellContext,
  injectFlexRenderHeaderContext,
} = createTableHook({
  features,
  rowModels: {
    filteredRowModel: createFilteredRowModel(filterFns),
    paginatedRowModel: createPaginatedRowModel(),
  },
  debugTable: true,
})
