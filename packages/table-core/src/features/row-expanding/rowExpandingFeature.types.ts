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
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getcanexpand)
   * [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  getCanExpand: () => boolean
  /**
   * Returns whether all parent rows of the row are expanded.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getisallparentsexpanded)
   * [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  getIsAllParentsExpanded: () => boolean
  /**
   * Returns whether the row is expanded.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getisexpanded)
   * [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  getIsExpanded: () => boolean
  /**
   * Returns a function that can be used to toggle the expanded state of the row. This function can be used to bind to an event handler to a button.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#gettoggleexpandedhandler)
   * [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  getToggleExpandedHandler: () => () => void
  /**
   * Toggles the expanded state (or sets it if `expanded` is provided) for the row.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#toggleexpanded)
   * [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  toggleExpanded: (expanded?: boolean) => void
}

export interface TableOptions_RowExpanding<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Enable this setting to automatically reset the expanded state of the table when expanding state changes.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#autoresetexpanded)
   * [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  autoResetExpanded?: boolean
  /**
   * Enable/disable expanding for all rows.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#enableexpanding)
   * [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  enableExpanding?: boolean
  /**
   * If provided, allows you to override the default behavior of determining whether a row is currently expanded.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getisrowexpanded)
   * [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  getIsRowExpanded?: (row: Row<TFeatures, TData>) => boolean
  /**
   * If provided, allows you to override the default behavior of determining whether a row can be expanded.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getrowcanexpand)
   * [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  getRowCanExpand?: (row: Row<TFeatures, TData>) => boolean
  /**
   * Enables manual row expansion. If this is set to `true`, `getExpandedRowModel` will not be used to expand rows and you would be expected to perform the expansion in your own data model. This is useful if you are doing server-side expansion.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#manualexpanding)
   * [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  manualExpanding?: boolean
  /**
   * This function is called when the `expanded` table state changes. If a function is provided, you will be responsible for managing this state on your own. To pass the managed state back to the table, use the `tableOptions.state.expanded` option.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#onexpandedchange)
   * [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  onExpandedChange?: OnChangeFn<ExpandedState>
  /**
   * If `true` expanded rows will be paginated along with the rest of the table (which means expanded rows may span multiple pages). If `false` expanded rows will not be considered for pagination (which means expanded rows will always render on their parents page. This also means more rows will be rendered than the set page size)
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#paginateexpandedrows)
   * [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
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
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getcansomerowsexpand)
   * [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  getCanSomeRowsExpand: () => boolean
  /**
   * Returns the maximum depth of the expanded rows.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getexpandeddepth)
   * [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  getExpandedDepth: () => number
  /**
   * Returns whether all rows are currently expanded.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getisallrowsexpanded)
   * [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  getIsAllRowsExpanded: () => boolean
  /**
   * Returns whether there are any rows that are currently expanded.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getissomerowsexpanded)
   * [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  getIsSomeRowsExpanded: () => boolean
  /**
   * Returns a handler that can be used to toggle the expanded state of all rows. This handler is meant to be used with an `input[type=checkbox]` element.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#gettoggleallrowsexpandedhandler)
   * [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  getToggleAllRowsExpandedHandler: () => (event: unknown) => void
  /**
   * Resets the expanded state of the table to the initial state.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#resetexpanded)
   * [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  resetExpanded: (defaultState?: boolean) => void
  /**
   * Updates the expanded state of the table via an update function or value.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#setexpanded)
   * [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  setExpanded: (updater: Updater<ExpandedState>) => void
  /**
   * Toggles the expanded state for all rows.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#toggleallrowsexpanded)
   * [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  toggleAllRowsExpanded: (expanded?: boolean) => void
}

export interface Table_RowModels_Expanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Returns the row model after expansion has been applied.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getexpandedrowmodel)
   * [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  getExpandedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Returns the row model before expansion has been applied.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getpreexpandedrowmodel)
   * [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  getPreExpandedRowModel: () => RowModel<TFeatures, TData>
}

export interface CreateRowModel_Expanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * This function is responsible for returning the expanded row model. If this function is not provided, the table will not expand rows. You can use the default exported `getExpandedRowModel` function to get the expanded row model or implement your own.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getexpandedrowmodel)
   * [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
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
