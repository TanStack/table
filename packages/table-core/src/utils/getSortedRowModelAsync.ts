import { TableInstance, Row, RowModel, AnyGenerics } from '../types'
import { SortingFn } from '../features/Sorting'
import { incrementalMemo, memo } from '../utils'

export function getSortedRowModelSync<TGenerics extends AnyGenerics>(opts?: {
  initialSync?: boolean
}): (instance: TableInstance<TGenerics>) => () => RowModel<TGenerics> {
  return instance =>
    incrementalMemo(
      () => [instance.getState().sorting, instance.getGlobalFilteredRowModel()],
      (_sorting, rowModel): RowModel<TGenerics> => {
        return {
          rows: rowModel.rows.slice(),
          flatRows: [],
          rowsById: rowModel.rowsById,
        }
      },
      (sorting, rowModel) => rowModelRef => scheduleTask => {
        // TODO: Figure out how to do async sorting
        // We probably need to use a sorting algo that is "divide and
        // conquer", since that will probably distribute the easiest into
        // separate tasks.  The trick will be batching those tasks in a way
        // that makes them fast. JS work loops don't tend to do well with
        // a high number of tasks that do one thing. Instead, shoot for each
        // task to have a few thousand opts (or whatever amount is generally
        // fast for most devices).

        throw new Error()

        // if (!rowModel.rows.length || !sorting?.length) {
        //   rowModelRef.current = rowModel
        //   return
        // }

        // const sortingState = instance.getState().sorting

        // const sortedFlatRows: Row<TGenerics>[] = []

        // // Filter out sortings that correspond to non existing columns
        // const availableSorting = sortingState.filter(sort =>
        //   instance.getColumnCanSort(sort.id)
        // )

        // const sorters = availableSorting.map(columnSorting => {
        //   const column = instance.getColumn(columnSorting.id)!
        //   const sortingFn = instance.getColumnSortingFn(columnSorting.id)!

        //   return {
        //     id: columnSorting.id,
        //     compare: (rowA: Row<TGenerics>, rowB: Row<TGenerics>) =>
        //       sortingFn(rowA, rowB, columnSorting.id),
        //     desc: columnSorting.desc,
        //     invertSorting: column.invertSorting,
        //     sortUndefined: column.sortUndefined,
        //   }
        // })

        // const sortData = (rows: Row<TGenerics>[]) => {
        //   // This will also perform a stable sorting using the row index
        //   // if needed.

        //   const sortedData = quicksort(rows, sorters)

        //   // If there are sub-rows, sort them
        //   sortedData.forEach(row => {
        //     rowModelRef.current.flatRows.push(row)
        //     if (!row.subRows || row.subRows.length <= 1) {
        //       return
        //     }
        //     row.subRows = sortData(row.subRows)
        //   })

        //   return sortedData
        // }

        // sortData(rowModelRef.current.rows)
      },
      {
        key: 'getSortedRowModel',
        initialSync: opts?.initialSync,
        onProgress: progress => {
          instance.setState(old => ({ ...old, sortingProgress: progress }))
        },
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
        onChange: () => {
          instance._notifyGroupingReset()
        },
      }
    )
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
