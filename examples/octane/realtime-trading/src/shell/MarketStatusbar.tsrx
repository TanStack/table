import { shallowEqual, useStoreSelector } from '../use-store-value'
import type { TradingBenchmarkController, TradingBenchmarkState } from '../benchmark/trading-benchmark-controller'

const integer = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const selectStatusbarState = (state: TradingBenchmarkState) => ({
  lastBatchSize: state.metrics.lastBatchSize,
  lastUpdateCount: state.metrics.lastUpdateCount,
  mountedCells: state.mountedCells,
  liveComponents: state.liveComponents,
})

export function MarketStatusbar({ controller }: { controller: TradingBenchmarkController }) @{
  const state = useStoreSelector(
    controller.store,
    selectStatusbarState,
    shallowEqual,
  )
  <footer className="market-statusbar">
    <span>MESSAGE SAMPLES <strong>{integer.format(state.lastBatchSize)}</strong></span>
    <span>CHANGED ROWS <strong>{integer.format(state.lastUpdateCount)}</strong></span>
    <span>HOSTS <strong>{integer.format(state.mountedCells)}</strong></span>
    <span>COMPONENTS <strong>{integer.format(state.liveComponents)}</strong></span>
  </footer>
}
