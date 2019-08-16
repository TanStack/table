import React from 'react'
import PropTypes from 'prop-types'

import { getFirstDefined, isFunction } from '../utils'
import * as filterTypes from '../filterTypes'
import { addActions, actions } from '../actions'
import { defaultState } from '../hooks/useTableState'

defaultState.filters = {}

addActions('setFilter', 'setAllFilters')

const propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      disableFilters: PropTypes.bool,
      Filter: PropTypes.any,
    })
  ),

  manualFilters: PropTypes.bool,
}

export const useFilters = hooks => {
  hooks.useMain.push(useMain)
}

useFilters.pluginName = 'useFilters'

function useMain(instance) {
  PropTypes.checkPropTypes(propTypes, instance, 'property', 'useFilters')

  const {
    debug,
    rows,
    columns,
    filterTypes: userFilterTypes,
    manualFilters,
    disableFilters,
    state: [{ filters }, setState],
  } = instance

  const preFilteredRows = rows

  const setFilter = (id, updater) => {
    const column = columns.find(d => d.id === id)

    if (!column) {
      throw new Error(`React-Table: Could not find a column with id: ${id}`)
    }

    const filterMethod = getFilterMethod(
      column.filter,
      userFilterTypes || {},
      filterTypes
    )

    return setState(old => {
      const newFilter =
        typeof updater === 'function' ? updater(old.filters[id]) : updater

      //
      if (shouldAutoRemove(filterMethod.autoRemove, newFilter)) {
        const { [id]: remove, ...newFilters } = old.filters
        return {
          ...old,
          filters: newFilters,
        }
      }

      return {
        ...old,
        filters: {
          ...old.filters,
          [id]: newFilter,
        },
      }
    }, actions.setFilter)
  }

  const setAllFilters = updater => {
    return setState(old => {
      const newFilters = typeof updater === 'function' ? updater(old) : updater

      // Filter out undefined values
      Object.keys(newFilters).forEach(id => {
        const newFilter = newFilters[id]
        const column = columns.find(d => d.id === id)
        const filterMethod = getFilterMethod(
          column.filter,
          userFilterTypes || {},
          filterTypes
        )

        if (shouldAutoRemove(filterMethod.autoRemove, newFilter)) {
          delete newFilters[id]
        }
      })

      return {
        ...old,
        filters: newFilters,
      }
    }, actions.setAllFilters)
  }

  columns.forEach(column => {
    const { id, accessor, disableFilters: columnDisableFilters } = column

    // Determine if a column is filterable
    column.canFilter = accessor
      ? getFirstDefined(
          columnDisableFilters === true ? false : undefined,
          disableFilters === true ? false : undefined,
          true
        )
      : false

    // Provide the column a way of updating the filter value
    column.setFilter = val => setFilter(column.id, val)

    // Provide the current filter value to the column for
    // convenience
    column.filterValue = filters[id]
  })

  // TODO: Create a filter cache for incremental high speed multi-filtering
  // This gets pretty complicated pretty fast, since you have to maintain a
  // cache for each row group (top-level rows, and each row's recursive subrows)
  // This would make multi-filtering a lot faster though. Too far?

  const filteredRows = React.useMemo(() => {
    if (manualFilters || !Object.keys(filters).length) {
      return rows
    }

    if (process.env.NODE_ENV === 'development' && debug)
      console.info('getFilteredRows')

    // Filters top level and nested rows
    const filterRows = (rows, depth = 0) => {
      let filteredRows = rows

      filteredRows = Object.entries(filters).reduce(
        (filteredSoFar, [columnID, filterValue]) => {
          // Find the filters column
          const column = columns.find(d => d.id === columnID)

          if (depth === 0) {
            column.preFilteredRows = filteredSoFar
          }

          if (!column) {
            return filteredSoFar
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
          return filterMethod(filteredSoFar, columnID, filterValue, column)
        },
        rows
      )

      // Apply the filter to any subRows
      // We technically could do this recursively in the above loop,
      // but that would severely hinder the API for the user, since they
      // would be required to do that recursion in some scenarios
      filteredRows = filteredRows.map(row => {
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

    return filterRows(rows)
  }, [manualFilters, filters, debug, rows, columns, userFilterTypes])

  React.useMemo(() => {
    // Now that each filtered column has it's partially filtered rows,
    // lets assign the final filtered rows to all of the other columns
    const nonFilteredColumns = columns.filter(
      column => !Object.keys(filters).includes(column.id)
    )

    // This essentially enables faceted filter options to be built easily
    // using every column's preFilteredRows value
    nonFilteredColumns.forEach(column => {
      column.preFilteredRows = filteredRows
    })
  }, [columns, filteredRows, filters])

  return {
    ...instance,
    setFilter,
    setAllFilters,
    preFilteredRows,
    rows: filteredRows,
  }
}

function shouldAutoRemove(autoRemove, value) {
  return autoRemove ? autoRemove(value) : typeof value === 'undefined'
}

function getFilterMethod(filter, userFilterTypes, filterTypes) {
  return (
    isFunction(filter) ||
    userFilterTypes[filter] ||
    filterTypes[filter] ||
    filterTypes.text
  )
}
