import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createTableHook,
  filterFns,
  rowPaginationFeature,
  rowSelectionFeature,
  tableFeatures,
} from '@tanstack/angular-table'

const _features = tableFeatures({
  columnFilteringFeature,
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
  _features,
  _rowModels: {
    filteredRowModel: createFilteredRowModel(filterFns),
    paginatedRowModel: createPaginatedRowModel(),
  },
  debugTable: true,
})
