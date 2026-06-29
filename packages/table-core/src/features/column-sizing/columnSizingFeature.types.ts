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
   * Sums the current sizes of visible center-region leaf columns.
   */
  getCenterTotalSize: () => number
  /**
   * Sums the current sizes of visible left-pinned leaf columns.
   */
  getLeftTotalSize: () => number
  /**
   * Sums the current sizes of visible right-pinned leaf columns.
   */
  getRightTotalSize: () => number
  /**
   * Sums the current sizes of all visible leaf columns.
   */
  getTotalSize: () => number
  /**
   * Resets column sizing to `initialState.columnSizing`. Pass `true` to reset
   * to the feature default of `{}`.
   */
  resetColumnSizing: (defaultState?: boolean) => void
  /**
   * Updates committed column sizing state with a next map or updater function.
   */
  setColumnSizing: (updater: Updater<ColumnSizingState>) => void
}

export interface ColumnDef_ColumnSizing {
  /**
   * Upper bound used when resolving this column's size.
   */
  maxSize?: number
  /**
   * Lower bound used when resolving this column's size.
   */
  minSize?: number
  /**
   * Initial size used before column sizing state overrides it.
   */
  size?: number
}

export interface Column_ColumnSizing {
  /**
   * Measures the offset from this column's end edge to the end of its region.
   *
   * Pass a pinned region to measure within that region. The value is the sum
   * of visible leaf column sizes after this column.
   */
  getAfter: (position?: ColumnPinningPosition | 'center') => number
  /**
   * Resolves the column's current size after state and min/max constraints.
   */
  getSize: () => number
  /**
   * Measures the offset from the start of this column's region to its start
   * edge.
   *
   * Pass a pinned region to measure within that region. The value is the sum
   * of visible leaf column sizes before this column.
   */
  getStart: (position?: ColumnPinningPosition | 'center') => number
  /**
   * Resets the column to its initial size.
   */
  resetSize: () => void
}

export interface Header_ColumnSizing {
  /**
   * Computes this header's rendered size from its leaf columns.
   */
  getSize: () => number
  /**
   * Returns the offset measurement along the row-axis (usually the x-axis for standard tables) for the header. This is effectively a sum of the offset measurements of all preceding headers.
   */
  getStart: (position?: ColumnPinningPosition) => number
}
