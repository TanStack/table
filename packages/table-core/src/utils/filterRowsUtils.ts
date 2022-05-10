import { TableGenerics, Row, RowModel, TableInstance } from '../types'

export function filterRows<TGenerics extends TableGenerics>(
  rows: Row<TGenerics>[],
  filterRowImpl: (row: Row<TGenerics>[]) => Row<TGenerics>[],
  instance: TableInstance<TGenerics>
) {
  if (instance.options.filterFromLeafRows) {
    return filterRowModelFromLeafs(rows, filterRowImpl, instance)
  }

  return filterRowModelFromRoot(rows, filterRowImpl, instance)
}

export function filterRowModelFromLeafs<TGenerics extends TableGenerics>(
  rowsToFilter: Row<TGenerics>[],
  filterRows: (
    rowsToFilter: Row<TGenerics>[],
    depth: number
  ) => Row<TGenerics>[],
  instance: TableInstance<TGenerics>
): RowModel<TGenerics> {
  const newFilteredFlatRows: Row<TGenerics>[] = []
  const newFilteredRowsById: Record<string, Row<TGenerics>> = {}

  let row
  let newRow

  const recurseFilterRows = (rowsToFilter: Row<TGenerics>[], depth = 0) => {
    rowsToFilter = rowsToFilter.slice()

    // Filter from children up first
    for (let i = 0; i < rowsToFilter.length; i++) {
      row = rowsToFilter[i]!

      if (!row.subRows?.length) {
        continue
      }

      newRow = instance.createRow(row.id, row.original, row.index, row.depth)

      newRow.columnFilterMap = row.columnFilterMap

      newRow.subRows = recurseFilterRows(row.subRows, depth + 1)

      if (!newRow.subRows.length) {
        rowsToFilter.splice(i, 1)
        i--
      }

      rowsToFilter[i] = newRow
    }

    rowsToFilter = filterRows(rowsToFilter, depth)

    // Apply the filter to any subRows
    rowsToFilter.forEach(row => {
      newFilteredFlatRows.push(row)
      newFilteredRowsById[row.id] = row
    })

    return rowsToFilter
  }

  return {
    rows: recurseFilterRows(rowsToFilter),
    flatRows: newFilteredFlatRows,
    rowsById: newFilteredRowsById,
  }
}

export function filterRowModelFromRoot<TGenerics extends TableGenerics>(
  rowsToFilter: Row<TGenerics>[],
  filterRows: (rowsToFilter: Row<TGenerics>[]) => Row<TGenerics>[],
  instance: TableInstance<TGenerics>
): RowModel<TGenerics> {
  const newFilteredFlatRows: Row<TGenerics>[] = []
  const newFilteredRowsById: Record<string, Row<TGenerics>> = {}

  let row
  let newRow

  // Filters top level and nested rows
  const recurseFilterRows = (rowsToFilter: Row<TGenerics>[], depth = 0) => {
    // Filter from parents downward first
    rowsToFilter = filterRows(rowsToFilter)

    // Apply the filter to any subRows
    for (let i = 0; i < rowsToFilter.length; i++) {
      row = rowsToFilter[i]!

      newFilteredFlatRows.push(row)
      newFilteredRowsById[row.id] = row

      if (!row.subRows?.length) {
        rowsToFilter.splice(i, 1)
        i--
        continue
      }

      newRow = instance.createRow(row.id, row.original, row.index, row.depth)
      newRow.subRows = recurseFilterRows(row.subRows, depth + 1)
      rowsToFilter[i] = newRow
    }

    return rowsToFilter
  }

  return {
    rows: recurseFilterRows(rowsToFilter),
    flatRows: newFilteredFlatRows,
    rowsById: newFilteredRowsById,
  }
}
