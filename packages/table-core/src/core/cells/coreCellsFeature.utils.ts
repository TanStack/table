import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Cell } from '../../types/Cell'

/**
 * Returns value for a cell.
 *
 * This is the static implementation behind the matching cell instance API and uses the owning row and column context.
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
 * Returns value for a cell.
 *
 * This is the static implementation behind the matching cell instance API and uses the owning row and column context.
 *
 * @example
 * ```ts
 * const value = cell_renderValue(cell)
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
 * Returns context for a cell.
 *
 * This is the static implementation behind the matching cell instance API and uses the owning row and column context.
 *
 * @example
 * ```ts
 * const value = cell_getContext(cell)
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
