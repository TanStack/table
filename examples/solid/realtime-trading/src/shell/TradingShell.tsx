import { For, Show, createMemo, createSignal } from 'solid-js'
import { longAnimationFramesSupported } from '../benchmark/benchmark-monitor'
import {
  feedSampleRateAt,
  feedSampleRateIndex,
  feedSampleRateOptions,
} from '../feed/feed-sample-rates'
import { FORCED_VIRTUALIZATION_ROW_COUNT } from '../table/trading-row-virtualizer'
import {
  useMarketFeedController,
  useTradingShellController,
} from './trading-shell-context'
import { configuratorOptions } from './configurator-options'
import type { JSX } from 'solid-js'
import type { FeedMetrics } from '../benchmark/benchmark-monitor'

const integerFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})
const rateFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})
export function TradingShell(props: { children: JSX.Element }) {
  const [sidebarOpen, setSidebarOpen] = createSignal(true)
  const toggleSidebar = () => setSidebarOpen((open) => !open)

  return (
    <main
      class="trading-terminal"
      classList={{ 'is-sidebar-collapsed': !sidebarOpen() }}
    >
      <div class="shell-header">
        <AppHeader
          sidebarOpen={sidebarOpen()}
          onSidebarToggle={toggleSidebar}
        />

        <Show when={import.meta.env.DEV}>
          <aside class="development-warning">
            DEV BUILD — use the production configuration before recording
            results.
          </aside>
        </Show>
      </div>

      <section class="market-panel" aria-label="Live synthetic quotes">
        <MetricsStrip />
        {props.children}
      </section>
      <MarketStatusbar />
      <div class="sidebar-slot">
        <Show when={sidebarOpen()}>
          <Configurator />
        </Show>
      </div>
    </main>
  )
}

