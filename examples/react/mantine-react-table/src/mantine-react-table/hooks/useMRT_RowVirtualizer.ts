import { useCallback } from 'react'

import {  useVirtualizer } from '@tanstack/react-virtual'
import { parseFromValuesOrFunc } from '../utils/utils'
import { extraIndexRangeExtractor } from '../utils/virtualization.utils'
import type {Range} from '@tanstack/react-virtual';

import type {MRT_DensityState, MRT_Row, MRT_RowData, MRT_RowVirtualizer, MRT_TableInstance} from '../types';

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

  const rowCount = rows?.length ?? getRowModel().rows.length

  const defaultRowHeightByDensity: Record<MRT_DensityState, number> = {
    lg: 62.7,
    md: 54.7,
    sm: 48.7,
    xl: 70.7,
    xs: 42.7,
  }

  const normalRowHeight =
    defaultRowHeightByDensity[density] ?? defaultRowHeightByDensity['md']

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
        const current_index = getRowModel().rows.findIndex(
          (row) => row.id === draggingRow?.id,
        )

        return extraIndexRangeExtractor(
          range,
          current_index >= 0 ? current_index : 0,
        )
      },
      [draggingRow],
    ),
    ...rowVirtualizerProps,
  }) as unknown as MRT_RowVirtualizer<TScrollElement, TItemElement>

  rowVirtualizer.virtualRows = rowVirtualizer.getVirtualItems()

  if (rowVirtualizerInstanceRef) {
    // @ts-ignore
    rowVirtualizerInstanceRef.current = rowVirtualizer
  }

  return rowVirtualizer
}
