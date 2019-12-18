import React from 'react'

import {
  actions,
  getFirstDefined,
  getFilterMethod,
  useMountedLayoutEffect,
  functionalUpdate,
  useGetLatest,
  shouldAutoRemoveFilter,
} from '../utils'
import * as filterTypes from '../filterTypes'

// Actions
actions.resetFilters = 'resetFilters'
actions.setFilter = 'setFilter'
actions.setAllFilters = 'setAllFilters'

export const useFilters = hooks => {
  hooks.stateReducers.push(reducer)
  hooks.useInstance.push(useInstance)
}

useFilters.pluginName = 'useFilters'

function reducer(state, action, previousState, instance) {
  if (action.type === actions.init) {
    return {
      filters: [],
      ...state,
    }
  }

  if (action.type === actions.resetFilters) {
    return {
      ...state,
      filters: instance.initialState.filters || [],
    }
  }

  if (action.type === actions.setFilter) {
    const { columnId, filterValue } = action
    const { flatColumns, userFilterTypes } = instance

    const column = flatColumns.find(d => d.id === columnId)

    if (!column) {
      throw new Error(
        `React-Table: Could not find a column with id: ${columnId}`
      )
    }

    const filterMethod = getFilterMethod(
      column.filter,
      userFilterTypes || {},
      filterTypes
    )

    const previousfilter = state.filters.find(d => d.id === columnId)

    const newFilter = functionalUpdate(
      filterValue,
      previousfilter && previousfilter.value
    )

    //
    if (shouldAutoRemoveFilter(filterMethod.autoRemove, newFilter)) {
      return {
        ...state,
        filters: state.filters.filter(d => d.id !== columnId),
      }
    }

    if (previousfilter) {
      return {
        ...state,
        filters: state.filters.map(d => {
          if (d.id === columnId) {
            return { id: columnId, value: newFilter }
          }
          return d
        }),
      }
    }

    return {
      ...state,
      filters: [...state.filters, { id: columnId, value: newFilter }],
    }
  }

  if (action.type === actions.setAllFilters) {
    const { filters } = action
    const { flatColumns, filterTypes: userFilterTypes } = instance

    return {
      ...state,
      // Filter out undefined values
      filters: functionalUpdate(filters, state.filters).filter(filter => {
        const column = flatColumns.find(d => d.id === filter.id)
        const filterMethod = getFilterMethod(
          column.filter,
          userFilterTypes || {},
          filterTypes
        )

        if (shouldAutoRemoveFilter(filterMethod.autoRemove, filter.value)) {
          return false
        }
        return true
      }),
    }
  }
}

function useInstance(instance) {
  const {
    data,
    rows,
    flatRows,
    flatColumns,
    filterTypes: userFilterTypes,
    manualFilters,
    defaultCanFilter = false,
    disableFilters,
    state: { filters },
    dispatch,
    autoResetFilters = true,
  } = instance

  const setFilter = (columnId, filterValue) => {
    dispatch({ type: actions.setFilter, columnId, filterValue })
  }

  const setAllFilters = filters => {
    dispatch({
      type: actions.setAllFilters,
      filters,
    })
  }

  flatColumns.forEach(column => {
    const {
      id,
      accessor,
      defaultCanFilter: columnDefaultCanFilter,
      disableFilters: columnDisableFilters,
    } = column

    // Determine if a column is filterable
    column.canFilter = accessor
      ? getFirstDefined(
          columnDisableFilters === true ? false : undefined,
          disableFilters === true ? false : undefined,
          true
        )
      : getFirstDefined(columnDefaultCanFilter, defaultCanFilter, false)

    // Provide the column a way of updating the filter value
    column.setFilter = val => setFilter(column.id, val)

    // Provide the current filter value to the column for
    // convenience
    const found = filters.find(d => d.id === id)
    column.filterValue = found && found.value
  })

  const [filteredRows, filteredFlatRows] = React.useMemo(() => {
    if (manualFilters || !filters.length) {
      return [rows, flatRows]
    }

    const filteredFlatRows = []

    // Filters top level and nested rows
    const filterRows = (rows, depth = 0) => {
      let filteredRows = rows

      filteredRows = filters.reduce(
        (filteredSoFar, { id: columnId, value: filterValue }) => {
          // Find the filters column
          const column = flatColumns.find(d => d.id === columnId)

          if (!column) {
            return filteredSoFar
          }

          if (depth === 0) {
            column.preFilteredRows = filteredSoFar
          }

          const filterMethod = getFilterMethod(
            column.filter,
            userFilterTypes || {},
            filterTypes
          )

          if (!filterMethod) {
            console.warn(
              `Could not find a valid 'column.filter' for column with the ID: ${column.id}.`
            )
            return filteredSoFar
          }

          // Pass the rows, id, filterValue and column to the filterMethod
          // to get the filtered rows back
          column.filteredRows = filterMethod(
            filteredSoFar,
            [columnId],
            filterValue
          )

          return column.filteredRows
        },
        rows
      )

      // Apply the filter to any subRows
      // We technically could do this recursively in the above loop,
      // but that would severely hinder the API for the user, since they
      // would be required to do that recursion in some scenarios
      filteredRows = filteredRows.map(row => {
        filteredFlatRows.push(row)
        if (!row.subRows) {
          return row
        }
        return {
          ...row,
          subRows:
            row.subRows && row.subRows.length > 0
              ? filterRows(row.subRows, depth + 1)
              : row.subRows,
        }
      })

      return filteredRows
    }

    return [filterRows(rows), filteredFlatRows]
  }, [manualFilters, filters, rows, flatRows, flatColumns, userFilterTypes])

  React.useMemo(() => {
    // Now that each filtered column has it's partially filtered rows,
    // lets assign the final filtered rows to all of the other columns
    const nonFilteredColumns = flatColumns.filter(
      column => !filters.find(d => d.id === column.id)
    )

    // This essentially enables faceted filter options to be built easily
    // using every column's preFilteredRows value
    nonFilteredColumns.forEach(column => {
      column.preFilteredRows = filteredRows
      column.filteredRows = filteredRows
    })
  }, [filteredRows, filters, flatColumns])

  const getAutoResetFilters = useGetLatest(autoResetFilters)

  useMountedLayoutEffect(() => {
    if (getAutoResetFilters()) {
      dispatch({ type: actions.resetFilters })
    }
  }, [dispatch, manualFilters ? null : data])

  Object.assign(instance, {
    preFilteredRows: rows,
    preFilteredFlatRows: flatRows,
    filteredRows,
    filteredFlatRows,
    rows: filteredRows,
    flatRows: filteredFlatRows,
    setFilter,
    setAllFilters,
  })
}
