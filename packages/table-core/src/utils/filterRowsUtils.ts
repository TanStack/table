import { TableGenerics, Row, RowModel, TableInstance } from '../types'

export function filterRows<TGenerics extends TableGenerics>(
  rows: Row<TGenerics>[],
  filterRowImpl: (row: Row<TGenerics>) => any,
  instance: TableInstance<TGenerics>
) {
  if (instance.options.filterFromLeafRows) {
    return filterRowModelFromLeafs(rows, filterRowImpl, instance)
  }

  return filterRowModelFromRoot(rows, filterRowImpl, instance)
}

export function filterRowModelFromLeafs<TGenerics extends TableGenerics>(
  rowsToFilter: Row<TGenerics>[],
  filterRow: (row: Row<TGenerics>) => Row<TGenerics>[],
  instance: TableInstance<TGenerics>
): RowModel<TGenerics> {
  const newFilteredFlatRows: Row<TGenerics>[] = []
  const newFilteredRowsById: Record<string, Row<TGenerics>> = {}

  let row
  let newRow

  const recurseFilterRows = (rowsToFilter: Row<TGenerics>[], depth = 0) => {
    const rows: Row<TGenerics>[] = []

    // Filter from children up first
    for (let i = 0; i < rowsToFilter.length; i++) {
      row = rowsToFilter[i]!

      if (row.subRows?.length) {
        newRow = instance.createRow(row.id, row.original, row.index, row.depth)
        newRow.columnFilters = row.columnFilters
        newRow.subRows = recurseFilterRows(row.subRows, depth + 1)
        if (!newRow.subRows.length) {
          continue
        }
        row = newRow
      }

      if (filterRow(row)) {
        rows.push(row)
        newFilteredRowsById[row.id] = row
        newFilteredRowsById[i] = row
      }
    }

    return rows
  }

  return {
    rows: recurseFilterRows(rowsToFilter),
    flatRows: newFilteredFlatRows,
    rowsById: newFilteredRowsById,
  }
}

export function filterRowModelFromRoot<TGenerics extends TableGenerics>(
  rowsToFilter: Row<TGenerics>[],
  filterRow: (row: Row<TGenerics>) => any,
  instance: TableInstance<TGenerics>
): RowModel<TGenerics> {
  const newFilteredFlatRows: Row<TGenerics>[] = []
  const newFilteredRowsById: Record<string, Row<TGenerics>> = {}

  let rows
  let row
  let newRow

  // Filters top level and nested rows
  const recurseFilterRows = (rowsToFilter: Row<TGenerics>[], depth = 0) => {
    // Filter from parents downward first

    rows = []

    // Apply the filter to any subRows
    for (let i = 0; i < rowsToFilter.length; i++) {
      row = rowsToFilter[i]!

      const pass = filterRow(row)

      if (pass) {
        if (row.subRows?.length) {
          newRow = instance.createRow(
            row.id,
            row.original,
            row.index,
            row.depth
          )
          newRow.subRows = recurseFilterRows(row.subRows, depth + 1)
          row = newRow
        }

        rows.push(row)
        newFilteredFlatRows.push(row)
        newFilteredRowsById[row.id] = row
      }
    }

    return rows
  }

  return {
    rows: recurseFilterRows(rowsToFilter),
    flatRows: newFilteredFlatRows,
    rowsById: newFilteredRowsById,
  }
}
