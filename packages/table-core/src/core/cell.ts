import { RowData, Cell, Column, Row, Table } from '../types'

export type CoreCell<TData extends RowData> = {
  id: string
  getValue: () => any
  renderValue: () => unknown
  row: Row<TData>
  column: Column<TData>
  getContext: () => {
    instance: Table<TData>
    column: Column<TData>
    row: Row<TData>
    cell: Cell<TData>
    getValue: () => any
    renderValue: () => any
  }
}

export function createCell<TData extends RowData>(
  instance: Table<TData>,
  row: Row<TData>,
  column: Column<TData>,
  columnId: string
) {
  const getRenderValue = () =>
    cell.getValue() ?? instance.options.renderFallbackValue

  const cell: CoreCell<TData> = {
    id: `${row.id}_${column.id}`,
    row,
    column,
    getValue: () => row.getValue(columnId),
    renderValue: getRenderValue,
    getContext: () => ({
      instance,
      column,
      row,
      cell: cell as Cell<TData>,
      getValue: cell.getValue,
      renderValue: cell.renderValue,
    }),
  }

  instance._features.forEach(feature => {
    Object.assign(
      cell,
      feature.createCell?.(
        cell as Cell<TData>,
        column,
        row as Row<TData>,
        instance
      )
    )
  }, {})

  return cell as Cell<TData>
}
