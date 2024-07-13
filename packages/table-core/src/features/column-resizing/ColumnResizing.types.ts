import type { OnChangeFn, Updater } from '../../types/type-utils'

export interface TableState_ColumnResizing {
  columnSizingInfo: ColumnResizingInfoState
}

export interface ColumnResizingInfoState {
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
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#columnresizemode)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)
   */
  columnResizeMode?: ColumnResizeMode
  /**
   * Enables or disables column resizing for the column.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#enablecolumnresizing)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)
   */
  enableColumnResizing?: boolean
  /**
   * Enables or disables right-to-left support for resizing the column. defaults to 'ltr'.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#columnResizeDirection)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)
   */
  columnResizeDirection?: ColumnResizeDirection
  /**
   * If provided, this function will be called with an `updaterFn` when `state.columnSizingInfo` changes. This overrides the default internal state management, so you will also need to supply `state.columnSizingInfo` from your own managed state.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#oncolumnsizinginfochange)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)
   */
  onColumnSizingInfoChange?: OnChangeFn<ColumnResizingInfoState>
}

export type ColumnResizingDefaultOptions = Pick<
  TableOptions_ColumnResizing,
  'columnResizeMode' | 'onColumnSizingInfoChange' | 'columnResizeDirection'
>

export interface Table_ColumnResizing {
  /**
   * Resets column sizing info to its initial state. If `defaultState` is `true`, the default state for the table will be used instead of the initialValue provided to the table.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#resetheadersizeinfo)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)
   */
  resetHeaderSizeInfo: (defaultState?: boolean) => void
  /**
   * Sets the column sizing info state using an updater function or a value. This will trigger the underlying `onColumnSizingInfoChange` function if one is passed to the table options, otherwise the state will be managed automatically by the table.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#setcolumnsizinginfo)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)
   */
  setColumnSizingInfo: (updater: Updater<ColumnResizingInfoState>) => void
}

export interface ColumnDef_ColumnResizing {
  /**
   * Enables or disables column resizing for the column.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#enableresizing)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)
   */
  enableResizing?: boolean
}

export interface Column_ColumnResizing {
  /**
   * Returns `true` if the column can be resized.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#getcanresize)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)
   */
  getCanResize: () => boolean
  /**
   * Returns `true` if the column is currently being resized.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#getisresizing)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)
   */
  getIsResizing: () => boolean
}

export interface Header_ColumnResizing {
  /**
   * Returns an event handler function that can be used to resize the header. It can be used as an:
   * - `onMouseDown` handler
   * - `onTouchStart` handler
   *
   * The dragging and release events are automatically handled for you.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#getresizehandler)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)
   */
  getResizeHandler: (context?: Document) => (event: unknown) => void
}
