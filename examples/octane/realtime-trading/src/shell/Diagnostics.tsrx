import { useStoreValue } from '../use-store-value'
import type { NamedInvocationRate } from '../benchmark/benchmark-monitor'
import type { TradingBenchmarkController } from '../benchmark/trading-benchmark-controller'

const integer = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const rate = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
const ms = (value: number): string => `${value.toFixed(2)} ms`
const invocations = (values: ReadonlyArray<NamedInvocationRate>): string => {
  const active = values.filter((entry) => entry.callsPerSecond > 0)
  return active.length ? active.map((entry) => `${entry.name} ${rate.format(entry.callsPerSecond)}`).join(' · ') : '—'
}

export function Diagnostics({ controller }: { controller: TradingBenchmarkController }) @{
  const state = useStoreValue(controller.store)
  const metrics = state.metrics
  const items = [
    ['Mounted cells', integer.format(state.mountedCells), ''],
    ['Live components', integer.format(state.liveComponents), ''],
    ['Created / destroyed', `${integer.format(metrics.componentsCreated)} / ${integer.format(metrics.componentsDestroyed)}`, ''],
    ['Renderer callbacks / s', rate.format(metrics.cellRendererCallsPerSecond), 'cell-render-rate'],
    ['Component executions / s', rate.format(metrics.componentRenderCallsPerSecond), 'component-render-rate'],
    ['Executions by component / s', invocations(metrics.componentRenderRates), 'component-render-breakdown'],
    ['Callbacks by column / s', invocations(metrics.cellRendererRates), 'cell-render-breakdown'],
    ['Observed MutationRecords / s', rate.format(metrics.domMutationsPerSecond), 'dom-mutation-rate'],
    ['Worker samples / s', rate.format(metrics.actualTicksPerSecond), 'actual-rate'],
    ['Worker messages / s', metrics.workerMessagesPerSecond.toFixed(1), 'message-rate'],
    ['Changed rows / s', rate.format(metrics.rowUpdatesPerSecond), 'row-update-rate'],
    ['State snapshots / s', metrics.stateApplicationsPerSecond.toFixed(1), 'state-apply-rate'],
    ['Table DOM commits / s', metrics.tableRendersPerSecond.toFixed(1), 'table-render-rate'],
    ['P95 / max commit latency (rolling 10 s)', `${ms(metrics.p95RenderMs)} / ${ms(metrics.maxRenderMs)}`, ''],
    ['Core row model calls / s', metrics.rowModelCallsPerSecond.toFixed(1), 'row-model-call-rate'],
    ['Core row model avg / max', `${ms(metrics.rowModelAverageMs)} / ${ms(metrics.rowModelMaxMs)}`, 'row-model-duration'],
    ['Visible rows', integer.format(metrics.visibleRows), 'visible-row-count'],
    ['Worker messages since reset', integer.format(metrics.workerMessages), 'worker-messages'],
    ['Worker-coalesced updates / s', rate.format(metrics.supersededUpdatesPerSecond), 'superseded-update-rate'],
    ['Last samples / updated rows', `${integer.format(metrics.lastBatchSize)} / ${integer.format(metrics.lastUpdateCount)}`, ''],
    ['Commits > 16.7 ms since reset', integer.format(metrics.slowRenders), ''],
    ['JS heap (GC-sensitive)', metrics.heapMb === null ? 'N/A' : `${metrics.heapMb.toFixed(1)} MB`, ''],
  ] as const
  <section className="config-section diagnostics" aria-labelledby="diagnostics">
    <h2 id="diagnostics">DIAGNOSTICS</h2>
    <dl>
      @for (const item of items; key item[0]) {
        <div><dt>{item[0]}</dt><dd data-testid={item[2] || undefined}>{item[1]}</dd></div>
      }
    </dl>
    <p className="diagnostic-note">
      MutationObserver counts delivered records, not individual DOM operations, and adds profiling overhead. Only class/style attributes, text, and child-list changes are observed. Heap is a Chromium-only point-in-time value and can move before garbage collection.
    </p>
  </section>
}
