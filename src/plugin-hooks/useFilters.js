import React from 'react'
import PropTypes from 'prop-types'

import { getFirstDefined, isFunction } from '../utils'
import * as filterTypes from '../filterTypes'
import { addActions, actions } from '../actions'
import { defaultState } from '../hooks/useTableState'

defaultState.filters = {}

addActions('setFilter', 'setAllFilters')

const propTypes = {
  // General
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      filterFn: PropTypes.func,
      filterAll: PropTypes.bool,
      canFilter: PropTypes.bool,
      Filter: PropTypes.any,
    })
  ),

  filterFn: PropTypes.func,
  manualFilters: PropTypes.bool,
}

export const useFilters = props => {
  PropTypes.checkPropTypes(propTypes, props, 'property', 'useFilters')

  const {
    debug,
    rows,
    columns,
    filterTypes: userFilterTypes,
    manualFilters,
    disableFilters,
    hooks,
    state: [{ filters }, setState],
  } = props

  const setFilter = (id, updater) => {
    const column = columns.find(d => d.id === id)

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

  hooks.columns.push(columns => {
    columns.forEach(column => {
      const { id, accessor, canFilter } = column

      // Determine if a column is filterable
      column.canFilter = accessor
        ? getFirstDefined(
            canFilter,
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

    return columns
  })

  // TODO: Create a filter cache for incremental high speed multi-filtering
  // This gets pretty complicated pretty fast, since you have to maintain a
  // cache for each row group (top-level rows, and each row's recursive subrows)
  // This would make multi-filtering a lot faster though. Too far?

  const filteredRows = React.useMemo(
    () => {
      if (manualFilters || !Object.keys(filters).length) {
        return rows
      }

      if (debug) console.info('getFilteredRows')

      // Filters top level and nested rows
      const filterRows = rows => {
        let filteredRows = rows

        filteredRows = Object.entries(filters).reduce(
          (filteredSoFar, [columnID, filterValue]) => {
            // Find the filters column
            const column = columns.find(d => d.id === columnID)

            column.preFilteredRows = filteredSoFar

            // Don't filter hidden columns or columns that have had their filters disabled
            if (!column || column.filterable === false) {
              return filteredSoFar
            }

            const columnFilter = column.filter || 'text'

            const filterMethod = getFilterMethod(
              columnFilter,
              userFilterTypes || {},
              filterTypes
            )

            if (!filterMethod) {
              console.warn(
                `Could not find a valid 'column.filter' for column with the ID: ${
                  column.id
                }.`
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
            subRows: filterRows(row.subRows),
          }
        })

        // then filter any rows without subcolumns because it would be strange to show
        filteredRows = filteredRows.filter(row => {
          if (!row.subRows) {
            return true
          }
          return row.subRows.length > 0
        })

        return filteredRows
      }

      return filterRows(rows)
    },
    [manualFilters, filters, debug, rows, columns, userFilterTypes]
  )

  return {
    ...props,
    setFilter,
    setAllFilters,
    preFilteredRows: rows,
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
