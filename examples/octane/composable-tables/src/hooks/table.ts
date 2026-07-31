/**
 * Custom table hook setup using createTableHook
 *
 * This file creates a custom useAppTable hook with pre-bound components.
 * Features, row models, and default options are defined once here and shared across all tables.
 * Context hooks and a pre-bound createAppColumnHelper are also exported.
 */
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
} from '@tanstack/octane-table'

// Import table-level components
import {
  PaginationControls,
  RowCount,
  TableToolbar,
} from '../components/table-components.tsrx'

// Import cell-level components
import {
  CategoryCell,
  NumberCell,
  PriceCell,
  ProgressCell,
  RowActionsCell,
  SelectCell,
  StatusCell,
  TextCell,
} from '../components/cell-components.tsrx'

// Import header/footer-level components (both use useHeaderContext)
import {
  ColumnFilter,
  FooterColumnId,
  FooterSum,
  SortIndicator,
} from '../components/header-components.tsrx'

/**
 * Create the custom table hook with all pre-bound components.
 * This exports:
 * - createAppColumnHelper: Create column definitions with TFeatures already bound
 * - useAppTable: Hook for creating tables with TFeatures baked in
 * - useTableContext: Access table instance in tableComponents
 * - useCellContext: Access cell instance in cellComponents
 * - useHeaderContext: Access header instance in headerComponents
 */
export const {
  createAppColumnHelper,
  useAppTable,
  useTableContext,
  useCellContext,
  useHeaderContext,
} = createTableHook({
  // Features are set once here and shared across all tables
  features: tableFeatures({
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
  }),

  // set any default table options here too
  getRowId: (row) => row.id,

  // Register table-level components (accessible via table.ComponentName)
  tableComponents: {
    PaginationControls,
    RowCount,
    TableToolbar,
  },

  // Register cell-level components (accessible via cell.ComponentName in AppCell)
  cellComponents: {
    SelectCell,
    TextCell,
    NumberCell,
    StatusCell,
    ProgressCell,
    RowActionsCell,
    PriceCell,
    CategoryCell,
  },

  // Register header/footer-level components (accessible via header.ComponentName in AppHeader/AppFooter)
  headerComponents: {
    SortIndicator,
    ColumnFilter,
    FooterColumnId,
    FooterSum,
  },
})
