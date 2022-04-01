import { AnyGenerics, TableInstance, Row, RowModel } from '../types'

export function columnFilterRowsFn<TGenerics extends AnyGenerics>(
  instance: TableInstance<TGenerics>,
  rowModel: RowModel<TGenerics>
): RowModel<TGenerics> {
  const columnFilters = instance.getState().columnFilters

  const newFilteredFlatRows: Row<TGenerics>[] = []
  const newFilteredRowsById: Record<string, Row<TGenerics>> = {}

  const filterFromChildrenUp = instance.options.filterFromChildrenUp

  const filterRows = (rowsToFilter: Row<TGenerics>[], depth: number) => {
    columnFilters.forEach(({ id: columnId, value: filterValue }) => {
      // Find the columnFilters column
      const column = instance.getColumn(columnId)

      if (!column) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`Table: Could not find a column with id: ${columnId}`)
        }
        throw new Error()
      }

      if (depth === 0) {
        const preFilteredRows = [...rowsToFilter]
        column.getPreFilteredRows = () => preFilteredRows
      }

      const filterFn = instance.getColumnFilterFn(column.id)

      if (!filterFn) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            `Could not find a valid 'column.filterType' for column with the ID: ${column.id}.`
          )
        }
        return
      }

      // Pass the rows, id, filterValue and column to the filterFn
      // to get the filtered rows back
      rowsToFilter = filterFn(rowsToFilter, [columnId], filterValue)
    })

    return rowsToFilter
  }

  if (filterFromChildrenUp) {
    const recurseFilterRows = (rowsToFilter: Row<TGenerics>[], depth = 0) => {
      // Filter from children up
      rowsToFilter = rowsToFilter.filter(row => {
        if (!row.subRows?.length) {
          return true
        }

        row.subRows = recurseFilterRows(row.subRows, depth + 1)

        return row.subRows.length
      })

      rowsToFilter = filterRows(rowsToFilter, depth)

      // Apply the filter to any subRows
      rowsToFilter.forEach(row => {
        newFilteredFlatRows.push(row)
        newFilteredRowsById[row.id] = row
      })

      return rowsToFilter
    }

    return {
      rows: recurseFilterRows(rowModel.rows),
      flatRows: newFilteredFlatRows,
      rowsById: newFilteredRowsById,
    }
  }

  // Filters top level and nested rows
  const recurseFilterRows = (rowsToFilter: Row<TGenerics>[], depth = 0) => {
    // Filter from parents downward
    rowsToFilter = filterRows(rowsToFilter, depth)

    // Apply the filter to any subRows
    // We technically could do this recursively in the above loop,
    // but that would severely hinder the API for the user, since they
    // would be required to do that recursion in some scenarios
    rowsToFilter.forEach(row => {
      newFilteredFlatRows.push(row)
      newFilteredRowsById[row.id] = row

      if (!filterFromChildrenUp) {
        if (!row.subRows?.length) {
          return
        }

        row.subRows = recurseFilterRows(row.subRows, depth + 1)
      }
    })

    return rowsToFilter
  }

  return {
    rows: recurseFilterRows(rowModel.rows),
    flatRows: newFilteredFlatRows,
    rowsById: newFilteredRowsById,
  }
}
