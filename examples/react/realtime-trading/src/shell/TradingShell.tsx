import { shallow } from '@tanstack/react-store'
import { useState } from 'react'
import {
  useMarketFeedController,
  useMarketFeedState,
  useTradingShellController,
  useTradingShellState,
} from './trading-shell-context'
import type { ReactNode } from 'react'
import type {
  FeedMetrics,
  ScrollStressMode,
} from '../benchmark/benchmark-monitor'
import type { FeedLoadProfile } from '../feed/feed-load-profiles'
import type { CoreRowModelMode } from '../table/trading-table'

const integerFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})
const rateFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})
export function TradingShell(props: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const toggleSidebar = () => setSidebarOpen((open) => !open)

  return (
    <main
      className={`trading-terminal ${sidebarOpen ? '' : 'is-sidebar-collapsed'}`}
    >
      <div className="shell-header">
        <AppHeader sidebarOpen={sidebarOpen} onSidebarToggle={toggleSidebar} />

        {import.meta.env.DEV && (
          <aside className="development-warning">
            DEV BUILD — use the profiling production configuration before
            recording React timings.
          </aside>
        )}

        {import.meta.env.MODE === 'production' && (
          <aside className="development-warning">
            STANDARD PRODUCTION BUILD — React Profiler callbacks are disabled;
            run the profile build for commit timings.
          </aside>
        )}
      </div>

      <section className="market-panel" aria-label="Live synthetic quotes">
        <MetricsStrip />
        {props.children}
      </section>
      <MarketStatusbar />
      <div className="sidebar-slot">
        <Configurator />
      </div>
    </main>
  )
}

