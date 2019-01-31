import { useMemo, useState, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'

import { warnUnknownProps } from './utils'
import useControlledState from './hooks/useControlledState'

const propTypes = {
  defaultPageSize: PropTypes.number,
  defaultPageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  pages: PropTypes.number,
  pageIndex: PropTypes.number,
  onStateChange: PropTypes.func,
  stateReducer: PropTypes.func,
  subRowsKey: PropTypes.string,
  debug: PropTypes.bool,
}

export const actions = {
  pageChange: '__pageChange__',
}

export default function usePagination (
  {
    debug: parentDebug, rows, prepareRows, groupedRows, sortedRows, filteredRows,
  },
  props = {}
) {
  // Validate props
  PropTypes.checkPropTypes(propTypes, props, 'property', 'usePagination')

  // Destructure props
  const {
    defaultPageSize = 10,
    defaultPageIndex = 0,
    pageSize: userPageSize,
    pageIndex: userPageIndex,
    state: userState,
    manualPagination,
    pageCount: userPageCount,
    pageOptions: userPageOptions,
    debug = parentDebug,
    ...rest
  } = props

  warnUnknownProps(rest)

  const defaultState = useState({})
  const localState = userState || defaultState

  // Build the controllable state
  const [{ pageSize, pageIndex }, setState] = useControlledState(
    localState,
    {
      pageSize: defaultPageSize,
      pageIndex: defaultPageIndex,
    },
    {
      pageSize: userPageSize,
      pageIndex: userPageIndex,
    }
  )

  useLayoutEffect(
    () => {
      if (manualPagination) {
        return
      }
      setState(
        old => ({
          ...old,
          pageIndex: 0,
        }),
        actions.pageChange
      )
    },
    [groupedRows, sortedRows, filteredRows]
  )

  const { pages, pageCount } = useMemo(
    () => {
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
    },
    [rows, pageSize, userPageCount]
  )

  const pageOptions = [...new Array(pageCount)].map((d, i) => i)
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

  const previousPage = () => gotoPage(pageIndex - 1)

  const nextPage = () => gotoPage(pageIndex + 1)

  const setPageSize = pageSize => {
    setState(old => ({
      ...old,
      pageSize,
    }))
  }

  prepareRows(page)

  return {
    pages,
    pageIndex,
    pageOptions,
    page,
    canPreviousPage,
    canNextPage,
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
  }
}
