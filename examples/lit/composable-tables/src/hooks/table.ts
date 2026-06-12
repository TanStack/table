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
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
  filterFns,
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
