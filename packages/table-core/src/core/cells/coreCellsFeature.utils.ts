import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Cell } from '../../types/Cell'

/**
 * Reads this cell's accessor value from its owning row and column.
 *
 * This is the standalone implementation behind `cell.getValue()`, useful when
 * importing static APIs instead of calling methods from the cell prototype.
 *
 * @example
 * ```ts
 * const value = cell_getValue(cell)
 * ```
 */
export function cell_getValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>): TValue {
  return cell.row.getValue(cell.column.id)
}

/**
 * Reads the value that should be rendered for this cell.
 *
 * Nullish accessor values are replaced with `table.options.renderFallbackValue`,
 * matching the behavior of `cell.renderValue()`.
 *
 * @example
 * ```ts
 * const rendered = cell_renderValue(cell)
 * ```
 */
export function cell_renderValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>) {
  return cell.getValue() ?? cell.table.options.renderFallbackValue
}

/**
 * Builds the render context passed to a column's `cell` template.
 *
 * The returned object includes stable references to the table, row, column, and
 * cell, plus bound `getValue` and `renderValue` helpers for render functions.
 *
 * @example
 * ```ts
 * const context = cell_getContext(cell)
 * ```
 */
export function cell_getContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>) {
  return {
    table: cell.table,
    column: cell.column,
    row: cell.row,
    cell: cell,
    // Wrap in arrow functions to preserve `this` binding (methods are on prototype)
    getValue: () => cell.getValue(),
    renderValue: () => cell.renderValue(),
  }
}
