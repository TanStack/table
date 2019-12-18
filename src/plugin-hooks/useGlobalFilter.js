import React from 'react'

import {
  actions,
  getFilterMethod,
  useMountedLayoutEffect,
  functionalUpdate,
  useGetLatest,
  shouldAutoRemoveFilter,
  ensurePluginOrder,
} from '../utils'
import * as filterTypes from '../filterTypes'

// Actions
actions.resetGlobalFilter = 'resetGlobalFilter'
actions.setGlobalFilter = 'setGlobalFilter'

export const useGlobalFilter = hooks => {
  hooks.stateReducers.push(reducer)
  hooks.useInstance.push(useInstance)
}

useGlobalFilter.pluginName = 'useGlobalFilter'

function reducer(state, action, previousState, instance) {
  if (action.type === actions.resetGlobalFilter) {
    return {
      ...state,
      globalFilter: instance.initialState.globalFilter || undefined,
    }
  }

  if (action.type === actions.setGlobalFilter) {
    const { filterValue } = action
    const { userFilterTypes } = instance

    const filterMethod = getFilterMethod(
      instance.globalFilter,
      userFilterTypes || {},
      filterTypes
    )

    const newFilter = functionalUpdate(filterValue, state.globalFilter)

    //
    if (shouldAutoRemoveFilter(filterMethod.autoRemove, newFilter)) {
      const { globalFilter, ...stateWithoutGlobalFilter } = state
      return stateWithoutGlobalFilter
    }

    return {
      ...state,
      globalFilter: newFilter,
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
    globalFilter,
    manualGlobalFilter,
    state: { globalFilter: globalFilterValue },
    dispatch,
    autoResetGlobalFilters = true,
    plugins,
  } = instance

  ensurePluginOrder(plugins, [], 'useGlobalFilter', [
    'useSortBy',
    'useExpanded',
  ])

  const setGlobalFilter = filterValue => {
    dispatch({ type: actions.setGlobalFilter, filterValue })
  }

  // TODO: Create a filter cache for incremental high speed multi-filtering
  // This gets pretty complicated pretty fast, since you have to maintain a
  // cache for each row group (top-level rows, and each row's recursive subrows)
  // This would make multi-filtering a lot faster though. Too far?

  const [globalFilteredRows, globalFilteredFlatRows] = React.useMemo(() => {
    if (manualGlobalFilter || typeof globalFilterValue === 'undefined') {
      return [rows, flatRows]
    }

    const filteredFlatRows = []

    const filterMethod = getFilterMethod(
      globalFilter,
      userFilterTypes || {},
      filterTypes
    )

    if (!filterMethod) {
      console.warn(`Could not find a valid 'globalFilter' option.`)
      return rows
    }

    // Filters top level and nested rows
    const filterRows = filteredRows => {
      return filterMethod(
        filteredRows,
        flatColumns.map(d => d.id),
        globalFilterValue
      ).map(row => {
        filteredFlatRows.push(row)

        return {
          ...row,
          subRows:
            row.subRows && row.subRows.length
              ? filterRows(row.subRows)
              : row.subRows,
        }
      })
    }

    return [filterRows(rows), filteredFlatRows]
  }, [
    manualGlobalFilter,
    globalFilter,
    userFilterTypes,
    rows,
    flatRows,
    flatColumns,
    globalFilterValue,
  ])

  const getAutoResetGlobalFilters = useGetLatest(autoResetGlobalFilters)

  useMountedLayoutEffect(() => {
    if (getAutoResetGlobalFilters()) {
      dispatch({ type: actions.resetGlobalFilter })
    }
  }, [dispatch, manualGlobalFilter ? null : data])

  Object.assign(instance, {
    preGlobalFilteredRows: rows,
    preGlobalFilteredFlatRows: flatRows,
    globalFilteredRows,
    globalFilteredFlatRows,
    rows: globalFilteredRows,
    flatRows: globalFilteredFlatRows,
    setGlobalFilter,
  })
}
