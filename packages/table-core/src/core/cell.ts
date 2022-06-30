import { RowData, Cell, Column, Row, Table } from '../types'

export type CoreCell<TData extends RowData, TValue> = {
  id: string
  getValue: () => TValue
  renderValue: () => unknown
  row: Row<TData>
  column: Column<TData, TValue>
  getContext: () => {
    instance: Table<TData>
    column: Column<TData, TValue>
    row: Row<TData>
    cell: Cell<TData, TValue>
    getValue: () => TValue
    renderValue: () => any
  }
}

export function createCell<TData extends RowData, TValue>(
  instance: Table<TData>,
  row: Row<TData>,
  column: Column<TData, TValue>,
  columnId: string
) {
  const getRenderValue = () =>
    cell.getValue() ?? instance.options.renderFallbackValue

  const cell: CoreCell<TData, TValue> = {
    id: `${row.id}_${column.id}`,
    row,
    column,
    getValue: () => row.getValue(columnId),
    renderValue: getRenderValue,
    getContext: () => ({
      instance,
      column,
      row,
      cell: cell as Cell<TData, TValue>,
      getValue: cell.getValue,
      renderValue: cell.renderValue,
    }),
  }

  instance._features.forEach(feature => {
    Object.assign(
      cell,
      feature.createCell?.(
        cell as Cell<TData, TValue>,
        column,
        row as Row<TData>,
        instance
      )
    )
  }, {})

  return cell as Cell<TData, TValue>
}
