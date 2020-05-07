import React from 'react'

//

import { useGetLatest, makeRenderer } from '../utils'

export default function useDataModel(instance) {
  const {
    leafColumns,
    options: { data, getRowId, getSubRows },
  } = instance

  const getInstance = useGetLatest(instance)

  const [rows, flatRows, rowsById] = React.useMemo(() => {
    if (process.env.NODE_ENV !== 'production' && getInstance().options.debug)
      console.info('Accessing...')

    // Access the row model using initial columns
    const rows = []
    const flatRows = []
    const rowsById = {}

    data.forEach((originalRow, rowIndex) =>
      accessRow(originalRow, rowIndex, 0, undefined, rows)
    )

    return [rows, flatRows, rowsById]

    function accessRow(originalRow, rowIndex, depth = 0, parent, parentRows) {
      // Keep the original reference around
      const original = originalRow

      const id = getRowId(originalRow, rowIndex, parent)

      // Make the row
      const row = {
        id,
        original,
        index: rowIndex,
        depth,
        values: {},
      }

      // Push this row into the parentRows array
      parentRows.push(row)
      // Keep track of every row in a flat array
      flatRows.push(row)
      // Also keep track of every row by its ID
      rowsById[id] = row

      // Get the original subrows
      row.originalSubRows = getSubRows(originalRow, rowIndex)

      // Then recursively access them
      if (row.originalSubRows) {
        const subRows = []
        row.originalSubRows.forEach((d, i) =>
          accessRow(d, i, depth + 1, row, subRows)
        )
        // Keep the new subRows array on the row
        row.subRows = subRows
      }

      row.cells = []

      row.cells = leafColumns.map(column => {
        let value

        // If the column has an accessor, use it to get a value
        if (column.accessor) {
          value = row.values[column.id] = column.accessor(
            originalRow,
            rowIndex,
            row
          )
        }

        const cell = {
          id: column.id,
          row,
          column,
          value,
        }

        cell.render = makeRenderer(getInstance, {
          cell,
          row,
          column,
          value,
        })

        getInstance().plugs.decorateCell(cell, { getInstance })

        return cell
      })

      row.getVisibleCells = () =>
        getInstance().visibleColumns.map(column =>
          row.cells.find(cell => cell.column.id === column.id)
        )

      getInstance().plugs.decorateRow(row, { getInstance })
    }
  }, [data, leafColumns, getInstance, getRowId, getSubRows])

  Object.assign(getInstance(), {
    rows,
    flatRows,
    rowsById,
  })
}
