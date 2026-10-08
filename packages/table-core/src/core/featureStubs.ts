import type { Table_CellSelection } from '../features/cell-selection/cellSelectionFeature.types'
import type {
  Column_ColumnVisibility,
  Table_ColumnVisibility,
} from '../features/column-visibility/columnVisibilityFeature.types'
import type {
  Column_GlobalFiltering,
  Table_GlobalFiltering,
} from '../features/global-filtering/globalFilteringFeature.types'
import type { FilterFn } from '../features/column-filtering/columnFilteringFeature.types'
import type { aggregateColumnValue } from '../features/row-aggregation/rowAggregationFeature.utils'
import type { Table_RowExpanding } from '../features/row-expanding/rowExpandingFeature.types'
import type { Table_RowPagination } from '../features/row-pagination/rowPaginationFeature.types'
import type { Table_RowSorting } from '../features/row-sorting/rowSortingFeature.types'
import type { Column } from '../types/Column'
import type { Table_Internal } from '../types/Table'
import type { TableFeatures } from '../types/TableFeatures'
import type { RowData } from '../types/type-utils'

/**
 * Stubs for optional features, used by the core and by row models that
 * another feature owns.
 *
 * Importing a feature's utils from shared code would bundle that feature into
 * every table that uses the shared code, registered or not. Each stub calls
 * the API the feature registers on the table or column when it is present,
 * and otherwise behaves as if the feature were absent.
 *
 * Internal: not exported from any package entry point.
 */

// Column visibility

/** Whether a column is visible; every column is without the feature. */
export function getIsColumnVisible(column: object): boolean {
  return (column as Partial<Column_ColumnVisibility>).getIsVisible?.() ?? true
}

/** Visible leaf columns; all leaf columns without the feature. */
export function getVisibleLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
): Array<Column<TFeatures, TData, unknown>> {
  return (
    (
      table as Partial<Table_ColumnVisibility<TFeatures, TData>>
    ).getVisibleLeafColumns?.() ?? table.getAllLeafColumns()
  )
}

// Global filtering

/** The resolved global filter function, if the feature is registered. */
export function getGlobalFilterFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
): FilterFn<TFeatures, TData> | undefined {
  return (
    table as Partial<Table_GlobalFiltering<TFeatures, TData>>
  ).getGlobalFilterFn?.()
}

/** Whether a column takes part in global filtering; none do without the feature. */
export function getCanGlobalFilter(column: object): boolean {
  return (
    (column as Partial<Column_GlobalFiltering>).getCanGlobalFilter?.() ?? false
  )
}

// Auto resets

/** Resets expanded state if row expanding is registered. */
export function autoResetExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): void {
  ;(
    table as Partial<Table_RowExpanding<TFeatures, TData>>
  ).autoResetExpanded?.()
}

/** Resets the page index if row pagination is registered. */
export function autoResetPageIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): void {
  ;(
    table as Partial<Table_RowPagination<TFeatures, TData>>
  ).autoResetPageIndex?.()
}

/** Resets sorting if row sorting is registered. */
export function autoResetSorting<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): void {
  ;(table as Partial<Table_RowSorting<TFeatures, TData>>).autoResetSorting?.()
}

/** Resets cell selection if cell selection is registered. */
export function autoResetCellSelection<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): void {
  ;(
    table as Partial<Table_CellSelection<TFeatures, TData>>
  ).autoResetCellSelection?.()
}

// Row aggregation

/**
 * The aggregation executor `rowAggregationFeature` stores on the table, or
 * `undefined` when the feature is not registered.
 */
export function getAggregateColumnValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
): typeof aggregateColumnValue | undefined {
  return (table as { _aggregateColumnValue?: typeof aggregateColumnValue })
    ._aggregateColumnValue
}
