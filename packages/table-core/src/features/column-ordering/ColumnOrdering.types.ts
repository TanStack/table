import type { Fns } from '../../types/Fns'
import type { OnChangeFn, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { ColumnPinningPosition } from '../column-pinning/ColumnPinning.types'

export type ColumnOrderState = Array<string>

export interface TableState_ColumnOrdering {
  columnOrder: ColumnOrderState
}

export interface TableState_ColumnOrdering_Unavailable {
  /**
   * @deprecated Import the `ColumnOrdering` feature to use the column ordering APIs.
   */
  columnOrder?: ColumnOrderState
}

export interface TableOptions_ColumnOrdering {
  /**
   * If provided, this function will be called with an `updaterFn` when `state.columnOrder` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-ordering#oncolumnorderchange)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-ordering)
   */
  onColumnOrderChange?: OnChangeFn<ColumnOrderState>
}

export interface TableOptions_ColumnOrdering_Unavailable {
  /**
   * @deprecated Import the `ColumnOrdering` feature to use the column ordering APIs.
   */
  onColumnOrderChange?: OnChangeFn<ColumnOrderState>
}

export interface Column_ColumnOrdering {
  /**
   * Returns the index of the column in the order of the visible columns. Optionally pass a `position` parameter to get the index of the column in a sub-section of the table
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-ordering#getindex)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-ordering)
   */
  getIndex: (position?: ColumnPinningPosition | 'center') => number
  /**
   * Returns `true` if the column is the first column in the order of the visible columns. Optionally pass a `position` parameter to check if the column is the first in a sub-section of the table.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-ordering#getisfirstcolumn)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-ordering)
   */
  getIsFirstColumn: (position?: ColumnPinningPosition | 'center') => boolean
  /**
   * Returns `true` if the column is the last column in the order of the visible columns. Optionally pass a `position` parameter to check if the column is the last in a sub-section of the table.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-ordering#getislastcolumn)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-ordering)
   */
  getIsLastColumn: (position?: ColumnPinningPosition | 'center') => boolean
}

export interface ColumnOrderDefaultOptions {
  onColumnOrderChange: OnChangeFn<ColumnOrderState>
}

export interface Table_ColumnOrdering<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
> {
  /**
   * Resets the **columnOrder** state to `initialState.columnOrder`, or `true` can be passed to force a default blank state reset to `[]`.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-ordering#resetcolumnorder)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-ordering)
   */
  resetColumnOrder: (defaultState?: boolean) => void
  /**
   * Sets or updates the `state.columnOrder` state.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-ordering#setcolumnorder)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-ordering)
   */
  setColumnOrder: (updater: Updater<ColumnOrderState>) => void
}
