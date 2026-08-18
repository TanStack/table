import { computed, defineComponent, ref } from 'vue'
import {
  feedSampleRateAt,
  feedSampleRateIndex,
  feedSampleRateOptions,
} from '../feed/feed-sample-rates'
import {
  FORCED_VIRTUALIZATION_ROW_COUNT,
  resolveVirtualScrollMode,
} from '../table/trading-row-virtualizer'
import {
  useMarketFeedController,
  useTradingShellController,
} from './trading-shell-context'
import { configuratorOptions } from './configurator-options'
import type { FeedMetrics } from '../benchmark/benchmark-monitor'

const integerFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})
const rateFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export const TradingShell = defineComponent({
  name: 'TradingShell',
  setup(_, { slots }) {
    const sidebarOpen = ref(true)
    return () => (
      <main
        class={[
          'trading-terminal',
          !sidebarOpen.value && 'is-sidebar-collapsed',
        ]}
      >
        <div class="shell-header">
          <AppHeader
            sidebarOpen={sidebarOpen.value}
            onSidebarToggle={() => {
              sidebarOpen.value = !sidebarOpen.value
            }}
          />
          {import.meta.env.DEV && (
            <aside class="development-warning">
              DEV BUILD — use the production build before recording results.
            </aside>
          )}
        </div>
        <section class="market-panel" aria-label="Live synthetic quotes">
          {slots.default?.()}
        </section>
        <MarketStatusbar />
        <div class="sidebar-slot">{sidebarOpen.value && <Configurator />}</div>
      </main>
    )
  },
})

const AppHeader = defineComponent({
  name: 'AppHeader',
  props: {
    sidebarOpen: { type: Boolean, required: true },
    onSidebarToggle: { type: Function, required: true },
  },
  setup(props) {
    const feed = useMarketFeedController()
    return () => (
      <header class="app-bar">
        <div class="brand">
          <strong>MARKET MONITOR</strong>
        </div>
        <div class="header-actions">
          <span
            class={[
              'feed-status',
              feed.workerReady.value && feed.running.value && 'is-running',
            ]}
            data-testid="feed-status"
          >
            <span class="status-dot" aria-hidden="true" />
            {!feed.workerReady.value
              ? 'FEED CONNECTING'
              : feed.running.value
                ? 'FEED LIVE'
                : 'FEED PAUSED'}
          </span>
          <button
            class="sidebar-toggle"
            type="button"
            aria-expanded={props.sidebarOpen}
            aria-controls="benchmark-configurator"
            aria-label={
              props.sidebarOpen ? 'Close configurator' : 'Open configurator'
            }
            onClick={() => (props.onSidebarToggle as () => void)()}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <rect x="2.5" y="3" width="15" height="14" rx="1.5" />
              <path d="M12.5 3v14" />
            </svg>
          </button>
        </div>
      </header>
    )
  },
})

const MetricsStrip = defineComponent({
  name: 'MetricsStrip',
  setup() {
    const controller = useTradingShellController()
    return () => {
      const metrics = controller.metrics.value
      return (
        <section class="metrics-strip" aria-labelledby="live-health">
          <h2 id="live-health">LIVE HEALTH</h2>
          <Metric
            label="FRAME RATE (EST.)"
            value={metrics.rafCallbacksPerSecond.toFixed(1)}
            detail="rAF callbacks/s · rolling 1 s"
            testId="frame-rate"
          />
          <Metric
            label="AVG COMMIT"
            value={formatMs(metrics.averageCommitLatencyMs)}
            detail="snapshot → DOM · rolling 3 s"
            testId="average-commit-latency"
          />
          <Metric
            label="LONG FRAMES"
            value={
              controller.longAnimationFramesSupported
                ? String(metrics.longAnimationFrames)
                : 'N/A'
            }
            detail={
              controller.longAnimationFramesSupported
                ? `since reset · worst ${formatMs(metrics.worstLongAnimationFrameMs)}`
                : 'unsupported by this browser'
            }
            testId="long-frame-count"
          />
          <article>
            <span>THROUGHPUT</span>
            <strong data-testid="throughput-rate">
              {formatRate(metrics.rowUpdatesPerSecond)} rows/s
            </strong>
            <small>
              {metrics.stateApplicationsPerSecond.toFixed(1)} snapshots/s · rows
              deduplicated per snapshot
            </small>
          </article>
        </section>
      )
    }
  },
})