function AppHeader(props: {
  sidebarOpen: boolean
  onSidebarToggle: () => void
}) {
  const { workerReady, running } = useMarketFeedController().state
  return (
    <header class="app-bar">
      <div class="brand">
        <strong>MARKET MONITOR</strong>
      </div>
      <div class="header-actions">
        <span
          class="feed-status"
          classList={{ 'is-running': workerReady() && running() }}
          data-testid="feed-status"
        >
          <span class="status-dot" aria-hidden="true" />
          {!workerReady()
            ? 'FEED CONNECTING'
            : running()
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
          title={props.sidebarOpen ? 'Close configurator' : 'Open configurator'}
          onClick={props.onSidebarToggle}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <rect x="2.5" y="3" width="15" height="14" rx="1.5" />
            <path d="M12.5 3v14" />
          </svg>
        </button>
      </div>
    </header>
  )
}

function MarketStatusbar() {
  const { metrics, mountedCells, liveComponents } =
    useTradingShellController().state
  return (
    <footer class="market-statusbar">
      <span>
        MESSAGE SAMPLES{' '}
        <strong>{formatInteger(metrics().lastBatchSize)}</strong>
      </span>
      <span>
        ROW UPDATES <strong>{formatInteger(metrics().lastUpdateCount)}</strong>
      </span>
      <span>
        HOSTS <strong>{formatInteger(mountedCells())}</strong>
      </span>
      <span>
        COMPONENTS <strong>{formatInteger(liveComponents())}</strong>
      </span>
    </footer>
  )
}

function Configurator() {
  const { state, actions } = useTradingShellController()
  const feed = useMarketFeedController()
  const {
    rendererMode,
    virtualScrollForced,
    virtualScrollMode,
  } = state
  const {
    running,
    instrumentCount,
    targetTicksPerSecond,
    publishIntervalMs,
    updateSparklines,
    sparklineSampleIntervalMs,
  } = feed.state
  const {
    resetViewState,
    setRendererMode,
    setVirtualScrollEnabled,
    resetMarket,
  } = actions
  const {
    toggle,
    setInstrumentCount,
    setTargetRate,
    setPublishInterval,
    setSparklineUpdates,
    setSparklineSampleInterval,
    runBurst,
  } = feed.actions
  return (
    <aside
      id="benchmark-configurator"
      class="configurator"
      aria-label="Benchmark configurator"
    >
      <header>
        <span>CONFIGURATOR</span>
        <small>RUN PARAMETERS</small>
      </header>

      <section class="config-section" aria-labelledby="feed-settings">
        <h2 id="feed-settings">FEED</h2>
        <button
          class="primary-action"
          type="button"
          data-testid="feed-toggle"
          onClick={toggle}
        >
          {running() ? 'PAUSE FEED' : 'START FEED'}
        </button>

        <label class="field">
          <span>Instruments (rows)</span>
          <select
            data-testid="instrument-count-select"
            value={instrumentCount()}
            onChange={(event) => {
              resetViewState()
              setInstrumentCount(Number(event.currentTarget.value))
            }}
          >
            <For each={configuratorOptions.instrumentCounts}>
              {(option) => <option value={option.value}>{option.label}</option>}
            </For>
          </select>
        </label>

        <label class="field rate-field">
          <span>
            Synthetic quote workload
            <strong data-testid="target-sample-rate">
              {formatRate(targetTicksPerSecond())} samples/s
            </strong>
          </span>
          <input
            data-testid="target-rate-slider"
            type="range"
            min={0}
            max={feedSampleRateOptions.length - 1}
            step={1}
            list="worker-sample-rate-steps"
            value={feedSampleRateIndex(targetTicksPerSecond())}
            aria-valuetext={`${formatRate(
              targetTicksPerSecond(),
            )} synthetic quote samples per second`}
            onInput={(event) =>
              setTargetRate(feedSampleRateAt(Number(event.currentTarget.value)))
            }
          />
          <datalist id="worker-sample-rate-steps">
            <For each={feedSampleRateOptions}>
              {(option, index) => (
                <option value={index()} label={option.label} />
              )}
            </For>
          </datalist>
          <small>
            Fixed worker-side workload levels, from 100 to 100K samples/s.
            Samples are coalesced; this is not the message delivery rate.
          </small>
        </label>

        <label class="field">
          <span>Worker delivery interval</span>
          <select
            data-testid="publish-interval-select"
            value={publishIntervalMs()}
            onChange={(event) =>
              setPublishInterval(Number(event.currentTarget.value))
            }
          >
            <For each={configuratorOptions.workerDeliveryIntervals}>
              {(option) => <option value={option.value}>{option.label}</option>}
            </For>
          </select>
          <small>
            The worker posts one coalesced update message at this target
            cadence.
          </small>
        </label>
      </section>

      <section class="config-section" aria-labelledby="render-settings">
        <h2 id="render-settings">RENDER PATH</h2>
        <label class="field" data-testid="virtual-scroll-mode">
          <span>Row rendering</span>
          <select
            data-testid="virtual-scroll-select"
            value={virtualScrollMode()}
            disabled={virtualScrollForced()}
            onChange={(event) =>
              setVirtualScrollEnabled(event.currentTarget.value === 'tanstack')
            }
          >
            <For each={configuratorOptions.rowRenderingModes}>
              {(option) => <option value={option.value}>{option.label}</option>}
            </For>
          </select>
          <small>
            {virtualScrollForced()
              ? `TanStack Virtual is required and locked at ${FORCED_VIRTUALIZATION_ROW_COUNT.toLocaleString()} or more rows.`
              : 'Full DOM mounts every row; TanStack Virtual mounts only the visible window.'}
          </small>
        </label>

        <label class="toggle-field">
          <input
            type="checkbox"
            checked={rendererMode() === 'swap'}
            onChange={(event) =>
              setRendererMode(event.currentTarget.checked ? 'swap' : 'stable')
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
            checked={updateSparklines()}
            onChange={(event) =>
              setSparklineUpdates(event.currentTarget.checked)
            }
          />
          <span>
            Update intraday charts
            <small>
              sample rolling prices independently for every instrument
            </small>
          </span>
        </label>

        <label class="field">
          <span>Intraday chart sampling</span>
          <select
            data-testid="sparkline-sample-interval-select"
            value={sparklineSampleIntervalMs()}
            onChange={(event) =>
              setSparklineSampleInterval(Number(event.currentTarget.value))
            }
          >
            <For each={configuratorOptions.intradaySamplingIntervals}>
              {(option) => <option value={option.value}>{option.label}</option>}
            </For>
          </select>
          <small>
            How often each row adds a point to its sparkline. Quote generation
            and worker delivery are unaffected.
          </small>
        </label>
      </section>

      <section class="config-section" aria-labelledby="stress-actions">
        <h2 id="stress-actions">STRESS ACTIONS</h2>
        <div class="action-grid">
          <button type="button" onClick={runBurst}>
            RUN 25K BURST
          </button>
          <button type="button" onClick={resetMarket}>
            RESET SESSION
          </button>
        </div>
      </section>

      <Diagnostics />
      <SelectedInstrument />
    </aside>
  )
}

function MetricsStrip() {
  const { metrics } = useTradingShellController().state
  return (
    <section class="metrics-strip" aria-label="Live performance metrics">
      <article>
        <span>WORKER SAMPLES</span>
        <strong data-testid="actual-rate">
          {formatRate(metrics().actualTicksPerSecond)}
        </strong>
        <small>generated samples/s</small>
      </article>
      <article>
        <span>ROW UPDATES</span>
        <strong data-testid="row-update-rate">
          {formatRate(metrics().rowUpdatesPerSecond)}
        </strong>
        <small>unique rows applied/s</small>
      </article>
      <article>
        <span>MESSAGES</span>
        <strong data-testid="message-rate">
          {metrics().workerMessagesPerSecond.toFixed(1)}
        </strong>
        <small>worker messages/s</small>
      </article>
      <article>
        <span>STATE APPLIES</span>
        <strong data-testid="state-apply-rate">
          {metrics().stateApplicationsPerSecond.toFixed(1)}
        </strong>
        <small>quote snapshots/s</small>
      </article>
      <article>
        <span>TABLE COMMITS</span>
        <strong data-testid="table-render-rate">
          {metrics().tableRendersPerSecond.toFixed(1)}
        </strong>
        <small>completed renders/s</small>
      </article>
      <article>
        <span>AVG RENDER</span>
        <strong>{formatMs(metrics().averageRenderMs)}</strong>
        <small>mutation → render</small>
      </article>
      <article>
        <span>P95 RENDER</span>
        <strong>{formatMs(metrics().p95RenderMs)}</strong>
        <small>max {formatMs(metrics().maxRenderMs)}</small>
      </article>
      <article>
        <span>LONG FRAMES</span>
        <Show
          when={longAnimationFramesSupported}
          fallback={
            <>
              <strong data-testid="long-frame-count">N/A</strong>
              <small>unsupported</small>
            </>
          }
        >
          <strong
            data-testid="long-frame-count"
            classList={{
              'metric-alert': metrics().longAnimationFrames > 0,
            }}
          >
            {metrics().longAnimationFrames}
          </strong>
          <small>worst {formatMs(metrics().worstLongAnimationFrameMs)}</small>
        </Show>
      </article>
    </section>
  )
}

function Diagnostics() {
  const { metrics, mountedCells, liveComponents } =
    useTradingShellController().state
  return (
    <section class="config-section diagnostics" aria-labelledby="diagnostics">
      <h2 id="diagnostics">DIAGNOSTICS</h2>
      <dl>
        <div>
          <dt>Mounted cells</dt>
          <dd>{formatInteger(mountedCells())}</dd>
        </div>
        <div>
          <dt>Live components</dt>
          <dd>{formatInteger(liveComponents())}</dd>
        </div>
        <div>
          <dt>Created / destroyed</dt>
          <dd>
            {formatInteger(metrics().componentsCreated)} /{' '}
            {formatInteger(metrics().componentsDestroyed)}
          </dd>
        </div>
        <div>
          <dt>Renderer callbacks / s</dt>
          <dd data-testid="cell-render-rate">
            {formatRate(metrics().cellRendererCallsPerSecond)}
          </dd>
        </div>
        <div>
          <dt>Component executions / s</dt>
          <dd data-testid="component-render-rate">
            {formatRate(metrics().componentRenderCallsPerSecond)}
          </dd>
        </div>
        <div>
          <dt>Executions by component / s</dt>
          <dd data-testid="component-render-breakdown">
            {formatInvocationRates(metrics().componentRenderRates)}
          </dd>
        </div>
        <div>
          <dt>Callbacks by column / s</dt>
          <dd data-testid="cell-render-breakdown">
            {formatInvocationRates(metrics().cellRendererRates)}
          </dd>
        </div>
        <div>
          <dt>DOM mutation records / s</dt>
          <dd data-testid="dom-mutation-rate">
            {formatRate(metrics().domMutationsPerSecond)}
          </dd>
        </div>
        <div>
          <dt>Worker messages</dt>
          <dd data-testid="worker-messages">
            {formatInteger(metrics().workerMessages)}
          </dd>
        </div>
        <div>
          <dt>Worker-coalesced updates / s</dt>
          <dd data-testid="superseded-update-rate">
            {formatRate(metrics().supersededUpdatesPerSecond)}
          </dd>
        </div>
        <div>
          <dt>Last message samples / updated rows</dt>
          <dd>
            {formatInteger(metrics().lastBatchSize)} /{' '}
            {formatInteger(metrics().lastUpdateCount)}
          </dd>
        </div>
        <div>
          <dt>Renders &gt; 16.7 ms</dt>
          <dd>{metrics().slowRenders}</dd>
        </div>
        <div>
          <dt>Long animation frames</dt>
          <dd>
            {longAnimationFramesSupported
              ? formatInteger(metrics().longAnimationFrames)
              : 'Unsupported'}
          </dd>
        </div>
        <div>
          <dt>JS heap</dt>
          <dd>
            {metrics().heapMb === null
              ? 'N/A'
              : `${metrics().heapMb?.toFixed(1)} MB`}
          </dd>
        </div>
      </dl>
    </section>
  )
}

function SelectedInstrument() {
  const feed = useMarketFeedController()
  const { selectedSymbol } = useTradingShellController().state
  const selectedQuote = createMemo(() =>
    feed.getQuoteBySymbol(selectedSymbol()),
  )
  return (
    <section
      class="config-section selected-instrument"
      data-testid="selected-instrument"
    >
      <h2>SELECTED INSTRUMENT</h2>
      <Show
        when={selectedQuote()}
        fallback={
          <p>
            Click or begin a cell selection in any row to inspect its
            instrument.
          </p>
        }
      >
        {(quote) => (
          <>
            <div class="selection">
              <div>
                <strong>{quote().symbol}</strong>
                <span>{quote().company}</span>
              </div>
              <small>{quote().venue}</small>
            </div>
            <dl>
              <div>
                <dt>Last</dt>
                <dd>{quote().price.toFixed(2)}</dd>
              </div>
              <div>
                <dt>Bid / ask</dt>
                <dd>
                  {quote().bid.toFixed(2)} / {quote().ask.toFixed(2)}
                </dd>
              </div>
            </dl>
          </>
        )}
      </Show>
    </section>
  )
}

function formatInteger(value: number): string {
  return integerFormatter.format(value)
}

function formatRate(value: number): string {
  return rateFormatter.format(value)
}

function formatMs(value: number): string {
  return `${value.toFixed(2)} ms`
}

function formatInvocationRates(
  rates: FeedMetrics['componentRenderRates'],
): string {
  const activeRates = rates
    .filter((rate) => rate.callsPerSecond > 0)
    .sort((left, right) => right.callsPerSecond - left.callsPerSecond)
  return activeRates.length === 0
    ? 'No calls in sample'
    : activeRates
        .map((rate) => `${rate.name} ${formatRate(rate.callsPerSecond)}`)
        .join(' · ')
}
