import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import { feedSampleRateAt, feedSampleRateIndex, feedSampleRateOptions } from '../../feed/feed-sample-rates'
import { FORCED_VIRTUALIZATION_ROW_COUNT, resolveVirtualScrollMode } from '../../table/trading-row-virtualizer'
import { observeValue } from '../../utils/subscriptions'
import { configuratorOptions } from './configurator-options'
import Diagnostics from './diagnostics.gts'
import SelectedInstrument from './selected-instrument.gts'
import type Owner from '@ember/owner'
import type { MarketFeedController, MarketFeedState } from '../../feed/market-feed-controller'
import type { TradingBenchmarkController, TradingBenchmarkState } from '../../benchmark/trading-benchmark-controller'
import type { RendererMode } from '../../table/trading-table'

interface Signature { Args: { controller: TradingBenchmarkController; feed: MarketFeedController } }
const rate = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

export default class Configurator extends Component<Signature> {
  readonly feedSampleRateOptions = feedSampleRateOptions
  readonly options = configuratorOptions
  @tracked feedState: MarketFeedState
  @tracked benchmark: TradingBenchmarkState
  @tracked rendererMode: RendererMode

  constructor(owner: Owner, args: Signature['Args']) {
    super(owner, args)
    this.feedState = args.feed.store.get()
    this.benchmark = args.controller.store.get()
    this.rendererMode = args.controller.renderAtoms.rendererMode.get()
    observeValue(this, args.feed.store, (state) => { this.feedState = state })
    observeValue(this, args.controller.store, (state) => { this.benchmark = state })
    observeValue(this, args.controller.renderAtoms.rendererMode, (mode) => { this.rendererMode = mode })
  }

  get virtualForced() { return this.feedState.instrumentCount >= FORCED_VIRTUALIZATION_ROW_COUNT }
  get virtualMode() { return resolveVirtualScrollMode(this.benchmark.requestedVirtualScrollMode, this.feedState.instrumentCount) }
  get sampleRateIndex() { return feedSampleRateIndex(this.feedState.targetTicksPerSecond) }
  get sampleRateLabel() { return `${rate.format(this.feedState.targetTicksPerSecond)} samples/s` }
  get virtualDescription() { return this.virtualForced ? 'TanStack Virtual is required and locked at 1,500 or more rows.' : 'Full DOM is the default below 200 rows; TanStack Virtual is the default from 200 rows and remains selectable.' }

  setInstrumentCount = (event: Event) => {
    this.args.controller.actions.resetViewState()
    this.args.feed.actions.setInstrumentCount(numberValue(event))
  }
  setSampleRate = (event: Event) => { this.args.feed.actions.setTargetRate(feedSampleRateAt(numberValue(event))) }
  setPublishInterval = (event: Event) => { this.args.feed.actions.setPublishInterval(numberValue(event)) }
  setVirtualMode = (event: Event) => { this.args.controller.actions.setVirtualScrollEnabled(selectValue(event) === 'tanstack') }
  setRendererMode = (event: Event) => { this.args.controller.actions.setRendererMode(checked(event) ? 'swap' : 'stable') }
  setSparklineUpdates = (event: Event) => { this.args.feed.actions.setSparklineUpdates(checked(event)) }
  setSparklineInterval = (event: Event) => { this.args.feed.actions.setSparklineSampleInterval(numberValue(event)) }

