import type { OnChangeFn, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Cell } from '../../types/Cell'
import type { Header } from '../../types/Header'
import type { HeaderGroup } from '../../types/HeaderGroup'
import type { Column } from '../../types/Column'

export type ColumnPinningPosition = false | 'left' | 'right'

export interface ColumnPinningState {
  left: Array<string>
  right: Array<string>
}

export interface TableState_ColumnPinning {
  columnPinning: ColumnPinningState
}

export interface TableOptions_ColumnPinning {
  /**
   * Enables/disables column pinning for the table. Defaults to `true`.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#enablecolumnpinning)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  enableColumnPinning?: boolean
  /**
   * If provided, this function will be called with an `updaterFn` when `state.columnPinning` changes. This overrides the default internal state management, so you will also need to supply `state.columnPinning` from your own managed state.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#oncolumnpinningchange)
   * [Guide](https://tanstack.com/table/v8/docs/guide/oncolumnpinningchange)
   */
  onColumnPinningChange?: OnChangeFn<ColumnPinningState>
}

export interface ColumnPinningDefaultOptions {
  onColumnPinningChange: OnChangeFn<ColumnPinningState>
}

export interface ColumnDef_ColumnPinning {
  /**
   * Enables/disables column pinning for this column. Defaults to `true`.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#enablepinning-1)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  enablePinning?: boolean
}

export interface Column_ColumnPinning {
  /**
   * Returns whether or not the column can be pinned.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getcanpin)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  getCanPin: () => boolean
  /**
   * Returns the pinned position of the column. (`'left'`, `'right'` or `false`)
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getispinned)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  getIsPinned: () => ColumnPinningPosition
  /**
   * Returns the numeric pinned index of the column within a pinned column group.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getpinnedindex)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  getPinnedIndex: () => number
  /**
   * Pins a column to the `'left'` or `'right'`, or unpins the column to the center if `false` is passed.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#pin)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  pin: (position: ColumnPinningPosition) => void
}

export interface Row_ColumnPinning<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Returns all center pinned (unpinned) leaf cells in the row.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getcentervisiblecells)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  getCenterVisibleCells: () => Array<Cell<TFeatures, TData, unknown>>
  /**
   * Returns all left pinned leaf cells in the row.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getleftvisiblecells)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  getLeftVisibleCells: () => Array<Cell<TFeatures, TData, unknown>>
  /**
   * Returns all right pinned leaf cells in the row.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getrightvisiblecells)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  getRightVisibleCells: () => Array<Cell<TFeatures, TData, unknown>>
}

export interface Table_ColumnPinning<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * If pinning, returns headers for all columns that are not pinned, including parent headers.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getcenterflatheaders)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getCenterFlatHeaders: () => Array<Header<TFeatures, TData, unknown>>
  /**
   * If pinning, returns the footer groups for columns that are not pinned.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getcenterfootergroups)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getCenterFooterGroups: () => Array<HeaderGroup<TFeatures, TData>>
  /**
   * If pinning, returns the header groups for columns that are not pinned.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getcenterheadergroups)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getCenterHeaderGroups: () => Array<HeaderGroup<TFeatures, TData>>
  /**
   * Returns all center pinned (unpinned) leaf columns.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getcenterleafcolumns)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  getCenterLeafColumns: () => Array<Column<TFeatures, TData, unknown>>
  /**
   * If pinning, returns headers for all columns that are not pinned, (not including parent headers).
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getcenterleafheaders)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getCenterLeafHeaders: () => Array<Header<TFeatures, TData, unknown>>
  /**
   * If column pinning, returns a flat array of leaf-node columns that are visible in the unpinned/center portion of the table.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#getcentervisibleleafcolumns)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)
   */
  getCenterVisibleLeafColumns: () => Array<Column<TFeatures, TData, unknown>>
  /**
   * Returns whether or not any columns are pinned. Optionally specify to only check for pinned columns in either the `left` or `right` position.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getissomecolumnspinned)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  getIsSomeColumnsPinned: (position?: ColumnPinningPosition) => boolean
  /**
   * If pinning, returns headers for all left pinned columns in the table, including parent headers.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getleftflatheaders)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getLeftFlatHeaders: () => Array<Header<TFeatures, TData, unknown>>
  /**
   * If pinning, returns the footer groups for the left pinned columns.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getleftfootergroups)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getLeftFooterGroups: () => Array<HeaderGroup<TFeatures, TData>>
  /**
   * If pinning, returns the header groups for the left pinned columns.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getleftheadergroups)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getLeftHeaderGroups: () => Array<HeaderGroup<TFeatures, TData>>
  /**
   * Returns all left pinned leaf columns.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getleftleafcolumns)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  getLeftLeafColumns: () => Array<Column<TFeatures, TData, unknown>>
  /**
   * If pinning, returns headers for all left pinned leaf columns in the table, (not including parent headers).
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getleftleafheaders)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getLeftLeafHeaders: () => Array<Header<TFeatures, TData, unknown>>
  /**
   * If column pinning, returns a flat array of leaf-node columns that are visible in the left portion of the table.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#getleftvisibleleafcolumns)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)
   */
  getLeftVisibleLeafColumns: () => Array<Column<TFeatures, TData, unknown>>
  /**
   * If pinning, returns headers for all right pinned columns in the table, including parent headers.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getrightflatheaders)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getRightFlatHeaders: () => Array<Header<TFeatures, TData, unknown>>
  /**
   * If pinning, returns the footer groups for the right pinned columns.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getrightfootergroups)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getRightFooterGroups: () => Array<HeaderGroup<TFeatures, TData>>
  /**
   * If pinning, returns the header groups for the right pinned columns.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getrightheadergroups)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getRightHeaderGroups: () => Array<HeaderGroup<TFeatures, TData>>
  /**
   * Returns all right pinned leaf columns.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getrightleafcolumns)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  getRightLeafColumns: () => Array<Column<TFeatures, TData, unknown>>
  /**
   * If pinning, returns headers for all right pinned leaf columns in the table, (not including parent headers).
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getrightleafheaders)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getRightLeafHeaders: () => Array<Header<TFeatures, TData, unknown>>
  /**
   * If column pinning, returns a flat array of leaf-node columns that are visible in the right portion of the table.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#getrightvisibleleafcolumns)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)
   */
  getRightVisibleLeafColumns: () => Array<Column<TFeatures, TData, unknown>>
  /**
   * Resets the **columnPinning** state to `initialState.columnPinning`, or `true` can be passed to force a default blank state reset to `{ left: [], right: [], }`.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#resetcolumnpinning)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  resetColumnPinning: (defaultState?: boolean) => void
  /**
   * Sets or updates the `state.columnPinning` state.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#setcolumnpinning)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  setColumnPinning: (updater: Updater<ColumnPinningState>) => void
  /**
   *
   */
  getPinnedLeafColumns: (
    position: ColumnPinningPosition | 'center',
  ) => Array<Column<TFeatures, TData, unknown>>
  /**
   *
   */
  getPinnedVisibleLeafColumns: (
    position: ColumnPinningPosition | 'center',
  ) => Array<Column<TFeatures, TData, unknown>>
}
