import { TableInstance, Row, RowModel, AnyGenerics } from '../types'
import { getBatchGroups, incrementalMemo } from '../utils'

export function getCoreRowModelAsync<TGenerics extends AnyGenerics>(opts?: {
  initialSync: boolean
}): (instance: TableInstance<TGenerics>) => () => RowModel<TGenerics> {
  return instance =>
    incrementalMemo(
      () => [instance.options.data, instance.getAllLeafColumns()],
      () => {
        const rows: Row<TGenerics>[] = []
        const flatRows: Row<TGenerics>[] = []
        const rowsById: Record<string, Row<TGenerics>> = {}

        return { rows, flatRows, rowsById }
      },
      (data, leafColumns) => rowModelRef => scheduleTask => {
        const accessRows = (
          originalRows: TGenerics['Row'][],
          depth = 0,
          parent?: Row<TGenerics>
        ) => {
          const batchGroups = getBatchGroups(originalRows, 2000)

          for (let i = 0; i < batchGroups.length; i++) {
            const batchGroup = batchGroups[i]
            scheduleTask(() => {
              for (let i = 0; i < batchGroup.items.length; i++) {
                const originalRow = batchGroup.items[i]
                const rowIndex = batchGroup.start + i
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
                if (parent) {
                  parent.subRows.push(row)
                } else {
                  rowModelRef.current.rows.push(row)
                }
                // Keep track of every row in a flat array
                rowModelRef.current.flatRows.push(row)
                // Also keep track of every row by its ID
                rowModelRef.current.rowsById[id] = row

                // Get the original subrows
                if (instance.options.getSubRows) {
                  const originalSubRows = instance.options.getSubRows(
                    originalRow,
                    rowIndex
                  )

                  // Then recursively access them
                  if (originalSubRows?.length) {
                    row.originalSubRows = originalSubRows
                    row.subRows = []

                    accessRows(row.originalSubRows, depth + 1, row)
                  }
                }
              }
            })
          }
        }

        accessRows(data)
      },
      {
        key: 'getRowModel',
        initialSync: opts?.initialSync,
        onProgress: progress => {
          instance.setState(old => ({ ...old, coreProgress: progress }))
        },
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
        onChange: () => {
          instance._notifyFiltersReset()
          instance._notifyRowSelectionReset()
        },
      }
    )
}
