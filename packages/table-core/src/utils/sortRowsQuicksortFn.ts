import { TableInstance, Row, RowModel, AnyGenerics } from '../types'
import { SortingFn } from '../features/Sorting'

export function sortRowsFn<TGenerics extends AnyGenerics>(
  instance: TableInstance<TGenerics>,
  rowModel: RowModel<TGenerics>
): RowModel<TGenerics> {
  // window.tanner = []

  const sortingState = instance.getState().sorting

  const sortedFlatRows: Row<TGenerics>[] = []

  // Filter out sortings that correspond to non existing columns
  const availableSorting = sortingState.filter(sort =>
    instance.getColumnCanSort(sort.id)
  )

  const sorters = availableSorting.map(columnSorting => {
    const column = instance.getColumn(columnSorting.id)!
    const sortingFn = instance.getColumnSortingFn(columnSorting.id)!

    return {
      id: columnSorting.id,
      compare: (rowA: Row<TGenerics>, rowB: Row<TGenerics>) =>
        sortingFn(rowA, rowB, columnSorting.id),
      desc: columnSorting.desc,
      invertSorting: column.invertSorting,
      sortUndefined: column.sortUndefined,
    }
  })

  const sortData = (rows: Row<TGenerics>[]) => {
    // This will also perform a stable sorting using the row index
    // if needed.

    const sortedData = quicksort(rows, sorters)

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

type Sorter<TGenerics extends AnyGenerics> = {
  id: string
  compare: (a: Row<TGenerics>, b: Row<TGenerics>) => number
  desc?: boolean
  sortUndefined?: false | -1 | 1
  invertSorting?: boolean
}

export function quicksort<TGenerics extends AnyGenerics>(
  rows: Row<TGenerics>[],
  sorters: Sorter<TGenerics>[]
): Row<TGenerics>[] {
  if (!rows.length) {
    return rows
  }

  // Copy the rows so we can mutate the order
  rows = rows.slice()

  // Start the quicksort recursion
  recurse(0, rows.length - 1)

  // Return the rows
  return rows

  function recurse(start: number, end: number) {
    const pivotIndex = pivot(start, end)

    if (start < pivotIndex - 1) {
      recurse(start, pivotIndex - 1)
    }

    if (pivotIndex < end) {
      recurse(pivotIndex + 1, end)
    }
  }

  function pivot(start: number, end: number) {
    const pivotIndex = Math.floor((start + end) / 2)
    let i = start
    let j = end

    const compare = (a: number, b: number) => {
      const rowA = rows[a]
      const rowB = rows[b]

      for (let i = 0; i < sorters.length; i += 1) {
        const sorter = sorters[i]!
        const isDesc = sorter?.desc ?? false

        if (sorter.sortUndefined) {
          const aValue = rowA.values[sorter.id]
          const bValue = rowB.values[sorter.id]

          const aUndefined = typeof aValue === 'undefined'
          const bUndefined = typeof bValue === 'undefined'

          if (aUndefined || bUndefined) {
            if (aUndefined !== bUndefined) {
              return aUndefined ? sorter.sortUndefined : -sorter.sortUndefined
            }
          }
        }

        // This function should always return in ascending order
        let sortInt = sorter.compare(rowA, rowB)

        if (i > 0) {
          // window.tanner.push([
          //   sorter.id,
          //   rowA.values[sorter.id],
          //   rowB.values[sorter.id],
          //   sortInt,
          // ])
        }

        if (sortInt !== 0) {
          if (isDesc) {
            sortInt *= -1
          }

          if (sorter.invertSorting) {
            sortInt *= -1
          }

          return sortInt
        }
      }

      return rowA.index < rowB.index ? -1 : 1
    }

    while (i <= j) {
      while (compare(i, pivotIndex) < 0) {
        i++
      }

      while (compare(pivotIndex, j) < 0) {
        j--
      }

      if (i <= j) {
        swap(rows, i, j)
        i++
        j--
      }
    }

    return i
  }

  function swap<T>(arr: T[], a: number, b: number) {
    const t = arr[a]
    arr[a] = arr[b]
    arr[b] = t
  }
}
