import React from 'react'

import * as aggregationTypes from '../aggregationTypes'

import { flattenBy, useGetLatest, makeRenderer } from '../utils'

const emptyArray = []
const emptyObject = {}

export default function useGrouping(instance) {
  const {
    options: { groupingFn, manualGrouping, decorateCell, decorateRow },
    state: { grouping },
    flatColumns,
    rows,
    flatRows,
    rowsById,
  } = instance

  const getInstance = useGetLatest(instance)

  const [
    groupedRows,
    groupedFlatRows,
    groupedRowsById,
    onlyGroupedFlatRows,
    onlyGroupedRowsById,
    nonGroupedFlatRows,
    nonGroupedRowsById,
  ] = React.useMemo(() => {
    if (manualGrouping || !grouping.length) {
      return [
        rows,
        flatRows,
        rowsById,
        emptyArray,
        emptyObject,
        flatRows,
        rowsById,
      ]
    }

    if (getInstance().options.debug) console.info('Grouping...')

    // Ensure that the list of filtered columns exist
    const existingGrouping = grouping.filter(g =>
      flatColumns.find(col => col.id === g)
    )

    // Find the columns that can or are aggregating
    // Uses each column to aggregate rows into a single value
    const aggregateRowsToValues = (leafRows, groupedRows, depth) => {
      const values = {}

      flatColumns.forEach(column => {
        // Don't aggregate columns that are in the grouping
        if (existingGrouping.includes(column.id)) {
          values[column.id] = groupedRows[0]
            ? groupedRows[0].values[column.id]
            : null
          return
        }

        // Get the columnValues to aggregate
        const groupedValues = groupedRows.map(row => row.values[column.id])

        // Get the columnValues to aggregate
        const leafValues = leafRows.map(row => {
          let columnValue = row.values[column.id]

          if (!depth && column.aggregatedValue) {
            const aggregateValueFn =
              typeof column.aggregateValue === 'function'
                ? column.aggregateValue
                : getInstance().options.aggregationTypes[
                    column.aggregateValue
                  ] || aggregationTypes[column.aggregateValue]

            if (!aggregateValueFn) {
              console.info({ column })
              throw new Error(
                `React Table: Invalid column.aggregateValue option for column listed above`
              )
            }

            columnValue = aggregateValueFn(columnValue, row, column)
          }
          return columnValue
        })

        // Aggregate the values
        let aggregateFn =
          typeof column.aggregate === 'function'
            ? column.aggregate
            : getInstance().options.aggregationTypes[column.aggregate] ||
              aggregationTypes[column.aggregate]

        if (aggregateFn) {
          values[column.id] = aggregateFn(leafValues, groupedValues)
        } else if (column.aggregate) {
          console.info({ column })
          throw new Error(
            `React Table: Invalid column.aggregate option for column listed above`
          )
        } else {
          values[column.id] = null
        }
      })

      return values
    }

    let groupedFlatRows = []
    const groupedRowsById = {}
    const onlyGroupedFlatRows = []
    const onlyGroupedRowsById = {}
    const nonGroupedFlatRows = []
    const nonGroupedRowsById = {}

    // Recursively group the data
    const groupUpRecursively = (rows, depth = 0, parentId) => {
      // This is the last level, just return the rows
      if (depth === existingGrouping.length) {
        return rows
      }

      const columnId = existingGrouping[depth]

      // Group the rows together for this level
      let rowGroupsMap = groupingFn(rows, columnId)

      // Peform aggregations for each group
      const aggregatedGroupedRows = Object.entries(rowGroupsMap).map(
        ([groupingVal, groupedRows], index) => {
          let id = `${columnId}:${groupingVal}`
          id = parentId ? `${parentId}>${id}` : id

          // First, Recurse to group sub rows before aggregation
          const subRows = groupUpRecursively(groupedRows, depth + 1, id)

          // Flatten the leaf rows of the rows in this group
          const leafRows = depth
            ? flattenBy(groupedRows, 'leafRows')
            : groupedRows

          const values = aggregateRowsToValues(leafRows, groupedRows, depth)

          const row = {
            id,
            groupingId: columnId,
            groupingVal,
            values,
            subRows,
            leafRows,
            depth,
            index,
          }

          subRows.forEach(subRow => {
            groupedFlatRows.push(subRow)
            groupedRowsById[subRow.id] = subRow
            if (subRow.getIsGrouped()) {
              onlyGroupedFlatRows.push(subRow)
              onlyGroupedRowsById[subRow.id] = subRow
            } else {
              nonGroupedFlatRows.push(subRow)
              nonGroupedRowsById[subRow.id] = subRow
            }
          })

          row.cells = []
          row.visibleCells = []

          row.cells = flatColumns.map(column => {
            let value = row.values[column.id]

            const cell = {
              id: column.id,
              row,
              column,
              value,
            }

            // Give each cell a getCellProps base
            cell.getCellProps = (props = {}) => ({
              ...props,
            })

            // Give each cell a renderer function (supports multiple renderers)
            cell.render = makeRenderer(getInstance, column, {
              row,
              column,
              cell,
              value,
            })

            decorateCell(cell, getInstance)

            return cell
          })

          row.getVisibleCells = () =>
            getInstance().visibleColumns.map(column =>
              row.cells.find(cell => cell.column.id === column.id)
            )

          decorateRow(row, getInstance)

          return row
        }
      )

      return aggregatedGroupedRows
    }

    const groupedRows = groupUpRecursively(rows)

    groupedRows.forEach(subRow => {
      groupedFlatRows.push(subRow)
      groupedRowsById[subRow.id] = subRow
      if (subRow.getIsGrouped()) {
        onlyGroupedFlatRows.push(subRow)
        onlyGroupedRowsById[subRow.id] = subRow
      } else {
        nonGroupedFlatRows.push(subRow)
        nonGroupedRowsById[subRow.id] = subRow
      }
    })

    // Assign the new data
    return [
      groupedRows,
      groupedFlatRows,
      groupedRowsById,
      onlyGroupedFlatRows,
      onlyGroupedRowsById,
      nonGroupedFlatRows,
      nonGroupedRowsById,
    ]
  }, [
    manualGrouping,
    grouping,
    rows,
    flatRows,
    rowsById,
    flatColumns,
    getInstance,
    groupingFn,
    decorateRow,
    decorateCell,
  ])

  Object.assign(instance, {
    preGroupedRows: rows,
    preGroupedFlatRow: flatRows,
    preGroupedRowsById: rowsById,
    groupedRows,
    groupedFlatRows,
    groupedRowsById,
    onlyGroupedFlatRows,
    onlyGroupedRowsById,
    nonGroupedFlatRows,
    nonGroupedRowsById,
    rows: groupedRows,
    flatRows: groupedFlatRows,
    rowsById: groupedRowsById,
  })
}
