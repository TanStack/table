import { Cell, Column, Row, TableGenerics, TableInstance } from '../types'

export type CoreCell<TGenerics extends TableGenerics> = {
  id: string
  getValue: () => TGenerics['Value']
  row: Row<TGenerics>
  column: Column<TGenerics>
  renderCell: () => string | null | TGenerics['Rendered']
}

export function createCell<TGenerics extends TableGenerics>(
  instance: TableInstance<TGenerics>,
  row: Row<TGenerics>,
  column: Column<TGenerics>,
  columnId: string
) {
  const getRenderValue = () =>
    cell.getValue() ?? instance.options.renderFallbackValue

  const cell: CoreCell<TGenerics> = {
    id: `${row.id}_${column.id}`,
    row,
    column,
    getValue: () => row.getValue(columnId),
    renderCell: () => {
      return column.columnDef.cell
        ? instance._render(column.columnDef.cell, {
            instance,
            column,
            row,
            cell: cell as Cell<TGenerics>,
            getValue: getRenderValue,
          })
        : null
    },
  }

  instance._features.forEach(feature => {
    Object.assign(
      cell,
      feature.createCell?.(
        cell as Cell<TGenerics>,
        column,
        row as Row<TGenerics>,
        instance
      )
    )
  }, {})

  return cell as Cell<TGenerics>
}
