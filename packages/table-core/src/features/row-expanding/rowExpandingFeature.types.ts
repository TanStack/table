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
   * Checks whether this row can be expanded.
   */
  getCanExpand: () => boolean
  /**
   * Checks whether every ancestor of this row is expanded.
   */
  getIsAllParentsExpanded: () => boolean
  /**
   * Checks whether this row is currently expanded.
   */
  getIsExpanded: () => boolean
  /**
   * Creates a handler that toggles this row's expanded state.
   */
  getToggleExpandedHandler: () => () => void
  /**
   * Toggles the expanded state (or sets it if `expanded` is provided) for the row.
   */
  toggleExpanded: (expanded?: boolean) => void
}

export interface TableOptions_RowExpanding<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Enables automatic expanded-state resets when page-altering table state changes.
   */
  autoResetExpanded?: boolean
  /**
   * Allows rows with subRows to be expanded.
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
   * Called with an updater when expanded state changes. Pair this with
   * `state.expanded` when using external state; external atoms can own the
   * slice without this callback.
   */
  onExpandedChange?: OnChangeFn<ExpandedState>
  /**
   * If `true` expanded rows will be paginated along with the rest of the table (which means expanded rows may span multiple pages). If `false` expanded rows will not be considered for pagination (which means expanded rows will always render on their parents page. This also means more rows will be rendered than the set page size)
   */
  paginateExpandedRows?: boolean
}

export interface Table_RowExpanding<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  autoResetExpanded: () => void
  /**
   * Checks whether at least one row can be expanded.
   */
  getCanSomeRowsExpand: () => boolean
  /**
   * Computes the deepest expanded row id depth.
   */
  getExpandedDepth: () => number
  /**
   * Checks whether all rows in the current row model are expanded.
   */
  getIsAllRowsExpanded: () => boolean
  /**
   * Checks whether any row is currently expanded.
   */
  getIsSomeRowsExpanded: () => boolean
  /**
   * Creates a handler that toggles all rows expanded.
   */
  getToggleAllRowsExpandedHandler: () => (event: unknown) => void
  /**
   * Resets `expanded` to `initialState.expanded`.
   *
   * Pass `true` to ignore initial state and reset to `{}`.
   */
  resetExpanded: (defaultState?: boolean) => void
  /**
   * Updates expanded state with `true`, a row-id map, or an updater function.
   */
  setExpanded: (updater: Updater<ExpandedState>) => void
  /**
   * Toggles the expanded state for all rows.
   */
  toggleAllRowsExpanded: (expanded?: boolean) => void
}

export interface Table_RowModels_Expanded<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Resolves the row model after expanded rows have been flattened into view.
   */
  getExpandedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Reads the row model immediately before expansion.
   */
  getPreExpandedRowModel: () => RowModel<TFeatures, TData>
}

export interface CachedRowModel_Expanded<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  expandedRowModel: () => RowModel<TFeatures, TData>
}
