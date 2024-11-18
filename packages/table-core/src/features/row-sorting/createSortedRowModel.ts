import { isDev, tableMemo } from '../../utils'
import { table_autoResetPageIndex } from '../row-pagination/rowPaginationFeature.utils'
import {
  column_getCanSort,
  column_getSortingFn,
} from './rowSortingFeature.utils'
import type { Column_Internal } from '../../types/Column'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/rowModelsFeature.types'
import type { Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { SortingFn } from './rowSortingFeature.types'

export function createSortedRowModel<TFeatures extends TableFeatures>(): (
  table: Table_Internal<TFeatures, any>,
) => () => RowModel<TFeatures, any> {
  return (table) =>
    tableMemo({
      debug: isDev && (table.options.debugAll ?? table.options.debugTable),
      fnName: 'table.getSortedRowModel',
      memoDeps: () => [
        table.options.state?.sorting,
        table.getPreSortedRowModel(),
      ],
      fn: () => _createSortedRowModel(table),
      onAfterUpdate: () => table_autoResetPageIndex(table),
    })
}

function _createSortedRowModel<TFeatures extends TableFeatures>(
  table: Table_Internal<TFeatures, any>,
): RowModel<TFeatures, any> {
  const preSortedRowModel = table.getPreSortedRowModel()
  const sorting = table.options.state?.sorting

  if (!preSortedRowModel.rows.length || !sorting?.length) {
    return preSortedRowModel
  }

  const sortedFlatRows: Array<Row<TFeatures, any>> = []

  // Filter out sortings that correspond to non existing columns
  const availableSorting = sorting.filter((sort) =>
    column_getCanSort(table.getColumn(sort.id)!),
  )

  const columnInfoById: Record<
    string,
    {
      sortUndefined?: false | -1 | 1 | 'first' | 'last'
      invertSorting?: boolean
      sortingFn: SortingFn<TFeatures, any>
    }
  > = {}

  availableSorting.forEach((sortEntry) => {
    const column = table.getColumn(sortEntry.id) as
      | Column_Internal<TFeatures, any>
      | undefined
    if (!column) return

    columnInfoById[sortEntry.id] = {
      sortUndefined: column.columnDef.sortUndefined,
      invertSorting: column.columnDef.invertSorting,
      sortingFn: column_getSortingFn(column),
    }
  })

  const sortData = (rows: Array<Row<TFeatures, any>>) => {
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
    rows: sortData(preSortedRowModel.rows),
    flatRows: sortedFlatRows,
    rowsById: preSortedRowModel.rowsById,
  }
}
