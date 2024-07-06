import type {
  Cell,
  Column,
  Header,
  HeaderGroup,
  OnChangeFn,
  RowData,
  Updater,
} from '../../types'

export type ColumnPinningPosition = false | 'left' | 'right'

export interface ColumnPinningState {
  left?: Array<string>
  right?: Array<string>
}

export interface TableState_ColumnPinning {
  columnPinning: ColumnPinningState
}

export interface TableOptions_ColumnPinning {
  /**
   * Enables/disables column pinning for the table. Defaults to `true`.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#enablecolumnpinning)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  enableColumnPinning?: boolean
  /**
   * @deprecated Use `enableColumnPinning` or `enableRowPinning` instead.
   * Enables/disables all pinning for the table. Defaults to `true`.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#enablepinning)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  enablePinning?: boolean
  /**
   * If provided, this function will be called with an `updaterFn` when `state.columnPinning` changes. This overrides the default internal state management, so you will also need to supply `state.columnPinning` from your own managed state.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#oncolumnpinningchange)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/oncolumnpinningchange)
   */
  onColumnPinningChange?: OnChangeFn<ColumnPinningState>
}

export interface ColumnPinningDefaultOptions {
  onColumnPinningChange: OnChangeFn<ColumnPinningState>
}

export interface ColumnDef_ColumnPinning {
  /**
   * Enables/disables column pinning for this column. Defaults to `true`.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#enablepinning-1)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  enablePinning?: boolean
}

export interface Column_ColumnPinning {
  /**
   * Returns whether or not the column can be pinned.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getcanpin)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  getCanPin: () => boolean
  /**
   * Returns the pinned position of the column. (`'left'`, `'right'` or `false`)
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getispinned)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  getIsPinned: () => ColumnPinningPosition
  /**
   * Returns the numeric pinned index of the column within a pinned column group.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getpinnedindex)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  getPinnedIndex: () => number
  /**
   * Pins a column to the `'left'` or `'right'`, or unpins the column to the center if `false` is passed.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#pin)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  pin: (position: ColumnPinningPosition) => void
}

export interface Row_ColumnPinning<TData extends RowData> {
  /**
   * Returns all center pinned (unpinned) leaf cells in the row.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getcentervisiblecells)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  getCenterVisibleCells: () => Array<Cell<TData, unknown>>
  /**
   * Returns all left pinned leaf cells in the row.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getleftvisiblecells)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  getLeftVisibleCells: () => Array<Cell<TData, unknown>>
  /**
   * Returns all right pinned leaf cells in the row.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getrightvisiblecells)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  getRightVisibleCells: () => Array<Cell<TData, unknown>>
}

export interface Table_ColumnPinning<TData extends RowData> {
  /**
   * Returns all center pinned (unpinned) leaf columns.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getcenterleafcolumns)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  getCenterLeafColumns: () => Array<Column<TData, unknown>>
  /**
   * Returns whether or not any columns are pinned. Optionally specify to only check for pinned columns in either the `left` or `right` position.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getissomecolumnspinned)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  getIsSomeColumnsPinned: (position?: ColumnPinningPosition) => boolean
  /**
   * Returns all left pinned leaf columns.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getleftleafcolumns)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  getLeftLeafColumns: () => Array<Column<TData, unknown>>
  /**
   * Returns all right pinned leaf columns.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getrightleafcolumns)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  getRightLeafColumns: () => Array<Column<TData, unknown>>
  /**
   * Resets the **columnPinning** state to `initialState.columnPinning`, or `true` can be passed to force a default blank state reset to `{ left: [], right: [], }`.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#resetcolumnpinning)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  resetColumnPinning: (defaultState?: boolean) => void
  /**
   * Sets or updates the `state.columnPinning` state.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#setcolumnpinning)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  setColumnPinning: (updater: Updater<ColumnPinningState>) => void
  /**
   * If pinning, returns the header groups for the left pinned columns.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getleftheadergroups)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getLeftHeaderGroups: () => Array<HeaderGroup<TData>>
  /**
   * If pinning, returns the header groups for columns that are not pinned.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getcenterheadergroups)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getCenterHeaderGroups: () => Array<HeaderGroup<TData>>
  /**
   * If pinning, returns the header groups for the right pinned columns.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getrightheadergroups)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getRightHeaderGroups: () => Array<HeaderGroup<TData>>
  /**
   * If pinning, returns the footer groups for the left pinned columns.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getleftfootergroups)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getLeftFooterGroups: () => Array<HeaderGroup<TData>>
  /**
   * If pinning, returns the footer groups for columns that are not pinned.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getcenterfootergroups)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getCenterFooterGroups: () => Array<HeaderGroup<TData>>
  /**
   * If pinning, returns the footer groups for the right pinned columns.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getrightfootergroups)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getRightFooterGroups: () => Array<HeaderGroup<TData>>
  /**
   * If pinning, returns headers for all left pinned columns in the table, including parent headers.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getleftflatheaders)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getLeftFlatHeaders: () => Array<Header<TData, unknown>>
  /**
   * If pinning, returns headers for all columns that are not pinned, including parent headers.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getcenterflatheaders)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getCenterFlatHeaders: () => Array<Header<TData, unknown>>
  /**
   * If pinning, returns headers for all right pinned columns in the table, including parent headers.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getrightflatheaders)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getRightFlatHeaders: () => Array<Header<TData, unknown>>
  /**
   * If pinning, returns headers for all left pinned leaf columns in the table, (not including parent headers).
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getleftleafheaders)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getLeftLeafHeaders: () => Array<Header<TData, unknown>>
  /**
   * If pinning, returns headers for all columns that are not pinned, (not including parent headers).
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getcenterleafheaders)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getCenterLeafHeaders: () => Array<Header<TData, unknown>>
  /**
   * If pinning, returns headers for all right pinned leaf columns in the table, (not including parent headers).
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getrightleafheaders)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getRightLeafHeaders: () => Array<Header<TData, unknown>>
}
