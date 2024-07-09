import { _createRow } from '../rows/createRow'
import { getMemoOptions, memo } from '../../utils'
import { table_getRowId } from '../rows/Rows.utils'
import type { Row, RowData, RowModel, Table } from '../../types'

export function createCoreRowModel<TData extends RowData>(): (
  table: Table<TData>,
) => () => RowModel<TData> {
  console.log('call create row model')
  return (table: Table<TData>) =>
    memo(
      () => [table.options.data],
      (
        data,
      ): {
        rows: Array<Row<TData>>
        flatRows: Array<Row<TData>>
        rowsById: Record<string, Row<TData>>
      } => {
        console.log('run row model')
        const rowModel: RowModel<TData> = {
          rows: [],
          flatRows: [],
          rowsById: {},
        }

        const accessRows = (
          originalRows: Array<TData>,
          depth = 0,
          parentRow?: Row<TData>,
        ): Array<Row<TData>> => {
          const rows = [] as Array<Row<TData>>

          for (let i = 0; i < originalRows.length; i++) {
            const originalRow = originalRows[i]!
            // Make the row
            const row = _createRow(
              table,
              table_getRowId(originalRow, table, i, parentRow),
              originalRow,
              i,
              depth,
              undefined,
              parentRow?.id,
            )

            // Keep track of every row in a flat array
            rowModel.flatRows.push(row)
            // Also keep track of every row by its ID
            rowModel.rowsById[row.id] = row
            // Push table row into parent
            rows.push(row)

            // Get the original subrows
            if (table.options.getSubRows) {
              row.originalSubRows = table.options.getSubRows(originalRow, i)

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
      getMemoOptions(table.options, 'debugTable', 'getRowModel', () =>
        table._autoResetPageIndex(),
      ),
    )
}
