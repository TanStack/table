import { onBeforeUnmount, onMounted } from 'vue'
import type { TradingBenchmarkController } from './trading-benchmark-controller'

export function useTableBenchmark(controller: TradingBenchmarkController): void {
  const runtime = { mutationObserver: null as MutationObserver | null }

  onMounted(() => {
    const tableBody = document.querySelector(
      '.market-panel [data-trading-table] tbody',
    )
    if (!tableBody) return

    controller.monitor.resetDomMutations()
    runtime.mutationObserver = new MutationObserver((records) => {
      controller.monitor.recordDomMutations(records.length)
    })
    runtime.mutationObserver.observe(tableBody, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    })
  })

  onBeforeUnmount(() => runtime.mutationObserver?.disconnect())
}
