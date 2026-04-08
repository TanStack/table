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

export const { createAppColumnHelper, useAppTable, useTableContext } =
  createTableHook({
    _features: tableFeatures({
      columnFilteringFeature,
      rowPaginationFeature,
      rowSortingFeature,
    }),
    _rowModels: {
      sortedRowModel: createSortedRowModel(sortFns),
      filteredRowModel: createFilteredRowModel(filterFns),
      paginatedRowModel: createPaginatedRowModel(),
    },
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
