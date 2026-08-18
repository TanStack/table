import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { ControllerElement } from './controller-element'
import type { NamedInvocationRate } from '../benchmark/benchmark-monitor'
import type { TradingBenchmarkController } from '../benchmark/trading-benchmark-controller'

const integer = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const rate = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})
const ms = (value: number) => `${value.toFixed(2)} ms`
const invocations = (values: ReadonlyArray<NamedInvocationRate>) => {
  const active = values.filter((entry) => entry.callsPerSecond > 0)
  return active.length
    ? active
        .map((entry) => `${entry.name} ${rate.format(entry.callsPerSecond)}`)
        .join(' · ')
    : '—'
}
@customElement('trading-diagnostics')
export class Diagnostics extends ControllerElement {
  @property({ attribute: false }) controller!: TradingBenchmarkController
  protected firstUpdated() {
    this.observe(this.controller.store)
  }
  protected render() {
    const state = this.controller.store.get()
    const metrics = state.metrics
    const items = [
      [
        'Worker-generated samples / s',
        rate.format(metrics.actualTicksPerSecond),
        'actual-rate',
      ],
      [
        'Changed rows / s',
        rate.format(metrics.rowUpdatesPerSecond),
        'row-update-rate',
      ],
      [
        'Worker messages / s',
        metrics.workerMessagesPerSecond.toFixed(1),
        'message-rate',
      ],
      [
        'Snapshots applied / s',
        metrics.stateApplicationsPerSecond.toFixed(1),
        'state-apply-rate',
      ],
      [
        'DOM commits / s',
        metrics.tableCommitsPerSecond.toFixed(1),
        'table-render-rate',
      ],
      [
        'Commit latency p95 / max (10 s)',
        `${ms(metrics.p95CommitLatencyMs)} / ${ms(metrics.maxCommitLatencyMs)}`,
        '',
      ],
      ['Mounted cells', integer.format(state.mountedCells), ''],
      ['Live components', integer.format(state.liveComponents), ''],
      [
        'Created / destroyed',
        `${integer.format(metrics.componentsCreated)} / ${integer.format(metrics.componentsDestroyed)}`,
        '',
      ],
      [
        'Renderer callbacks / s',
        rate.format(metrics.cellRendererCallsPerSecond),
        'cell-render-rate',
      ],
      [
        'Component executions / s',
        rate.format(metrics.componentRenderCallsPerSecond),
        'component-render-rate',
      ],
      [
        'Executions by component / s',
        invocations(metrics.componentRenderRates),
        'component-render-breakdown',
      ],
      [
        'Callbacks by column / s',
        invocations(metrics.cellRendererRates),
        'cell-render-breakdown',
      ],
      [
        'Observed MutationRecords / s',
        rate.format(metrics.domMutationsPerSecond),
        'dom-mutation-rate',
      ],
      [
        'Core row model calls / s',
        metrics.rowModelCallsPerSecond.toFixed(1),
        'row-model-call-rate',
      ],
      [
        'Core row model avg / max',
        `${ms(metrics.rowModelAverageMs)} / ${ms(metrics.rowModelMaxMs)}`,
        'row-model-duration',
      ],
      [
        'Visible rows',
        integer.format(metrics.visibleRows),
        'visible-row-count',
      ],
      [
        'Worker messages',
        integer.format(metrics.workerMessages),
        'worker-messages',
      ],
      [
        'Worker-coalesced updates / s',
        rate.format(metrics.supersededUpdatesPerSecond),
        'superseded-update-rate',
      ],
      [
        'Last samples / updated rows',
        `${integer.format(metrics.lastBatchSize)} / ${integer.format(metrics.lastUpdateCount)}`,
        '',
      ],
      [
        'Commits > 16.7 ms (since reset)',
        integer.format(metrics.slowCommits),
        '',
      ],
      [
        'JS heap (current, GC-sensitive)',
        metrics.heapMb === null ? 'N/A' : `${metrics.heapMb.toFixed(1)} MB`,
        '',
      ],
    ] as const
    return html`<section
      class="config-section diagnostics"
      aria-labelledby="diagnostics"
    >
      <h2 id="diagnostics">DIAGNOSTICS</h2>
      <dl>
        ${repeat(
          items,
          (item) => item[0],
          (item) =>
            html`<div>
              <dt>${item[0]}</dt>
              <dd data-testid=${item[2] || undefined}>${item[1]}</dd>
            </div>`,
        )}
      </dl>
    </section>`
  }
}
