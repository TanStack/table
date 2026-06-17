import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  filterFns,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/vue-table'
import {
  CategoryCell,
  NumberCell,
  PriceCell,
  ProgressCell,
  RowActionsCell,
  SelectCell,
  StatusCell,
  TextCell,
} from '../components/cell-components'
import {
  ColumnFilter,
  FooterColumnId,
  FooterSum,
  SelectAllHeader,
  SortIndicator,
} from '../components/header-components'
import {
  PaginationControls,
  RowCount,
  TableToolbar,
} from '../components/table-components'
import type {
  Cell,
  CellData,
  Header,
  RowData,
  VueTable,
} from '@tanstack/vue-table'

// Define features separately to extract the type for explicit annotations below.
// This is needed to break the circular inference chain caused by the component
// files (table-components, cell-components, header-components) importing context
// functions from this file, while this file imports from those component files.
const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns,
  sortFns,
})

const _hook = createTableHook({
  features,
  getRowId: (row) => row.id,
  tableComponents: {
    PaginationControls,
    RowCount,
    TableToolbar,
  },
  cellComponents: {
    TextCell,
    NumberCell,
    StatusCell,
    ProgressCell,
    RowActionsCell,
    PriceCell,
    CategoryCell,
    SelectCell,
  },
  headerComponents: {
    SortIndicator,
    ColumnFilter,
    FooterColumnId,
    FooterSum,
    SelectAllHeader,
  },
})

export const createAppColumnHelper = _hook.createAppColumnHelper
export const useAppTable = _hook.useAppTable

// Explicit type annotations break the circular inference chain (TS7022).
// TypeScript cannot infer the types of these when the component files that
// import them are also imported by this module (circular dependency).
export const useTableContext: <TData extends RowData = RowData>() => VueTable<
  typeof features,
  TData
> = _hook.useTableContext

export const useCellContext: <TValue extends CellData = CellData>() => Cell<
  typeof features,
  any,
  TValue
> = _hook.useCellContext

export const useHeaderContext: <TValue extends CellData = CellData>() => Header<
  typeof features,
  any,
  TValue
> = _hook.useHeaderContext
