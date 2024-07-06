import { row_getValue } from '../rows/Rows.utils'
import type { Cell, CellData, RowData, Table } from '../../types'

export function cell_getValue<TData extends RowData, TValue extends CellData>(
  cell: Cell<TData, TValue>,
  table: Table<TData>,
): TValue {
  return row_getValue(cell.row, table, cell.column.id)
}

export function cell_renderValue<
  TData extends RowData,
  TValue extends CellData,
>(cell: Cell<TData, TValue>, table: Table<TData>) {
  return cell_getValue(cell, table) ?? table.options.renderFallbackValue
}

export function cell_getContext<TData extends RowData, TValue extends CellData>(
  cell: Cell<TData, TValue>,
  table: Table<TData>,
) {
  return {
    table,
    column: cell.column,
    row: cell.row,
    cell: cell,
    getValue: cell.getValue,
    renderValue: cell.renderValue,
  }
}
