import { TableGenerics, Row, RowModel, TableInstance } from '../types'

export function filterRows<TGenerics extends TableGenerics>(
  rows: Row<TGenerics>[],
  columnIds: string[],
  instance: TableInstance<TGenerics>
) {
  const filterRowImpl = (rowsToFilter: Row<TGenerics>[]) => {
    // Horizontally filter rows through each column
    return rowsToFilter.filter(row => {
      for (let i = 0; i < columnIds.length; i++) {
        if (row.columnFilterMap[columnIds[i]] === false) {
          return false
        }
      }
      return true
    })
  }

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

  const recurseFilterRows = (rowsToFilter: Row<TGenerics>[], depth = 0) => {
    rowsToFilter = rowsToFilter.slice()

    // Filter from children up first
    for (let i = 0; i < rowsToFilter.length; i++) {
      const row = rowsToFilter[i]

      if (!row.subRows?.length) {
        continue
      }

      rowsToFilter[i] = instance.createRow(
        row.id,
        row.original,
        row.index,
        row.depth,
        row.values
      )

      rowsToFilter[i].subRows = recurseFilterRows(row.subRows, depth + 1)

      if (!rowsToFilter[i].subRows.length) {
        rowsToFilter.splice(i, 1)
        i--
      }
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
  filterRows: (
    rowsToFilter: Row<TGenerics>[],
    depth: number
  ) => Row<TGenerics>[],
  instance: TableInstance<TGenerics>
): RowModel<TGenerics> {
  const newFilteredFlatRows: Row<TGenerics>[] = []
  const newFilteredRowsById: Record<string, Row<TGenerics>> = {}

  // Filters top level and nested rows
  const recurseFilterRows = (rowsToFilter: Row<TGenerics>[], depth = 0) => {
    // Filter from parents downward first
    rowsToFilter = filterRows(rowsToFilter, depth)

    // Apply the filter to any subRows
    for (let i = 0; i < rowsToFilter.length; i++) {
      const row = rowsToFilter[i]

      newFilteredFlatRows.push(row)
      newFilteredRowsById[row.id] = row

      if (!row.subRows?.length) {
        rowsToFilter.splice(i, 1)
        i--
        continue
      }

      rowsToFilter[i] = instance.createRow(
        row.id,
        row.original,
        row.index,
        row.depth,
        row.values
      )

      rowsToFilter[i].subRows = recurseFilterRows(row.subRows, depth + 1)
    }

    return rowsToFilter
  }

  return {
    rows: recurseFilterRows(rowsToFilter),
    flatRows: newFilteredFlatRows,
    rowsById: newFilteredRowsById,
  }
}
