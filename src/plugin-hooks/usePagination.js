import React from 'react'

//

import {
  ensurePluginOrder,
  functionalUpdate,
  useMountedLayoutEffect,
  useGetLatest,
} from '../publicUtils'

import { expandRows } from '../utils'

const pluginName = 'usePagination'

export const usePagination = hooks => {
  hooks.getInitialState.push(getInitialState)
  hooks.useInstance.push(useInstance)
}

usePagination.pluginName = pluginName

function getInitialState(state) {
  return {
    pageSize: 10,
    pageIndex: 0,
    ...state,
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
    state: {
      pageSize,
      pageIndex,
      expanded,
      globalFilter,
      filters,
      groupBy,
      sortBy,
    },
    setState,
    data,
    manualPagination,
  } = instance

  ensurePluginOrder(
    plugins,
    ['useGlobalFilter', 'useFilters', 'useGroupBy', 'useSortBy', 'useExpanded'],
    'usePagination'
  )

  const getAutoResetPage = useGetLatest(autoResetPage)
  const getInstance = useGetLatest(instance)

  const resetPage = React.useCallback(
    () =>
      setState(
        old => ({
          ...old,
          pageIndex: getInstance().initialState.pageIndex || 0,
        }),
        {
          type: 'resetPage',
        }
      ),
    [getInstance, setState]
  )

  const pageCount = manualPagination
    ? userPageCount
    : Math.ceil(rows.length / pageSize)

  const pageOptions = React.useMemo(
    () =>
      pageCount > 0
        ? [...new Array(pageCount)].fill(null).map((d, i) => i)
        : [],
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
  const canNextPage =
    pageCount === -1 ? page.length >= pageSize : pageIndex < pageCount - 1

  const gotoPage = React.useCallback(
    pageIndex => {
      setState(
        old => {
          const { pageCount, page } = getInstance()
          const newPageIndex = functionalUpdate(pageIndex, old.pageIndex)
          const cannnotPreviousPage = newPageIndex < 0
          const cannotNextPage =
            pageCount === -1
              ? page.length < old.pageSize
              : newPageIndex > pageCount - 1

          if (cannnotPreviousPage || cannotNextPage) {
            return old
          }

          return {
            ...old,
            pageIndex: newPageIndex,
          }
        },
        {
          type: 'gotoPage',
        }
      )
    },
    [getInstance, setState]
  )

  const previousPage = React.useCallback(() => {
    return gotoPage(old => old - 1)
  }, [gotoPage])

  const nextPage = React.useCallback(() => {
    return gotoPage(old => old + 1)
  }, [gotoPage])

  const setPageSize = React.useCallback(
    pageSize => {
      setState(
        old => {
          const topRowIndex = old.pageSize * old.pageIndex
          const pageIndex = Math.floor(topRowIndex / pageSize)

          return {
            ...old,
            pageIndex,
            pageSize,
          }
        },
        {
          type: 'setPageSize',
        }
      )
    },
    [setState]
  )

  useMountedLayoutEffect(() => {
    if (getAutoResetPage()) {
      resetPage()
    }
  }, [
    resetPage,
    manualPagination ? null : data,
    globalFilter,
    filters,
    groupBy,
    sortBy,
  ])

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
