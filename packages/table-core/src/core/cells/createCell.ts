import type { Cell, Column, Row, RowData, Table } from '../../types'
import type { Cell_CoreProperties } from './Cells.types'

export function _createCell<TData extends RowData, TValue>(
  column: Column<TData, TValue>,
  row: Row<TData>,
  table: Table<TData>,
): Cell<TData, TValue> {
  const cell: Cell_CoreProperties<TData, TValue> = {
    column,
    id: `${row.id}_${column.id}`,
    row,
  }

  for (const feature of Object.values(table._features)) {
    feature?._createCell?.(cell as Cell<TData, TValue>, table)
  }

  return cell as Cell<TData, TValue>
}
