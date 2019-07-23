import { useMemo } from 'react'
import PropTypes from 'prop-types'

import { getFirstDefined, isFunction } from '../utils'
import * as filterTypes from '../filterTypes'
import { addActions, actions } from '../actions'
import { defaultState } from '../hooks/useTableState'

defaultState.filters = {}
addActions({
  setFilter: '__setFilter__',
  setAllFilters: '__setAllFilters__',
})

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
    filterTypes: userFilterTypes = {},
    defaultFilter = filterTypes.text,
    manualFilters,
    disableFilters,
    hooks,
    state: [{ filters }, setState],
  } = props

  const setFilter = (id, val) => {
    return setState(old => {
      if (typeof val === 'undefined') {
        const { [id]: prev, ...rest } = filters
        return {
          ...old,
          filters: {
            ...rest,
          },
        }
      }

      return {
        ...old,
        filters: {
          ...filters,
          [id]: val,
        },
      }
    }, actions.setFilter)
  }

  const setAllFilters = filters => {
    return setState(old => {
      return {
        ...old,
        filters,
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

  const filteredRows = useMemo(() => {
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

          // Don't filter hidden columns or columns that have had their filters disabled
          if (!column || column.filterable === false) {
            return filteredSoFar
          }

          // Look up filter functions in this order:
          // column function
          // column string lookup on user filters
          // column string lookup on built-in filters
          // default function
          // default string lookup on user filters
          // default string lookup on built-in filters
          const filterMethod =
            isFunction(column.filter) ||
            userFilterTypes[column.filter] ||
            filterTypes[column.filter] ||
            isFunction(defaultFilter) ||
            userFilterTypes[defaultFilter] ||
            filterTypes[defaultFilter]

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
  }, [
    manualFilters,
    filters,
    debug,
    rows,
    columns,
    userFilterTypes,
    defaultFilter,
  ])

  return {
    ...props,
    setFilter,
    setAllFilters,
    rows: filteredRows,
  }
}
