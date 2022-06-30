import { createRow } from '../core/row'
import { Table, Row, RowModel, TableGenerics, RowData } from '../types'
import { memo } from '../utils'

export function getCoreRowModel<TData extends RowData>(): (
  instance: Table<TData>
) => () => RowModel<TData> {
  return instance =>
    memo(
      () => [instance.options.data],
      (
        data
      ): {
        rows: Row<TData>[]
        flatRows: Row<TData>[]
        rowsById: Record<string, Row<TData>>
      } => {
        const rowModel: RowModel<TData> = {
          rows: [],
          flatRows: [],
          rowsById: {},
        }

        const accessRows = (
          originalRows: TData[],
          depth = 0,
          parent?: Row<TData>
        ): Row<TData>[] => {
          const rows = [] as Row<TData>[]

          for (let i = 0; i < originalRows.length; i++) {
            // This could be an expensive check at scale, so we should move it somewhere else, but where?
            // if (!id) {
            //   if (process.env.NODE_ENV !== 'production') {
            //     throw new Error(`getRowId expected an ID, but got ${id}`)
            //   }
            // }

            // Make the row
            const row = createRow(
              instance,
              instance._getRowId(originalRows[i]!, i, parent),
              originalRows[i],
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
              row.originalSubRows = instance.options.getSubRows(
                originalRows[i]!,
                i
              )

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
