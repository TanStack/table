import { row_getValue } from '../rows/Rows.utils'
import type { Cell, CellData, RowData, Table, TableFeatures } from '../../types'

export function cell_getValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  cell: Cell<TFeatures, TData, TValue>,
  table: Table<TFeatures, TData>,
): TValue {
  return row_getValue(cell.row, table, cell.column.id)
}

export function cell_renderValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>, table: Table<TFeatures, TData>) {
  return cell_getValue(cell, table) ?? table.options.renderFallbackValue
}

export function cell_getContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>, table: Table<TFeatures, TData>) {
  return {
    table,
    column: cell.column,
    row: cell.row,
    cell: cell,
    getValue: cell.getValue,
    renderValue: cell.renderValue,
  }
}