  <template>
    <aside id='benchmark-configurator' class='configurator' aria-label='Benchmark configurator'>
      <header><span>CONFIGURATOR</span><small>RUN PARAMETERS</small></header>
      <section class='config-section' aria-labelledby='feed-settings'>
        <h2 id='feed-settings'>FEED</h2>
        <button class='primary-action' type='button' data-testid='feed-toggle' {{on 'click' @feed.actions.toggle}}>{{if this.feedState.running 'PAUSE FEED' 'START FEED'}}</button>
        <label class='field'><span>Instruments (rows)</span>
          <select data-testid='instrument-count-select' value={{this.feedState.instrumentCount}} {{on 'change' this.setInstrumentCount}}>
            {{#each this.options.instrumentCounts as |item|}}<option value={{optionValue item}} selected={{eq (optionValue item) this.feedState.instrumentCount}}>{{optionLabel item}}</option>{{/each}}
          </select>
        </label>
        <label class='field rate-field'><span>Synthetic quote workload <strong data-testid='target-sample-rate'>{{this.sampleRateLabel}}</strong></span>
          <input data-testid='target-rate-slider' type='range' min='0' max={{subtract this.feedSampleRateOptions.length 1}} step='1' value={{this.sampleRateIndex}} {{on 'change' this.setSampleRate}} />
          <small>Fixed worker-side workload levels. Samples are coalesced; this is not the message delivery rate.</small>
        </label>
        <label class='field'><span>Worker delivery interval</span>
          <select data-testid='publish-interval-select' value={{this.feedState.publishIntervalMs}} {{on 'change' this.setPublishInterval}}>
            {{#each this.options.workerDeliveryIntervals as |item|}}<option value={{optionValue item}} selected={{eq (optionValue item) this.feedState.publishIntervalMs}}>{{optionLabel item}}</option>{{/each}}
          </select>
          <small>One coalesced worker message at this target cadence.</small>
        </label>
      </section>
      <section class='config-section' aria-labelledby='render-settings'>
        <h2 id='render-settings'>RENDER PATH</h2>
        <label class='field' data-testid='virtual-scroll-mode'><span>Row rendering</span>
          <select data-testid='virtual-scroll-select' value={{this.virtualMode}} disabled={{this.virtualForced}} {{on 'change' this.setVirtualMode}}>
            {{#each this.options.rowRenderingModes as |item|}}<option value={{optionValue item}} selected={{eq (optionValue item) this.virtualMode}}>{{optionLabel item}}</option>{{/each}}
          </select><small>{{this.virtualDescription}}</small>
        </label>
        <label class='toggle-field'><input type='checkbox' checked={{eq this.rendererMode 'swap'}} {{on 'change' this.setRendererMode}} /><span>Swap Tick component A ↔ B<small>destroy and recreate when direction changes</small></span></label>
        <label class='toggle-field'><input type='checkbox' checked={{this.feedState.updateSparklines}} {{on 'change' this.setSparklineUpdates}} /><span>Update intraday charts<small>sample rolling prices independently</small></span></label>
        <label class='field'><span>Intraday chart sampling</span>
          <select data-testid='sparkline-sample-interval-select' value={{this.feedState.sparklineSampleIntervalMs}} {{on 'change' this.setSparklineInterval}}>
            {{#each this.options.intradaySamplingIntervals as |item|}}<option value={{optionValue item}} selected={{eq (optionValue item) this.feedState.sparklineSampleIntervalMs}}>{{optionLabel item}}</option>{{/each}}
          </select>
        </label>
      </section>
      <section class='config-section' aria-labelledby='stress-actions'><h2 id='stress-actions'>STRESS ACTIONS</h2><div class='action-grid'><button type='button' {{on 'click' @feed.actions.runBurst}}>RUN 25K BURST</button><button type='button' {{on 'click' @controller.actions.resetMarket}}>RESET SESSION</button></div></section>
      <Diagnostics @controller={{@controller}} />
      <SelectedInstrument @controller={{@controller}} @feed={{@feed}} />
    </aside>
  </template>
}

const selectValue = (event: Event): string => (event.target as HTMLInputElement | HTMLSelectElement).value
const numberValue = (event: Event): number => Number(selectValue(event))
const checked = (event: Event): boolean => (event.target as HTMLInputElement).checked
const subtract = (left: number, right: number): number => left - right
const eq = (left: unknown, right: unknown): boolean => left === right
const optionValue = (option: { readonly value: number | string }): number | string => option.value
const optionLabel = (option: { readonly label: string }): string => option.label
