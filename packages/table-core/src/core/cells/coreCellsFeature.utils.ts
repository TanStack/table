import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Cell } from '../../types/Cell'

export function cell_getValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>): TValue {
  return cell.row.getValue(cell.column.id)
}

export function cell_renderValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>) {
  return cell.getValue() ?? cell._table.options.renderFallbackValue
}

export function cell_getContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>) {
  return {
    table: cell._table,
    column: cell.column,
    row: cell.row,
    cell: cell,
    getValue: cell.getValue,
    renderValue: cell.renderValue,
  }
}
