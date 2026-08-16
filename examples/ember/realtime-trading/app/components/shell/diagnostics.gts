import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { observeValue } from '../../utils/subscriptions'
import type Owner from '@ember/owner'
import type { NamedInvocationRate } from '../../benchmark/benchmark-monitor'
import type { TradingBenchmarkController, TradingBenchmarkState } from '../../benchmark/trading-benchmark-controller'

interface Signature { Args: { controller: TradingBenchmarkController } }
const integer = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const rate = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
const ms = (value: number): string => `${value.toFixed(2)} ms`
const invocations = (values: ReadonlyArray<NamedInvocationRate>): string => {
  const active = values.filter((entry) => entry.callsPerSecond > 0)
  return active.length ? active.map((entry) => `${entry.name} ${rate.format(entry.callsPerSecond)}`).join(' · ') : '—'
}

export default class Diagnostics extends Component<Signature> {
  @tracked state: TradingBenchmarkState
  constructor(owner: Owner, args: Signature['Args']) {
    super(owner, args)
    this.state = args.controller.store.get()
    observeValue(this, args.controller.store, (state) => { this.state = state })
  }
  get items() {
    const metrics = this.state.metrics
    return [
      { label: 'Mounted cells', value: integer.format(this.state.mountedCells), testId: '' },
      { label: 'Live components', value: integer.format(this.state.liveComponents), testId: '' },
      { label: 'Created / destroyed', value: `${integer.format(metrics.componentsCreated)} / ${integer.format(metrics.componentsDestroyed)}`, testId: '' },
      { label: 'Renderer callbacks / s', value: rate.format(metrics.cellRendererCallsPerSecond), testId: 'cell-render-rate' },
      { label: 'Component executions / s', value: rate.format(metrics.componentRenderCallsPerSecond), testId: 'component-render-rate' },
      { label: 'Executions by component / s', value: invocations(metrics.componentRenderRates), testId: 'component-render-breakdown' },
      { label: 'Callbacks by column / s', value: invocations(metrics.cellRendererRates), testId: 'cell-render-breakdown' },
      { label: 'DOM mutation records / s', value: rate.format(metrics.domMutationsPerSecond), testId: 'dom-mutation-rate' },
      { label: 'Core row model calls / s', value: metrics.rowModelCallsPerSecond.toFixed(1), testId: 'row-model-call-rate' },
      { label: 'Core row model avg / max', value: `${ms(metrics.rowModelAverageMs)} / ${ms(metrics.rowModelMaxMs)}`, testId: 'row-model-duration' },
      { label: 'Visible rows', value: integer.format(metrics.visibleRows), testId: 'visible-row-count' },
      { label: 'Worker messages', value: integer.format(metrics.workerMessages), testId: 'worker-messages' },
      { label: 'Worker-coalesced updates / s', value: rate.format(metrics.supersededUpdatesPerSecond), testId: 'superseded-update-rate' },
      { label: 'Last samples / updated rows', value: `${integer.format(metrics.lastBatchSize)} / ${integer.format(metrics.lastUpdateCount)}`, testId: '' },
      { label: 'Renders > 16.7 ms', value: integer.format(metrics.slowRenders), testId: '' },
      { label: 'JS heap', value: metrics.heapMb === null ? 'N/A' : `${metrics.heapMb.toFixed(1)} MB`, testId: '' },
    ]
  }
  <template>
    <section class='config-section diagnostics' aria-labelledby='diagnostics'>
      <h2 id='diagnostics'>DIAGNOSTICS</h2>
      <dl>{{#each this.items as |item|}}<div><dt>{{item.label}}</dt><dd data-testid={{or item.testId undefined}}>{{item.value}}</dd></div>{{/each}}</dl>
    </section>
  </template>
}
const or = <T,>(left: T, right: T): T => left || right
