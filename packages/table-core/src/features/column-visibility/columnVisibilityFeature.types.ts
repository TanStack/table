import type { OnChangeFn, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Cell } from '../../types/Cell'
import type { Column } from '../../types/Column'

export type ColumnVisibilityState = Record<string, boolean>

export interface TableState_ColumnVisibility {
  columnVisibility: ColumnVisibilityState
}

export interface TableOptions_ColumnVisibility {
  /**
   * Whether to enable column hiding. Defaults to `true`.
   */
  enableHiding?: boolean
  /**
   * Called with an updater when column visibility state changes. Pair this with
   * `state.columnVisibility` when using external state; external atoms can own
   * the slice without this callback.
   */
  onColumnVisibilityChange?: OnChangeFn<ColumnVisibilityState>
}

export type VisibilityDefaultOptions = Pick<
  TableOptions_ColumnVisibility,
  'onColumnVisibilityChange'
>

export interface Table_ColumnVisibility<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Returns whether all columns are visible
   */
  getIsAllColumnsVisible: () => boolean
  /**
   * Returns whether any columns are visible
   */
  getIsSomeColumnsVisible: () => boolean
  /**
   * Returns a handler for toggling the visibility of all columns, meant to be bound to a `input[type=checkbox]` element.
   */
  getToggleAllColumnsVisibilityHandler: () => (event: unknown) => void
  /**
   * Returns a flat array of columns that are visible, including parent columns.
   */
  getVisibleFlatColumns: () => Array<Column<TFeatures, TData, unknown>>
  /**
   * Returns a flat array of leaf-node columns that are visible.
   */
  getVisibleLeafColumns: () => Array<Column<TFeatures, TData, unknown>>
  /**
   * Resets the column visibility state to the initial state. If `defaultState` is provided, the state will be reset to `{}`
   */
  resetColumnVisibility: (defaultState?: boolean) => void
  /**
   * Sets column visibility state using a value or updater.
   */
  setColumnVisibility: (updater: Updater<ColumnVisibilityState>) => void
  /**
   * Toggles the visibility of all columns.
   */
  toggleAllColumnsVisible: (value?: boolean) => void
}

export interface ColumnDef_ColumnVisibility {
  /**
   * Enables/disables column hiding for this column. Defaults to `true`.
   */
  enableHiding?: boolean
}

export interface Row_ColumnVisibility<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Returns all cells for the row whose columns are currently visible.
   */
  getAllVisibleCells: () => Array<Cell<TFeatures, TData, unknown>>
  /**
   * Returns an array of cells that account for column visibility for the row.
   */
  getVisibleCells: () => Array<Cell<TFeatures, TData, unknown>>
}

export interface Column_ColumnVisibility {
  /**
   * Returns whether the column can be hidden
   */
  getCanHide: () => boolean
  /**
   * Returns whether the column is visible
   */
  getIsVisible: () => boolean
  /**
   * Returns a function that can be used to toggle the column visibility. This function can be used to bind to an event handler to a checkbox.
   */
  getToggleVisibilityHandler: () => (event: unknown) => void
  /**
   * Toggles the visibility of the column.
   */
  toggleVisibility: (value?: boolean) => void
}
