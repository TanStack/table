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
   * Determines when committed `columnSizing` values are updated. `onChange`
   * commits sizes while the resize handle is dragged; `onEnd` commits when the
   * resize interaction finishes.
   */
  columnResizeMode?: ColumnResizeMode
  /**
   * Enables or disables column resizing for the whole table.
   */
  enableColumnResizing?: boolean
  /**
   * Sets the resize direction used to calculate drag offsets. Defaults to `ltr`.
   */
  columnResizeDirection?: ColumnResizeDirection
  /**
   * Called with an updater when the transient `columnResizing` state changes.
   * Pair this with `state.columnResizing` when using external state; external
   * atoms can own the slice without this callback.
   */
  onColumnResizingChange?: OnChangeFn<columnResizingState>
}

export type ColumnResizingDefaultOptions = Pick<
  TableOptions_ColumnResizing,
  'columnResizeMode' | 'onColumnResizingChange' | 'columnResizeDirection'
>

export interface Table_ColumnResizing {
  /**
   * Resets `columnResizing` to `initialState.columnResizing`.
   *
   * Pass `true` to ignore initial state and reset to the no-drag default state.
   */
  resetHeaderSizeInfo: (defaultState?: boolean) => void
  /**
   * Updates transient resize interaction state with a next state or updater function.
   *
   * The lowercase `c` in this API name matches the current generated v9 table
   * API for the `columnResizing` state slice.
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
   * Checks whether this column can start a resize interaction.
   */
  getCanResize: () => boolean
  /**
   * Checks whether this column is the active resize target.
   */
  getIsResizing: () => boolean
}

export interface Header_ColumnResizing {
  /**
   * Creates the `onMouseDown`/`onTouchStart` handler for a resize handle.
   *
   * Dragging and release listeners are installed and cleaned up automatically.
   */
  getResizeHandler: (context?: Document) => (event: unknown) => void
}
