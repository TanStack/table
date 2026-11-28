import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Row } from '../../types/Row'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'

export interface SparseRowRange {
  /**
   * The index of the first row in the range.
   */
  startIndex: number
  /**
   * The index of the last row in the range. The range includes this row.
   */
  endIndex: number
}

export interface MissingRowRangesOptions extends SparseRowRange {
  /**
   * Returns whole blocks of this many rows instead of exact gaps: one range for
   * each block that has a missing row between `startIndex` and `endIndex`.
   * Block `n` starts at index `n * blockSize`, so the same block always has
   * the same bounds.
   */
  blockSize?: number
}

export interface TableOptions_SparseRows {
  /**
   * The total number of rows on the server. The core row model has this many
   * rows, and each index that `data` has no row for gets a placeholder row.
   * Defaults to `data.length`.
   */
  rowCount?: number
}

export interface Row_SparseRows {
  /**
   * Checks whether this row stands in for a row that is not loaded. A
   * placeholder row has a temporary id, its `original` is `undefined`, and all
   * of its values are `undefined`.
   */
  getIsPlaceholder: () => boolean
}

export interface Table_SparseRows<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Creates the core row model that holds `rowCount` rows. The core row model
   * getter uses it in place of `createCoreRowModel()`.
   *
   * @internal
   */
  _createSparseRowModel: () => () => RowModel<TFeatures, TData>
  /**
   * Returns the row at the index that a placeholder row id holds, also after
   * that row is loaded. Returns `undefined` for all other ids.
   *
   * @internal
   */
  _getRowByPlaceholderId: (rowId: string) => Row<TFeatures, TData> | undefined
  /**
   * Returns the ranges between `startIndex` and `endIndex` (both included) that
   * `data` has no rows for. The table does not load rows; request these ranges
   * and put the rows into `data` at their index.
   */
  getMissingRowRanges: (
    options: MissingRowRangesOptions,
  ) => Array<SparseRowRange>
}
