import type { OnChangeFn, Updater } from '../../types/type-utils'
import type { ColumnPinningPosition } from '../column-pinning/columnPinningFeature.types'

export interface TableState_ColumnSizing {
  columnSizing: ColumnSizingState
}

export type ColumnSizingState = Record<string, number>

export interface TableOptions_ColumnSizing {
  /**
   * Called with an updater when committed column sizing state changes. Pair
   * this with `state.columnSizing` when using external state; external atoms
   * can own the slice without this callback.
   */
  onColumnSizingChange?: OnChangeFn<ColumnSizingState>
}

export type ColumnSizingDefaultOptions = Pick<
  TableOptions_ColumnSizing,
  'onColumnSizingChange'
>

export interface Table_ColumnSizing {
  /**
   * If pinning, returns the total size of the center portion of the table by calculating the sum of the sizes of all unpinned/center leaf-columns.
   */
  getCenterTotalSize: () => number
  /**
   * Returns the total size of the left portion of the table by calculating the sum of the sizes of all left leaf-columns.
   */
  getLeftTotalSize: () => number
  /**
   * Returns the total size of the right portion of the table by calculating the sum of the sizes of all right leaf-columns.
   */
  getRightTotalSize: () => number
  /**
   * Returns the total size of the table by calculating the sum of the sizes of all leaf-columns.
   */
  getTotalSize: () => number
  /**
   * Resets column sizing to `initialState.columnSizing`. Pass `true` to reset
   * to the feature default of `{}`.
   */
  resetColumnSizing: (defaultState?: boolean) => void
  /**
   * Sets committed column sizing state using a value or updater.
   */
  setColumnSizing: (updater: Updater<ColumnSizingState>) => void
}

export interface ColumnDef_ColumnSizing {
  /**
   * The maximum allowed size for the column
   */
  maxSize?: number
  /**
   * The minimum allowed size for the column
   */
  minSize?: number
  /**
   * The desired size for the column
   */
  size?: number
}

export interface Column_ColumnSizing {
  /**
   * Returns the offset measurement along the row-axis (usually the x-axis for standard tables) for the header. This is effectively a sum of the offset measurements of all succeeding (right) headers in relation to the current column.
   */
  getAfter: (position?: ColumnPinningPosition | 'center') => number
  /**
   * Returns the current size of the column.
   */
  getSize: () => number
  /**
   * Returns the offset measurement along the row-axis (usually the x-axis for standard tables) for the header. This is effectively a sum of the offset measurements of all preceding (left) headers in relation to the current column.
   */
  getStart: (position?: ColumnPinningPosition | 'center') => number
  /**
   * Resets the column to its initial size.
   */
  resetSize: () => void
}

export interface Header_ColumnSizing {
  /**
   * Returns the current size of the header.
   */
  getSize: () => number
  /**
   * Returns the offset measurement along the row-axis (usually the x-axis for standard tables) for the header. This is effectively a sum of the offset measurements of all preceding headers.
   */
  getStart: (position?: ColumnPinningPosition) => number
}