const Metric = defineComponent({
  name: 'Metric',
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    detail: { type: String, required: true },
    testId: String,
  },
  setup(props) {
    return () => (
      <article>
        <span>{props.label}</span>
        <strong data-testid={props.testId}>{props.value}</strong>
        <small>{props.detail}</small>
      </article>
    )
  },
})

const MarketStatusbar = defineComponent({
  name: 'MarketStatusbar',
  setup() {
    const controller = useTradingShellController()
    return () => {
      const metrics = controller.metrics.value
      return <footer class="market-statusbar">
        <span>
          MESSAGE SAMPLES{' '}
          <strong>{formatInteger(metrics.lastBatchSize)}</strong>
        </span>
        <span>
          CHANGED ROWS{' '}
          <strong>{formatInteger(metrics.lastUpdateCount)}</strong>
        </span>
        <span>
          HOSTS <strong>{formatInteger(controller.mountedCells.value)}</strong>
        </span>
        <span>
          COMPONENTS{' '}
          <strong>{formatInteger(controller.liveComponents.value)}</strong>
        </span>
      </footer>
    }
  },
})

const Configurator = defineComponent({
  name: 'Configurator',
  setup() {
    const controller = useTradingShellController()
    const feed = useMarketFeedController()
    const virtualScrollForced = computed(
      () => feed.instrumentCount.value >= FORCED_VIRTUALIZATION_ROW_COUNT,
    )
    const virtualScrollMode = computed(() =>
      resolveVirtualScrollMode(
        controller.requestedVirtualScrollMode.value,
        feed.instrumentCount.value,
      ),
    )

    return () => (
      <aside
        id="benchmark-configurator"
        class="configurator"
        aria-label="Benchmark configurator"
      >
        <header>
          <span>CONFIGURATOR</span>
          <small>RUN PARAMETERS</small>
        </header>
        <MetricsStrip />
        <section class="config-section" aria-labelledby="feed-settings">
          <h2 id="feed-settings">FEED</h2>
          <button
            class="primary-action"
            type="button"
            data-testid="feed-toggle"
            onClick={feed.actions.toggle}
          >
            {feed.running.value ? 'PAUSE FEED' : 'START FEED'}
          </button>
          <label class="field">
            <span>Instruments (rows)</span>
            <select
              data-testid="instrument-count-select"
              value={feed.instrumentCount.value}
              onChange={(event) => {
                controller.actions.resetViewState()
                feed.actions.setInstrumentCount(numberValue(event))
              }}
            >
              {configuratorOptions.instrumentCounts.map(optionNode)}
            </select>
          </label>
          <label class="field rate-field">
            <span>
              Synthetic quote workload
              <strong data-testid="target-sample-rate">
                {formatRate(feed.targetTicksPerSecond.value)} samples/s
              </strong>
            </span>
            <input
              data-testid="target-rate-slider"
              type="range"
              min={0}
              max={feedSampleRateOptions.length - 1}
              step={1}
              value={feedSampleRateIndex(feed.targetTicksPerSecond.value)}
              onChange={(event) =>
                feed.actions.setTargetRate(feedSampleRateAt(numberValue(event)))
              }
            />
            <small>
              Fixed worker-side workload levels. Samples are coalesced; this is
              not the message delivery rate.
            </small>
          </label>
          <label class="field">
            <span>Worker delivery interval</span>
            <select
              data-testid="publish-interval-select"
              value={feed.publishIntervalMs.value}
              onChange={(event) =>
                feed.actions.setPublishInterval(numberValue(event))
              }
            >
              {configuratorOptions.workerDeliveryIntervals.map(optionNode)}
            </select>
            <small>One coalesced worker message at this target cadence.</small>
          </label>
        </section>
        <section class="config-section" aria-labelledby="render-settings">
          <h2 id="render-settings">RENDER PATH</h2>
          <label class="field" data-testid="virtual-scroll-mode">
            <span>Row rendering</span>
            <select
              data-testid="virtual-scroll-select"
              value={virtualScrollMode.value}
              disabled={virtualScrollForced.value}
              onChange={(event) =>
                controller.actions.setVirtualScrollEnabled(
                  stringValue(event) === 'tanstack',
                )
              }
            >
              {configuratorOptions.rowRenderingModes.map(optionNode)}
            </select>
            <small>
              {virtualScrollForced.value
                ? 'TanStack Virtual is required and locked at 1,500 or more rows.'
                : 'Full DOM is the default below 200 rows; TanStack Virtual is the default from 200 rows and remains selectable.'}
            </small>
          </label>
          <label class="toggle-field">
            <input
              type="checkbox"
              checked={controller.rendererMode.value === 'swap'}
              onChange={(event) =>
                controller.actions.setRendererMode(
                  checkedValue(event) ? 'swap' : 'stable',
                )
              }
            />
            <span>
              Swap Tick component A ↔ B
              <small>destroy and recreate when direction changes</small>
            </span>
          </label>
          <label class="toggle-field">
            <input
              type="checkbox"
              checked={feed.updateSparklines.value}
              onChange={(event) =>
                feed.actions.setSparklineUpdates(checkedValue(event))
              }
            />
            <span>
              Update intraday charts
              <small>sample rolling prices independently</small>
            </span>
          </label>
          <label class="field">
            <span>Intraday chart sampling</span>
            <select
              data-testid="sparkline-sample-interval-select"
              value={feed.sparklineSampleIntervalMs.value}
              onChange={(event) =>
                feed.actions.setSparklineSampleInterval(numberValue(event))
              }
            >
              {configuratorOptions.intradaySamplingIntervals.map(optionNode)}
            </select>
          </label>
        </section>
        <section class="config-section" aria-labelledby="stress-actions">
          <h2 id="stress-actions">STRESS ACTIONS</h2>
          <div class="action-grid">
            <button type="button" onClick={feed.actions.runBurst}>
              RUN 25K BURST
            </button>
            <button type="button" onClick={controller.actions.resetMarket}>
              RESET SESSION
            </button>
          </div>
        </section>
        <Diagnostics />
        <SelectedInstrument />
      </aside>
    )
  },
})

