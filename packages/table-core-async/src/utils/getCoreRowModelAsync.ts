import type {
  Row,
  RowModel,
  TableGenerics,
  TableInstance,
} from '@tanstack/react-table'

import { incrementalMemo } from '../utils'

export function getCoreRowModelWorker<TGenerics extends TableGenerics>(opts?: {
  keepPreviousData?: boolean
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
      () => async data => {
        console.info('progress', 0)

        const rowModel: RowModel<TGenerics> = {
          rows: [],
          flatRows: [],
          rowsById: {},
        }

        let id
        let rows
        let row
        let originalRow
        let originalSubRows

        const accessRows = (
          originalRows: TGenerics['Row'][],
          depth = 0,
          parent?: Row<TGenerics>
        ): Row<TGenerics>[] => {
          rows = []

          for (let i = 0; i < originalRows.length; i++) {
            if (i % 100 === 0) {
              console.info('progress', i / originalRows.length)
            }
            originalRow = originalRows[i]
            id = instance.getRowId(originalRow, i, parent)

            if (!id) {
              if (process.env.NODE_ENV !== 'production') {
                throw new Error(`getRowId expected an ID, but got ${id}`)
              }
            }

            // Make the row
            row = instance.createRow(id, originalRow, i, depth)

            // Keep track of every row in a flat array
            rowModel.flatRows.push(row)
            // Also keep track of every row by its ID
            rowModel.rowsById[id] = row
            // Push instance row into parent
            rows.push(row)

            // Get the original subrows
            if (instance.options.getSubRows) {
              originalSubRows = instance.options.getSubRows(originalRow, i)

              // Then recursively access them
              if (originalSubRows?.length) {
                row.originalSubRows = originalSubRows
                row.subRows = accessRows(row.originalSubRows, depth + 1, row)
              }
            }
          }

          return rows
        }

        rowModel.rows = accessRows(data)

        console.info('progress', 1)

        return rowModel
      },
      {
        // priority: 'data',
        keepPrevious: () => opts?.keepPreviousData,
        instance,
        key: process.env.NODE_ENV === 'development' && 'getCoreRowModelAsync',
        onChange: () => {
          console.info('progress', 0)
          instance.setState(old => ({ ...old }))
        },
        onComplete: () => {
          console.info('progress', 0)
          instance._autoResetPageIndex()
          instance.setState(old => ({ ...old }))
        },
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
      }
    )
}
