import { ReactTable, Row, RowModel } from '../types'
import { SortingFn, SortingState } from '../features/Sorting'
import { Options } from '../types'

export const sortRowsFn: Options<any, any, {}, {}, {}>['sortRowsFn'] = <
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  sortingState: SortingState,
  rowModel: RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
): RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> => {
  const sortedFlatRows: Row<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[] = []

  // Filter out sortings that correspond to non existing columns
  const availableSorting = sortingState.filter(sort =>
    instance.getColumnCanSort(sort.id)
  )

  const columnInfoById: Record<
    string,
    {
      sortUndefined?: false | -1 | 1
      invertSorting?: boolean
      sortingFn: SortingFn<
        TData,
        TValue,
        TFilterFns,
        TSortingFns,
        TAggregationFns
      >
    }
  > = {}

  availableSorting.forEach(sortEntry => {
    const column = instance.getColumn(sortEntry.id)!

    columnInfoById[sortEntry.id] = {
      sortUndefined: column.sortUndefined,
      invertSorting: column.invertSorting,
      sortingFn: instance.getColumnSortingFn(sortEntry.id)!,
    }
  })

  const sortData = (
    rows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[]
  ) => {
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
            return aUndefined && bUndefined ? 0 : aUndefined ? 1 : -1
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
}
