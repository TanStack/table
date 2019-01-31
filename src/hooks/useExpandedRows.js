import { useMemo, useEffect } from 'react'

import { getBy } from '../utils'

export default function useExpandedRows ({
  debug,
  expanded,
  expandedKey,
  columns,
  rows,
  setState,
  actions,
}) {
  return useMemo(
    () => {
      if (debug) console.info('getExpandedRows')

      const expandedRows = []

      // Here we do some mutation, but it's the last stage in the
      // immutable process so this is safe
      const handleRow = (row, index, depth = 0, parentPath = []) => {
        // Compute some final state for the row
        const path = [...parentPath, index]

        row.path = path
        row.depth = depth

        row.isExpanded = (row.original && row.original[expandedKey]) || getBy(expanded, path)

        row.cells = columns.map(column => {
          const cell = {
            column,
            row,
            state: null,
            value: row.values[column.id],
          }

          return cell
        })

        expandedRows.push(row)

        if (row.isExpanded && row.subRows && row.subRows.length) {
          row.subRows.forEach((row, i) => handleRow(row, i, depth + 1, path))
        }
      }

      rows.forEach((row, i) => handleRow(row, i))

      return expandedRows
    },
    [rows, expanded, columns]
  )
}
