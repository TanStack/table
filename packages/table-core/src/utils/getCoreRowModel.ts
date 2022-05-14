import { TableInstance, Row, RowModel, TableGenerics } from '../types'
import { memo } from '../utils'

export function getCoreRowModel<TGenerics extends TableGenerics>(): (
  instance: TableInstance<TGenerics>
) => () => RowModel<TGenerics> {
  return instance =>
    memo(
      () => [instance.options.data],
      (
        data
      ): {
        rows: Row<TGenerics>[]
        flatRows: Row<TGenerics>[]
        rowsById: Record<string, Row<TGenerics>>
      } => {
        const rowModel: RowModel<TGenerics> = {
          rows: [],
          flatRows: [],
          rowsById: {},
        }

        let rows
        let row
        let originalRow

        const accessRows = (
          originalRows: TGenerics['Row'][],
          depth = 0,
          parent?: Row<TGenerics>
        ): Row<TGenerics>[] => {
          rows = []

          for (let i = 0; i < originalRows.length; i++) {
            originalRow = originalRows[i]

            // This could be an expensive check at scale, so we should move it somewhere else, but where?
            // if (!id) {
            //   if (process.env.NODE_ENV !== 'production') {
            //     throw new Error(`getRowId expected an ID, but got ${id}`)
            //   }
            // }

            // Make the row
            row = instance.createRow(
              instance.getRowId(originalRow, i, parent),
              originalRow,
              i,
              depth
            )

            // Keep track of every row in a flat array
            rowModel.flatRows.push(row)
            // Also keep track of every row by its ID
            rowModel.rowsById[row.id] = row
            // Push instance row into parent
            rows.push(row)

            // Get the original subrows
            if (instance.options.getSubRows) {
              row.originalSubRows = instance.options.getSubRows(originalRow, i)

              // Then recursively access them
              if (row.originalSubRows?.length) {
                row.subRows = accessRows(row.originalSubRows, depth + 1, row)
              }
            }
          }

          return rows
        }

        rowModel.rows = accessRows(data)

        return rowModel
      },
      {
        key: process.env.NODE_ENV === 'development' && 'getRowModel',
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
        onChange: () => {
          instance._autoResetPageIndex()
        },
      }
    )
}
