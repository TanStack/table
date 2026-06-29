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
} from '@tanstack/svelte-table'
import ColumnFilter from './ColumnFilter.svelte'
import PaginationControls from './PaginationControls.svelte'
import RowCount from './RowCount.svelte'
import SortIndicator from './SortIndicator.svelte'

export const {
  appFeatures,
  createAppColumnHelper,
  createAppTable,
  useHeaderContext,
  useTableContext,
} = createTableHook({
  features: tableFeatures({
    rowPaginationFeature,
    columnFilteringFeature,
    rowSortingFeature,
    filteredRowModel: createFilteredRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(),
    filterFns,
    sortFns,
  }),
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
