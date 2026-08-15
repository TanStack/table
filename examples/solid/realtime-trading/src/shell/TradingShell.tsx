import { Show, createSignal } from 'solid-js'
import { longAnimationFramesSupported } from '../benchmark/benchmark-monitor'
import {
  useMarketFeedController,
  useTradingShellController,
} from './trading-shell-context'
import type { JSX } from 'solid-js'
import type { FeedMetrics } from '../benchmark/benchmark-monitor'
import type { FeedLoadProfile } from '../feed/feed-load-profiles'

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
        <Configurator />
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
        <span class="brand-mark">TT</span>
        <strong>MARKET MONITOR</strong>
        <span class="environment">SIMULATED</span>
      </div>
      <div class="header-actions">
        <div class="session-info">
          <span>SOLID / FLEX RENDER</span>
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
        </div>
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
        BATCH TICKS <strong>{formatInteger(metrics().lastBatchSize)}</strong>
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
      <span class="statusbar-spacer" />
      <span>WORKER / FIXED CADENCE / IMMUTABLE</span>
    </footer>
  )
}

function Configurator() {
  const { state, actions } = useTradingShellController()
  const feed = useMarketFeedController()
  const { rendererMode, metrics, selectedQuote, mountedCells, liveComponents } =
    state
  const {
    running,
    instrumentCount,
    feedLoadProfile,
    targetTicksPerSecond,
    publishIntervalMs,
    updateSparklines,
    sparklineSampleIntervalMs,
  } = feed.state
  const { resetViewState, setRendererMode, resetMarket } = actions
  const {
    toggle,
    setInstrumentCount,
    setLoadProfile,
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
          <span>Instruments</span>
          <select
            data-testid="instrument-count-select"
            value={instrumentCount()}
            onChange={(event) => {
              resetViewState()
              setInstrumentCount(Number(event.currentTarget.value))
            }}
          >
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="150">150</option>
            <option value="250">250</option>
            <option value="350">350</option>
            <option value="500">500</option>
            <option value="750">750</option>
            <option value="1000">1,000</option>
            <option value="1500">1,500</option>
            <option value="2500">2,500</option>
            <option value="5000">5,000</option>
          </select>
        </label>

        <label class="field">
          <span>Load profile</span>
          <select
            data-testid="load-profile-select"
            value={feedLoadProfile()}
            onChange={(event) =>
              setLoadProfile(event.currentTarget.value as FeedLoadProfile)
            }
          >
            <option value="low">Low · 1K/s</option>
            <option value="medium">Medium · 5K/s</option>
            <option value="high">High · 10K/s</option>
            <option value="very-high">Very high · 25K/s</option>
            <option value="max">Max · 100K/s</option>
            <option value="custom">Custom</option>
          </select>
          <small>
            High is the repeatable default; Max is intentionally saturating.
          </small>
        </label>

        <label class="field rate-field">
          <span>
            Worker sample generation
            <strong>{formatRate(targetTicksPerSecond())}/s</strong>
          </span>
          <input
            data-testid="target-rate-slider"
            type="range"
            min="100"
            max="100000"
            step="100"
            value={targetTicksPerSecond()}
            onInput={(event) =>
              setTargetRate(Number(event.currentTarget.value))
            }
          />
          <small>
            Synthetic quote samples generated inside the worker, not browser
            events. Repeated instruments are coalesced before each message.
          </small>
        </label>

        <label class="field">
          <span>Publish interval</span>
          <select
            data-testid="publish-interval-select"
            value={publishIntervalMs()}
            onChange={(event) =>
              setPublishInterval(Number(event.currentTarget.value))
            }
          >
            <option value="8">8 ms · 125 msg/s</option>
            <option value="16">16 ms · 62.5 msg/s</option>
            <option value="20">20 ms · 50 msg/s</option>
            <option value="33">33 ms · 30 msg/s</option>
            <option value="50">50 ms · 20 msg/s</option>
            <option value="100">100 ms · 10 msg/s</option>
            <option value="250">250 ms · 4 msg/s</option>
            <option value="500">500 ms · 2 msg/s</option>
            <option value="1000">1000 ms · 1 msg/s</option>
          </select>
          <small>
            The worker posts one coalesced update message at this target
            cadence.
          </small>
        </label>
      </section>

      <section class="config-section" aria-labelledby="render-settings">
        <h2 id="render-settings">RENDER PATH</h2>
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
          <span>Intraday sample interval</span>
          <select
            data-testid="sparkline-sample-interval-select"
            value={sparklineSampleIntervalMs()}
            onChange={(event) =>
              setSparklineSampleInterval(Number(event.currentTarget.value))
            }
          >
            <option value="100">100 ms</option>
            <option value="250">250 ms</option>
            <option value="500">500 ms</option>
            <option value="1000">1,000 ms</option>
            <option value="2000">2,000 ms</option>
          </select>
          <small>
            Minimum time between rolling samples for the same instrument.
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

      <Diagnostics
        metrics={metrics()}
        mountedCells={mountedCells()}
        liveComponents={liveComponents()}
      />

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

function Diagnostics(props: {
  metrics: FeedMetrics
  mountedCells: number
  liveComponents: number
}) {
  return (
    <section class="config-section diagnostics" aria-labelledby="diagnostics">
      <h2 id="diagnostics">DIAGNOSTICS</h2>
      <dl>
        <div>
          <dt>Mounted cells</dt>
          <dd>{formatInteger(props.mountedCells)}</dd>
        </div>
        <div>
          <dt>Live components</dt>
          <dd>{formatInteger(props.liveComponents)}</dd>
        </div>
        <div>
          <dt>Created / destroyed</dt>
          <dd>
            {formatInteger(props.metrics.componentsCreated)} /{' '}
            {formatInteger(props.metrics.componentsDestroyed)}
          </dd>
        </div>
        <div>
          <dt>Cell renderer calls / s</dt>
          <dd data-testid="cell-render-rate">
            {formatRate(props.metrics.cellRendererCallsPerSecond)}
          </dd>
        </div>
        <div>
          <dt>Component function calls / s</dt>
          <dd data-testid="component-render-rate">
            {formatRate(props.metrics.componentRenderCallsPerSecond)}
          </dd>
        </div>
        <div>
          <dt>Component function calls by type / s</dt>
          <dd data-testid="component-render-breakdown">
            {formatInvocationRates(props.metrics.componentRenderRates)}
          </dd>
        </div>
        <div>
          <dt>Cell callbacks by column / s</dt>
          <dd data-testid="cell-render-breakdown">
            {formatInvocationRates(props.metrics.cellRendererRates)}
          </dd>
        </div>
        <div>
          <dt>DOM mutation records / s</dt>
          <dd data-testid="dom-mutation-rate">
            {formatRate(props.metrics.domMutationsPerSecond)}
          </dd>
        </div>
        <div>
          <dt>Worker messages</dt>
          <dd data-testid="worker-messages">
            {formatInteger(props.metrics.workerMessages)}
          </dd>
        </div>
        <div>
          <dt>Worker-coalesced updates / s</dt>
          <dd data-testid="superseded-update-rate">
            {formatRate(props.metrics.supersededUpdatesPerSecond)}
          </dd>
        </div>
        <div>
          <dt>Last batch ticks / rows</dt>
          <dd>
            {formatInteger(props.metrics.lastBatchSize)} /{' '}
            {formatInteger(props.metrics.lastUpdateCount)}
          </dd>
        </div>
        <div>
          <dt>Renders &gt; 16.7 ms</dt>
          <dd>{props.metrics.slowRenders}</dd>
        </div>
        <div>
          <dt>Long animation frames</dt>
          <dd>
            {longAnimationFramesSupported
              ? formatInteger(props.metrics.longAnimationFrames)
              : 'Unsupported'}
          </dd>
        </div>
        <div>
          <dt>JS heap</dt>
          <dd>
            {props.metrics.heapMb === null
              ? 'N/A'
              : `${props.metrics.heapMb.toFixed(1)} MB`}
          </dd>
        </div>
      </dl>
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
