import Component from '@glimmer/component'
import type { NamedInvocationRate } from '../../benchmark/benchmark-monitor'
import type { TradingBenchmarkController } from '../../benchmark/trading-benchmark-controller'

interface Signature {
  Args: { controller: TradingBenchmarkController }
}
const integer = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const rate = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})
const ms = (value: number): string => `${value.toFixed(2)} ms`
const invocations = (values: ReadonlyArray<NamedInvocationRate>): string => {
  const active = values.filter((entry) => entry.callsPerSecond > 0)
  return active.length
    ? active
        .map((entry) => `${entry.name} ${rate.format(entry.callsPerSecond)}`)
        .join(' · ')
    : '—'
}

export default class Diagnostics extends Component<Signature> {
  get items() {
    const metrics = this.args.controller.metrics
    return [
      {
        label: 'Mounted cells',
        value: integer.format(this.args.controller.mountedCells),
        testId: '',
      },
      {
        label: 'Live components',
        value: integer.format(this.args.controller.liveComponents),
        testId: '',
      },
      {
        label: 'Created / destroyed',
        value: `${integer.format(metrics.componentsCreated)} / ${integer.format(metrics.componentsDestroyed)}`,
        testId: '',
      },
      {
        label: 'Renderer callbacks / s',
        value: rate.format(metrics.cellRendererCallsPerSecond),
        testId: 'cell-render-rate',
      },
      {
        label: 'Component executions / s',
        value: rate.format(metrics.componentRenderCallsPerSecond),
        testId: 'component-render-rate',
      },
      {
        label: 'Executions by component / s',
        value: invocations(metrics.componentRenderRates),
        testId: 'component-render-breakdown',
      },
      {
        label: 'Callbacks by column / s',
        value: invocations(metrics.cellRendererRates),
        testId: 'cell-render-breakdown',
      },
      {
        label: 'Observed MutationRecords / s',
        value: rate.format(metrics.domMutationsPerSecond),
        testId: 'dom-mutation-rate',
      },
      {
        label: 'Worker samples / s',
        value: rate.format(metrics.actualTicksPerSecond),
        testId: 'actual-rate',
      },
      {
        label: 'Worker messages / s',
        value: metrics.workerMessagesPerSecond.toFixed(1),
        testId: 'message-rate',
      },
      {
        label: 'Changed rows / s',
        value: rate.format(metrics.rowUpdatesPerSecond),
        testId: 'row-update-rate',
      },
      {
        label: 'State snapshots / s',
        value: metrics.stateApplicationsPerSecond.toFixed(1),
        testId: 'state-apply-rate',
      },
      {
        label: 'Table DOM commits / s',
        value: metrics.tableRendersPerSecond.toFixed(1),
        testId: 'table-render-rate',
      },
      {
        label: 'P95 / max commit latency (rolling 10 s)',
        value: `${ms(metrics.p95RenderMs)} / ${ms(metrics.maxRenderMs)}`,
        testId: '',
      },
      {
        label: 'Core row model calls / s',
        value: metrics.rowModelCallsPerSecond.toFixed(1),
        testId: 'row-model-call-rate',
      },
      {
        label: 'Core row model avg / max',
        value: `${ms(metrics.rowModelAverageMs)} / ${ms(metrics.rowModelMaxMs)}`,
        testId: 'row-model-duration',
      },
      {
        label: 'Visible rows',
        value: integer.format(metrics.visibleRows),
        testId: 'visible-row-count',
      },
      {
        label: 'Worker messages since reset',
        value: integer.format(metrics.workerMessages),
        testId: 'worker-messages',
      },
      {
        label: 'Worker-coalesced updates / s',
        value: rate.format(metrics.supersededUpdatesPerSecond),
        testId: 'superseded-update-rate',
      },
      {
        label: 'Last samples / updated rows',
        value: `${integer.format(metrics.lastBatchSize)} / ${integer.format(metrics.lastUpdateCount)}`,
        testId: '',
      },
      {
        label: 'Commits > 16.7 ms since reset',
        value: integer.format(metrics.slowRenders),
        testId: '',
      },
      {
        label: 'JS heap (GC-sensitive)',
        value:
          metrics.heapMb === null ? 'N/A' : `${metrics.heapMb.toFixed(1)} MB`,
        testId: '',
      },
    ]
  }
  <template>
    <section class='config-section diagnostics' aria-labelledby='diagnostics'>
      <h2 id='diagnostics'>DIAGNOSTICS</h2>
      <dl>{{#each this.items as |item|}}<div><dt>{{item.label}}</dt><dd
              data-testid={{or item.testId undefined}}
            >{{item.value}}</dd></div>{{/each}}</dl>
      <p class='diagnostic-note'>MutationObserver counts delivered records, not
        individual DOM operations, and adds profiling overhead. Only class/style
        attributes, text, and child-list changes are observed. Heap is a
        Chromium-only point-in-time value and can move before garbage
        collection.</p>
    </section>
  </template>
}
const or = <T,>(left: T, right: T): T => left || right
