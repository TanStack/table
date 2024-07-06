import { getMemoOptions, memo } from '../../utils'
import type { SortingFn } from './RowSorting.types'
import type { Row, RowData, RowModel, Table } from '../../types'

export function getSortedRowModel<TData extends RowData>(): (
  table: Table<TData>,
) => () => RowModel<TData> {
  return (table) =>
    memo(
      () => [table.getState().sorting, table.getPreSortedRowModel()],
      (sorting, rowModel) => {
        if (!rowModel.rows.length || !sorting.length) {
          return rowModel
        }

        const sortingState = table.getState().sorting

        const sortedFlatRows: Array<Row<TData>> = []

        // Filter out sortings that correspond to non existing columns
        const availableSorting = sortingState.filter((sort) =>
          table.getColumn(sort.id)?.getCanSort(),
        )

        const columnInfoById: Record<
          string,
          {
            sortUndefined?: false | -1 | 1 | 'first' | 'last'
            invertSorting?: boolean
            sortingFn: SortingFn<TData>
          }
        > = {}

        availableSorting.forEach((sortEntry) => {
          const column = table.getColumn(sortEntry.id)
          if (!column) return

          columnInfoById[sortEntry.id] = {
            sortUndefined: column.columnDef.sortUndefined,
            invertSorting: column.columnDef.invertSorting,
            sortingFn: column.getSortingFn(),
          }
        })

        const sortData = (rows: Array<Row<TData>>) => {
          // This will also perform a stable sorting using the row index
          // if needed.
          const sortedData = rows.map((row) => ({ ...row }))

          sortedData.sort((rowA, rowB) => {
            for (const sortEntry of availableSorting) {
              const columnInfo = columnInfoById[sortEntry.id]!
              const sortUndefined = columnInfo.sortUndefined
              const isDesc = sortEntry.desc

              let sortInt = 0

              // All sorting ints should always return in ascending order
              if (sortUndefined) {
                const aValue = rowA.getValue(sortEntry.id)
                const bValue = rowB.getValue(sortEntry.id)

                const aUndefined = aValue === undefined
                const bUndefined = bValue === undefined

                if (aUndefined || bUndefined) {
                  if (sortUndefined === 'first') return aUndefined ? -1 : 1
                  if (sortUndefined === 'last') return aUndefined ? 1 : -1
                  sortInt =
                    aUndefined && bUndefined
                      ? 0
                      : aUndefined
                        ? sortUndefined
                        : -sortUndefined
                }
              }

              if (sortInt === 0) {
                sortInt = columnInfo.sortingFn(rowA, rowB, sortEntry.id)
              }

              // If sorting is non-zero, take care of desc and inversion
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
          sortedData.forEach((row) => {
            sortedFlatRows.push(row)
            if (row.subRows.length) {
              row.subRows = sortData(row.subRows)
            }
          })

          return sortedData
        }

        return {
          rows: sortData(rowModel.rows),
          flatRows: sortedFlatRows,
          rowsById: rowModel.rowsById,
        }
      },
      getMemoOptions(table.options, 'debugTable', 'getSortedRowModel', () =>
        table._autoResetPageIndex(),
      ),
    )
}
