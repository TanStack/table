import React from 'react'
import { Cell, Row, TableInstance } from '../types'

//

import { makeRenderer, flattenBy } from '../utils'

export default function useDataModel(instance: TableInstance) {
  const {
    leafColumns,
    options: { data, getRowId, getSubRows, debug },
  } = instance

  const [rows, flatRows, rowsById] = React.useMemo(() => {
    if (process.env.NODE_ENV !== 'production' && debug)
      console.info('Accessing...')

    // Access the row model using initial columns
    const rows: Row[] = []
    const flatRows: Row[] = []
    const rowsById: Record<Row['id'], Row> = {}

    data.forEach((originalRow, rowIndex) =>
      accessRow(originalRow, rowIndex, 0, undefined, rows)
    )

    return [rows, flatRows, rowsById]

    function accessRow<TOriginalRow>(
      originalRow: TOriginalRow,
      rowIndex: number,
      depth = 0,
      parent?: Row,
      parentRows?: Row[]
    ) {
      // Keep the original reference around
      const original = originalRow

      const id = getRowId?.(originalRow, rowIndex, parent)

      if (!id) {
        throw new Error(`getRowId expected an ID, but got ${id}`)
      }

      // Make the row
      const row = {
        id,
        original,
        index: rowIndex,
        depth,
        values: {},
      } as Row

      // Push this row into the parentRows array
      parentRows?.push(row)
      // Keep track of every row in a flat array
      flatRows.push(row)
      // Also keep track of every row by its ID
      rowsById[id] = row

      // Get the original subrows
      row.originalSubRows = getSubRows?.(originalRow, rowIndex) ?? []

      // Then recursively access them
      if (row.originalSubRows) {
        const subRows: Row[] = []
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
          value = row.values[column.id as string] = column.accessor(
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
        } as Cell

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
        ) as Cell[]

      instance.plugs.decorateRow(row, { instance })
    }
  }, [debug, data, getRowId, getSubRows, leafColumns, instance])

  Object.assign(instance, {
    rows,
    flatRows,
    rowsById,
  })
}
