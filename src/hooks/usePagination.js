import { useMemo, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'

//
import { addActions, actions } from '../actions'
import { defaultState } from './useTableState'

defaultState.pageSize = 10
defaultState.pageIndex = 0

addActions({
  pageChange: '__pageChange__',
  pageSizeChange: '__pageSizeChange__',
})

const propTypes = {
  // General
  manualPagination: PropTypes.bool,
}

export const usePagination = props => {
  PropTypes.checkPropTypes(propTypes, props, 'property', 'usePagination')

  const {
    rows,
    manualPagination,
    disablePageResetOnDataChange,
    debug,
    state: [
      {
        pageSize,
        pageIndex,
        pageCount: userPageCount,
        filters,
        groupBy,
        sortBy,
      },
      setState,
    ],
  } = props

  const pageOptions = useMemo(
    () => [...new Array(userPageCount)].map((d, i) => i),
    [userPageCount]
  )

  const rowDep = disablePageResetOnDataChange ? null : rows

  useLayoutEffect(() => {
    setState(
      old => ({
        ...old,
        pageIndex: 0,
      }),
      actions.pageChange
    )
  }, [setState, rowDep, filters, groupBy, sortBy])

  const { pages, pageCount } = useMemo(() => {
    if (manualPagination) {
      return {
        pages: [rows],
        pageCount: userPageCount,
      }
    }
    if (debug) console.info('getPages')

    // Create a new pages with the first page ready to go.
    const pages = rows.length ? [] : [[]]

    // Start the pageIndex and currentPage cursors
    let cursor = 0
    while (cursor < rows.length) {
      const end = cursor + pageSize
      pages.push(rows.slice(cursor, end))
      cursor = end
    }

    const pageCount = pages.length

    return {
      pages,
      pageCount,
      pageOptions,
    }
  }, [manualPagination, debug, rows, pageOptions, userPageCount, pageSize])

  const page = manualPagination ? rows : pages[pageIndex] || []
  const canPreviousPage = pageIndex > 0
  const canNextPage = pageIndex < pageCount - 1

  const gotoPage = pageIndex => {
    if (debug) console.info('gotoPage')
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
    ...props,
    pages,
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
