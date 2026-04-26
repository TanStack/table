import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  filterFns,
  globalFilteringFeature,
  rowPaginationFeature,
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
  StatusCell,
  TextCell,
} from '../components/cell-components'
import {
  ColumnFilter,
  FooterColumnId,
  FooterSum,
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
const _features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
})

const _hook = createTableHook({
  _features,
  _rowModels: {
    filteredRowModel: createFilteredRowModel(filterFns),
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(sortFns),
  },
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
  },
  headerComponents: {
    SortIndicator,
    ColumnFilter,
    FooterColumnId,
    FooterSum,
  },
})

export const createAppColumnHelper = _hook.createAppColumnHelper
export const useAppTable = _hook.useAppTable

// Explicit type annotations break the circular inference chain (TS7022).
// TypeScript cannot infer the types of these when the component files that
// import them are also imported by this module (circular dependency).
export const useTableContext: <TData extends RowData = RowData>() => VueTable<
  typeof _features,
  TData
> = _hook.useTableContext

export const useCellContext: <TValue extends CellData = CellData>() => Cell<
  typeof _features,
  any,
  TValue
> = _hook.useCellContext

export const useHeaderContext: <TValue extends CellData = CellData>() => Header<
  typeof _features,
  any,
  TValue
> = _hook.useHeaderContext
