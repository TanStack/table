import { useMemo } from 'react'

export default function useAccessedRows ({
  debug, data, columns, subRowsKey,
}) {
  return useMemo(
    () => {
      if (debug) console.info('getAccessedRows')

      // Access the row's data
      const accessRow = (data, i, depth = 0) => {
        // Keep the original reference around
        const original = data

        // Process any subRows
        const subRows = data[subRowsKey]
          ? data[subRowsKey].map((d, i) => accessRow(d, i, depth + 1))
          : undefined

        const row = {
          original,
          index: i,
          subRows,
          depth,
        }

        // Create the cells and values
        row.values = {}
        columns.forEach(column => {
          row.values[column.id] = column.accessor ? column.accessor(data) : undefined
        })

        return row
      }

      // Use the resolved data
      return data.map((d, i) => accessRow(d, i))
    },
    [data, columns]
  )
}
