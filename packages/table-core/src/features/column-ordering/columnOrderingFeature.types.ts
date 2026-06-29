import type { OnChangeFn, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { ColumnPinningPosition } from '../column-pinning/columnPinningFeature.types'

export type ColumnOrderState = Array<string>

export interface TableState_ColumnOrdering {
  columnOrder: ColumnOrderState
}

export interface TableOptions_ColumnOrdering {
  /**
   * Called with an updater when column order state changes. Pair this with
   * `state.columnOrder` when using external state; external atoms can own the
   * slice without this callback.
   */
  onColumnOrderChange?: OnChangeFn<ColumnOrderState>
}

export interface Column_ColumnOrdering {
  /**
   * Finds this column's zero-based index among visible columns.
   *
   * Pass `'left'`, `'center'`, or `'right'` to measure within that pinned
   * region instead of the full visible leaf order.
   */
  getIndex: (position?: ColumnPinningPosition | 'center') => number
  /**
   * Checks whether this column is the first visible column.
   *
   * Pass a pinned region to check the first column within that region.
   */
  getIsFirstColumn: (position?: ColumnPinningPosition | 'center') => boolean
  /**
   * Checks whether this column is the last visible column.
   *
   * Pass a pinned region to check the last column within that region.
   */
  getIsLastColumn: (position?: ColumnPinningPosition | 'center') => boolean
}

export interface ColumnOrderDefaultOptions {
  onColumnOrderChange: OnChangeFn<ColumnOrderState>
}

export interface Table_ColumnOrdering<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Resets `columnOrder` to `initialState.columnOrder`.
   *
   * Pass `true` to ignore initial state and reset to `[]`.
   */
  resetColumnOrder: (defaultState?: boolean) => void
  /**
   * Updates column order state with a next ordered id array or updater function.
   */
  setColumnOrder: (updater: Updater<ColumnOrderState>) => void
}
