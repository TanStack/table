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
   * Returns the index of the column in the order of the visible columns. Optionally pass a `position` parameter to get the index of the column in a sub-section of the table
   */
  getIndex: (position?: ColumnPinningPosition | 'center') => number
  /**
   * Returns `true` if the column is the first column in the order of the visible columns. Optionally pass a `position` parameter to check if the column is the first in a sub-section of the table.
   */
  getIsFirstColumn: (position?: ColumnPinningPosition | 'center') => boolean
  /**
   * Returns `true` if the column is the last column in the order of the visible columns. Optionally pass a `position` parameter to check if the column is the last in a sub-section of the table.
   */
  getIsLastColumn: (position?: ColumnPinningPosition | 'center') => boolean
}

export interface ColumnOrderDefaultOptions {
  onColumnOrderChange: OnChangeFn<ColumnOrderState>
}

export interface Table_ColumnOrdering<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Resets the **columnOrder** state to `initialState.columnOrder`, or `true` can be passed to force a default blank state reset to `[]`.
   */
  resetColumnOrder: (defaultState?: boolean) => void
  /**
   * Sets column order state using a value or updater.
   */
  setColumnOrder: (updater: Updater<ColumnOrderState>) => void
}
