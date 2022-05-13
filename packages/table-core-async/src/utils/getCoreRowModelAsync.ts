import { TableInstance, Row, RowModel, TableGenerics } from '../types'
import { incrementalMemo, batchReduce } from '../utils'

export function getCoreRowModelAsync<TGenerics extends TableGenerics>(opts?: {
  initialSync: boolean
}): (instance: TableInstance<TGenerics>) => () => RowModel<TGenerics> {
  return instance =>
    incrementalMemo(
      () => [instance.options.data, instance.getAllLeafColumns()],
      () => () =>
        ({
          rows: [],
          flatRows: [],
          rowsById: {},
        } as RowModel<TGenerics>),
      () => (data, leafColumns) => async scheduleTask => {
        const rowModel: RowModel<TGenerics> = {
          rows: [],
          flatRows: [],
          rowsById: {},
        }

        let id
        let values: Record<string, any>
        let column
        let row
        let originalSubRows

        const accessRows = (
          originalRows: TGenerics['Row'][],
          depth = 0,
          parent?: Row<TGenerics>
        ): Promise<Row<TGenerics>[]> => {
          return batchReduce(
            originalRows,
            1000,
            scheduleTask,
            [] as Row<TGenerics>[],
            async (ref, originalRow, rowIndex) => {
              id = instance.getRowId(originalRow, rowIndex, parent)

              if (!id) {
                if (process.env.NODE_ENV !== 'production') {
                  throw new Error(`getRowId expected an ID, but got ${id}`)
                }
              }

              // Make the row
              row = instance.createRow(id, originalRow, rowIndex, depth)

              // Keep track of every row in a flat array
              rowModel.flatRows.push(row)
              // Also keep track of every row by its ID
              rowModel.rowsById[id] = row
              // Push instance row into parent
              ref.current.push(row)

              // Get the original subrows
              if (instance.options.getSubRows) {
                originalSubRows = instance.options.getSubRows(
                  originalRow,
                  rowIndex
                )

                // Then recursively access them
                if (originalSubRows?.length) {
                  row.originalSubRows = originalSubRows
                  row.subRows = await accessRows(
                    row.originalSubRows,
                    depth + 1,
                    row
                  )
                }
              }
            }
          )
        }

        rowModel.rows = await accessRows(data)

        return rowModel
      },
      {
        priority: 'data',
        keepPrevious: () => instance.options.keepPreviousData,
        instance,
        key: process.env.NODE_ENV === 'development' && 'getCoreRowModelAsync',
        onProgress: progress => {
          instance.setState(old => ({ ...old, coreProgress: progress }))
        },
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
        onChange: () => {
          instance._autoResetPageIndex()
        },
      }
    )
}
