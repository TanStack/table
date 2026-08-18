import type { TradingBenchmarkController } from './trading-benchmark-controller'

export function startTableBenchmark(
  controller: TradingBenchmarkController,
): () => void {
  const tableBody = document.querySelector(
    '.market-panel [data-trading-table] tbody',
  )
  if (!tableBody) return () => undefined

  controller.monitor.resetDomMutations()
  const observer = new MutationObserver((records) => {
    controller.monitor.recordDomMutations(records.length)
  })
  observer.observe(tableBody, {
    attributes: true,
    attributeFilter: ['class', 'style'],
    characterData: true,
    childList: true,
    subtree: true,
  })
  return () => observer.disconnect()
}
