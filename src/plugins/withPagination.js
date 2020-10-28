import React from 'react'

import {
  functionalUpdate,
  expandRows,
  useLazyMemo,
  useMountedLayoutEffect,
  makeStateUpdater,
} from '../utils'

import {
  withPagination as name,
  withColumnVisibility,
  withColumnFilters,
  withGlobalFilter,
  withGrouping,
  withSorting,
  withExpanding,
} from '../Constants'

export const withPagination = {
  name,
  after: [
    withColumnVisibility,
    withColumnFilters,
    withGlobalFilter,
    withGrouping,
    withSorting,
    withExpanding,
  ],
  plugs: {
    useReduceOptions,
    useInstanceAfterState,
  },
}

function useReduceOptions(options) {
  return {
    onPageIndexChange: React.useCallback(makeStateUpdater('pageIndex'), []),
    onPageSizeChange: React.useCallback(makeStateUpdater('pageSize'), []),
    onPageCountChange: React.useCallback(makeStateUpdater('pageCount'), []),
    autoResetPage: true,
    ...options,
    initialState: {
      pageIndex: 0,
      pageSize: 10,
      pageCount: -1,
      ...options.initialState,
    },
  }
}

function useInstanceAfterState(instance) {
  const pageResetDeps = [
    instance.options.manualPagination ? null : instance.options.data,
    instance.state.globalFilter,
    instance.state.columnFilters,
    instance.state.grouping,
    instance.state.sorting,
  ]
  React.useMemo(() => {
    if (instance.options.autoResetPage) {
      instance.state.pageIndex = instance.options.initialState.pageIndex
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, pageResetDeps)

  useMountedLayoutEffect(() => {
    if (instance.options.autoResetPage) {
      instance.resetPage()
    }
  }, pageResetDeps)

  instance.setPageIndex = React.useCallback(
    updater => {
      instance.options.onPageIndexChange(old => {
        const {
          getPageCount,
          state: { page },
        } = instance
        const newPageIndex = functionalUpdate(updater, old)
        const pageCount = getPageCount()
        const cannnotPreviousPage = newPageIndex < 0
        const cannotNextPage =
          pageCount === -1 ? page.length < old : newPageIndex > pageCount - 1

        if (cannnotPreviousPage || cannotNextPage) {
          return old
        }

        return newPageIndex
      }, instance)
    },
    [instance]
  )

  instance.setPageSize = React.useCallback(
    updater => {
      instance.options.onPageSizeChange(old => {
        const newPageSize = Math.max(1, functionalUpdate(updater, old))
        const topRowIndex = old.pageSize * old.pageIndex
        const pageIndex = Math.floor(topRowIndex / newPageSize)

        instance.setPageIndex(pageIndex)

        return newPageSize
      }, instance)
    },
    [instance]
  )

  instance.setPageCount = React.useCallback(
    updater => {
      instance.options.onPageCountChange(
        old => Math.max(-1, functionalUpdate(updater, old)),
        instance
      )
    },
    [instance]
  )

  instance.resetPageIndex = React.useCallback(
    () => instance.setPageIndex(instance.options.initialState.pageIndex),
    [instance]
  )

  instance.resetPageSize = React.useCallback(
    () => instance.setPageSize(instance.options.initialState.pageSize),
    [instance]
  )

  instance.resetPageCount = React.useCallback(
    () => instance.setPageCount(instance.options.initialState.pageCount),
    [instance]
  )

  instance.getPageCount = React.useCallback(
    () =>
      instance.options.manualPagination
        ? instance.state.pageCount
        : instance.rows
        ? Math.ceil(instance.rows.length / instance.state.pageSize)
        : 0,
    [
      instance.options.manualPagination,
      instance.rows,
      instance.state.pageCount,
      instance.state.pageSize,
    ]
  )

  instance.getPageOptions = useLazyMemo(() => {
    const pageCount = instance.getPageCount()

    return pageCount > 0
      ? [...new Array(pageCount)].fill(null).map((d, i) => i)
      : []
  }, [instance.getPageCount()])

  instance.getPageRows = React.useCallback(() => {
    const {
      rows,
      state: { pageIndex, pageSize },
      options: { manualPagination },
    } = instance
    let page

    if (manualPagination) {
      page = rows
    } else {
      const pageStart = pageSize * pageIndex
      const pageEnd = pageStart + pageSize

      page = rows.slice(pageStart, pageEnd)
    }

    if (instance.options.paginateExpandedRows) {
      return page
    }

    return expandRows(page, instance)
  }, [instance])

  instance.getCanPreviousPage = React.useCallback(
    () => instance.state.pageIndex > 0,
    [instance.state.pageIndex]
  )

  instance.getCanNextPage = React.useCallback(() => {
    const {
      state: { pageSize, pageIndex },
      getPageRows,
      getPageCount,
    } = instance

    return getPageCount() === -1
      ? getPageRows().length >= pageSize
      : pageIndex < getPageCount() - 1
  }, [instance])

  instance.previousPage = React.useCallback(() => {
    return instance.gotoPage(old => old - 1)
  }, [instance])

  instance.nextPage = React.useCallback(() => {
    return instance.gotoPage(old => old + 1)
  }, [instance])
}
