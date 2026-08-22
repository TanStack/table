import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import {
  feedSampleRateAt,
  feedSampleRateIndex,
  feedSampleRateOptions,
} from '../feed/feed-sample-rates'
import {
  FORCED_VIRTUALIZATION_ROW_COUNT,
  resolveVirtualScrollMode,
} from '../table/trading-row-virtualizer'
import { configuratorOptions } from './configurator-options'
import { ControllerElement } from './controller-element'
import './Diagnostics'
import './MetricsStrip'
import './SelectedInstrument'
import type { MarketFeedController } from '../feed/market-feed-controller'
import type { TradingBenchmarkController } from '../benchmark/trading-benchmark-controller'

const rate = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})
const value = (event: Event) =>
  (event.target as HTMLInputElement | HTMLSelectElement).value
const number = (event: Event) => Number(value(event))
const checked = (event: Event) => (event.target as HTMLInputElement).checked
const options = (
  items: ReadonlyArray<{
    readonly label: string
    readonly value: number | string
  }>,
  selectedValue: number | string,
) =>
  repeat(
    items,
    (item) => item.value,
    (item) =>
      html`<option
        value=${item.value}
        ?selected=${String(item.value) === String(selectedValue)}
      >
        ${item.label}
      </option>`,
  )

@customElement('trading-configurator')
export class Configurator extends ControllerElement {
  @property({ attribute: false }) controller!: TradingBenchmarkController
  @property({ attribute: false }) feed!: MarketFeedController
  protected firstUpdated() {
    this.observe(this.controller.store)
    this.observe(this.controller.renderAtoms.rendererMode)
    this.observe(this.feed.running)
    this.observe(this.feed.instrumentCount)
    this.observe(this.feed.targetTicksPerSecond)
    this.observe(this.feed.publishIntervalMs)
    this.observe(this.feed.updateSparklines)
    this.observe(this.feed.sparklineSampleIntervalMs)
  }
  protected render() {
    const feedState = {
      running: this.feed.running.get(),
      instrumentCount: this.feed.instrumentCount.get(),
      targetTicksPerSecond: this.feed.targetTicksPerSecond.get(),
      publishIntervalMs: this.feed.publishIntervalMs.get(),
      updateSparklines: this.feed.updateSparklines.get(),
      sparklineSampleIntervalMs: this.feed.sparklineSampleIntervalMs.get(),
    }
    const benchmark = this.controller.store.get()
    const forced = feedState.instrumentCount >= FORCED_VIRTUALIZATION_ROW_COUNT
    const virtualMode = resolveVirtualScrollMode(
      benchmark.requestedVirtualScrollMode,
      feedState.instrumentCount,
    )
    return html`<aside
      id="benchmark-configurator"
      class="configurator"
      aria-label="Benchmark configurator"
    >
      <header><span>CONFIGURATOR</span><small>RUN PARAMETERS</small></header>
      <trading-metrics-strip
        .controller=${this.controller}
      ></trading-metrics-strip>
      <section class="config-section" aria-labelledby="feed-settings">
        <h2 id="feed-settings">FEED</h2>
        <button
          class="primary-action"
          type="button"
          data-testid="feed-toggle"
          @click=${this.feed.actions.toggle}
        >
          ${feedState.running ? 'PAUSE FEED' : 'START FEED'}
        </button>
        <label class="field"
          ><span>Instruments (rows)</span
          ><select
            data-testid="instrument-count-select"
            .value=${String(feedState.instrumentCount)}
            @change=${(event: Event) => {
              this.controller.actions.resetViewState()
              this.feed.actions.setInstrumentCount(number(event))
            }}
          >
            ${options(
              configuratorOptions.instrumentCounts,
              feedState.instrumentCount,
            )}
          </select></label
        >
        <label class="field rate-field"
          ><span
            >Synthetic quote workload
            <strong data-testid="target-sample-rate"
              >${rate.format(feedState.targetTicksPerSecond)} samples/s</strong
            ></span
          ><input
            data-testid="target-rate-slider"
            type="range"
            min="0"
            max=${feedSampleRateOptions.length - 1}
            step="1"
            .value=${String(feedSampleRateIndex(feedState.targetTicksPerSecond))}
            @change=${(event: Event) => this.feed.actions.setTargetRate(feedSampleRateAt(number(event)))}
          /><small
            >Fixed worker-side workload levels. Samples are coalesced; this is
            not the message delivery rate.</small
          ></label
        >
        <label class="field"
          ><span>Worker delivery interval</span
          ><select
            data-testid="publish-interval-select"
            .value=${String(feedState.publishIntervalMs)}
            @change=${(event: Event) => this.feed.actions.setPublishInterval(number(event))}
          >
            ${options(
              configuratorOptions.workerDeliveryIntervals,
              feedState.publishIntervalMs,
            )}</select
          ><small
            >One coalesced worker message at this target cadence.</small
          ></label
        >
      </section>
      <section class="config-section" aria-labelledby="render-settings">
        <h2 id="render-settings">RENDER PATH</h2>
        <label class="field" data-testid="virtual-scroll-mode"
          ><span>Row rendering</span
          ><select
            data-testid="virtual-scroll-select"
            .value=${virtualMode}
            ?disabled=${forced}
            @change=${(event: Event) => this.controller.actions.setVirtualScrollEnabled(value(event) === 'tanstack')}
          >
            ${options(configuratorOptions.rowRenderingModes, virtualMode)}</select
          ><small
            >${forced ? 'TanStack Virtual is required and locked at 1,500 or more rows.' : 'Full DOM is the default below 200 rows; TanStack Virtual is the default from 200 rows and remains selectable.'}</small
          ></label
        >
        <label class="toggle-field"
          ><input
            type="checkbox"
            .checked=${this.controller.renderAtoms.rendererMode.get() === 'swap'}
            @change=${(event: Event) => this.controller.actions.setRendererMode(checked(event) ? 'swap' : 'stable')}
          /><span
            >Swap Tick component A ↔ B<small
              >destroy and recreate when direction changes</small
            ></span
          ></label
        >
        <label class="toggle-field"
          ><input
            type="checkbox"
            .checked=${feedState.updateSparklines}
            @change=${(event: Event) => this.feed.actions.setSparklineUpdates(checked(event))}
          /><span
            >Update intraday charts<small
              >sample rolling prices independently</small
            ></span
          ></label
        >
        <label class="field"
          ><span>Intraday chart sampling</span
          ><select
            data-testid="sparkline-sample-interval-select"
            .value=${String(feedState.sparklineSampleIntervalMs)}
            @change=${(event: Event) => this.feed.actions.setSparklineSampleInterval(number(event))}
          >
            ${options(
              configuratorOptions.intradaySamplingIntervals,
              feedState.sparklineSampleIntervalMs,
            )}
          </select></label
        >
      </section>
      <section class="config-section" aria-labelledby="stress-actions">
        <h2 id="stress-actions">STRESS ACTIONS</h2>
        <div class="action-grid">
          <button type="button" @click=${this.feed.actions.runBurst}>
            RUN 25K BURST</button
          ><button type="button" @click=${this.controller.actions.resetMarket}>
            RESET SESSION
          </button>
        </div>
      </section>
      <trading-diagnostics .controller=${this.controller}></trading-diagnostics
      ><trading-selected-instrument
        .controller=${this.controller}
        .feed=${this.feed}
      ></trading-selected-instrument>
    </aside>`
  }
}
