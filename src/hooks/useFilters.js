import { useMemo } from 'react'
import PropTypes from 'prop-types'

import { defaultFilterFn, getFirstDefined } from '../utils'
import { addActions, actions } from '../actions'
import { defaultState } from './useTableState'

defaultState.filters = {}
addActions({
  setFilter: '__setFilter__',
  setAllFilters: '__setAllFilters__'
})

const propTypes = {
  // General
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      filterFn: PropTypes.func,
      filterAll: PropTypes.bool,
      canFilter: PropTypes.bool,
      Filter: PropTypes.any
    })
  ),

  filterFn: PropTypes.func,
  manualFilters: PropTypes.bool
}

export const useFilters = props => {
  PropTypes.checkPropTypes(propTypes, props, 'property', 'useFilters')

  const {
    debug,
    rows,
    columns,
    filterFn = defaultFilterFn,
    manualFilters,
    disableFilters,
    hooks,
    state: [{ filters }, setState]
  } = props

  columns.forEach(column => {
    const { id, accessor, canFilter } = column
    column.canFilter = accessor
      ? getFirstDefined(
        canFilter,
        disableFilters === true ? false : undefined,
        true
      )
      : false
    // Was going to add this to the filter hook
    column.filterValue = filters[id]
  })

  const setFilter = (id, val) => {
    return setState(old => {
      if (typeof val === 'undefined') {
        const { [id]: prev, ...rest } = filters
        return {
          ...old,
          filters: {
            ...rest
          }
        }
      }

      return {
        ...old,
        filters: {
          ...filters,
          [id]: val
        }
      }
    }, actions.setFilter)
  }

  const setAllFilters = filters => {
    return setState(old => {
      return {
        ...old,
        filters
      }
    }, actions.setAllFilters)
  }

  hooks.columns.push(columns => {
    columns.forEach(column => {
      if (column.canFilter) {
        column.setFilter = val => setFilter(column.id, val)
      }
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

          const filterMethod = column.filterMethod || filterFn

          // If 'filterAll' is set to true, pass the entire dataset to the filter method
          if (column.filterAll) {
            return filterMethod(filteredSoFar, columnID, filterValue, column)
          }
          return filteredSoFar.filter(row =>
            filterMethod(row, columnID, filterValue, column)
          )
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
          subRows: filterRows(row.subRows)
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
  }, [rows, filters, manualFilters])

  return {
    ...props,
    setFilter,
    setAllFilters,
    rows: filteredRows
  }
}
