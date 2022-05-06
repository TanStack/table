import { TableInstance, Row, RowModel, TableGenerics } from '../types'
import { SortingFn } from '../features/Sorting'
import { memo } from '../utils'

export function getSortedRowModelSync<TGenerics extends TableGenerics>(): (
  instance: TableInstance<TGenerics>
) => () => RowModel<TGenerics> {
  return instance =>
    memo(
      () => [instance.getState().sorting, instance.getPreSortedRowModel()],
      (sorting, rowModel) => {
        if (!rowModel.rows.length || !sorting?.length) {
          return rowModel
        }

        const sortingState = instance.getState().sorting

        const sortedFlatRows: Row<TGenerics>[] = []

        // Filter out sortings that correspond to non existing columns
        const availableSorting = sortingState.filter(sort =>
          instance.getColumn(sort.id).getCanSort()
        )

        const columnInfoById: Record<
          string,
          {
            sortUndefined?: false | -1 | 1
            invertSorting?: boolean
            sortingFn: SortingFn<TGenerics>
          }
        > = {}

        availableSorting.forEach(sortEntry => {
          const column = instance.getColumn(sortEntry.id)

          columnInfoById[sortEntry.id] = {
            sortUndefined: column.sortUndefined,
            invertSorting: column.invertSorting,
            sortingFn: column.getSortingFn(),
          }
        })

        const sortData = (rows: Row<TGenerics>[]) => {
          // This will also perform a stable sorting using the row index
          // if needed.
          const sortedData = rows.slice()

          sortedData.sort((rowA, rowB) => {
            for (let i = 0; i < availableSorting.length; i += 1) {
              const sortEntry = availableSorting[i]!
              const columnInfo = columnInfoById[sortEntry.id]!
              const isDesc = sortEntry?.desc ?? false

              if (columnInfo.sortUndefined) {
                const aValue = rowA.values[sortEntry.id]
                const bValue = rowB.values[sortEntry.id]

                const aUndefined = typeof aValue === 'undefined'
                const bUndefined = typeof bValue === 'undefined'

                if (aUndefined || bUndefined) {
                  return aUndefined && bUndefined
                    ? 0
                    : aUndefined
                    ? columnInfo.sortUndefined
                    : -columnInfo.sortUndefined
                }
              }

              // This function should always return in ascending order
              let sortInt = columnInfo.sortingFn(rowA, rowB, sortEntry.id)

              if (sortInt !== 0) {
                if (isDesc) {
                  sortInt *= -1
                }

                if (columnInfo.invertSorting) {
                  sortInt *= -1
                }

                return sortInt
              }
            }

            return rowA.index - rowB.index
          })

          // If there are sub-rows, sort them
          sortedData.forEach(row => {
            sortedFlatRows.push(row)
            if (!row.subRows || row.subRows.length <= 1) {
              return
            }
            row.subRows = sortData(row.subRows)
          })

          return sortedData
        }

        return {
          rows: sortData(rowModel.rows),
          flatRows: sortedFlatRows,
          rowsById: rowModel.rowsById,
        }
      },
      {
        key: process.env.NODE_ENV === 'development' && 'getSortedRowModel',
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
        onChange: () => {
          instance.queue(() => {
            instance._autoResetPageIndex()
          })
        },
      }
    )
}
