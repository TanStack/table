import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  filterFn_includesString,
  filterFn_inNumberRange,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
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
    filterFns: {
      includesString: filterFn_includesString,
      inNumberRange: filterFn_inNumberRange,
    },
    sortFns: {
      alphanumeric: sortFn_alphanumeric,
      text: sortFn_text,
    },
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
