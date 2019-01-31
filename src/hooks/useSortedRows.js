import { useMemo } from 'react'

export default function useSortedRows ({
  debug,
  sortBy,
  rows,
  columns,
  orderByFn,
  sortByFn,
  manualSorting,
}) {
  return useMemo(
    () => {
      if (manualSorting || !sortBy.length) {
        return rows
      }
      if (debug) console.info('getSortedRows')

      const sortMethodsByColumnID = {}

      columns
        .filter(col => col.sortMethod)
        .forEach(col => {
          sortMethodsByColumnID[col.id] = col.sortMethod
        })

      const sortData = rows => {
        // Use the orderByFn to compose multiple sortBy's together.
        // This will also perform a stable sorting using the row index
        // if needed.
        const sortedData = orderByFn(
          rows,
          sortBy.map(sort => {
            // Support custom sorting methods for each column
            const columnSortBy = sortMethodsByColumnID[sort.id]

            // Return the correct sortFn
            return (a, b) =>
              (columnSortBy || sortByFn)(a.values[sort.id], b.values[sort.id], sort.desc)
          }),
          // Map the directions
          sortBy.map(d => !d.desc)
        )

        // TODO: this should be optimized. Not good to loop again
        sortedData.forEach(row => {
          if (!row.subRows) {
            return
          }
          row.subRows = sortData(row.subRows)
        })

        return sortedData
      }

      return sortData(rows)
    },
    [rows, columns, sortBy, manualSorting]
  )
}
