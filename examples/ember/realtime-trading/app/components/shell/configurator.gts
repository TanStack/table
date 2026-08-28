import Component from '@glimmer/component'
import { on } from '@ember/modifier'
import { modifier } from 'ember-modifier'
import {
  feedSampleRateAt,
  feedSampleRateIndex,
  feedSampleRateOptions,
} from '../../feed/feed-sample-rates'
import { initialMarketFeedConfig } from '../../feed/market-feed-config'
import { configuratorOptions } from './configurator-options'
import Diagnostics from './diagnostics.gts'
import MetricsStrip from './metrics-strip.gts'
import SelectedInstrument from './selected-instrument.gts'
import type { MarketFeedController } from '../../feed/market-feed-controller'
import type { TradingBenchmarkController } from '../../benchmark/trading-benchmark-controller'

interface Signature {
  Args: { controller: TradingBenchmarkController; feed: MarketFeedController }
}
const rate = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})
const captureSelect = modifier(
  (
    element: HTMLSelectElement,
    [capture]: [(el: HTMLSelectElement | null) => void],
  ) => {
    capture(element)
    return () => capture(null)
  },
)

export default class Configurator extends Component<Signature> {
  readonly feedSampleRateOptions = feedSampleRateOptions
  readonly options = configuratorOptions
  uiInstrumentCount = initialMarketFeedConfig.instrumentCount
  instrumentSelect: HTMLSelectElement | null = null
  captureInstrumentSelect = (element: HTMLSelectElement | null) => {
    this.instrumentSelect = element
    if (element) {
      element.value = String(this.uiInstrumentCount)
    }
  }
  get running() {
    return this.args.feed.running
  }
  get targetTicksPerSecond() {
    return this.args.feed.targetTicksPerSecond
  }
  get publishIntervalMs() {
    return this.args.feed.publishIntervalMs
  }
  get updateSparklines() {
    return this.args.feed.updateSparklines
  }
  get sparklineSampleIntervalMs() {
    return this.args.feed.sparklineSampleIntervalMs
  }
  get rendererMode() {
    return this.args.controller.rendererMode
  }
  get sampleRateIndex() {
    return feedSampleRateIndex(this.targetTicksPerSecond)
  }
  get sampleRateLabel() {
    return `${rate.format(this.targetTicksPerSecond)} samples/s`
  }

  setInstrumentCount = (value: string) => {
    const count = Number(value)
    this.args.feed.actions.setInstrumentCount(count)
    this.args.controller.actions.resetViewState()
    this.uiInstrumentCount = count
  }
  setInstrumentCountFromEvent = (event: Event) => {
    this.setInstrumentCount(selectValue(event))
  }
  setSampleRate = (event: Event) => {
    this.args.feed.actions.setTargetRate(feedSampleRateAt(numberValue(event)))
  }
  setPublishInterval = (event: Event) => {
    this.args.feed.actions.setPublishInterval(numberValue(event))
  }
  setRendererMode = (event: Event) => {
    this.args.controller.actions.setRendererMode(
      checked(event) ? 'swap' : 'stable',
    )
  }
  setSparklineUpdates = (event: Event) => {
    this.args.feed.actions.setSparklineUpdates(checked(event))
  }
  setSparklineInterval = (event: Event) => {
    this.args.feed.actions.setSparklineSampleInterval(numberValue(event))
  }

