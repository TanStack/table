import type { Table_CellSelection } from '../features/cell-selection/cellSelectionFeature.types'
import type {
  ColumnPinningPosition,
  Table_ColumnPinning,
} from '../features/column-pinning/columnPinningFeature.types'
import type {
  Column_ColumnVisibility,
  Row_ColumnVisibility,
  Table_ColumnVisibility,
} from '../features/column-visibility/columnVisibilityFeature.types'
import type {
  Column_GlobalFiltering,
  Table_GlobalFiltering,
} from '../features/global-filtering/globalFilteringFeature.types'
import type { FilterFn } from '../features/column-filtering/columnFilteringFeature.types'
import type { orderByColumnPinning as orderByColumnPinningImpl } from '../features/column-pinning/orderByColumnPinning'
import type { aggregateColumnValue } from '../features/row-aggregation/rowAggregationFeature.utils'
import type { expandRows } from '../features/row-expanding/createExpandedRowModel'
import type {
  Row_RowExpanding,
  Table_RowExpanding,
} from '../features/row-expanding/rowExpandingFeature.types'
import type { Table_RowPagination } from '../features/row-pagination/rowPaginationFeature.types'
import type { Table_RowSorting } from '../features/row-sorting/rowSortingFeature.types'
import type { Cell } from '../types/Cell'
import type { Column } from '../types/Column'
import type { Row } from '../types/Row'
import type { Table_Internal } from '../types/Table'
import type { TableFeatures } from '../types/TableFeatures'
import type { RowData } from '../types/type-utils'
import type { RowModel } from './row-models/coreRowModelsFeature.types'

/**
 * Stubs for optional features, used by the core and by any feature or row
 * model that reads another feature.
 *
 * Importing a feature's utils from shared code would bundle that feature into
 * every table that uses the shared code, registered or not. Each stub calls
 * what the feature registers when it is present, either an API on the table,
 * column, or row or a `_`-prefixed function the feature stores on the table
 * in `initTableInstanceData`, and otherwise behaves as if the feature were
 * absent.
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

/**
 * A row's visible cells; all cells, in leaf column order, without the
 * feature.
 */
export function getVisibleCells<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>): Array<Cell<TFeatures, TData, unknown>> {
  return (
    (
      row as Partial<Row_ColumnVisibility<TFeatures, TData>>
    ).getVisibleCells?.() ?? row.getAllCells()
  )
}

/** A row's visible cells by column id; all cells without the feature. */
export function getVisibleCellsByColumnId<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>): Record<string, Cell<TFeatures, TData, unknown>> {
  return (
    (
      row as Partial<Row_ColumnVisibility<TFeatures, TData>>
    ).getVisibleCellsByColumnId?.() ?? row.getAllCellsByColumnId()
  )
}

// Column ordering and grouping

/**
 * Orders leaf columns for display. The column ordering feature applies
 * `columnOrder` and moves grouped columns. Without it, the grouping feature
 * still moves grouped columns, and without either the order is unchanged.
 */
export function orderLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TColumn,
>(
  table: Table_Internal<TFeatures, TData>,
  columns: Array<TColumn>,
): Array<TColumn> {
  const orderedTable = table as {
    getOrderColumnsFn?: () => (columns: Array<TColumn>) => Array<TColumn>
    _orderGroupedColumns?: (
      table: Table_Internal<TFeatures, TData>,
      columns: Array<TColumn>,
    ) => Array<TColumn>
  }
  return (
    orderedTable.getOrderColumnsFn?.()(columns) ??
    orderedTable._orderGroupedColumns?.(table, columns) ??
    columns
  )
}

// Column pinning

/**
 * Orders items that each belong to a leaf column, such as visible leaf columns
 * or a row's visible cells, with start-pinned items first and end-pinned items
 * last. Without the feature, nothing is pinned and the order is unchanged.
 */
export function orderByColumnPinning<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TItem,
>(
  table: Table_Internal<TFeatures, TData>,
  items: Array<TItem>,
  getColumnId: (item: TItem) => string,
  getItemsByColumnId?: () => Record<string, TItem | undefined>,
): Array<TItem> {
  return (
    (
      table as { _orderByColumnPinning?: typeof orderByColumnPinningImpl }
    )._orderByColumnPinning?.(table, items, getColumnId, getItemsByColumnId) ??
    items
  )
}

/**
 * Visible leaf columns in a pinning region. Without the feature, nothing is
 * pinned: the start and end regions are empty, and the center region and the
 * full list (`position` omitted) hold every visible leaf column.
 */
export function getPinnedVisibleLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  position?: ColumnPinningPosition | 'center',
): Array<Column<TFeatures, TData, unknown>> {
  return (
    (
      table as Partial<Table_ColumnPinning<TFeatures, TData>>
    ).getPinnedVisibleLeafColumns?.(position!) ??
    (position && position !== 'center' ? [] : getVisibleLeafColumns(table))
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

// Row expanding

/**
 * Lists expanded sub-rows inline below their parents. Without the feature no
 * row is expanded, so the row model is returned as is.
 */
export function expandRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  rowModel: RowModel<TFeatures, TData>,
): RowModel<TFeatures, TData> {
  return (
    (table as { _expandRows?: typeof expandRows })._expandRows?.(rowModel) ??
    rowModel
  )
}

/**
 * Whether every parent of a row is expanded. Without the feature no row is
 * expanded, so only a top-level row qualifies.
 */
export function getIsAllParentsExpanded(row: { parentId?: string }): boolean {
  return (
    (row as Partial<Row_RowExpanding>).getIsAllParentsExpanded?.() ??
    !row.parentId
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