const Diagnostics = defineComponent({
  name: 'Diagnostics',
  setup() {
    const controller = useTradingShellController()
    return () => {
      const metrics = controller.metrics.value
      return (
        <section
          class="config-section diagnostics"
          aria-labelledby="diagnostics"
        >
          <h2 id="diagnostics">DIAGNOSTICS</h2>
          <dl>
            <Diagnostic
              label="Worker samples / s"
              value={formatRate(metrics.actualTicksPerSecond)}
              testId="actual-rate"
            />
            <Diagnostic
              label="Worker messages / s"
              value={metrics.workerMessagesPerSecond.toFixed(1)}
              testId="message-rate"
            />
            <Diagnostic
              label="Changed rows / s"
              value={formatRate(metrics.rowUpdatesPerSecond)}
              testId="row-update-rate"
            />
            <Diagnostic
              label="Snapshots applied / s"
              value={metrics.stateApplicationsPerSecond.toFixed(1)}
              testId="state-apply-rate"
            />
            <Diagnostic
              label="DOM commits / s"
              value={metrics.tableCommitsPerSecond.toFixed(1)}
              testId="table-render-rate"
            />
            <Diagnostic
              label="P95 / max commit latency"
              value={`${formatMs(metrics.p95CommitLatencyMs)} / ${formatMs(metrics.maxCommitLatencyMs)}`}
            />
            <Diagnostic
              label="Mounted cells"
              value={formatInteger(controller.mountedCells.value)}
            />
            <Diagnostic
              label="Live components"
              value={formatInteger(controller.liveComponents.value)}
            />
            <Diagnostic
              label="Created / destroyed"
              value={`${formatInteger(metrics.componentsCreated)} / ${formatInteger(metrics.componentsDestroyed)}`}
            />
            <Diagnostic
              label="Renderer callbacks / s"
              value={formatRate(metrics.cellRendererCallsPerSecond)}
              testId="cell-render-rate"
            />
            <Diagnostic
              label="Component executions / s"
              value={formatRate(metrics.componentRenderCallsPerSecond)}
              testId="component-render-rate"
            />
            <Diagnostic
              label="Executions by component / s"
              value={formatInvocationRates(metrics.componentRenderRates)}
              testId="component-render-breakdown"
            />
            <Diagnostic
              label="Callbacks by column / s"
              value={formatInvocationRates(metrics.cellRendererRates)}
              testId="cell-render-breakdown"
            />
            <Diagnostic
              label="Observed MutationRecords / s"
              value={formatRate(metrics.domMutationsPerSecond)}
              testId="dom-mutation-rate"
            />
            <Diagnostic
              label="Core row model calls / s"
              value={metrics.rowModelCallsPerSecond.toFixed(1)}
              testId="row-model-call-rate"
            />
            <Diagnostic
              label="Core row model avg / max"
              value={`${formatMs(metrics.rowModelAverageMs)} / ${formatMs(metrics.rowModelMaxMs)}`}
              testId="row-model-duration"
            />
            <Diagnostic
              label="Visible rows"
              value={formatInteger(metrics.visibleRows)}
              testId="visible-row-count"
            />
            <Diagnostic
              label="Worker messages"
              value={formatInteger(metrics.workerMessages)}
              testId="worker-messages"
            />
            <Diagnostic
              label="Worker-coalesced updates / s"
              value={formatRate(metrics.supersededUpdatesPerSecond)}
              testId="superseded-update-rate"
            />
            <Diagnostic
              label="Last samples / updated rows"
              value={`${formatInteger(metrics.lastBatchSize)} / ${formatInteger(metrics.lastUpdateCount)}`}
            />
            <Diagnostic
              label="Commits > 16.7 ms"
              value={formatInteger(metrics.slowCommits)}
            />
            <Diagnostic
              label="JS heap (GC-sensitive)"
              value={
                metrics.heapMb === null
                  ? 'N/A'
                  : `${metrics.heapMb.toFixed(1)} MB`
              }
            />
          </dl>
        </section>
      )
    }
  },
})

