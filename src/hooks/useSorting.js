import React from 'react'

import { isFunction, useGetLatest } from '../utils'

import * as sortTypes from '../sortTypes'

export default function useSorting(instance) {
  const {
    options: { manualSorting },
    state: { sorting },
    rows,
    flatRows,
    flatColumns,
  } = instance

  const getInstance = useGetLatest(instance)

  const [sortedRows, sortedFlatRows] = React.useMemo(() => {
    if (manualSorting || !sorting.length) {
      return [rows, flatRows]
    }

    if (getInstance().options.debug) console.info('Sorting...')

    const sortedFlatRows = []

    // Filter out sortings that correspond to non existing columns
    const availableSorting = sorting.filter(sort =>
      flatColumns.find(col => col.id === sort.id)
    )

    const sortData = rows => {
      // Use the orderByFn to compose multiple sorting's together.
      // This will also perform a stable sorting using the row index
      // if needed.
      const sortedData = getInstance().options.orderByFn(
        rows,
        availableSorting.map(sort => {
          // Support custom sorting methods for each column
          const column = flatColumns.find(d => d.id === sort.id)

          if (!column) {
            throw new Error(
              `React-Table: Could not find a column with id: ${sort.id} while sorting`
            )
          }

          const { sortType } = column

          const sortMethod =
            isFunction(sortType) ||
            (getInstance().options.sortTypes || {})[sortType] ||
            sortTypes[sortType]

          if (!sortMethod) {
            throw new Error(
              `React-Table: Could not find a valid sortType of '${sortType}' for column '${sort.id}'.`
            )
          }

          // Return the correct sortFn.
          // This function should always return in ascending order
          return (a, b) => sortMethod(a, b, sort.id, sort.desc)
        }),
        // Map the directions
        availableSorting.map(sort => {
          // Detect and use the sortInverted option
          const column = flatColumns.find(d => d.id === sort.id)

          if (column && column.sortInverted) {
            return sort.desc
          }

          return !sort.desc
        })
      )

      // If there are sub-rows, sort them
      sortedData.forEach(row => {
        sortedFlatRows.push(row)
        if (!row.subRows || row.subRows.length <= 1) {
          return
        }
        row.subRows = sortData(row.subRows)
      })

      return sortedData
    }

    return [sortData(rows), sortedFlatRows]
  }, [manualSorting, sorting, rows, flatRows, flatColumns, getInstance])

  Object.assign(instance, {
    preSortedRows: rows,
    preSortedFlatRows: flatRows,
    sortedRows,
    sortedFlatRows,
    rows: sortedRows,
    flatRows: sortedFlatRows,
  })
}
