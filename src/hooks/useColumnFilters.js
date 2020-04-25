import React from 'react'

//

import { useGetLatest, getFilterMethod } from '../utils'

import * as filterTypes from '../filterTypes'

export default function useColumnFilters(instance) {
  const getInstance = useGetLatest(instance)

  const {
    options: { manualColumnFilters },
    state: { columnFilters },
    rows,
    flatRows,
    rowsById,
  } = instance

  const [
    filteredRows,
    filteredFlatRows,
    filteredRowsById,
  ] = React.useMemo(() => {
    if (manualColumnFilters || !columnFilters.length) {
      return [rows, flatRows, rowsById]
    }

    if (getInstance().options.debug) console.info('Filtering...')

    const filteredFlatRows = []
    const filteredRowsById = {}

    const enableFacetedFilters = getInstance().options.enableFacetedFilters

    // Filters top level and nested rows
    const filterRows = (rows, depth = 0) => {
      let filteredRows = rows

      columnFilters.forEach(({ id: columnId, value: filterValue }) => {
        // Find the columnFilters column
        const column = getInstance().flatColumns.find(d => d.id === columnId)

        if (!column) {
          return
        }

        if (depth === 0 && enableFacetedFilters) {
          facetFilterValues(column, filteredRows, getInstance)
        }

        const filterMethod = getFilterMethod(
          column.filterType,
          getInstance().options.filterTypes || {},
          filterTypes
        )

        if (!filterMethod) {
          console.warn(
            `Could not find a valid 'column.filterType' for column with the ID: ${column.id}.`
          )
          return
        }

        // Pass the rows, id, filterValue and column to the filterMethod
        // to get the filtered rows back
        const newFilteredRows = filterMethod(
          filteredRows,
          [columnId],
          filterValue
        )

        filteredRows = newFilteredRows
      }, rows)

      // Apply the filter to any subRows
      // We technically could do this recursively in the above loop,
      // but that would severely hinder the API for the user, since they
      // would be required to do that recursion in some scenarios
      filteredRows.forEach(row => {
        filteredFlatRows.push(row)
        filteredRowsById[row.id] = row
        if (!row.subRows) {
          return
        }

        row.subRows =
          row.subRows && row.subRows.length > 0
            ? filterRows(row.subRows, depth + 1)
            : row.subRows
      })

      return filteredRows
    }

    return [filterRows(rows), filteredFlatRows, filteredRowsById]
  }, [
    columnFilters,
    flatRows,
    getInstance,
    manualColumnFilters,
    rows,
    rowsById,
  ])

  React.useMemo(() => {
    // Now that each filtered column has it's partially filtered rows,
    // lets assign the final filtered rows to all of the other columns
    const nonFilteredColumns = getInstance().flatColumns.filter(
      column => !columnFilters.find(d => d.id === column.id)
    )

    // This essentially enables faceted filter options to be built easily
    // using every column's preFilteredRows value

    const enableFacetedFilters = getInstance().options.enableFacetedFilters

    nonFilteredColumns.forEach(column => {
      facetFilterValues(column, filteredRows, getInstance)

      // There are no more levels of filters, so duplicate the pre-filter
      // values as the standard ones
    })
  }, [filteredRows, columnFilters, getInstance])

  Object.assign(instance, {
    preFilteredRows: rows,
    preFilteredFlatRows: flatRows,
    preFilteredRowsById: rowsById,
    filteredRows,
    filteredFlatRows,
    filteredRowsById,
    rows: filteredRows,
    flatRows: filteredFlatRows,
    rowsById: filteredRowsById,
  })
}

function facetFilterValues(column, rows, getInstance) {
  const enableUniqueValues =
    getInstance().options.enableUniqueValues || column.enableUniqueValues

  const enableMinMaxValues =
    getInstance().options.enableMinMaxValues || column.enableMinMaxValues

  column.preFilteredRows = rows

  if (enableUniqueValues) {
    column.preFilteredUniqueValues = new Map()
  }

  if (enableMinMaxValues) {
    column.preFilteredMinMaxValues = [
      rows[0]?.values[column.id],
      rows[0]?.values[column.id],
    ]
  }

  if (enableUniqueValues || enableMinMaxValues) {
    rows.forEach(row => {
      const value = row.values[column.id]

      if (enableUniqueValues) {
        if (column.preFilteredUniqueValues.has(value)) {
          column.preFilteredUniqueValues.set(
            value,
            column.preFilteredUniqueValues.get(value) + 1
          )
        } else {
          column.preFilteredUniqueValues.set(value, 1)
        }
      }

      if (enableMinMaxValues) {
        if (value < column.preFilteredMinMaxValues[0]) {
          column.preFilteredMinMaxValues[0] = value
        } else if (value > column.preFilteredMinMaxValues[1]) {
          column.preFilteredMinMaxValues[1] = value
        }
      }
    })
  }
}
