import { useCallback, useMemo } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { parseFromValuesOrFunc } from '../utils/utils'
import { extraIndexRangeExtractor } from '../utils/virtualization.utils'
import type { Range } from '@tanstack/react-virtual'
import type {
  MRT_Row,
  MRT_RowData,
  MRT_RowVirtualizer,
  MRT_TableInstance,
} from '../types'

export const useMRT_RowVirtualizer = <
  TData extends MRT_RowData,
  TScrollElement extends Element | Window = HTMLDivElement,
  TItemElement extends Element = HTMLTableRowElement,
>(
  table: MRT_TableInstance<TData>,
  rows?: Array<MRT_Row<TData>>,
): MRT_RowVirtualizer<TScrollElement, TItemElement> | undefined => {
  const {
    getRowModel,
    state,
    options: {
      enableRowVirtualization,
      renderDetailPanel,
      rowVirtualizerInstanceRef,
      rowVirtualizerOptions,
    },
    refs: { tableContainerRef },
  } = table
  const { density, draggingRow, expanded } = state

  if (!enableRowVirtualization) return undefined

  const rowVirtualizerProps = parseFromValuesOrFunc(rowVirtualizerOptions, {
    table,
  })

  const realRows = rows ?? getRowModel().rows
  /**
   * when filtering, should find the correct index in filtered rows
   */
  const draggingRowIndex = useMemo(
    () =>
      draggingRow?.id
        ? realRows.findIndex((r) => r.id === draggingRow?.id)
        : undefined,
    [realRows, draggingRow?.id],
  )

  const rowCount = realRows.length

  const normalRowHeight =
    density === 'compact' ? 37 : density === 'comfortable' ? 58 : 73

  const rowVirtualizer = useVirtualizer({
    count: renderDetailPanel ? rowCount * 2 : rowCount,
    estimateSize: (index) =>
      renderDetailPanel && index % 2 === 1
        ? expanded === true
          ? 100
          : 0
        : normalRowHeight,
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 4,
    rangeExtractor: useCallback(
      (range: Range) => {
        return extraIndexRangeExtractor(range, draggingRowIndex)
      },
      [draggingRowIndex],
    ),
    ...rowVirtualizerProps,
  }) as unknown as MRT_RowVirtualizer<TScrollElement, TItemElement>

  rowVirtualizer.virtualRows = rowVirtualizer.getVirtualItems()

  if (rowVirtualizerInstanceRef) {
    // @ts-expect-error
    rowVirtualizerInstanceRef.current = rowVirtualizer
  }

  return rowVirtualizer
}
