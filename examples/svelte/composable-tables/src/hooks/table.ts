/**
 * Custom table hook setup using createTableHook
 *
 * This file creates a custom createAppTable hook with pre-bound components.
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
} from '@tanstack/svelte-table'

// Import table-level components
import PaginationControls from '../components/PaginationControls.svelte'
import RowCount from '../components/RowCount.svelte'
import TableToolbar from '../components/TableToolbar.svelte'

// Import cell-level components
import CategoryCell from '../components/CategoryCell.svelte'
import NumberCell from '../components/NumberCell.svelte'
import PriceCell from '../components/PriceCell.svelte'
import ProgressCell from '../components/ProgressCell.svelte'
import RowActionsCell from '../components/RowActionsCell.svelte'
import StatusCell from '../components/StatusCell.svelte'
import TextCell from '../components/TextCell.svelte'

// Import header/footer-level components (both use useHeaderContext)
import ColumnFilter from '../components/ColumnFilter.svelte'
import FooterColumnId from '../components/FooterColumnId.svelte'
import FooterSum from '../components/FooterSum.svelte'
import SortIndicator from '../components/SortIndicator.svelte'

/**
 * Create the custom table hook with all pre-bound components.
 * This exports:
 * - createAppColumnHelper: Create column definitions with TFeatures already bound
 * - createAppTable: Hook for creating tables with TFeatures baked in
 * - useTableContext: Access table instance in tableComponents
 * - useCellContext: Access cell instance in cellComponents
 * - useHeaderContext: Access header instance in headerComponents
 */
export const {
  createAppColumnHelper,
  createAppTable,
  useTableContext,
  useCellContext,
  useHeaderContext,
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
