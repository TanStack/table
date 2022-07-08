import { RowData, Cell, Column, Row, Table } from '../types'

export type CoreCell<TData extends RowData, TValue> = {
  id: string
  getValue: <TTValue = TValue>() => TTValue
  renderValue: <TTValue = TValue>() => TTValue | null
  row: Row<TData>
  column: Column<TData, TValue>
  getContext: () => {
    table: Table<TData>
    column: Column<TData, TValue>
    row: Row<TData>
    cell: Cell<TData, TValue>
    getValue: <TTValue = TValue>() => TTValue
    renderValue: <TTValue = TValue>() => TTValue | null
  }
}

export function createCell<TData extends RowData, TValue>(
  table: Table<TData>,
  row: Row<TData>,
  column: Column<TData, TValue>,
  columnId: string
) {
  const getRenderValue = () =>
    cell.getValue() ?? table.options.renderFallbackValue

  const cell: CoreCell<TData, TValue> = {
    id: `${row.id}_${column.id}`,
    row,
    column,
    getValue: () => row.getValue(columnId),
    renderValue: getRenderValue,
    getContext: () => ({
      table,
      column,
      row,
      cell: cell as Cell<TData, TValue>,
      getValue: cell.getValue,
      renderValue: cell.renderValue,
    }),
  }

  table._features.forEach(feature => {
    Object.assign(
      cell,
      feature.createCell?.(
        cell as Cell<TData, TValue>,
        column,
        row as Row<TData>,
        table
      )
    )
  }, {})

  return cell as Cell<TData, TValue>
}
