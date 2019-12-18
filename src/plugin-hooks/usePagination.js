import React from 'react'

//

import {
  actions,
  ensurePluginOrder,
  expandRows,
  functionalUpdate,
  useMountedLayoutEffect,
  useGetLatest,
} from '../utils'

const pluginName = 'usePagination'

// Actions
actions.resetPage = 'resetPage'
actions.gotoPage = 'gotoPage'
actions.setPageSize = 'setPageSize'

export const usePagination = hooks => {
  hooks.stateReducers.push(reducer)
  hooks.useInstance.push(useInstance)
}

usePagination.pluginName = pluginName

function reducer(state, action, previousState, instance) {
  if (action.type === actions.init) {
    return {
      pageSize: 10,
      pageIndex: 0,
      ...state,
    }
  }

  if (action.type === actions.resetPage) {
    return {
      ...state,
      pageIndex: instance.initialState.pageIndex || 0,
    }
  }

  if (action.type === actions.gotoPage) {
    const { pageCount } = instance
    const newPageIndex = functionalUpdate(action.pageIndex, state.pageIndex)

    if (newPageIndex < 0 || newPageIndex > pageCount - 1) {
      return state
    }
    return {
      ...state,
      pageIndex: newPageIndex,
    }
  }

  if (action.type === actions.setPageSize) {
    const { pageSize } = action
    const topRowIndex = state.pageSize * state.pageIndex
    const pageIndex = Math.floor(topRowIndex / pageSize)

    return {
      ...state,
      pageIndex,
      pageSize,
    }
  }
}

function useInstance(instance) {
  const {
    rows,
    autoResetPage = true,
    manualExpandedKey = 'expanded',
    plugins,
    pageCount: userPageCount,
    paginateExpandedRows = true,
    expandSubRows = true,
    state: { pageSize, pageIndex, expanded, filters, groupBy, sortBy },
    dispatch,
    data,
    manualPagination,
    manualFilters,
    manualGroupBy,
    manualSortBy,
  } = instance

  ensurePluginOrder(
    plugins,
    ['useFilters', 'useGroupBy', 'useSortBy', 'useExpanded'],
    'usePagination',
    []
  )

  const getAutoResetPage = useGetLatest(autoResetPage)

  useMountedLayoutEffect(() => {
    if (getAutoResetPage()) {
      dispatch({ type: actions.resetPage })
    }
  }, [
    dispatch,
    manualPagination ? null : data,
    manualPagination || manualFilters ? null : filters,
    manualPagination || manualGroupBy ? null : groupBy,
    manualPagination || manualSortBy ? null : sortBy,
  ])

  const pageCount = manualPagination
    ? userPageCount
    : Math.ceil(rows.length / pageSize)

  const pageOptions = React.useMemo(
    () => (pageCount > 0 ? [...new Array(pageCount)].map((d, i) => i) : []),
    [pageCount]
  )

  const page = React.useMemo(() => {
    let page

    if (manualPagination) {
      page = rows
    } else {
      const pageStart = pageSize * pageIndex
      const pageEnd = pageStart + pageSize

      page = rows.slice(pageStart, pageEnd)
    }

    if (paginateExpandedRows) {
      return page
    }

    return expandRows(page, { manualExpandedKey, expanded, expandSubRows })
  }, [
    expandSubRows,
    expanded,
    manualExpandedKey,
    manualPagination,
    pageIndex,
    pageSize,
    paginateExpandedRows,
    rows,
  ])

  const canPreviousPage = pageIndex > 0
  const canNextPage = pageCount === -1 || pageIndex < pageCount - 1

  const gotoPage = React.useCallback(
    pageIndex => {
      dispatch({ type: actions.gotoPage, pageIndex })
    },
    [dispatch]
  )

  const previousPage = React.useCallback(() => {
    return gotoPage(old => old - 1)
  }, [gotoPage])

  const nextPage = React.useCallback(() => {
    return gotoPage(old => old + 1)
  }, [gotoPage])

  const setPageSize = React.useCallback(
    pageSize => {
      dispatch({ type: actions.setPageSize, pageSize })
    },
    [dispatch]
  )

  Object.assign(instance, {
    pageOptions,
    pageCount,
    page,
    canPreviousPage,
    canNextPage,
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
  })
}
