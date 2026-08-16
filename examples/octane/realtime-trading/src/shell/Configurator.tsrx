import { feedSampleRateAt, feedSampleRateIndex, feedSampleRateOptions } from '../feed/feed-sample-rates'
import { FORCED_VIRTUALIZATION_ROW_COUNT, resolveVirtualScrollMode } from '../table/trading-row-virtualizer'
import { shallowEqual, useStoreSelector, useStoreValue } from '../use-store-value'
import { configuratorOptions } from './configurator-options'
import { Diagnostics } from './Diagnostics.tsrx'
import { SelectedInstrument } from './SelectedInstrument.tsrx'
import type { MarketFeedController, MarketFeedState } from '../feed/market-feed-controller'
import type { TradingBenchmarkController, TradingBenchmarkState } from '../benchmark/trading-benchmark-controller'

const rate = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
const selectConfiguratorFeedState = (state: MarketFeedState) => ({
  running: state.running,
  instrumentCount: state.instrumentCount,
  targetTicksPerSecond: state.targetTicksPerSecond,
  publishIntervalMs: state.publishIntervalMs,
  updateSparklines: state.updateSparklines,
  sparklineSampleIntervalMs: state.sparklineSampleIntervalMs,
})
const selectRequestedVirtualScrollMode = (state: TradingBenchmarkState) =>
  state.requestedVirtualScrollMode

export function Configurator(props: {
  controller: TradingBenchmarkController
  feed: MarketFeedController
}) @{
  const feedState = useStoreSelector(
    props.feed.store,
    selectConfiguratorFeedState,
    shallowEqual,
  )
  const requestedVirtualScrollMode = useStoreSelector(
    props.controller.store,
    selectRequestedVirtualScrollMode,
    Object.is,
  )
  const rendererMode = useStoreValue(props.controller.renderAtoms.rendererMode)
  const forced = feedState.instrumentCount >= FORCED_VIRTUALIZATION_ROW_COUNT
  const virtualMode = resolveVirtualScrollMode(
    requestedVirtualScrollMode,
    feedState.instrumentCount,
  )
  const value = (event: Event): string => (event.target as HTMLInputElement | HTMLSelectElement).value
  const number = (event: Event): number => Number(value(event))
  const checked = (event: Event): boolean => (event.target as HTMLInputElement).checked

  <aside id="benchmark-configurator" className="configurator" aria-label="Benchmark configurator">
    <header><span>CONFIGURATOR</span><small>RUN PARAMETERS</small></header>
    <section className="config-section" aria-labelledby="feed-settings">
      <h2 id="feed-settings">FEED</h2>
      <button className="primary-action" type="button" data-testid="feed-toggle" onClick={props.feed.actions.toggle}>
        {feedState.running ? 'PAUSE FEED' : 'START FEED'}
      </button>
      <label className="field">
        <span>Instruments (rows)</span>
        <select
          data-testid="instrument-count-select"
          value={feedState.instrumentCount}
          onChange={(event) => {
            props.controller.actions.resetViewState()
            props.feed.actions.setInstrumentCount(number(event))
          }}
        >
          @for (const option of configuratorOptions.instrumentCounts; key option.value) {
            <option value={option.value}>{option.label}</option>
          }
        </select>
      </label>
      <label className="field rate-field">
        <span>Synthetic quote workload <strong data-testid="target-sample-rate">{rate.format(feedState.targetTicksPerSecond)} samples/s</strong></span>
        <input
          data-testid="target-rate-slider"
          type="range"
          min="0"
          max={feedSampleRateOptions.length - 1}
          step="1"
          value={feedSampleRateIndex(feedState.targetTicksPerSecond)}
          onChange={(event) => props.feed.actions.setTargetRate(feedSampleRateAt(number(event)))}
        />
        <small>Fixed worker-side workload levels. Samples are coalesced; this is not the message delivery rate.</small>
      </label>
      <label className="field">
        <span>Worker delivery interval</span>
        <select data-testid="publish-interval-select" value={feedState.publishIntervalMs} onChange={(event) => props.feed.actions.setPublishInterval(number(event))}>
          @for (const option of configuratorOptions.workerDeliveryIntervals; key option.value) {
            <option value={option.value}>{option.label}</option>
          }
        </select>
        <small>One coalesced worker message at this target cadence.</small>
      </label>
    </section>
    <section className="config-section" aria-labelledby="render-settings">
      <h2 id="render-settings">RENDER PATH</h2>
      <label className="field" data-testid="virtual-scroll-mode">
        <span>Row rendering</span>
        <select
          data-testid="virtual-scroll-select"
          value={virtualMode}
          disabled={forced}
          onChange={(event) => props.controller.actions.setVirtualScrollEnabled(value(event) === 'tanstack')}
        >
          @for (const option of configuratorOptions.rowRenderingModes; key option.value) {
            <option value={option.value}>{option.label}</option>
          }
        </select>
        <small>{forced ? 'TanStack Virtual is required and locked at 1,500 or more rows.' : 'Full DOM is the default below 200 rows; TanStack Virtual is the default from 200 rows and remains selectable.'}</small>
      </label>
      <label className="toggle-field">
        <input type="checkbox" checked={rendererMode === 'swap'} onChange={(event) => props.controller.actions.setRendererMode(checked(event) ? 'swap' : 'stable')} />
        <span>Swap Tick component A ↔ B<small>destroy and recreate when direction changes</small></span>
      </label>
      <label className="toggle-field">
        <input type="checkbox" checked={feedState.updateSparklines} onChange={(event) => props.feed.actions.setSparklineUpdates(checked(event))} />
        <span>Update intraday charts<small>sample rolling prices independently</small></span>
      </label>
      <label className="field">
        <span>Intraday chart sampling</span>
        <select data-testid="sparkline-sample-interval-select" value={feedState.sparklineSampleIntervalMs} onChange={(event) => props.feed.actions.setSparklineSampleInterval(number(event))}>
          @for (const option of configuratorOptions.intradaySamplingIntervals; key option.value) {
            <option value={option.value}>{option.label}</option>
          }
        </select>
      </label>
    </section>
    <section className="config-section" aria-labelledby="stress-actions">
      <h2 id="stress-actions">STRESS ACTIONS</h2>
      <div className="action-grid">
        <button type="button" onClick={props.feed.actions.runBurst}>RUN 25K BURST</button>
        <button type="button" onClick={props.controller.actions.resetMarket}>RESET SESSION</button>
      </div>
    </section>
    <Diagnostics controller={props.controller} />
    <SelectedInstrument controller={props.controller} feed={props.feed} />
  </aside>
}
