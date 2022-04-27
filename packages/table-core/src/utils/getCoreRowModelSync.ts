import { TableInstance, Row, RowModel, AnyGenerics } from '../types'
import { memo } from '../utils'

export function getCoreRowModelSync<TGenerics extends AnyGenerics>(): (
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
        // Access the row model using initial columns
        const rows: Row<TGenerics>[] = []
        const flatRows: Row<TGenerics>[] = []
        const rowsById: Record<string, Row<TGenerics>> = {}

        const leafColumns = instance.getAllLeafColumns()

        const accessRow = (
          originalRow: TGenerics['Row'],
          rowIndex: number,
          depth = 0,
          parentRows: Row<TGenerics>[],
          parent?: Row<TGenerics>
        ) => {
          const id = instance.getRowId(originalRow, rowIndex, parent)

          if (!id) {
            if (process.env.NODE_ENV !== 'production') {
              throw new Error(`getRowId expected an ID, but got ${id}`)
            }
          }

          const values: Record<string, any> = {}

          for (let i = 0; i < leafColumns.length; i++) {
            const column = leafColumns[i]
            if (column && column.accessorFn) {
              values[column.id] = column.accessorFn(originalRow, rowIndex)
            }
          }

          // Make the row
          const row = instance.createRow(
            id,
            originalRow,
            rowIndex,
            depth,
            values
          )

          // Push instance row into the parentRows array
          parentRows.push(row)
          // Keep track of every row in a flat array
          flatRows.push(row)
          // Also keep track of every row by its ID
          rowsById[id] = row

          // Get the original subrows
          if (instance.options.getSubRows) {
            const originalSubRows = instance.options.getSubRows(
              originalRow,
              rowIndex
            )

            // Then recursively access them
            if (originalSubRows?.length) {
              row.originalSubRows = originalSubRows
              const subRows: Row<TGenerics>[] = []

              for (let i = 0; i < row.originalSubRows.length; i++) {
                accessRow(
                  row.originalSubRows[i] as TGenerics['Row'],
                  i,
                  depth + 1,
                  subRows,
                  row
                )
              }
              row.subRows = subRows
            }
          }
        }

        for (let i = 0; i < data.length; i++) {
          accessRow(data[i] as TGenerics['Row'], i, 0, rows)
        }

        return { rows, flatRows, rowsById }
      },
      {
        key: 'getRowModel',
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
        onChange: () => {
          instance.queue(() => {
            instance.queueResetFilters()
            instance.queueResetRowSelection()
          })
        },
      }
    )
}
