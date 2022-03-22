import { ReactTable, Row, RowModel } from '../types'

export function globalFilterRowsFn<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  rowModel: RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
): RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> {
  const globalFilter = instance.getState().globalFilter
  const newFilteredFlatRows: Row<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[] = []
  const newFilteredRowsById: Record<
    string,
    Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  > = {}

  const filterFromChildrenUp = instance.options.filterFromChildrenUp

  const filterFn = instance.getGlobalFilterFn()

  if (!filterFn) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Could not find a valid 'globalFilterType'`)
    }
    return rowModel
  }

  const filterableColumns = instance
    .getAllLeafColumns()
    .filter(column => column.getCanGlobalFilter())

  const filterableColumnIds = filterableColumns.map(d => d.id)

  if (filterFromChildrenUp) {
    const recurseFilterRows = (
      rowsToFilter: Row<
        TData,
        TValue,
        TFilterFns,
        TSortingFns,
        TAggregationFns
      >[],
      depth = 0
    ) => {
      // Filter from children up
      rowsToFilter = rowsToFilter.filter(row => {
        if (!row.subRows?.length) {
          return true
        }

        row.subRows = recurseFilterRows(row.subRows, depth + 1)

        return row.subRows.length
      })

      rowsToFilter = filterFn(rowsToFilter, filterableColumnIds, globalFilter)

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
  const recurseFilterRows = (
    rowsToFilter: Row<
      TData,
      TValue,
      TFilterFns,
      TSortingFns,
      TAggregationFns
    >[],
    depth = 0
  ) => {
    // Filter from parents downward
    rowsToFilter = filterFn(rowsToFilter, filterableColumnIds, globalFilter)

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
