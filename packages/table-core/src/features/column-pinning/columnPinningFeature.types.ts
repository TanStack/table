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
   */
  enableColumnPinning?: boolean
  /**
   * If provided, this function will be called with an `updaterFn` when `state.columnPinning` changes. This overrides the default internal state management, so you will also need to supply `state.columnPinning` from your own managed state.
   */
  onColumnPinningChange?: OnChangeFn<ColumnPinningState>
}

export interface ColumnPinningDefaultOptions {
  onColumnPinningChange: OnChangeFn<ColumnPinningState>
}

export interface ColumnDef_ColumnPinning {
  /**
   * Enables/disables column pinning for this column. Defaults to `true`.
   */
  enablePinning?: boolean
}

export interface Column_ColumnPinning {
  /**
   * Returns whether or not the column can be pinned.
   */
  getCanPin: () => boolean
  /**
   * Returns the pinned position of the column. (`'left'`, `'right'` or `false`)
   */
  getIsPinned: () => ColumnPinningPosition
  /**
   * Returns the numeric pinned index of the column within a pinned column group.
   */
  getPinnedIndex: () => number
  /**
   * Pins a column to the `'left'` or `'right'`, or unpins the column to the center if `false` is passed.
   */
  pin: (position: ColumnPinningPosition) => void
}

export interface Row_ColumnPinning<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Returns all center pinned (unpinned) leaf cells in the row.
   */
  getCenterVisibleCells: () => Array<Cell<TFeatures, TData, unknown>>
  /**
   * Returns all left pinned leaf cells in the row.
   */
  getLeftVisibleCells: () => Array<Cell<TFeatures, TData, unknown>>
  /**
   * Returns all right pinned leaf cells in the row.
   */
  getRightVisibleCells: () => Array<Cell<TFeatures, TData, unknown>>
}

export interface Table_ColumnPinning<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * If pinning, returns headers for all columns that are not pinned, including parent headers.
   */
  getCenterFlatHeaders: () => Array<Header<TFeatures, TData, unknown>>
  /**
   * If pinning, returns the footer groups for columns that are not pinned.
   */
  getCenterFooterGroups: () => Array<HeaderGroup<TFeatures, TData>>
  /**
   * If pinning, returns the header groups for columns that are not pinned.
   */
  getCenterHeaderGroups: () => Array<HeaderGroup<TFeatures, TData>>
  /**
   * Returns all center pinned (unpinned) leaf columns.
   */
  getCenterLeafColumns: () => Array<Column<TFeatures, TData, unknown>>
  /**
   * If pinning, returns headers for all columns that are not pinned, (not including parent headers).
   */
  getCenterLeafHeaders: () => Array<Header<TFeatures, TData, unknown>>
  /**
   * If column pinning, returns a flat array of leaf-node columns that are visible in the unpinned/center portion of the table.
   */
  getCenterVisibleLeafColumns: () => Array<Column<TFeatures, TData, unknown>>
  /**
   * Returns whether or not any columns are pinned. Optionally specify to only check for pinned columns in either the `left` or `right` position.
   */
  getIsSomeColumnsPinned: (position?: ColumnPinningPosition) => boolean
  /**
   * If pinning, returns headers for all left pinned columns in the table, including parent headers.
   */
  getLeftFlatHeaders: () => Array<Header<TFeatures, TData, unknown>>
  /**
   * If pinning, returns the footer groups for the left pinned columns.
   */
  getLeftFooterGroups: () => Array<HeaderGroup<TFeatures, TData>>
  /**
   * If pinning, returns the header groups for the left pinned columns.
   */
  getLeftHeaderGroups: () => Array<HeaderGroup<TFeatures, TData>>
  /**
   * Returns all left pinned leaf columns.
   */
  getLeftLeafColumns: () => Array<Column<TFeatures, TData, unknown>>
  /**
   * If pinning, returns headers for all left pinned leaf columns in the table, (not including parent headers).
   */
  getLeftLeafHeaders: () => Array<Header<TFeatures, TData, unknown>>
  /**
   * If column pinning, returns a flat array of leaf-node columns that are visible in the left portion of the table.
   */
  getLeftVisibleLeafColumns: () => Array<Column<TFeatures, TData, unknown>>
  /**
   * If pinning, returns headers for all right pinned columns in the table, including parent headers.
   */
  getRightFlatHeaders: () => Array<Header<TFeatures, TData, unknown>>
  /**
   * If pinning, returns the footer groups for the right pinned columns.
   */
  getRightFooterGroups: () => Array<HeaderGroup<TFeatures, TData>>
  /**
   * If pinning, returns the header groups for the right pinned columns.
   */
  getRightHeaderGroups: () => Array<HeaderGroup<TFeatures, TData>>
  /**
   * Returns all right pinned leaf columns.
   */
  getRightLeafColumns: () => Array<Column<TFeatures, TData, unknown>>
  /**
   * If pinning, returns headers for all right pinned leaf columns in the table, (not including parent headers).
   */
  getRightLeafHeaders: () => Array<Header<TFeatures, TData, unknown>>
  /**
   * If column pinning, returns a flat array of leaf-node columns that are visible in the right portion of the table.
   */
  getRightVisibleLeafColumns: () => Array<Column<TFeatures, TData, unknown>>
  /**
   * Resets the **columnPinning** state to `initialState.columnPinning`, or `true` can be passed to force a default blank state reset to `{ left: [], right: [], }`.
   */
  resetColumnPinning: (defaultState?: boolean) => void
  /**
   * Sets or updates the `state.columnPinning` state.
   */
  setColumnPinning: (updater: Updater<ColumnPinningState>) => void
  /**
   */
  getPinnedLeafColumns: (
    position: ColumnPinningPosition | 'center',
  ) => Array<Column<TFeatures, TData, unknown>>
  /**
   */
  getPinnedVisibleLeafColumns: (
    position: ColumnPinningPosition | 'center',
  ) => Array<Column<TFeatures, TData, unknown>>
}
