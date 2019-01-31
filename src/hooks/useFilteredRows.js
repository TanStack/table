import { useMemo } from 'react'

export default function useFilteredRows ({
  debug,
  filters,
  rows,
  columns,
  filterFn,
  manualFilters,
}) {
  return useMemo(
    () => {
      if (manualFilters || !Object.keys(filters).length) {
        return rows
      }

      if (debug) console.info('getFilteredRows')

      // Filters top level and nested rows
      const filterRows = rows => {
        let filteredRows = rows

        filteredRows = Object.entries(filters).reduce((filteredSoFar, [columnID, filterValue]) => {
          // Find the filters column
          const column = columns.find(d => d.id === columnID)

          // Don't filter hidden columns or columns that have had their filters disabled
          if (!column || column.filterable === false) {
            return filteredSoFar
          }

          const filterMethod = column.filterMethod || filterFn

          // If 'filterAll' is set to true, pass the entire dataset to the filter method
          if (column.filterAll) {
            return filterMethod(filteredSoFar, columnID, filterValue, column)
          }
          return filteredSoFar.filter(row => filterMethod(row, columnID, filterValue, column))
        }, rows)

        // Apply the filter to any subRows
        filteredRows = filteredRows.map(row => {
          if (!row.subRows) {
            return row
          }
          return {
            ...row,
            subRows: filterRows(row.subRows),
          }
        })

        // then filter any rows without subcolumns because it would be strange to show
        filteredRows = filteredRows.filter(row => {
          if (!row.subRows) {
            return true
          }
          return row.subRows.length > 0
        })

        return filteredRows
      }

      return filterRows(rows)
    },
    [rows, filters, manualFilters]
  )
}
