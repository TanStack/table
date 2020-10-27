import React from 'react'

//

import { makeRenderer, flattenBy } from '../utils'

export default function useDataModel(instance) {
  const {
    leafColumns,
    options: { data, getRowId, getSubRows, debug },
  } = instance

  const [rows, flatRows, rowsById] = React.useMemo(() => {
    if (process.env.NODE_ENV !== 'production' && debug)
      console.info('Accessing...')

    // Access the row model using initial columns
    const _rows = []
    const _flatRows = []
    const _rowsById = {}

    data.forEach((originalRow, rowIndex) =>
      accessRow(originalRow, rowIndex, 0, undefined, _rows)
    )

    return [_rows, _flatRows, _rowsById]

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
      _flatRows.push(row)
      // Also keep track of every row by its ID
      _rowsById[id] = row

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
        row.leafRows = flattenBy(subRows, 'leafRows')
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

        cell.render = makeRenderer(instance, {
          cell,
          row,
          column,
          value,
        })

        instance.plugs.decorateCell(cell, { instance })

        return cell
      })

      row.getVisibleCells = () =>
        leafColumns.map(column =>
          row.cells.find(cell => cell.column.id === column.id)
        )

      instance.plugs.decorateRow(row, { instance })
    }
  }, [debug, data, getRowId, getSubRows, leafColumns, instance])

  Object.assign(instance, {
    rows,
    flatRows,
    rowsById,
  })
}
