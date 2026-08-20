import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  filterFn_inNumberRange,
  filterFn_includesString,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
} from '@tanstack/lit-table'
import {
  CategoryCell,
  NumberCell,
  PriceCell,
  ProgressCell,
  RowActionsCell,
  StatusCell,
  TextCell,
} from '../components/cell-components'
import {
  ColumnFilter,
  FooterColumnId,
  FooterSum,
  SortIndicator,
} from '../components/header-components'

// Note: Table-level components (PaginationControls, RowCount, TableToolbar)
// are LitElement custom elements that use useTableContext(this) directly,
// so they don't need to be registered here as tableComponents.

export const features = tableFeatures({
  columnFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
  },
  filterFns: {
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
  },
})

export const { createAppColumnHelper, useAppTable, useTableContext } =
  createTableHook({
    features,
    getRowId: (row) => row.id,
    cellComponents: {
      TextCell,
      NumberCell,
      StatusCell,
      ProgressCell,
      RowActionsCell,
      PriceCell,
      CategoryCell,
    },
    headerComponents: {
      SortIndicator,
      ColumnFilter,
      FooterColumnId,
      FooterSum,
    },
  })
