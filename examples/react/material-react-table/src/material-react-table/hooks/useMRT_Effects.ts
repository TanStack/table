import { useEffect, useReducer, useRef } from 'react'
import { getDefaultColumnOrderIds } from '../utils/displayColumn.utils'
import { getCanRankRows } from '../utils/row.utils'
import type { MRT_RowData, MRT_SortingState, MRT_TableInstance } from '../types'

export const useMRT_Effects = <TData extends MRT_RowData>(
  table: MRT_TableInstance<TData>,
) => {
  const {
    getIsSomeRowsPinned,
    getPrePaginatedRowModel,
    state,
    options: { enablePagination, enableRowPinning, rowCount },
  } = table
  const {
    columnOrder,
    density,
    globalFilter,
    isFullScreen,
    isLoading,
    pagination,
    showSkeletons,
    sorting,
  } = state

  const totalColumnCount = table.options.columns.length
  const totalRowCount = rowCount ?? getPrePaginatedRowModel().rows.length

  const rerender = useReducer(() => ({}), {})[1]
  const initialBodyHeight = useRef<string>(null)
  const previousTop = useRef<number>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      initialBodyHeight.current = document.body.style.height
    }
  }, [])

  // hide scrollbars when table is in full screen mode, preserve body scroll position after full screen exit
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isFullScreen) {
        previousTop.current = document.body.getBoundingClientRect().top // save scroll position
        document.body.style.height = '100dvh' // hide page scrollbars when table is in full screen mode
      } else {
        document.body.style.height = initialBodyHeight.current as string
        if (!previousTop.current) return
        // restore scroll position
        window.scrollTo({
          behavior: 'instant',
          top: -1 * previousTop.current,
        })
      }
    }
  }, [isFullScreen])

  // recalculate column order when columns change or features are toggled on/off
  useEffect(() => {
    if (totalColumnCount !== columnOrder.length) {
      table.setColumnOrder(getDefaultColumnOrderIds(table.options))
    }
  }, [totalColumnCount])

  // if page index is out of bounds, set it to the last page
  useEffect(() => {
    if (!enablePagination || isLoading || showSkeletons) return
    const { pageIndex, pageSize } = pagination
    const totalPages: number =
      totalRowCount > 0 ? Math.ceil(totalRowCount / pageSize) : 1
    const isOutOfBounds: boolean = pageIndex < 0 || pageIndex >= totalPages

    if (isOutOfBounds) {
      table.setPageIndex(totalPages - 1)
    }
  }, [totalRowCount, enablePagination, isLoading, showSkeletons])

  // turn off sort when global filter is looking for ranked results
  const appliedSort = useRef<MRT_SortingState>(sorting)
  useEffect(() => {
    if (sorting.length) {
      appliedSort.current = sorting
    }
  }, [sorting])

  useEffect(() => {
    if (!getCanRankRows(table)) return
    if (globalFilter) {
      table.setSorting([])
    } else {
      table.setSorting(() => appliedSort.current || [])
    }
  }, [globalFilter])

  // fix pinned row top style when density changes
  useEffect(() => {
    if (enableRowPinning && getIsSomeRowsPinned()) {
      setTimeout(() => {
        rerender()
      }, 150)
    }
  }, [density])
}
