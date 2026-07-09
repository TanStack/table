import type { OnChangeFn, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Cell } from '../../types/Cell'
import type { Header } from '../../types/Header'
import type { HeaderGroup } from '../../types/HeaderGroup'
import type { Column } from '../../types/Column'

export type ColumnPinningPosition = false | 'start' | 'end'

export interface ColumnPinningState {
  start: Array<string>
  end: Array<string>
}

export interface TableState_ColumnPinning {
  columnPinning: ColumnPinningState
}

export interface TableOptions_ColumnPinning {
  /**
   * Allows columns to be pinned into start and end regions.
   *
   * Defaults to `true`; column-level `enablePinning` can still opt individual
   * columns out.
   */
  enableColumnPinning?: boolean
  /**
   * Called with an updater when column pinning state changes. Pair this with
   * `state.columnPinning` when using external state; external atoms can own the
   * slice without this callback.
   */
  onColumnPinningChange?: OnChangeFn<ColumnPinningState>
}

export interface ColumnPinningDefaultOptions {
  onColumnPinningChange: OnChangeFn<ColumnPinningState>
}

export interface ColumnDef_ColumnPinning {
  /**
   * Allows this column's leaf columns to be pinned.
   *
   * Defaults to `true`; table-level `enableColumnPinning` must also allow
   * pinning.
   */
  enablePinning?: boolean
}

export interface Column_ColumnPinning {
  /**
   * Checks whether this column or any of its leaves can be pinned.
   */
  getCanPin: () => boolean
  /**
   * Reads the column's pinned position: `'start'`, `'end'`, or `false`.
   */
  getIsPinned: () => ColumnPinningPosition
  /**
   * Finds this column's index within its pinned region.
   */
  getPinnedIndex: () => number
  /**
   * Pins this column's leaf columns start or end, or unpins them when `false`
   * is passed.
   */
  pin: (position: ColumnPinningPosition) => void
}

export interface Row_ColumnPinning<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Gets visible row cells whose columns are not pinned start or end.
   */
  getCenterVisibleCells: () => Array<Cell<TFeatures, TData, unknown>>
  /**
   * Gets visible row cells whose columns are pinned start.
   */
  getStartVisibleCells: () => Array<Cell<TFeatures, TData, unknown>>
  /**
   * Gets visible row cells whose columns are pinned end.
   */
  getEndVisibleCells: () => Array<Cell<TFeatures, TData, unknown>>
}

export interface Table_ColumnPinning<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Builds flat center-region headers for columns that are not pinned,
   * including parent headers.
   */
  getCenterFlatHeaders: () => Array<Header<TFeatures, TData, unknown>>
  /**
   * Builds footer groups for the center region of unpinned columns.
   */
  getCenterFooterGroups: () => Array<HeaderGroup<TFeatures, TData>>
  /**
   * Builds header groups for the center region of unpinned columns.
   */
  getCenterHeaderGroups: () => Array<HeaderGroup<TFeatures, TData>>
  /**
   * Gets leaf columns that are not pinned start or end.
   */
  getCenterLeafColumns: () => Array<Column<TFeatures, TData, unknown>>
  /**
   * Builds center-region leaf headers for columns that are not pinned.
   */
  getCenterLeafHeaders: () => Array<Header<TFeatures, TData, unknown>>
  /**
   * Lists visible leaf columns in the unpinned center region.
   */
  getCenterVisibleLeafColumns: () => Array<Column<TFeatures, TData, unknown>>
  /**
   * Checks whether any columns are pinned, optionally limited to one side.
   */
  getIsSomeColumnsPinned: (position?: ColumnPinningPosition) => boolean
  /**
   * Builds flat start-region headers for pinned columns, including parent
   * headers.
   */
  getStartFlatHeaders: () => Array<Header<TFeatures, TData, unknown>>
  /**
   * Builds footer groups for start-pinned columns.
   */
  getStartFooterGroups: () => Array<HeaderGroup<TFeatures, TData>>
  /**
   * Builds header groups for start-pinned columns.
   */
  getStartHeaderGroups: () => Array<HeaderGroup<TFeatures, TData>>
  /**
   * Gets leaf columns pinned to the start region in pinning-state order.
   */
  getStartLeafColumns: () => Array<Column<TFeatures, TData, unknown>>
  /**
   * Builds leaf headers for start-pinned columns.
   */
  getStartLeafHeaders: () => Array<Header<TFeatures, TData, unknown>>
  /**
   * Lists visible leaf columns in the start pinned region.
   */
  getStartVisibleLeafColumns: () => Array<Column<TFeatures, TData, unknown>>
  /**
   * Builds flat end-region headers for pinned columns, including parent
   * headers.
   */
  getEndFlatHeaders: () => Array<Header<TFeatures, TData, unknown>>
  /**
   * Builds footer groups for end-pinned columns.
   */
  getEndFooterGroups: () => Array<HeaderGroup<TFeatures, TData>>
  /**
   * Builds header groups for end-pinned columns.
   */
  getEndHeaderGroups: () => Array<HeaderGroup<TFeatures, TData>>
  /**
   * Gets leaf columns pinned to the end region in pinning-state order.
   */
  getEndLeafColumns: () => Array<Column<TFeatures, TData, unknown>>
  /**
   * Builds leaf headers for end-pinned columns.
   */
  getEndLeafHeaders: () => Array<Header<TFeatures, TData, unknown>>
  /**
   * Lists visible leaf columns in the end pinned region.
   */
  getEndVisibleLeafColumns: () => Array<Column<TFeatures, TData, unknown>>
  /**
   * Resets `columnPinning` to `initialState.columnPinning`.
   *
   * Pass `true` to ignore initial state and reset to empty start/end arrays.
   */
  resetColumnPinning: (defaultState?: boolean) => void
  /**
   * Updates column pinning state with a next state or updater function.
   */
  setColumnPinning: (updater: Updater<ColumnPinningState>) => void
  /**
   * Returns pinned leaf columns for the requested pinning region.
   */
  getPinnedLeafColumns: (
    position: ColumnPinningPosition | 'center',
  ) => Array<Column<TFeatures, TData, unknown>>
  /**
   * Lists visible leaf columns for the requested pinning region.
   */
  getPinnedVisibleLeafColumns: (
    position: ColumnPinningPosition | 'center',
  ) => Array<Column<TFeatures, TData, unknown>>
}
