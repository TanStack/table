import { useMemo } from 'react'

import * as aggregations from '../aggregations'

export default function useGroupedRows ({
  debug,
  groupBy,
  rows,
  columns,
  groupByFn,
  manualGroupBy,
  userAggregations,
}) {
  return useMemo(
    () => {
      if (manualGroupBy || !groupBy.length) {
        return rows
      }
      if (debug) console.info('getGroupedRows')
      // Find the columns that can or are aggregating

      // Uses each column to aggregate rows into a single value
      const aggregateRowsToValues = rows => {
        const values = {}
        columns.forEach(column => {
          const columnValues = rows.map(d => d.values[column.id])
          const aggregate =
            userAggregations[column.aggregate] || aggregations[column.aggregate] || column.aggregate
          if (typeof aggregate === 'function') {
            values[column.id] = aggregate(columnValues, rows)
          } else if (aggregate) {
            throw new Error(
              `Invalid aggregate "${aggregate}" passed to column with ID: "${column.id}"`
            )
          } else {
            values[column.id] = columnValues[0]
          }
        })
        return values
      }

      // Recursively group the data
      const groupRecursively = (rows, groupBy, depth = 0) => {
        // This is the last level, just return the rows
        if (depth >= groupBy.length) {
          return rows
        }

        // Group the rows together for this level
        const groupedRows = Object.entries(groupByFn(rows, groupBy[depth])).map(
          ([groupByVal, subRows], index) => {
            // Recurse to sub rows before aggregation
            subRows = groupRecursively(subRows, groupBy, depth + 1)

            const values = aggregateRowsToValues(subRows)

            const row = {
              groupByID: groupBy[depth],
              groupByVal,
              values,
              subRows,
              depth,
              index,
            }
            return row
          }
        )

        return groupedRows
      }

      // Assign the new data
      return groupRecursively(rows, groupBy)
    },
    [rows, groupBy, columns, manualGroupBy]
  )
}
