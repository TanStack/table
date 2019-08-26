import React from 'react'
import PropTypes from 'prop-types'

//
import { addActions, actions } from '../actions'
import { defaultState } from '../hooks/useTableState'
import { ensurePluginOrder } from '../utils'

defaultState.pageSize = 10
defaultState.pageIndex = 0

addActions('pageChange', 'pageSizeChange')

const propTypes = {
  // General
  manualPagination: PropTypes.bool,
  paginateExpandedRows: PropTypes.bool,
}

// SSR has issues with useLayoutEffect still, so use useEffect during SSR
let useLayoutEffect =
  typeof window !== 'undefined' && process.env.NODE_ENV === 'production'
    ? React.useLayoutEffect
    : React.useEffect

export const usePagination = hooks => {
  hooks.useMain.push(useMain)
}

usePagination.pluginName = 'usePagination'

function useMain(instance) {
  PropTypes.checkPropTypes(propTypes, instance, 'property', 'usePagination')

  const {
    data,
    rows,
    manualPagination,
    disablePageResetOnDataChange,
    debug,
    plugins,
    pageCount: userPageCount,
    paginateExpandedRows = true,
    state: [{ pageSize, pageIndex, filters, groupBy, sortBy }, setState],
  } = instance

  ensurePluginOrder(
    plugins,
    ['useFilters', 'useGroupBy', 'useSortBy', 'useExpanded'],
    'usePagination',
    []
  )

  const rowDep = manualPagination ? null : data

  const isPageIndexMountedRef = React.useRef()

  useLayoutEffect(() => {
    if (isPageIndexMountedRef.current && !disablePageResetOnDataChange) {
      setState(
        old => ({
          ...old,
          pageIndex: 0,
        }),
        actions.pageChange
      )
    }
    isPageIndexMountedRef.current = true
  }, [setState, rowDep, filters, groupBy, sortBy, disablePageResetOnDataChange])

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

    const expandedPage = []

    const handleRow = row => {
      expandedPage.push(row)

      if (row.subRows && row.subRows.length && row.isExpanded) {
        row.subRows.forEach(handleRow)
      }
    }

    page.forEach(handleRow)

    return expandedPage
  }, [debug, manualPagination, pageIndex, pageSize, paginateExpandedRows, rows])

  const canPreviousPage = pageIndex > 0
  const canNextPage = pageCount === -1 || pageIndex < pageCount - 1

  const gotoPage = pageIndex => {
    if (process.env.NODE_ENV === 'development' && debug)
      console.info('gotoPage')
    return setState(old => {
      if (pageIndex < 0 || pageIndex > pageCount - 1) {
        return old
      }
      return {
        ...old,
        pageIndex,
      }
    }, actions.pageChange)
  }

  const previousPage = () => {
    return gotoPage(pageIndex - 1)
  }

  const nextPage = () => {
    return gotoPage(pageIndex + 1)
  }

  const setPageSize = pageSize => {
    setState(old => {
      const topRowIndex = old.pageSize * old.pageIndex
      const pageIndex = Math.floor(topRowIndex / pageSize)
      return {
        ...old,
        pageIndex,
        pageSize,
      }
    }, actions.pageSizeChange)
  }

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
