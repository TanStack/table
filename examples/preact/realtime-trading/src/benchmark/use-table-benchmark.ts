import { useEffect } from 'preact/hooks'
import type { TradingBenchmarkController } from './trading-benchmark-controller'

export function useTableBenchmark(
  controller: TradingBenchmarkController,
): void {
  useEffect(() => {
    const tableBody = document.querySelector(
      '.market-panel [data-trading-table] tbody',
    )
    if (!tableBody) {
      return
    }

    controller.monitor.resetDomMutations()
    const observer = new MutationObserver((records) => {
      controller.monitor.recordDomMutations(records.length)
    })
    observer.observe(tableBody, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    })
    return () => observer.disconnect()
  }, [controller])
}
