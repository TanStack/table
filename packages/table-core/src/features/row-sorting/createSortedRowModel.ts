import { tableMemo } from '../../utils'
import { table_autoResetPageIndex } from '../row-pagination/rowPaginationFeature.utils'
import { column_getCanSort, column_getSortFn } from './rowSortingFeature.utils'
import type { Column_Internal } from '../../types/Column'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { SortFn, SortFns } from './rowSortingFeature.types'
import type { RowData } from '../../types/type-utils'

export function createSortedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  sortFns: Record<keyof SortFns, SortFn<TFeatures, TData>>,
): (
  table: Table_Internal<TFeatures, TData>,
) => () => RowModel<TFeatures, TData> {
  return (table) => {
    if (!table._rowModelFns.sortFns) table._rowModelFns.sortFns = sortFns
    return tableMemo({
      feature: 'rowSortingFeature',
      table,
      fnName: 'table.getSortedRowModel',
      memoDeps: () => [
        table.options.state?.sorting,
        table.getPreSortedRowModel(),
      ],
      fn: () => _createSortedRowModel(table),
      onAfterUpdate: () => table_autoResetPageIndex(table),
    })
  }
}

function _createSortedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  const preSortedRowModel = table.getPreSortedRowModel()
  const sorting = table.options.state?.sorting

  if (!preSortedRowModel.rows.length || !sorting?.length) {
    return preSortedRowModel
  }

  const sortedFlatRows: Array<Row<TFeatures, TData>> = []

  // Filter out sortings that correspond to non existing columns
  const availableSorting = sorting.filter((sort) =>
    column_getCanSort(
      table.getColumn(sort.id) as Column_Internal<TFeatures, TData>,
    ),
  )

  const columnInfoById: Record<
    string,
    {
      sortUndefined?: false | -1 | 1 | 'first' | 'last'
      invertSorting?: boolean
      sortFn: SortFn<TFeatures, TData>
    }
  > = {}

  availableSorting.forEach((sortEntry) => {
    const column = table.getColumn(sortEntry.id) as
      | Column_Internal<TFeatures, TData>
      | undefined
    if (!column) return

    columnInfoById[sortEntry.id] = {
      sortUndefined: column.columnDef.sortUndefined,
      invertSorting: column.columnDef.invertSorting,
      sortFn: column_getSortFn(column),
    }
  })

  const sortData = (rows: Array<Row<TFeatures, TData>>) => {
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
          sortInt = columnInfo.sortFn(rowA, rowB, sortEntry.id)
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
