<script lang="ts">
  import { useSelector } from '@tanstack/svelte-store'
  import { feedSampleRateAt, feedSampleRateIndex, feedSampleRateOptions } from '../feed/feed-sample-rates'
  import { FORCED_VIRTUALIZATION_ROW_COUNT, resolveVirtualScrollMode } from '../table/trading-row-virtualizer'
  import { configuratorOptions } from './configurator-options'
  import { useMarketFeedController, useTradingShellController } from './trading-shell-context'
  import Diagnostics from './Diagnostics.svelte'
  import MetricsStrip from './MetricsStrip.svelte'
  import SelectedInstrument from './SelectedInstrument.svelte'

  const controller = useTradingShellController()
  const feed = useMarketFeedController()
  const running = useSelector(feed.running)
  const instrumentCount = useSelector(feed.instrumentCount)
  const targetTicksPerSecond = useSelector(feed.targetTicksPerSecond)
  const publishIntervalMs = useSelector(feed.publishIntervalMs)
  const updateSparklines = useSelector(feed.updateSparklines)
  const sparklineSampleIntervalMs = useSelector(feed.sparklineSampleIntervalMs)
  const benchmarkState = useSelector(controller.store)
  const rendererMode = useSelector(controller.renderAtoms.rendererMode)
  const virtualScrollForced = $derived(instrumentCount.current >= FORCED_VIRTUALIZATION_ROW_COUNT)
  const virtualScrollMode = $derived(resolveVirtualScrollMode(benchmarkState.current.requestedVirtualScrollMode, instrumentCount.current))
  const rate = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
  const numberValue = (event: Event) => Number((event.target as HTMLInputElement | HTMLSelectElement).value)
  const stringValue = (event: Event) => (event.target as HTMLInputElement | HTMLSelectElement).value
  const checkedValue = (event: Event) => (event.target as HTMLInputElement).checked
</script>

<aside id="benchmark-configurator" class="configurator" aria-label="Benchmark configurator">
  <header><span>CONFIGURATOR</span><small>RUN PARAMETERS</small></header>
  <MetricsStrip />
  <section class="config-section" aria-labelledby="feed-settings"><h2 id="feed-settings">FEED</h2>
    <button class="primary-action" type="button" data-testid="feed-toggle" onclick={feed.actions.toggle}>{running.current ? 'PAUSE FEED' : 'START FEED'}</button>
    <label class="field"><span>Instruments (rows)</span><select data-testid="instrument-count-select" value={instrumentCount.current} onchange={(event) => { controller.actions.resetViewState(); feed.actions.setInstrumentCount(numberValue(event)) }}>{#each configuratorOptions.instrumentCounts as option (option.value)}<option value={option.value}>{option.label}</option>{/each}</select></label>
    <label class="field rate-field"><span>Synthetic quote workload <strong data-testid="target-sample-rate">{rate.format(targetTicksPerSecond.current)} samples/s</strong></span><input data-testid="target-rate-slider" type="range" min="0" max={feedSampleRateOptions.length - 1} step="1" value={feedSampleRateIndex(targetTicksPerSecond.current)} oninput={(event) => feed.actions.setTargetRate(feedSampleRateAt(numberValue(event)))} onchange={(event) => feed.actions.setTargetRate(feedSampleRateAt(numberValue(event)))} /><small>Fixed worker-side workload levels. Samples are coalesced; this is not the message delivery rate.</small></label>
    <label class="field"><span>Worker delivery interval</span><select data-testid="publish-interval-select" value={publishIntervalMs.current} onchange={(event) => feed.actions.setPublishInterval(numberValue(event))}>{#each configuratorOptions.workerDeliveryIntervals as option (option.value)}<option value={option.value}>{option.label}</option>{/each}</select><small>One coalesced worker message at this target cadence.</small></label>
  </section>
  <section class="config-section" aria-labelledby="render-settings"><h2 id="render-settings">RENDER PATH</h2>
    <label class="field" data-testid="virtual-scroll-mode"><span>Row rendering</span><select data-testid="virtual-scroll-select" value={virtualScrollMode} disabled={virtualScrollForced} onchange={(event) => controller.actions.setVirtualScrollEnabled(stringValue(event) === 'tanstack')}>{#each configuratorOptions.rowRenderingModes as option (option.value)}<option value={option.value}>{option.label}</option>{/each}</select><small>{virtualScrollForced ? 'TanStack Virtual is required and locked at 1,500 or more rows.' : 'Full DOM is the default below 200 rows; TanStack Virtual is the default from 200 rows and remains selectable.'}</small></label>
    <label class="toggle-field"><input type="checkbox" checked={rendererMode.current === 'swap'} onchange={(event) => controller.actions.setRendererMode(checkedValue(event) ? 'swap' : 'stable')} /><span>Swap Tick component A ↔ B<small>destroy and recreate when direction changes</small></span></label>
    <label class="toggle-field"><input type="checkbox" checked={updateSparklines.current} onchange={(event) => feed.actions.setSparklineUpdates(checkedValue(event))} /><span>Update intraday charts<small>sample rolling prices independently</small></span></label>
    <label class="field"><span>Intraday chart sampling</span><select data-testid="sparkline-sample-interval-select" value={sparklineSampleIntervalMs.current} onchange={(event) => feed.actions.setSparklineSampleInterval(numberValue(event))}>{#each configuratorOptions.intradaySamplingIntervals as option (option.value)}<option value={option.value}>{option.label}</option>{/each}</select></label>
  </section>
  <section class="config-section" aria-labelledby="stress-actions"><h2 id="stress-actions">STRESS ACTIONS</h2>
    <div class="action-grid"><button type="button" onclick={feed.actions.runBurst}>RUN 25K BURST</button><button type="button" onclick={controller.actions.resetMarket}>RESET SESSION</button></div>
  </section>
  <Diagnostics /><SelectedInstrument />
</aside>
