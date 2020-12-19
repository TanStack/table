import React from 'react'

import {
  getFirstDefined,
  getFilterMethod,
  shouldAutoRemoveFilter,
} from '../utils'

import {
  actions,
  useGetLatest,
  functionalUpdate,
  useMountedLayoutEffect,
  reduceMappings,
} from '../publicUtils'

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
    const { allColumns, filterTypes: userFilterTypes } = instance

    const column = allColumns.find(d => d.id === columnId)

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
    if (shouldAutoRemoveFilter(filterMethod.autoRemove, newFilter, column)) {
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
    const { allColumns, filterTypes: userFilterTypes } = instance

    return {
      ...state,
      // Filter out undefined values
      filters: functionalUpdate(filters, state.filters).filter(filter => {
        const column = allColumns.find(d => d.id === filter.id)
        const filterMethod = getFilterMethod(
          column.filter,
          userFilterTypes || {},
          filterTypes
        )

        if (
          shouldAutoRemoveFilter(filterMethod.autoRemove, filter.value, column)
        ) {
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
    rowsById,
    allColumns,
    filterTypes: userFilterTypes,
    manualFilters,
    defaultCanFilter = false,
    disableFilters,
    state: { filters },
    dispatch,
    autoResetFilters = true,
  } = instance

  const setFilter = React.useCallback(
    (columnId, filterValue) => {
      dispatch({ type: actions.setFilter, columnId, filterValue })
    },
    [dispatch]
  )

  const setAllFilters = React.useCallback(
    filters => {
      dispatch({
        type: actions.setAllFilters,
        filters,
      })
    },
    [dispatch]
  )

  allColumns.forEach(column => {
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

  const [
    filteredRows,
    filteredFlatRows,
    filteredRowsById,
  ] = React.useMemo(() => {
    if (manualFilters || !filters.length) {
      return [rows, flatRows, rowsById]
    }

    //partially apply useFilterType and filterTypes to avoid having to pass these around
    const prepareFilter = filter =>
      getFilterMethod(filter, userFilterTypes || {}, filterTypes)

    const columnFilterPairs = filters.map(filterOption => {
      const { id: columnId, value: filterValue } = filterOption

      //Find the column this filter is refering to
      const column = allColumns.find(d => d.id === columnId)
      //Create the filter function for this column
      const filter = produceFilterFromColumn(column, filterValue, prepareFilter)

      return { column, filter }
    })

    //main row filters update their column with their current filter progress
    const mainRowFilters = columnFilterPairs.map(
      ({ column, filter }) => rows => {
        const filteredRows = filter(rows)
        Object.assign(column, { preFilteredRows: rows, filteredRows })
        return filteredRows
      }
    )

    //sub row filters DO NOT update the column with their "in progress" filtered values
    const subRowFilters = columnFilterPairs.map(({ filter }) => filter)

    //Build a function that recusively evaluates rows starting from a row
    const filterSubRows = row => reduceMappings(row.subRows, subRowFilters)
    const evaluateRow = (row, depth = 0) =>
      reduceMappings(row, [
        //expose the current depth to the filter
        row => ({ ...row, depth }),

        //recurse the subrows first
        row => ({
          ...row,
          subRows: row.subRows?.map(row => evaluateRow(row, depth + 1)) || [],
        }),

        //filter and collect the subrows
        row => {
          //collect the flat rows before filtering
          const [subRowsFlat, subRowsById] = row.subRows.reduce(
            ([filteredFlatRows, filteredRowsById], row) => [
              [...filteredFlatRows, ...row.filteredFlatRows],
              { ...filteredRowsById, ...row.filteredRowsById },
            ],
            [[], {}]
          )

          const filteredSubRows = filterSubRows(row)
          return {
            ...row,
            subRows: filteredSubRows,
            prefilteredSubRows: row.subRows,
            filteredFlatRows: [...filteredSubRows, ...subRowsFlat],
            filteredRowsById: {
              ...Object.fromEntries(filteredSubRows.map(row => [row.id, row])),
              ...subRowsById,
            },
          }
        },
      ])

    //evaluate each row
    const evaluatedRows = rows.map(row => evaluateRow(row))

    //filter the main rows with thier special filters
    const filteredRows = reduceMappings(evaluatedRows, mainRowFilters)

    //do this first so we get a lookup table
    const filteredMainRowsById = Object.fromEntries(
      filteredRows.map(row => [row.id, row])
    )

    //collect filteredFlatRows, filteredRowsById
    const [filteredFlatRows, filteredRowsById] = evaluatedRows.reduce(
      ([filteredFlatRows, filteredRowsById], row) => [
        [
          ...filteredFlatRows,
          ...([filteredRowsById[row.id]] || []), // to ensure that flatRows occurs in depth first order we need to conditionally add it here
          ...row.filteredFlatRows,
        ],
        { ...filteredRowsById, ...row.filteredRowsById },
      ],
      [[], filteredMainRowsById] //since order doesn't matter in objects prepopulate with the main rows
    )

    return [filteredRows, filteredFlatRows, filteredRowsById]
  }, [
    manualFilters,
    filters,
    rows,
    flatRows,
    rowsById,
    allColumns,
    userFilterTypes,
  ])

  React.useMemo(() => {
    // Now that each filtered column has it's partially filtered rows,
    // lets assign the final filtered rows to all of the other columns
    const nonFilteredColumns = allColumns.filter(
      column => !filters.find(d => d.id === column.id)
    )

    // This essentially enables faceted filter options to be built easily
    // using every column's preFilteredRows value
    nonFilteredColumns.forEach(column => {
      column.preFilteredRows = filteredRows
      column.filteredRows = filteredRows
    })
  }, [filteredRows, filters, allColumns])

  const getAutoResetFilters = useGetLatest(autoResetFilters)

  useMountedLayoutEffect(() => {
    if (getAutoResetFilters()) {
      dispatch({ type: actions.resetFilters })
    }
  }, [dispatch, manualFilters ? null : data])

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
    setFilter,
    setAllFilters,
  })
}

const produceFilterFromColumn = (column, filterValue, getFilterMethod) => {
  if (!column) return rows => rows

  const filterMethod = getFilterMethod(column.filter)

  if (!filterMethod) {
    console.warn(
      `Could not find a valid 'column.filter' for column with the ID: ${column.id}.`
    )
    return rows => rows
  }

  return rows => filterMethod(rows, [column.id], filterValue)
}

export default useFilters

//This allows you to use any existing filter as a tree filter.
//This HOC is inherently slow (does 1 extra list traversal)
//If you find that this causes table to slow down it's best to implement this yourself
/* eg.
	{
	  Header: "Name",
	  accessor: "name",
	  filter: makeTreeFilter(text, "subRowHasMatch")
	}
  */

export function makeTreeFilter(
  filter = filterTypes.text,
  deep_filter_key = 'deep_filtered'
) {
  //(row, ids, filterValue)
  return (rows, ids, filterValue) => {
    const filteredRowsById = Object.fromEntries(
      filter(rows, ids, filterValue).map(row => [row.id, row])
    )

    //rebuild the list from subRows that have a descendant that matches the filter or things matched throught the userFilter
    return rows.reduce((rows, row) => {
      const matchedRow = filteredRowsById[row.id]
      if (matchedRow) {
        matchedRow[deep_filter_key] = false //this flag indicates that this row was filtered directly
        return [...rows, matchedRow]
      } else if (row.filteredFlatRows.length > 0) {
        row[deep_filter_key] = true
        return [...rows, row]
      } else {
        return rows
      }
    }, [])
  }
}
