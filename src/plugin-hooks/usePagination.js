import React from 'react'

//
import { addActions, actions } from '../actions'
import { defaultState } from '../hooks/useTable'
import { ensurePluginOrder, safeUseLayoutEffect, expandRows } from '../utils'

defaultState.pageSize = 10
defaultState.pageIndex = 0

addActions('pageChange', 'pageSizeChange')

export const usePagination = hooks => {
  hooks.useMain.push(useMain)
}

usePagination.pluginName = 'usePagination'

function useMain(instance) {
  const {
    data,
    rows,
    manualPagination,
    disablePageResetOnDataChange,
    manualExpandedKey = 'expanded',
    debug,
    plugins,
    pageCount: userPageCount,
    paginateExpandedRows = true,
    expandSubRows = true,
    state: { pageSize, pageIndex, filters, groupBy, sortBy, expanded },
    setState,
  } = instance

  ensurePluginOrder(
    plugins,
    ['useFilters', 'useGroupBy', 'useSortBy', 'useExpanded'],
    'usePagination',
    []
  )

  const rowDep = manualPagination ? null : data

  const isPageIndexMountedRef = React.useRef()

  // Bypass any effects from firing when this changes
  const disablePageResetOnDataChangeRef = React.useRef()
  disablePageResetOnDataChangeRef.current = disablePageResetOnDataChange

  safeUseLayoutEffect(() => {
    if (
      isPageIndexMountedRef.current &&
      !disablePageResetOnDataChangeRef.current
    ) {
      setState(
        old => ({
          ...old,
          pageIndex: 0,
        }),
        actions.pageChange
      )
    }
    isPageIndexMountedRef.current = true
  }, [setState, rowDep, filters, groupBy, sortBy])

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
      if (process.env.NODE_ENV === 'development' && debug)
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
    updater => {
      if (process.env.NODE_ENV === 'development' && debug)
        console.info('gotoPage')
      return setState(old => {
        const newPageIndex =
          typeof updater === 'function' ? updater(old.pageIndex) : updater

        if (newPageIndex < 0 || newPageIndex > pageCount - 1) {
          return old
        }
        return {
          ...old,
          pageIndex: newPageIndex,
        }
      }, actions.pageChange)
    },
    [debug, pageCount, setState]
  )

  const previousPage = React.useCallback(() => {
    return gotoPage(old => old - 1)
  }, [gotoPage])

  const nextPage = React.useCallback(() => {
    return gotoPage(old => old + 1)
  }, [gotoPage])

  const setPageSize = React.useCallback(
    pageSize => {
      setState(old => {
        const topRowIndex = old.pageSize * old.pageIndex
        const pageIndex = Math.floor(topRowIndex / pageSize)
        return {
          ...old,
          pageIndex,
          pageSize,
        }
      }, actions.pageSizeChange)
    },
    [setState]
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
