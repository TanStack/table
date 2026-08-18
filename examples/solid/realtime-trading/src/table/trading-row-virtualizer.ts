import { createVirtualizer } from '@tanstack/solid-virtual'
import { createEffect, createMemo } from 'solid-js'
import type { Accessor } from 'solid-js'
import type { TradingRow } from './trading-table-features'

export const TRADING_ROW_HEIGHT = 32
export const TRADING_ROW_OVERSCAN = 10
export const DEFAULT_VIRTUALIZATION_ROW_COUNT = 200
export const FORCED_VIRTUALIZATION_ROW_COUNT = 1_500

export type VirtualScrollMode = 'tanstack' | 'none'
export type VirtualScrollPreference = VirtualScrollMode | 'auto'

export interface TradingRowVirtualizationOptions {
  rows: Accessor<Array<TradingRow>>
  scrollElement: Accessor<HTMLDivElement | null>
  enabled: Accessor<boolean>
  onRenderedRowCount: (count: number) => void
}

export function createTradingRowVirtualization(
  options: TradingRowVirtualizationOptions,
) {
  const virtualizer = createVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    get count() {
      return options.rows().length
    },
    estimateSize: () => TRADING_ROW_HEIGHT,
    getScrollElement: options.scrollElement,
    getItemKey: (index) => options.rows()[index]?.id ?? index,
    overscan: TRADING_ROW_OVERSCAN,
    get enabled() {
      return options.enabled()
    },
  })
  const virtualRows = virtualizer.getVirtualItems
  const visibleRange = createMemo(() => {
    void virtualRows()
    const rowCount = options.rows().length
    const range = virtualizer.range
    if (!options.enabled() || rowCount === 0 || range === null) return null

    const lastRowIndex = rowCount - 1
    const start = Math.min(range.startIndex, lastRowIndex)
    return {
      start,
      end: Math.min(Math.max(start, range.endIndex), lastRowIndex),
    }
  })
  const bodyHeight = createMemo(() =>
    options.enabled()
      ? `${options.rows().length * TRADING_ROW_HEIGHT}px`
      : undefined,
  )

  createEffect(() => {
    options.onRenderedRowCount(
      options.enabled() ? virtualRows().length : options.rows().length,
    )
  })

  return { bodyHeight, virtualizer, virtualRows, visibleRange }
}

export type TradingRowVirtualization = ReturnType<
  typeof createTradingRowVirtualization
>

export function resolveVirtualScrollMode(
  requestedMode: VirtualScrollPreference,
  instrumentCount: number,
): VirtualScrollMode {
  if (instrumentCount >= FORCED_VIRTUALIZATION_ROW_COUNT) return 'tanstack'
  if (requestedMode !== 'auto') return requestedMode
  return instrumentCount >= DEFAULT_VIRTUALIZATION_ROW_COUNT
    ? 'tanstack'
    : 'none'
}