const Diagnostic = defineComponent({
  name: 'Diagnostic',
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    testId: String,
  },
  setup(props) {
    return () => (
      <div>
        <dt>{props.label}</dt>
        <dd data-testid={props.testId}>{props.value}</dd>
      </div>
    )
  },
})

const SelectedInstrument = defineComponent({
  name: 'SelectedInstrument',
  setup() {
    const controller = useTradingShellController()
    const feed = useMarketFeedController()
    const selectedQuote = computed(() =>
      feed.getQuoteBySymbol(feed.quotes.value, controller.selectedSymbol.value),
    )
    return () => (
      <section
        class="config-section selected-instrument"
        data-testid="selected-instrument"
      >
        <h2>SELECTED INSTRUMENT</h2>
        {selectedQuote.value ? (
          <>
            <div class="selection">
              <div>
                <strong>{selectedQuote.value.symbol}</strong>
                <span>{selectedQuote.value.company}</span>
              </div>
              <small>{selectedQuote.value.venue}</small>
            </div>
            <dl>
              <div>
                <dt>Last</dt>
                <dd>{selectedQuote.value.price.toFixed(2)}</dd>
              </div>
              <div>
                <dt>Bid / ask</dt>
                <dd>
                  {selectedQuote.value.bid.toFixed(2)} /{' '}
                  {selectedQuote.value.ask.toFixed(2)}
                </dd>
              </div>
            </dl>
          </>
        ) : (
          <p>
            Click or begin a cell selection in any row to inspect its
            instrument.
          </p>
        )}
      </section>
    )
  },
})

function optionNode(option: {
  readonly label: string
  readonly value: number | string
}) {
  return (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  )
}

function stringValue(event: Event): string {
  return (event.target as HTMLInputElement | HTMLSelectElement).value
}

function numberValue(event: Event): number {
  return Number(stringValue(event))
}

function checkedValue(event: Event): boolean {
  return (event.target as HTMLInputElement).checked
}

function formatRate(value: number): string {
  return rateFormatter.format(value)
}

function formatInteger(value: number): string {
  return integerFormatter.format(value)
}

function formatMs(value: number): string {
  return `${value.toFixed(2)} ms`
}

function formatInvocationRates(
  rates: FeedMetrics['cellRendererRates'],
): string {
  const active = rates.filter((entry) => entry.callsPerSecond > 0)
  return active.length === 0
    ? '—'
    : active
        .map((entry) => `${entry.name} ${formatRate(entry.callsPerSecond)}`)
        .join(' · ')
}
