import React from 'react'

import {
  useGetLatest,
  functionalUpdate,
  expandRows,
  useLazyMemo,
  useMountedLayoutEffect,
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
  useReduceOptions,
  useInstanceAfterState,
}

function useReduceOptions(options) {
  return {
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
  const { setState } = instance

  const getInstance = useGetLatest(instance)

  const pageResetDeps = [
    instance.options.manualPagination ? null : instance.options.data,
    instance.state.globalFilterValue,
    instance.state.columnFilters,
    instance.state.grouping,
    instance.state.sorting,
  ]
  React.useMemo(() => {
    if (getInstance().options.autoResetPage) {
      getInstance().state.pageIndex = getInstance().getInitialState().pageIndex
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, pageResetDeps)

  useMountedLayoutEffect(() => {
    if (getInstance().options.autoResetPage) {
      instance.resetPage()
    }
  }, pageResetDeps)

  instance.resetPage = React.useCallback(
    () =>
      setState(
        old => ({
          ...old,
          pageIndex: getInstance().getInitialState().pageIndex,
        }),
        {
          type: 'resetPage',
        }
      ),
    [getInstance, setState]
  )

  instance.resetPageSize = React.useCallback(
    () =>
      setState(
        old => ({
          ...old,
          pageIndex: getInstance().getInitialState().pageSize,
        }),
        {
          type: 'resetPageSize',
        }
      ),
    [getInstance, setState]
  )

  instance.getPageCount = React.useCallback(
    () =>
      getInstance().options.manualPagination
        ? getInstance().state.pageCount
        : getInstance().rows
        ? Math.ceil(getInstance().rows.length / getInstance().state.pageSize)
        : 0,
    [getInstance]
  )

  instance.getPageOptions = useLazyMemo(() => {
    const pageCount = getInstance().getPageCount()

    return pageCount > 0
      ? [...new Array(pageCount)].fill(null).map((d, i) => i)
      : []
  }, [getInstance().getPageCount()])

  instance.getPageRows = React.useCallback(() => {
    const {
      rows,
      state: { pageIndex, pageSize },
      options: { manualPagination },
    } = getInstance()
    let page

    if (manualPagination) {
      page = rows
    } else {
      const pageStart = pageSize * pageIndex
      const pageEnd = pageStart + pageSize

      page = rows.slice(pageStart, pageEnd)
    }

    if (getInstance().options.paginateExpandedRows) {
      return page
    }

    return expandRows(page, getInstance)
  }, [getInstance])

  instance.getCanPreviousPage = React.useCallback(
    () => getInstance().state.pageIndex > 0,
    [getInstance]
  )

  instance.getCanNextPage = React.useCallback(() => {
    const {
      state: { pageSize, pageIndex },
      getPageRows,
      getPageCount,
    } = getInstance()

    return getPageCount() === -1
      ? getPageRows().length >= pageSize
      : pageIndex < getPageCount() - 1
  }, [getInstance])

  instance.gotoPage = React.useCallback(
    pageIndex => {
      setState(
        old => {
          const {
            getPageCount,
            state: { page },
          } = getInstance()
          const newPageIndex = functionalUpdate(pageIndex, old.pageIndex)
          const cannnotPreviousPage = newPageIndex < 0
          const pageCount = getPageCount()
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

  instance.previousPage = React.useCallback(() => {
    return getInstance().gotoPage(old => old - 1)
  }, [getInstance])

  instance.nextPage = React.useCallback(() => {
    return getInstance().gotoPage(old => old + 1)
  }, [getInstance])

  instance.setPageSize = React.useCallback(
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
}
