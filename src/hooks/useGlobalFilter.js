import React from 'react'

import { getFilterMethod, useGetLatest } from '../utils'

import * as filterTypes from '../filterTypes'

export default function useGlobalFilter(instance) {
  const {
    options: { manualGlobalFilter, globalFilterType },
    state: { globalFilterValue },
    rows,
    flatRows,
    rowsById,
    flatColumns,
  } = instance

  const getInstance = useGetLatest(instance)

  const [
    globalFilteredRows,
    globalFilteredFlatRows,
    globalFilteredRowsById,
  ] = React.useMemo(() => {
    if (manualGlobalFilter || !globalFilterValue) {
      return [rows, flatRows, rowsById]
    }

    if (getInstance().options.debug) console.info('Global Filtering...')

    const filteredFlatRows = []
    const filteredRowsById = {}

    const filterMethod = getFilterMethod(
      globalFilterType,
      getInstance().options.filterTypes || {},
      filterTypes
    )

    if (!filterMethod) {
      console.warn(`Could not find a valid 'globalFilterType' option.`)
      return rows
    }

    const filterableColumns = flatColumns.filter(c =>
      getInstance().getCanGlobalFilterColumn(c.id)
    )

    // Filters top level and nested rows
    const filterRows = filteredRows => {
      filteredRows = filterMethod(
        filteredRows,
        filterableColumns.map(d => d.id),
        globalFilterValue
      )

      filteredRows.forEach(row => {
        filteredFlatRows.push(row)
        filteredRowsById[row.id] = row

        row.subRows =
          row.subRows && row.subRows.length
            ? filterRows(row.subRows)
            : row.subRows
      })

      return filteredRows
    }

    return [filterRows(rows), filteredFlatRows, filteredRowsById]
  }, [
    manualGlobalFilter,
    globalFilterValue,
    globalFilterType,
    getInstance,
    flatColumns,
    rows,
    flatRows,
    rowsById,
  ])

  Object.assign(instance, {
    preGlobalFilteredRows: rows,
    preGlobalFilteredFlatRows: flatRows,
    preGlobalFilteredRowsById: rowsById,
    globalFilteredRows,
    globalFilteredFlatRows,
    globalFilteredRowsById,
    rows: globalFilteredRows,
    flatRows: globalFilteredFlatRows,
    rowsById: globalFilteredRowsById,
  })
}
