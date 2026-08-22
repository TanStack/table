import { DestroyRef, afterNextRender, inject } from '@angular/core'
import type { ElementRef, Signal } from '@angular/core'

interface FitColumn {
  getSize: () => number
  id: string
}

interface FitTable {
  atoms: {
    columnResizing: {
      subscribe: (
        listener: (state: { isResizingColumn: false | string }) => void,
      ) => { unsubscribe: () => void }
    }
  }
  getTotalSize: () => number
  getVisibleLeafColumns: () => Array<FitColumn>
  setColumnSizing: (sizes: Record<string, number>) => void
}

export function injectTradingTableInitialFit(
  table: FitTable,
  scrollContainer: Signal<ElementRef<HTMLDivElement> | undefined>,
): void {
  const destroyRef = inject(DestroyRef)
  const runtime = { manuallyResized: false }

  afterNextRender(() => {
    const element = scrollContainer()?.nativeElement
    if (!element) return

    const fitAvailableWidth = () => {
      if (runtime.manuallyResized) return
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
        if (state.isResizingColumn !== false) runtime.manuallyResized = true
      },
    )
    resizeObserver.observe(element)
    fitAvailableWidth()

    destroyRef.onDestroy(() => {
      resizeObserver.disconnect()
      resizingSubscription.unsubscribe()
    })
  })
}
