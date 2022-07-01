import { RowData, Cell, Column, Row, Table } from '../types'

export type CoreCell<TData extends RowData> = {
  id: string
  getValue: () => any
  renderValue: () => unknown
  row: Row<TData>
  column: Column<TData>
  getContext: () => {
    table: Table<TData>
    column: Column<TData>
    row: Row<TData>
    cell: Cell<TData>
    getValue: () => any
    renderValue: () => any
  }
}

export function createCell<TData extends RowData>(
  table: Table<TData>,
  row: Row<TData>,
  column: Column<TData>,
  columnId: string
) {
  const getRenderValue = () =>
    cell.getValue() ?? table.options.renderFallbackValue

  const cell: CoreCell<TData> = {
    id: `${row.id}_${column.id}`,
    row,
    column,
    getValue: () => row.getValue(columnId),
    renderValue: getRenderValue,
    getContext: () => ({
      table,
      column,
      row,
      cell: cell as Cell<TData>,
      getValue: cell.getValue,
      renderValue: cell.renderValue,
    }),
  }

  table._features.forEach(feature => {
    Object.assign(
      cell,
      feature.createCell?.(
        cell as Cell<TData>,
        column,
        row as Row<TData>,
        table
      )
    )
  }, {})

  return cell as Cell<TData>
}
