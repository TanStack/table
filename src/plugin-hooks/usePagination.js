import React from 'react'

//

import { actions, reducerHandlers } from '../hooks/useTable'
import {
  ensurePluginOrder,
  safeUseLayoutEffect,
  expandRows,
  functionalUpdate,
} from '../utils'

const pluginName = 'usePagination'

// Actions
actions.resetPage = 'resetPage'
actions.gotoPage = 'gotoPage'
actions.setPageSize = 'setPageSize'

// Reducer
reducerHandlers[pluginName] = (state, action) => {
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
      pageIndex: 0,
    }
  }

  if (action.type === actions.gotoPage) {
    const { pageCount } = action.instanceRef.current
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

export const usePagination = hooks => {
  hooks.useMain.push(useMain)
}

usePagination.pluginName = pluginName

const defaultGetResetPageDeps = ({
  data,
  manualPagination,
  state: { filters, groupBy, sortBy },
}) => [manualPagination ? null : data, filters, groupBy, sortBy]

function useMain(instance) {
  const {
    rows,
    manualPagination,
    getResetPageDeps = defaultGetResetPageDeps,
    manualExpandedKey = 'expanded',
    debug,
    plugins,
    pageCount: userPageCount,
    paginateExpandedRows = true,
    expandSubRows = true,
    state: { pageSize, pageIndex, expanded },
    dispatch,
  } = instance

  ensurePluginOrder(
    plugins,
    ['useFilters', 'useGroupBy', 'useSortBy', 'useExpanded'],
    'usePagination',
    []
  )

  // Bypass any effects from firing when this changes
  const isMountedRef = React.useRef()
  safeUseLayoutEffect(() => {
    if (isMountedRef.current) {
      dispatch({ type: actions.resetPage })
    }
    isMountedRef.current = true
  }, [dispatch, ...(getResetPageDeps ? getResetPageDeps(instance) : [])])

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
      if (process.env.NODE_ENV !== 'production' && debug)
        console.info('getPage')

      const pageStart = pageSize * pageIndex
      const pageEnd = pageStart + pageSize

      page = rows.slice(pageStart, pageEnd)
    }

    if (paginateExpandedRows) {
      return page
    }

    return expandRows(page, { manualExpandedKey, expanded, expandSubRows })
  }, [
    debug,
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

  return {
    ...instance,
    pageOptions,
    pageCount,
    page,
    canPreviousPage,
    canNextPage,
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    pageIndex,
    pageSize,
  }
}
