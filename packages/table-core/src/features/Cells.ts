import {
  Cell,
  TableGenerics,
  TableInstance,
  Row,
  Column,
  CoreCell,
} from '../types'
import { memo } from '../utils'

export type CellsRow<TGenerics extends TableGenerics> = {
  getAllCells: () => Cell<TGenerics>[]
  getAllCellsByColumnId: () => Record<string, Cell<TGenerics>>
}

export type CellsInstance<TGenerics extends TableGenerics> = {
  createCell: (
    row: Row<TGenerics>,
    column: Column<TGenerics>,
    columnId: string
  ) => Cell<TGenerics>
  getCell: (rowId: string, columnId: string) => Cell<TGenerics>
}

//

export const Cells = {
  createRow: <TGenerics extends TableGenerics>(
    row: Row<TGenerics>,
    instance: TableInstance<TGenerics>
  ): CellsRow<TGenerics> => {
    return {
      getAllCells: memo(
        () => [instance.getAllLeafColumns()],
        leafColumns => {
          return leafColumns.map(column => {
            return instance.createCell(row as Row<TGenerics>, column, column.id)
          })
        },
        {
          key: process.env.NODE_ENV === 'development' && 'row.getAllCells',
          debug: () => instance.options.debugAll ?? instance.options.debugRows,
        }
      ),

      getAllCellsByColumnId: memo(
        () => [row.getAllCells()],
        allCells => {
          return allCells.reduce((acc, cell) => {
            acc[cell.columnId] = cell
            return acc
          }, {} as Record<string, Cell<TGenerics>>)
        },
        {
          key:
            process.env.NODE_ENV === 'production' &&
            'row.getAllCellsByColumnId',
          debug: () => instance.options.debugAll ?? instance.options.debugRows,
        }
      ),
    }
  },

  createInstance: <TGenerics extends TableGenerics>(
    instance: TableInstance<TGenerics>
  ): CellsInstance<TGenerics> => {
    return {
      createCell: (row, column, columnId) => {
        const cell: CoreCell<TGenerics> = {
          id: `${row.id}_${column.id}`,
          rowId: row.id,
          columnId,
          row,
          column,
          getValue: () => row.getValue(columnId),
          renderCell: () =>
            column.columnDef.cell
              ? instance._render(column.columnDef.cell, {
                  instance,
                  column,
                  row,
                  cell: cell as Cell<TGenerics>,
                  getValue: cell.getValue,
                })
              : null,
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
      },

      getCell: (rowId: string, columnId: string) => {
        const row = instance.getRow(rowId)

        if (!row) {
          if (process.env.NODE_ENV !== 'production') {
            throw new Error(`[Table] could not find row with id ${rowId}`)
          }
          throw new Error()
        }

        const cell = row.getAllCellsByColumnId()[columnId]

        if (!cell) {
          if (process.env.NODE_ENV !== 'production') {
            throw new Error(
              `[Table] could not find cell ${columnId} in row ${rowId}`
            )
          }
          throw new Error()
        }

        return cell
      },
    }
  },
}
