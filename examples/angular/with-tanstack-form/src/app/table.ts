import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  filterFns,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/angular-table'
import { ColumnFilter, SortIndicator } from './header-components'
import { PaginationControls, RowCount } from './table-components'

export const features = tableFeatures({
  rowPaginationFeature,
  columnFilteringFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns,
  sortFns,
})

export const {
  createAppColumnHelper,
  injectAppTable,
  injectTableContext,
  injectTableHeaderContext,
} = createTableHook({
  features,
  tableComponents: {
    PaginationControls,
    RowCount,
  },
  headerComponents: {
    SortIndicator,
    ColumnFilter,
  },
  cellComponents: {},
})
