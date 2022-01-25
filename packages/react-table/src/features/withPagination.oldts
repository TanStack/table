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
import { MakeInstance, GetDefaultOptions } from '../types'

const getDefaultOptions: GetDefaultOptions = options => {
  return {
    onPageIndexChange: React.useCallback(makeStateUpdater('pageIndex'), []),
    onPageSizeChange: React.useCallback(makeStateUpdater('pageSize'), []),
    onPageCountChange: React.useCallback(makeStateUpdater('pageCount'), []),
    autoResetPageIndex: true,
    paginateExpandedRows: true,
    ...options,
    initialState: {
      pageIndex: 0,
      pageSize: 10,
      pageCount: 0,
      ...options.initialState,
    },
  }
}

const extendInstance: MakeInstance = instance => {
  const pageResetDeps = [
    instance.options.manualPagination ? null : instance.options.data,
    instance.state.globalFilter,
    instance.state.columnFilters,
    instance.state.grouping,
    instance.state.sorting,
  ]
  React.useMemo(() => {
    if (instance.options.autoResetPageIndex) {
      instance.state.pageIndex = instance.options.initialState?.pageIndex ?? 0
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, pageResetDeps)

  useMountedLayoutEffect(() => {
    if (instance.options.autoResetPageIndex) {
      instance.resetPageIndex?.()
    }
  }, pageResetDeps)

  instance.setPageIndex = React.useCallback(
    updater =>
      instance.options.onPageIndexChange?.(old => {
        const newPageIndex = functionalUpdate(updater, old)
        const pageCount = instance.getPageCount?.() ?? 0
        const maxPageIndex =
          pageCount > 0 ? pageCount - 1 : Number.MAX_SAFE_INTEGER

        return Math.min(Math.max(0, newPageIndex), maxPageIndex)
      }, instance),
    [instance]
  )

  instance.setPageSize = React.useCallback(
    updater =>
      instance.options.onPageSizeChange?.(old => {
        const newPageSize = Math.max(1, functionalUpdate(updater, old))
        const topRowIndex = old! * instance.state.pageIndex!
        const pageIndex = Math.floor(topRowIndex / newPageSize)

        if (instance.state.pageIndex !== pageIndex) {
          instance.setPageIndex?.(pageIndex)
        }

        return newPageSize
      }, instance),
    [instance]
  )

  instance.setPageCount = React.useCallback(
    updater =>
      instance.options.onPageCountChange?.(
        old => Math.max(0, functionalUpdate(updater, old)),
        instance
      ),
    [instance]
  )

  instance.resetPageIndex = React.useCallback(
    () =>
      instance.setPageIndex?.(instance.options.initialState?.pageIndex ?? 0),
    [instance]
  )

  instance.resetPageSize = React.useCallback(
    () => instance.setPageSize?.(instance.options.initialState?.pageSize ?? 10),
    [instance]
  )

  instance.resetPageCount = React.useCallback(
    () =>
      instance.setPageCount?.(instance.options.initialState?.pageCount ?? 0),
    [instance]
  )

  instance.getPageCount = React.useCallback(
    () =>
      instance.options.manualPagination
        ? instance.state.pageCount!
        : instance.rows
        ? Math.ceil(instance.rows.length / instance.state.pageSize!)
        : -1,
    [
      instance.options.manualPagination,
      instance.rows,
      instance.state.pageCount,
      instance.state.pageSize,
    ]
  )

  const pageCount = instance.getPageCount?.()

  instance.getPageOptions = useLazyMemo(() => {
    let pageOptions: number[] = []
    if (pageCount > 0) {
      pageOptions = [...new Array(pageCount)].fill(null).map((_, i) => i)
    }
    return pageOptions
  }, [pageCount])

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
      const pageStart = pageSize! * pageIndex!
      const pageEnd = pageStart + pageSize!

      page = rows.slice(pageStart, pageEnd)
    }

    if (instance.options.paginateExpandedRows) {
      return page
    }

    return expandRows(page, instance)
  }, [instance])

  instance.getCanPreviousPage = React.useCallback(
    () => instance.state.pageIndex! > 0,
    [instance.state.pageIndex]
  )

  instance.getCanNextPage = React.useCallback(() => {
    const {
      state: { pageSize, pageIndex },
      getPageRows,
      getPageCount,
    } = instance

    const pageCount = getPageCount?.() ?? 0

    return pageCount === 0
      ? (getPageRows?.().length ?? 0) >= pageSize!
      : pageIndex! < (pageCount ?? 0) - 1
  }, [instance])

  instance.gotoPreviousPage = React.useCallback(() => {
    return instance.setPageIndex?.(old => old! - 1)
  }, [instance])

  instance.gotoNextPage = React.useCallback(() => {
    return instance.setPageIndex?.(old => old! + 1)
  }, [instance])

  return instance
}

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
    getDefaultOptions,
    extendInstance,
  },
}
