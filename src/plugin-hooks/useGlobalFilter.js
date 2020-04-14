import React from 'react'

import {
  getFilterMethod,
  shouldAutoRemoveFilter,
  getFirstDefined,
} from '../utils'

import {
  useMountedLayoutEffect,
  functionalUpdate,
  useGetLatest,
} from '../publicUtils'

import * as filterTypes from '../filterTypes'

export const useGlobalFilter = hooks => {
  hooks.useInstance.push(useInstance)
}

useGlobalFilter.pluginName = 'useGlobalFilter'

function useInstance(instance) {
  const {
    data,
    rows,
    flatRows,
    rowsById,
    allColumns,
    filterTypes: userFilterTypes,
    globalFilter,
    manualGlobalFilter,
    state: { globalFilter: globalFilterValue },
    setState,
    autoResetGlobalFilter = true,
    disableGlobalFilter,
  } = instance

  const getInstance = useGetLatest(instance)

  const setGlobalFilter = React.useCallback(
    value =>
      setState(
        old => {
          const { userFilterTypes } = getInstance()

          const filterMethod = getFilterMethod(
            getInstance().globalFilter,
            userFilterTypes || {},
            filterTypes
          )

          const newFilter = functionalUpdate(value, old.globalFilter)

          //
          if (shouldAutoRemoveFilter(filterMethod.autoRemove, newFilter)) {
            const { globalFilter, ...stateWithoutGlobalFilter } = old
            return stateWithoutGlobalFilter
          }

          return {
            ...old,
            globalFilter: newFilter,
          }
        },
        {
          type: 'setGlobalFilter',
          value,
        }
      ),
    [getInstance, setState]
  )

  const resetGlobalFilter = React.useCallback(
    () =>
      setState(
        old => ({
          ...old,
          globalFilter: getInstance().initialState.globalFilter || undefined,
        }),
        {
          type: 'resetGlobalFilter',
        }
      ),
    [getInstance, setState]
  )

  // TODO: Create a filter cache for incremental high speed multi-filtering
  // This gets pretty complicated pretty fast, since you have to maintain a
  // cache for each row group (top-level rows, and each row's recursive subrows)
  // This would make multi-filtering a lot faster though. Too far?

  const [
    globalFilteredRows,
    globalFilteredFlatRows,
    globalFilteredRowsById,
  ] = React.useMemo(() => {
    if (manualGlobalFilter || typeof globalFilterValue === 'undefined') {
      return [rows, flatRows, rowsById]
    }

    const filteredFlatRows = []
    const filteredRowsById = {}

    const filterMethod = getFilterMethod(
      globalFilter,
      userFilterTypes || {},
      filterTypes
    )

    if (!filterMethod) {
      console.warn(`Could not find a valid 'globalFilter' option.`)
      return rows
    }

    allColumns.forEach(column => {
      const { disableGlobalFilter: columnDisableGlobalFilter } = column

      column.canFilter = getFirstDefined(
        columnDisableGlobalFilter === true ? false : undefined,
        disableGlobalFilter === true ? false : undefined,
        true
      )
    })

    const filterableColumns = allColumns.filter(c => c.canFilter === true)

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
    globalFilter,
    userFilterTypes,
    allColumns,
    rows,
    flatRows,
    rowsById,
    disableGlobalFilter,
  ])

  const getAutoResetGlobalFilter = useGetLatest(autoResetGlobalFilter)

  useMountedLayoutEffect(() => {
    if (getAutoResetGlobalFilter()) {
      resetGlobalFilter()
    }
  }, [manualGlobalFilter ? null : data])

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
    setGlobalFilter,
    disableGlobalFilter,
    resetGlobalFilter,
  })
}
