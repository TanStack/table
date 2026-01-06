import type { Table } from '../../types/Table'
import type { OnChangeFn, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Row } from '../../types/Row'

export type ExpandedStateList = Record<string, boolean>
export type ExpandedState = true | Record<string, boolean>

export interface TableState_RowExpanding {
  expanded: ExpandedState
}

export interface Row_RowExpanding {
  /**
   * Returns whether the row can be expanded.
   */
  getCanExpand: () => boolean
  /**
   * Returns whether all parent rows of the row are expanded.
   */
  getIsAllParentsExpanded: () => boolean
  /**
   * Returns whether the row is expanded.
   */
  getIsExpanded: () => boolean
  /**
   * Returns a function that can be used to toggle the expanded state of the row. This function can be used to bind to an event handler to a button.
   */
  getToggleExpandedHandler: () => () => void
  /**
   * Toggles the expanded state (or sets it if `expanded` is provided) for the row.
   */
  toggleExpanded: (expanded?: boolean) => void
}

export interface TableOptions_RowExpanding<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Enable this setting to automatically reset the expanded state of the table when expanding state changes.
   */
  autoResetExpanded?: boolean
  /**
   * Enable/disable expanding for all rows.
   */
  enableExpanding?: boolean
  /**
   * If provided, allows you to override the default behavior of determining whether a row is currently expanded.
   */
  getIsRowExpanded?: (row: Row<TFeatures, TData>) => boolean
  /**
   * If provided, allows you to override the default behavior of determining whether a row can be expanded.
   */
  getRowCanExpand?: (row: Row<TFeatures, TData>) => boolean
  /**
   * Enables manual row expansion. If this is set to `true`, `getExpandedRowModel` will not be used to expand rows and you would be expected to perform the expansion in your own data model. This is useful if you are doing server-side expansion.
   */
  manualExpanding?: boolean
  /**
   * This function is called when the `expanded` table state changes. If a function is provided, you will be responsible for managing this state on your own. To pass the managed state back to the table, use the `tableOptions.state.expanded` option.
   */
  onExpandedChange?: OnChangeFn<ExpandedState>
  /**
   * If `true` expanded rows will be paginated along with the rest of the table (which means expanded rows may span multiple pages). If `false` expanded rows will not be considered for pagination (which means expanded rows will always render on their parents page. This also means more rows will be rendered than the set page size)
   */
  paginateExpandedRows?: boolean
}

export interface Table_RowExpanding<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  autoResetExpanded: () => void
  /**
   * Returns whether there are any rows that can be expanded.
   */
  getCanSomeRowsExpand: () => boolean
  /**
   * Returns the maximum depth of the expanded rows.
   */
  getExpandedDepth: () => number
  /**
   * Returns whether all rows are currently expanded.
   */
  getIsAllRowsExpanded: () => boolean
  /**
   * Returns whether there are any rows that are currently expanded.
   */
  getIsSomeRowsExpanded: () => boolean
  /**
   * Returns a handler that can be used to toggle the expanded state of all rows. This handler is meant to be used with an `input[type=checkbox]` element.
   */
  getToggleAllRowsExpandedHandler: () => (event: unknown) => void
  /**
   * Resets the expanded state of the table to the initial state.
   */
  resetExpanded: (defaultState?: boolean) => void
  /**
   * Updates the expanded state of the table via an update function or value.
   */
  setExpanded: (updater: Updater<ExpandedState>) => void
  /**
   * Toggles the expanded state for all rows.
   */
  toggleAllRowsExpanded: (expanded?: boolean) => void
}

export interface Table_RowModels_Expanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Returns the row model after expansion has been applied.
   */
  getExpandedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Returns the row model before expansion has been applied.
   */
  getPreExpandedRowModel: () => RowModel<TFeatures, TData>
}

export interface CreateRowModel_Expanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * This function is responsible for returning the expanded row model. If this function is not provided, the table will not expand rows. You can use the default exported `getExpandedRowModel` function to get the expanded row model or implement your own.
   */
  expandedRowModel?: (
    table: Table<TFeatures, TData>,
  ) => () => RowModel<TFeatures, TData>
}

export interface CachedRowModel_Expanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  expandedRowModel: () => RowModel<TFeatures, TData>
}
