import type { OnChangeFn, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { ColumnPinningPosition } from '../column-pinning/columnPinningFeature.types'

export type ColumnOrderState = Array<string>

export interface TableState_ColumnOrdering {
  columnOrder: ColumnOrderState
}

export interface TableOptions_ColumnOrdering {
  /**
   * If provided, this function will be called with an `updaterFn` when `state.columnOrder` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.
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
   * Sets or updates the `state.columnOrder` state.
   */
  setColumnOrder: (updater: Updater<ColumnOrderState>) => void
}
