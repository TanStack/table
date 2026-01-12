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
  filterFns,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/angular-table'

// Import table-level components
import {
  PaginationControls,
  RowCount,
  TableToolbar,
} from './components/table-components'
// Import cell-level components
import {
  CategoryCell,
  NumberCell,
  PriceCell,
  ProgressCell,
  RowActionsCell,
  StatusCell,
  TextCell,
} from './components/cell-components'
// Import header-level components (both use injectTableHeaderContext())
import {
  ColumnFilter,
  FooterColumnId,
  FooterSum,
  SortIndicator,
} from './components/header-components'

/**
 * Create the custom table hook with all pre-bound components.
 * This exports:
 * - createAppColumnHelper: Create column definitions with TFeatures already bound
 * - injectAppTable: Function for creating tables with TFeatures baked in
 * - injectTableContext: Access table instance in tableComponents
 * - injectTableCellContext: Access cell instance in cellComponents
 * - injectTableHeaderContext: Access header instance in headerComponents
 * - injectFlexRenderHeaderContext: Access FlexRenderContext with header-level typings
 * - injectFlexRenderCellContext: Access FlexRenderContext with cell-level typings
 */
export const {
  createAppColumnHelper,
  injectAppTable,
  injectTableContext,
  injectTableCellContext,
  injectTableHeaderContext,
  // injectFlexRenderHeaderContext
  // injectFlexRenderCellContext
} = createTableHook({
  // Features are set once here and shared across all tables
  _features: tableFeatures({
    columnFilteringFeature,
    rowPaginationFeature,
    rowSortingFeature,
  }),

  // Row models are set once here
  _rowModels: {
    sortedRowModel: createSortedRowModel(sortFns),
    filteredRowModel: createFilteredRowModel(filterFns),
    paginatedRowModel: createPaginatedRowModel(),
  },

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
    TextCell,
    NumberCell,
    ProgressCell,
    StatusCell,
    CategoryCell,
    PriceCell,
    RowActionsCell,
  },

  // Register header/footer-level components (accessible via header.ComponentName in AppHeader/AppFooter)
  headerComponents: {
    SortIndicator,
    ColumnFilter,
    FooterColumnId,
    FooterSum,
  },
})
