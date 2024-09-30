import type { Fns } from '../../types/Fns'
import type { OnChangeFn, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Cell } from '../../types/Cell'
import type { Column } from '../../types/Column'

export type ColumnVisibilityState = Record<string, boolean>

export interface TableState_ColumnVisibility {
  columnVisibility: ColumnVisibilityState
}

export interface TableState_ColumnVisibility_Unavailable {
  /**
   * @deprecated Import the `ColumnVisibility` feature to use the column visibility APIs.
   */
  columnVisibility?: ColumnVisibilityState
}

export interface TableOptions_ColumnVisibility {
  /**
   * Whether to enable column hiding. Defaults to `true`.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#enablehiding)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)
   */
  enableHiding?: boolean
  /**
   * If provided, this function will be called with an `updaterFn` when `state.columnVisibility` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#oncolumnvisibilitychange)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)
   */
  onColumnVisibilityChange?: OnChangeFn<ColumnVisibilityState>
}

export interface TableOptions_ColumnVisibility_Unavailable {
  /**
   * @deprecated Import the `ColumnVisibility` feature to use the column visibility APIs.
   */
  enableHiding?: boolean
  /**
   * @deprecated Import the `ColumnVisibility` feature to use the column visibility APIs.
   */
  onColumnVisibilityChange?: OnChangeFn<ColumnVisibilityState>
}

export type VisibilityDefaultOptions = Pick<
  TableOptions_ColumnVisibility,
  'onColumnVisibilityChange'
>

export interface Table_ColumnVisibility<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
> {
  /**
   * Returns whether all columns are visible
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#getisallcolumnsvisible)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)
   */
  getIsAllColumnsVisible: () => boolean
  /**
   * Returns whether any columns are visible
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#getissomecolumnsvisible)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)
   */
  getIsSomeColumnsVisible: () => boolean
  /**
   * Returns a handler for toggling the visibility of all columns, meant to be bound to a `input[type=checkbox]` element.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#gettoggleallcolumnsvisibilityhandler)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)
   */
  getToggleAllColumnsVisibilityHandler: () => (event: unknown) => void
  /**
   * Returns a flat array of columns that are visible, including parent columns.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#getvisibleflatcolumns)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)
   */
  getVisibleFlatColumns: () => Array<Column<TFeatures, TFns, TData, unknown>>
  /**
   * Returns a flat array of leaf-node columns that are visible.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#getvisibleleafcolumns)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)
   */
  getVisibleLeafColumns: () => Array<Column<TFeatures, TFns, TData, unknown>>
  /**
   * Resets the column visibility state to the initial state. If `defaultState` is provided, the state will be reset to `{}`
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#resetcolumnvisibility)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)
   */
  resetColumnVisibility: (defaultState?: boolean) => void
  /**
   * Sets or updates the `state.columnVisibility` state.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#setcolumnvisibility)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)
   */
  setColumnVisibility: (updater: Updater<ColumnVisibilityState>) => void
  /**
   * Toggles the visibility of all columns.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#toggleallcolumnsvisible)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)
   */
  toggleAllColumnsVisible: (value?: boolean) => void
}

export interface ColumnDef_ColumnVisibility {
  /**
   * Enables/disables column hiding for this column. Defaults to `true`.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#enablehiding)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)
   */
  enableHiding?: boolean
}

export interface ColumnDef_ColumnVisibility_Unavailable {
  /**
   * @deprecated Import the `ColumnVisibility` feature to use the column visibility APIs.
   */
  enableHiding?: boolean
}

export interface Row_ColumnVisibility<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
> {
  getAllVisibleCells: () => Array<Cell<TFeatures, TFns, TData, unknown>>
  /**
   * Returns an array of cells that account for column visibility for the row.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#getvisiblecells)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)
   */
  getVisibleCells: () => Array<Cell<TFeatures, TFns, TData, unknown>>
}

export interface Column_ColumnVisibility {
  /**
   * Returns whether the column can be hidden
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#getcanhide)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)
   */
  getCanHide: () => boolean
  /**
   * Returns whether the column is visible
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#getisvisible)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)
   */
  getIsVisible: () => boolean
  /**
   * Returns a function that can be used to toggle the column visibility. This function can be used to bind to an event handler to a checkbox.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#gettogglevisibilityhandler)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)
   */
  getToggleVisibilityHandler: () => (event: unknown) => void
  /**
   * Toggles the visibility of the column.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#togglevisibility)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)
   */
  toggleVisibility: (value?: boolean) => void
}
