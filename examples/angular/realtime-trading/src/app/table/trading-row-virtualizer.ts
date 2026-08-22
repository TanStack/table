import {
  ChangeDetectorRef,
  DestroyRef,
  computed,
  effect,
  inject,
} from '@angular/core'
import { injectVirtualizer } from '@tanstack/angular-virtual'
import type { ElementRef, Signal } from '@angular/core'

export const TRADING_ROW_HEIGHT = 32
export const DEFAULT_VIRTUALIZATION_ROW_COUNT = 200
export const FORCED_VIRTUALIZATION_ROW_COUNT = 1_500

const TANSTACK_OVERSCAN = 10

export type VirtualScrollMode = 'tanstack' | 'none'
export type VirtualScrollPreference = VirtualScrollMode | 'auto'

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

interface TradingVirtualRow {
  id: string
}

function injectLocalDomFlush() {
  const changeDetectorRef = inject(ChangeDetectorRef)
  const destroyRef = inject(DestroyRef)
  const state = {
    destroyed: false,
    queued: false,
  }

  destroyRef.onDestroy(() => {
    state.destroyed = true
  })

  return () => {
    if (state.queued || state.destroyed) return

    state.queued = true
    queueMicrotask(() => {
      state.queued = false
      if (!state.destroyed) {
        changeDetectorRef.detectChanges()
      }
    })
  }
}

export function injectTradingRowVirtualizer<TRow extends TradingVirtualRow>(
  rows: Signal<ReadonlyArray<TRow>>,
  mode: Signal<VirtualScrollMode>,
  tanStackScrollContainer: Signal<ElementRef<HTMLDivElement> | undefined>,
  reportRenderedRowCount: (count: number) => void,
) {
  const scheduleLocalDomFlush = injectLocalDomFlush()
  const rowVirtualizer = injectVirtualizer<HTMLDivElement, HTMLTableRowElement>(
    () => ({
      count: rows().length,
      scrollElement: tanStackScrollContainer()?.nativeElement,
      estimateSize: () => TRADING_ROW_HEIGHT,
      getItemKey: (index) => rows()[index]?.id ?? index,
      overscan: TANSTACK_OVERSCAN,
      enabled: mode() === 'tanstack',
      useCachedMeasurements: true,
      useApplicationRefTick: false,
      onChange: scheduleLocalDomFlush,
    }),
  )

  const tanStackVirtualRows = rowVirtualizer.getVirtualItems
  const tanStackTotalSize = rowVirtualizer.getTotalSize
  const visibleRange = computed(() => {
    const rowCount = rows().length
    const range = rowVirtualizer.range()

    if (mode() !== 'tanstack' || rowCount === 0 || range === null) {
      return null
    }

    const lastRowIndex = rowCount - 1
    const start = Math.min(range.startIndex, lastRowIndex)

    return {
      start,
      end: Math.min(Math.max(start, range.endIndex), lastRowIndex),
    }
  })
  const renderedRowCount = computed(() => {
    if (mode() === 'tanstack') {
      return tanStackVirtualRows().length
    }
    return rows().length
  })

  effect(() => reportRenderedRowCount(renderedRowCount()))

  return {
    rowVirtualizer,
    tanStackVirtualRows,
    tanStackTotalSize,
    visibleRange,
    renderedRowCount,
  }
}