  <template>
    <aside
      id='benchmark-configurator'
      class='configurator'
      aria-label='Benchmark configurator'
    >
      <header><span>CONFIGURATOR</span><small>RUN PARAMETERS</small></header>
      <MetricsStrip @controller={{@controller}} />
      <section class='config-section' aria-labelledby='feed-settings'>
        <h2 id='feed-settings'>FEED</h2>
        <button
          class='primary-action'
          type='button'
          data-testid='feed-toggle'
          {{on 'click' @feed.actions.toggle}}
        >{{if this.running 'PAUSE FEED' 'START FEED'}}</button>
        <label class='field'><span>Instruments (rows)</span>
          <select
            data-testid='instrument-count-select'
            {{captureSelect this.captureInstrumentSelect}}
            {{on 'input' this.setInstrumentCountFromEvent}}
            {{on 'change' this.setInstrumentCountFromEvent}}
          >
            {{#each this.options.instrumentCounts as |item|}}<option
                value={{optionValue item}}
              >{{optionLabel item}}</option>{{/each}}
          </select>
        </label>
        <label class='field rate-field'><span>Synthetic quote workload
            <strong
              data-testid='target-sample-rate'
            >{{this.sampleRateLabel}}</strong></span>
          <input
            data-testid='target-rate-slider'
            type='range'
            min='0'
            max={{subtract this.feedSampleRateOptions.length 1}}
            step='1'
            value={{this.sampleRateIndex}}
            {{on 'input' this.setSampleRate}}
            {{on 'change' this.setSampleRate}}
          />
          <small>Fixed worker-side workload levels. Samples are coalesced; this
            is not the message delivery rate.</small>
        </label>
        <label class='field'><span>Worker delivery interval</span>
          <select
            data-testid='publish-interval-select'
            value={{this.publishIntervalMs}}
            {{on 'change' this.setPublishInterval}}
          >
            {{#each this.options.workerDeliveryIntervals as |item|}}<option
                value={{optionValue item}}
                selected={{eq (optionValue item) this.publishIntervalMs}}
              >{{optionLabel item}}</option>{{/each}}
          </select>
          <small>One coalesced worker message at this target cadence.</small>
        </label>
      </section>
      <section class='config-section' aria-labelledby='render-settings'>
        <h2 id='render-settings'>RENDER PATH</h2>
        <label class='toggle-field'><input
            type='checkbox'
            checked={{eq this.rendererMode 'swap'}}
            {{on 'change' this.setRendererMode}}
          /><span>Swap Tick component A ↔ B<small>destroy and recreate when
              direction changes</small></span></label>
        <label class='toggle-field'><input
            type='checkbox'
            checked={{this.updateSparklines}}
            {{on 'change' this.setSparklineUpdates}}
          /><span>Update intraday charts<small>sample rolling prices
              independently</small></span></label>
        <label class='field'><span>Intraday chart sampling</span>
          <select
            data-testid='sparkline-sample-interval-select'
            value={{this.sparklineSampleIntervalMs}}
            {{on 'change' this.setSparklineInterval}}
          >
            {{#each this.options.intradaySamplingIntervals as |item|}}<option
                value={{optionValue item}}
                selected={{eq
                  (optionValue item)
                  this.sparklineSampleIntervalMs
                }}
              >{{optionLabel item}}</option>{{/each}}
          </select>
        </label>
      </section>
      <section class='config-section' aria-labelledby='stress-actions'><h2
          id='stress-actions'
        >STRESS ACTIONS</h2><div class='action-grid'><button
            type='button'
            {{on 'click' @feed.actions.runBurst}}
          >RUN 25K BURST</button><button
            type='button'
            {{on 'click' @controller.actions.resetMarket}}
          >RESET SESSION</button></div></section>
      <Diagnostics @controller={{@controller}} />
      <SelectedInstrument @controller={{@controller}} @feed={{@feed}} />
    </aside>
  </template>
}

const selectValue = (event: Event): string =>
  (event.target as HTMLInputElement | HTMLSelectElement).value
const numberValue = (event: Event): number => Number(selectValue(event))
const checked = (event: Event): boolean =>
  (event.target as HTMLInputElement).checked
const subtract = (left: number, right: number): number => left - right
const eq = (left: unknown, right: unknown): boolean => left === right
const optionValue = (option: {
  readonly value: number | string
}): number | string => option.value
const optionLabel = (option: { readonly label: string }): string => option.label
