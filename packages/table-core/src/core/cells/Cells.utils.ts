import { row_getValue } from '../rows/Rows.utils'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Cell } from '../../types/Cell'

export function cell_getValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  cell: Cell<TFeatures, TData, TValue>,
  table: Table<TFeatures, TData>,
): TValue {
  return row_getValue(cell.row, table, cell.column.id) as TValue
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
