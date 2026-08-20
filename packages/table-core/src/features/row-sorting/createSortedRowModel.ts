import {
  copyInstancePropertiesWithoutMemos,
  skipFirstRun,
  tableMemo,
} from '../../utils'
import { table_autoResetPageIndex } from '../row-pagination/rowPaginationFeature.utils'
import { column_getCanSort, column_getSortFn } from './rowSortingFeature.utils'
import type { Column_Internal } from '../../types/Column'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Table, Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { SortFn } from './rowSortingFeature.types'
import type { RowData } from '../../types/type-utils'

/**
 * Creates a memoized sorted row model factory.
 *
 * The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.
 *
 * Register the sorting functions you use with the `sortFns` slot on the
 * `features` option:
 * `tableFeatures({ rowSortingFeature, sortedRowModel: createSortedRowModel(), sortFns: { alphanumeric: sortFn_alphanumeric } })`.
 * Importing individual `sortFn_*` functions keeps unused built-ins out of
 * your bundle; sorting functions passed directly to the `sortFn` column
 * option need no registration at all.
 */
export function createSortedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): (table: Table<TFeatures, TData>) => () => RowModel<TFeatures, TData> {
  return (_table) => {
    const table = _table as unknown as Table_Internal<TFeatures, TData>
    return tableMemo({
      feature: 'rowSortingFeature',
      table,
      fnName: 'table.getSortedRowModel',
      memoDeps: () => [
        table.atoms.sorting?.get(),
        table.getPreSortedRowModel(),
      ],
      fn: () => _createSortedRowModel(table),
      onAfterUpdate: skipFirstRun(() => table_autoResetPageIndex(table)),
    })
  }
}

function _createSortedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  const preSortedRowModel = table.getPreSortedRowModel()
  const sorting = table.atoms.sorting?.get()

  if (!preSortedRowModel.rows.length || !sorting?.length) {
    return preSortedRowModel
  }

  const sortedFlatRows: Array<Row<TFeatures, TData>> = []

  // Filter out sortings that correspond to non existing columns
  const availableSorting = sorting.filter((sort) => {
    const column = table.getColumn(sort.id)
    return column ? column_getCanSort(column) : false
  })

  if (!availableSorting.length) {
    return preSortedRowModel
  }

  const resolvedSorting: Array<{
    id: string
    desc?: boolean
    sortUndefined?: false | -1 | 1 | 'first' | 'last'
    invertSorting?: boolean
    sortFn: SortFn<TFeatures, TData>
  }> = []

  for (let i = 0; i < availableSorting.length; i++) {
    const sortEntry = availableSorting[i]!
    const column: Column_Internal<TFeatures, TData> | undefined =
      table.getColumn(sortEntry.id)
    if (!column) {
      continue
    }

    resolvedSorting.push({
      id: sortEntry.id,
      desc: sortEntry.desc,
      sortUndefined: column.columnDef.sortUndefined,
      invertSorting: column.columnDef.invertSorting,
      sortFn: column_getSortFn(column),
    })
  }

  const compareRows = (
    rowA: Row<TFeatures, TData>,
    rowB: Row<TFeatures, TData>,
  ) => {
    for (let i = 0; i < resolvedSorting.length; i++) {
      const sortEntry = resolvedSorting[i]!
      const sortUndefined = sortEntry.sortUndefined
      const isDesc = sortEntry.desc

      let sortInt = 0

      // All sorting ints should always return in ascending order
      if (sortUndefined) {
        const aValue = rowA.getValue(sortEntry.id)
        const bValue = rowB.getValue(sortEntry.id)

        const aUndefined = aValue === undefined
        const bUndefined = bValue === undefined

        if (aUndefined && bUndefined) {
          continue
        }

        if (aUndefined || bUndefined) {
          if (sortUndefined === 'first') return aUndefined ? -1 : 1
          if (sortUndefined === 'last') return aUndefined ? 1 : -1
          sortInt = aUndefined ? sortUndefined : -sortUndefined
        }
      }

      if (sortInt === 0) {
        sortInt = sortEntry.sortFn(rowA, rowB, sortEntry.id)
      }

      // If sorting is non-zero, take care of desc and inversion
      if (sortInt !== 0) {
        if (isDesc) {
          sortInt *= -1
        }

        if (sortEntry.invertSorting) {
          sortInt *= -1
        }

        return sortInt
      }
    }

    return rowA.index - rowB.index
  }

  const sortData = (
    rows: Array<Row<TFeatures, TData>>,
  ): {
    rows: Array<Row<TFeatures, TData>>
    changed: boolean
  } => {
    const sortedData = rows.slice()

    sortedData.sort(compareRows)
    let changed = false

    // If there are sub-rows, sort them. Clone only rows that need mutation
    // (i.e. have subRows) so we don't corrupt the source row model.
    for (let i = 0; i < sortedData.length; i++) {
      const row = sortedData[i]!
      if (row !== rows[i]) {
        changed = true
      }

      // Take this row's slot before descending, so a parent stays ahead of
      // its own sub-rows in flatRows.
      const flatIndex = sortedFlatRows.length
      sortedFlatRows.push(row)

      if (row.subRows.length) {
        const sortedSubRows = sortData(row.subRows)

        if (sortedSubRows.changed) {
          // Preserve prototype chain so methods like getValue() remain accessible
          const cloned = Object.create(Object.getPrototypeOf(row))
          copyInstancePropertiesWithoutMemos(cloned, row)
          cloned.subRows = sortedSubRows.rows
          sortedData[i] = cloned
          sortedFlatRows[flatIndex] = cloned
          changed = true
        }
      }
    }

    return { rows: sortedData, changed }
  }

  return {
    rows: sortData(preSortedRowModel.rows).rows,
    flatRows: sortedFlatRows,
    rowsById: preSortedRowModel.rowsById,
  }
}
