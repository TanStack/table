import type { OnChangeFn, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Row } from '../../types/Row'

export type RowPinningPosition = false | 'top' | 'bottom'

export interface RowPinningState {
  bottom: Array<string>
  top: Array<string>
}

export interface TableState_RowPinning {
  rowPinning: RowPinningState
}

export interface TableOptions_RowPinning<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Allows rows to be pinned to top or bottom regions.
   *
   * Provide a predicate to decide per row. Defaults to `true`.
   */
  enableRowPinning?: boolean | ((row: Row<TFeatures, TData>) => boolean)
  /**
   * When `false`, pinned rows will not be visible if they are filtered or paginated out of the table. When `true`, pinned rows will always be visible regardless of filtering or pagination. Defaults to `true`.
   */
  keepPinnedRows?: boolean
  /**
   * Called with an updater when row pinning state changes. Pair this with
   * `state.rowPinning` when using external state; external atoms can own the
   * slice without this callback.
   */
  onRowPinningChange?: OnChangeFn<RowPinningState>
}

export interface RowPinningDefaultOptions {
  onRowPinningChange: OnChangeFn<RowPinningState>
}

export interface Row_RowPinning {
  /**
   * Checks whether this row can be pinned.
   */
  getCanPin: () => boolean
  /**
   * Returns the pinned position of the row. (`'top'`, `'bottom'` or `false`)
   */
  getIsPinned: () => RowPinningPosition
  /**
   * Returns the numeric pinned index of the row within a pinned row group.
   */
  getPinnedIndex: () => number
  /**
   * Pins a row to the `'top'` or `'bottom'`, or unpins the row to the center if `false` is passed.
   */
  pin: (
    position: RowPinningPosition,
    includeLeafRows?: boolean,
    includeParentRows?: boolean,
  ) => void
}

export interface Table_RowPinning<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Gets rows pinned to the bottom region.
   */
  getBottomRows: () => Array<Row<TFeatures, TData>>
  /**
   * Gets rows that are not pinned to the top or bottom region.
   */
  getCenterRows: () => Array<Row<TFeatures, TData>>
  /**
   * Checks whether any rows are pinned, optionally limited to one region.
   */
  getIsSomeRowsPinned: (position?: RowPinningPosition) => boolean
  /**
   * Gets rows pinned to the top region.
   */
  getTopRows: () => Array<Row<TFeatures, TData>>
  /**
   * Resets `rowPinning` to `initialState.rowPinning`.
   *
   * Pass `true` to ignore initial state and reset to empty top/bottom arrays.
   */
  resetRowPinning: (defaultState?: boolean) => void
  /**
   * Updates row pinning state with a next state or updater function.
   */
  setRowPinning: (updater: Updater<RowPinningState>) => void
}