function AppHeader(props: {
  sidebarOpen: boolean
  onSidebarToggle: () => void
}) {
  const { workerReady, running } = useMarketFeedState(
    (state) => ({
      workerReady: state.workerReady,
      running: state.running,
    }),
    { compare: shallow },
  )
  return (
    <header className="app-bar">
      <div className="brand">
        <span className="brand-mark">TT</span>
        <strong>MARKET MONITOR</strong>
        <span className="environment">SIMULATED</span>
      </div>
      <div className="header-actions">
        <div className="session-info">
          <span>REACT / FLEX RENDER</span>
          <span
            className={`feed-status ${workerReady && running ? 'is-running' : ''}`}
            data-testid="feed-status"
          >
            <span className="status-dot" aria-hidden="true" />
            {!workerReady
              ? 'FEED CONNECTING'
              : running
                ? 'FEED LIVE'
                : 'FEED PAUSED'}
          </span>
        </div>
        <button
          className="sidebar-toggle"
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
  const { lastBatchSize, lastUpdateCount, mountedCells, liveComponents } =
    useTradingShellState(
      (state) => ({
        lastBatchSize: state.metrics.lastBatchSize,
        lastUpdateCount: state.metrics.lastUpdateCount,
        mountedCells: state.mountedCells,
        liveComponents: state.liveComponents,
      }),
      { compare: shallow },
    )
  return (
    <footer className="market-statusbar">
      <span>
        BATCH TICKS <strong>{formatInteger(lastBatchSize)}</strong>
      </span>
      <span>
        ROW UPDATES <strong>{formatInteger(lastUpdateCount)}</strong>
      </span>
      <span>
        HOSTS <strong>{formatInteger(mountedCells)}</strong>
      </span>
      <span>
        COMPONENTS <strong>{formatInteger(liveComponents)}</strong>
      </span>
      <span className="statusbar-spacer" />
      <span>WORKER / FIXED CADENCE / IMMUTABLE</span>
    </footer>
  )
}

function Configurator() {
  const feedState = useMarketFeedState(
    (storeState) => ({
      running: storeState.running,
      instrumentCount: storeState.instrumentCount,
      feedLoadProfile: storeState.feedLoadProfile,
      targetTicksPerSecond: storeState.targetTicksPerSecond,
      publishIntervalMs: storeState.publishIntervalMs,
      updateSparklines: storeState.updateSparklines,
      sparklineSampleIntervalMs: storeState.sparklineSampleIntervalMs,
    }),
    { compare: shallow },
  )
  const benchmarkState = useTradingShellState(
    (storeState) => ({
      coreRowModelMode: storeState.coreRowModelMode,
      coreFilterValue: storeState.coreFilterValue,
      scrollStressMode: storeState.scrollStressMode,
      rendererMode: storeState.rendererMode,
    }),
    { compare: shallow },
  )
  const controller = useTradingShellController()
  const feed = useMarketFeedController()
  const { actions } = controller
  const feedActions = feed.actions
  const {
    running,
    instrumentCount,
    feedLoadProfile,
    targetTicksPerSecond,
    publishIntervalMs,
    updateSparklines,
    sparklineSampleIntervalMs,
  } = feedState
  const { coreRowModelMode, coreFilterValue, scrollStressMode, rendererMode } =
    benchmarkState
  const {
    setCoreRowModelMode,
    setCoreFilterValue,
    setScrollStressMode,
    setRendererMode,
    resetMarket,
  } = actions
  const {
    toggle,
    setInstrumentCount,
    setLoadProfile,
    setTargetRate,
    setPublishInterval,
    setSparklineUpdates,
    setSparklineSampleInterval,
    runBurst,
  } = feedActions

  return (
    <aside
      id="benchmark-configurator"
      className="configurator"
      aria-label="Benchmark configurator"
    >
      <header>
        <span>CONFIGURATOR</span>
        <small>RUN PARAMETERS</small>
      </header>

      <section className="config-section" aria-labelledby="feed-settings">
        <h2 id="feed-settings">FEED</h2>
        <button
          className="primary-action"
          type="button"
          data-testid="feed-toggle"
          onClick={toggle}
        >
          {running ? 'PAUSE FEED' : 'START FEED'}
        </button>

        <label className="field">
          <span>Instruments</span>
          <select
            data-testid="instrument-count-select"
            value={instrumentCount}
            onChange={(event) => {
              actions.resetViewState()
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

        <label className="field">
          <span>Load profile</span>
          <select
            data-testid="load-profile-select"
            value={feedLoadProfile}
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

        <label className="field rate-field">
          <span>
            Worker sample generation
            <strong>{formatRate(targetTicksPerSecond)}/s</strong>
          </span>
          <input
            data-testid="target-rate-slider"
            type="range"
            min="100"
            max="100000"
            step="100"
            value={targetTicksPerSecond}
            onChange={(event) =>
              setTargetRate(Number(event.currentTarget.value))
            }
          />
          <small>
            Synthetic quote samples generated inside the worker, not browser
            events. Repeated instruments are coalesced before each message.
          </small>
        </label>

        <label className="field">
          <span>Publish interval</span>
          <select
            data-testid="publish-interval-select"
            value={publishIntervalMs}
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

      <section className="config-section" aria-labelledby="render-settings">
        <h2 id="render-settings">RENDER PATH</h2>
        <label className="field">
          <span>TanStack core row model</span>
          <select
            data-testid="core-row-model-select"
            value={coreRowModelMode}
            onChange={(event) =>
              setCoreRowModelMode(event.currentTarget.value as CoreRowModelMode)
            }
          >
            <option value="none">Off · source order</option>
            <option value="sort">Sort Last descending</option>
            <option value="filter">Filter Symbol</option>
            <option value="sort-filter">Filter + sort Last</option>
          </select>
          <small>
            Runs inside the selected adapter against the stable market-data
            array.
          </small>
        </label>

        {(coreRowModelMode === 'filter' ||
          coreRowModelMode === 'sort-filter') && (
          <label className="field">
            <span>Symbol contains</span>
            <input
              data-testid="core-filter-input"
              type="text"
              value={coreFilterValue}
              onChange={(event) =>
                setCoreFilterValue(event.currentTarget.value)
              }
            />
            <small>Case-insensitive column filter; try ALP, 1, or R.</small>
          </label>
        )}

        <label className="toggle-field">
          <input
            type="checkbox"
            checked={rendererMode === 'swap'}
            onChange={(event) =>
              setRendererMode(event.currentTarget.checked ? 'swap' : 'stable')
            }
          />
          <span>
            Swap Tick component A ↔ B
            <small>destroy and recreate when direction changes</small>
          </span>
        </label>

        <label className="toggle-field">
          <input
            type="checkbox"
            checked={updateSparklines}
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

        <label className="field">
          <span>Intraday sample interval</span>
          <select
            data-testid="sparkline-sample-interval-select"
            value={sparklineSampleIntervalMs}
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

      <section className="config-section" aria-labelledby="stress-actions">
        <h2 id="stress-actions">STRESS ACTIONS</h2>
        <label className="field">
          <span>Automated scroll pressure</span>
          <select
            data-testid="scroll-stress-select"
            value={scrollStressMode}
            onChange={(event) =>
              setScrollStressMode(event.currentTarget.value as ScrollStressMode)
            }
          >
            <option value="off">Off</option>
            <option value="vertical">Vertical · 700 px/s</option>
            <option value="horizontal">Horizontal · 420 px/s</option>
            <option value="both">Vertical + horizontal</option>
          </select>
          <small>
            Bounces the real table viewport and records callback rate, distance,
            and delayed scroll frames.
          </small>
        </label>
        <div className="action-grid">
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
  const { metrics, longAnimationFramesSupported } = useTradingShellState(
    (state) => ({
      metrics: state.metrics,
      longAnimationFramesSupported: state.longAnimationFramesSupported,
    }),
    { compare: shallow },
  )
  return (
    <section className="metrics-strip" aria-label="Live performance metrics">
      <article>
        <span>WORKER SAMPLES</span>
        <strong data-testid="actual-rate">
          {formatRate(metrics.actualTicksPerSecond)}
        </strong>
        <small>generated samples/s</small>
      </article>
      <article>
        <span>ROW UPDATES</span>
        <strong data-testid="row-update-rate">
          {formatRate(metrics.rowUpdatesPerSecond)}
        </strong>
        <small>unique rows applied/s</small>
      </article>
      <article>
        <span>MESSAGES</span>
        <strong data-testid="message-rate">
          {metrics.workerMessagesPerSecond.toFixed(1)}
        </strong>
        <small>worker messages/s</small>
      </article>
      <article>
        <span>STATE APPLIES</span>
        <strong data-testid="state-apply-rate">
          {metrics.stateApplicationsPerSecond.toFixed(1)}
        </strong>
        <small>quote snapshots/s</small>
      </article>
      <article>
        <span>TABLE COMMITS</span>
        <strong data-testid="table-render-rate">
          {metrics.tableRendersPerSecond.toFixed(1)}
        </strong>
        <small>completed renders/s</small>
      </article>
      <article>
        <span>AVG RENDER</span>
        <strong>{formatMs(metrics.averageRenderMs)}</strong>
        <small>mutation → render</small>
      </article>
      <article>
        <span>P95 RENDER</span>
        <strong>{formatMs(metrics.p95RenderMs)}</strong>
        <small>max {formatMs(metrics.maxRenderMs)}</small>
      </article>
      <article>
        <span>LONG FRAMES</span>
        {longAnimationFramesSupported ? (
          <>
            <strong
              data-testid="long-frame-count"
              className={metrics.longAnimationFrames > 0 ? 'metric-alert' : ''}
            >
              {metrics.longAnimationFrames}
            </strong>
            <small>worst {formatMs(metrics.worstLongAnimationFrameMs)}</small>
          </>
        ) : (
          <>
            <strong data-testid="long-frame-count">N/A</strong>
            <small>unsupported</small>
          </>
        )}
      </article>
    </section>
  )
}

function Diagnostics() {
  const {
    metrics,
    mountedCells,
    liveComponents,
    longAnimationFramesSupported,
  } = useTradingShellState(
    (state) => ({
      metrics: state.metrics,
      mountedCells: state.mountedCells,
      liveComponents: state.liveComponents,
      longAnimationFramesSupported: state.longAnimationFramesSupported,
    }),
    { compare: shallow },
  )
  const profilerEnabled =
    import.meta.env.DEV || import.meta.env.MODE === 'profile'
  return (
    <section
      className="config-section diagnostics"
      aria-labelledby="diagnostics"
    >
      <h2 id="diagnostics">DIAGNOSTICS</h2>
      <dl>
        <div>
          <dt>Mounted cells</dt>
          <dd>{formatInteger(mountedCells)}</dd>
        </div>
        <div>
          <dt>Live components</dt>
          <dd>{formatInteger(liveComponents)}</dd>
        </div>
        <div>
          <dt>Created / destroyed</dt>
          <dd>
            {formatInteger(metrics.componentsCreated)} /{' '}
            {formatInteger(metrics.componentsDestroyed)}
          </dd>
        </div>
        <div>
          <dt>Cell renderer calls / s</dt>
          <dd data-testid="cell-render-rate">
            {formatRate(metrics.cellRendererCallsPerSecond)}
          </dd>
        </div>
        <div>
          <dt>Component function calls / s</dt>
          <dd data-testid="component-render-rate">
            {formatRate(metrics.componentRenderCallsPerSecond)}
          </dd>
        </div>
        <div>
          <dt>Component function calls by type / s</dt>
          <dd data-testid="component-render-breakdown">
            {formatInvocationRates(metrics.componentRenderRates)}
          </dd>
        </div>
        <div>
          <dt>Cell callbacks by column / s</dt>
          <dd data-testid="cell-render-breakdown">
            {formatInvocationRates(metrics.cellRendererRates)}
          </dd>
        </div>
        <div>
          <dt>DOM mutation records / s</dt>
          <dd data-testid="dom-mutation-rate">
            {formatRate(metrics.domMutationsPerSecond)}
          </dd>
        </div>
        <div>
          <dt>React Profiler commits / s</dt>
          <dd data-testid="profiler-commit-rate">
            {profilerEnabled
              ? metrics.profilerCommitsPerSecond.toFixed(1)
              : 'PROFILE BUILD REQUIRED'}
          </dd>
        </div>
        <div>
          <dt>Profiler actual avg / p95</dt>
          <dd data-testid="profiler-actual-duration">
            {profilerEnabled
              ? `${formatMs(metrics.profilerAverageActualMs)} / ${formatMs(
                  metrics.profilerP95ActualMs,
                )}`
              : 'N/A'}
          </dd>
        </div>
        <div>
          <dt>Profiler base avg</dt>
          <dd>
            {profilerEnabled ? formatMs(metrics.profilerAverageBaseMs) : 'N/A'}
          </dd>
        </div>
        <div>
          <dt>Core row model calls / s</dt>
          <dd data-testid="row-model-call-rate">
            {metrics.rowModelCallsPerSecond.toFixed(1)}
          </dd>
        </div>
        <div>
          <dt>Core row model avg / max</dt>
          <dd data-testid="row-model-duration">
            {formatMs(metrics.rowModelAverageMs)} /{' '}
            {formatMs(metrics.rowModelMaxMs)}
          </dd>
        </div>
        <div>
          <dt>Visible rows</dt>
          <dd data-testid="visible-row-count">
            {formatInteger(metrics.visibleRows)}
          </dd>
        </div>
        <div>
          <dt>Scroll callbacks / distance</dt>
          <dd data-testid="scroll-pressure-rate">
            {metrics.scrollCallbacksPerSecond.toFixed(1)} /{' '}
            {formatRate(metrics.scrollDistancePerSecond)} px/s
          </dd>
        </div>
        <div>
          <dt>Delayed scroll frames (&gt;34 ms)</dt>
          <dd data-testid="scroll-jank-frames">
            {formatInteger(metrics.scrollJankFrames)}
          </dd>
        </div>
        <div>
          <dt>Worker messages</dt>
          <dd data-testid="worker-messages">
            {formatInteger(metrics.workerMessages)}
          </dd>
        </div>
        <div>
          <dt>Worker-coalesced updates / s</dt>
          <dd data-testid="superseded-update-rate">
            {formatRate(metrics.supersededUpdatesPerSecond)}
          </dd>
        </div>
        <div>
          <dt>Last batch ticks / rows</dt>
          <dd>
            {formatInteger(metrics.lastBatchSize)} /{' '}
            {formatInteger(metrics.lastUpdateCount)}
          </dd>
        </div>
        <div>
          <dt>Renders &gt; 16.7 ms</dt>
          <dd>{metrics.slowRenders}</dd>
        </div>
        <div>
          <dt>Long animation frames</dt>
          <dd>
            {longAnimationFramesSupported
              ? formatInteger(metrics.longAnimationFrames)
              : 'Unsupported'}
          </dd>
        </div>
        <div>
          <dt>JS heap</dt>
          <dd>
            {metrics.heapMb === null
              ? 'N/A'
              : `${metrics.heapMb.toFixed(1)} MB`}
          </dd>
        </div>
      </dl>
    </section>
  )
}

function SelectedInstrument() {
  const selectedQuote = useTradingShellState((state) => state.selectedQuote)
  return (
    <section
      className="config-section selected-instrument"
      data-testid="selected-instrument"
    >
      <h2>SELECTED INSTRUMENT</h2>
      {selectedQuote ? (
        <>
          <div className="selection">
            <div>
              <strong>{selectedQuote.symbol}</strong>
              <span>{selectedQuote.company}</span>
            </div>
            <small>{selectedQuote.venue}</small>
          </div>
          <dl>
            <div>
              <dt>Last</dt>
              <dd>{selectedQuote.price.toFixed(2)}</dd>
            </div>
            <div>
              <dt>Bid / ask</dt>
              <dd>
                {selectedQuote.bid.toFixed(2)} / {selectedQuote.ask.toFixed(2)}
              </dd>
            </div>
          </dl>
        </>
      ) : (
        <p>
          Click or begin a cell selection in any row to inspect its instrument.
        </p>
      )}
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
