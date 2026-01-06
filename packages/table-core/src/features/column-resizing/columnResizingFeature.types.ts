import type { OnChangeFn, Updater } from '../../types/type-utils'

export interface TableState_ColumnResizing {
  columnResizing: columnResizingState
}

export interface columnResizingState {
  columnSizingStart: Array<[string, number]>
  deltaOffset: null | number
  deltaPercentage: null | number
  isResizingColumn: false | string
  startOffset: null | number
  startSize: null | number
}

export type ColumnResizeMode = 'onChange' | 'onEnd'

export type ColumnResizeDirection = 'ltr' | 'rtl'

export interface TableOptions_ColumnResizing {
  /**
   * Determines when the columnSizing state is updated. `onChange` updates the state when the user is dragging the resize handle. `onEnd` updates the state when the user releases the resize handle.
   */
  columnResizeMode?: ColumnResizeMode
  /**
   * Enables or disables column resizing for the column.
   */
  enableColumnResizing?: boolean
  /**
   * Enables or disables right-to-left support for resizing the column. defaults to 'ltr'.
   */
  columnResizeDirection?: ColumnResizeDirection
  /**
   * If provided, this function will be called with an `updaterFn` when `state.columnResizing` changes. This overrides the default internal state management, so you will also need to supply `state.columnResizing` from your own managed state.
   */
  onColumnResizingChange?: OnChangeFn<columnResizingState>
}

export type ColumnResizingDefaultOptions = Pick<
  TableOptions_ColumnResizing,
  'columnResizeMode' | 'onColumnResizingChange' | 'columnResizeDirection'
>

export interface Table_ColumnResizing {
  /**
   * Resets column sizing info to its initial state. If `defaultState` is `true`, the default state for the table will be used instead of the initialValue provided to the table.
   */
  resetHeaderSizeInfo: (defaultState?: boolean) => void
  /**
   * Sets the column sizing info state using an updater function or a value. This will trigger the underlying `oncolumnResizingChange` function if one is passed to the table options, otherwise the state will be managed automatically by the table.
   */
  setcolumnResizing: (updater: Updater<columnResizingState>) => void
}

export interface ColumnDef_ColumnResizing {
  /**
   * Enables or disables column resizing for the column.
   */
  enableResizing?: boolean
}

export interface Column_ColumnResizing {
  /**
   * Returns `true` if the column can be resized.
   */
  getCanResize: () => boolean
  /**
   * Returns `true` if the column is currently being resized.
   */
  getIsResizing: () => boolean
}

export interface Header_ColumnResizing {
  /**
   * Returns an event handler function that can be used to resize the header. It can be used as an:
   * - `onMouseDown` handler
   * - `onTouchStart` handler
   * The dragging and release events are automatically handled for you.
   */
  getResizeHandler: (context?: Document) => (event: unknown) => void
}
