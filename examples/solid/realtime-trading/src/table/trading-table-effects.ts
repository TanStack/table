import { createEffect, onCleanup, onMount } from 'solid-js'
import type { Accessor } from 'solid-js'
import type { TradingTableInstance } from './trading-table-features'

export function createFeedCommitTracking(
  quotes: Accessor<unknown>,
  completeCommit: () => void,
): void {
  const runtime = { queued: false, disposed: false }

  createEffect(() => {
    quotes()
    if (runtime.queued) return

    runtime.queued = true
    queueMicrotask(() => {
      runtime.queued = false
      if (!runtime.disposed) completeCommit()
    })
  })

  onCleanup(() => {
    runtime.disposed = true
  })
}

export function createTableAutoFit(
  table: TradingTableInstance,
  scrollElement: Accessor<HTMLDivElement | null>,
): void {
  const runtime = { manuallyResized: false }

  onMount(() => {
    const fitAvailableWidth = (): void => {
      const element = scrollElement()
      if (!element || runtime.manuallyResized) return

      const currentWidth = table.getTotalSize()
      const availableWidth = element.clientWidth
      if (availableWidth <= currentWidth + 1 || currentWidth <= 0) return

      const ratio = availableWidth / currentWidth
      table.setColumnSizing(
        Object.fromEntries(
          table
            .getVisibleLeafColumns()
            .map((column) => [column.id, column.getSize() * ratio]),
        ),
      )
    }
    const resizeObserver = new ResizeObserver(fitAvailableWidth)
    const resizingSubscription = table.atoms.columnResizing.subscribe(
      (state) => {
        if (state.isResizingColumn !== false) {
          runtime.manuallyResized = true
        }
      },
    )
    const element = scrollElement()
    if (element) resizeObserver.observe(element)
    fitAvailableWidth()

    onCleanup(() => {
      resizeObserver.disconnect()
      resizingSubscription.unsubscribe()
    })
  })
}
