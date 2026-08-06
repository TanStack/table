import { shallow } from '@tanstack/react-store'
import {
  useTradingShellController,
  useTradingShellState,
} from './trading-shell-context'
import type { ReactNode } from 'react'
import type {
  FeedMetrics,
  ScrollStressMode,
} from '../benchmark/benchmark-monitor'
import type { FeedLoadProfile, RowWorkloadMode } from '../benchmark-profiles'
import type {
  CoreRowModelMode,
  TableAdapter,
} from '../trading-table'

const integerFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})
const rateFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})
export function TradingShell(props: { children: ReactNode }) {
  return (
    <main className="trading-terminal">
      <AppHeader />

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

      <div className="workspace">
        <section className="market-panel" aria-label="Live synthetic quotes">
          <MarketToolbar />
          <MetricsStrip />
          {props.children}
          <MarketStatusbar />
        </section>
        <Configurator />
      </div>
    </main>
  )
}

function AppHeader() {
  const { workerReady, running } = useTradingShellState(
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
    </header>
  )
}

function MarketToolbar() {
  const {
    coreRowModelMode,
    rendererMode,
    updateSparklines,
    updateQuoteAges,
    quoteCount,
    displayQuoteCount,
    adapterLabel,
    workloadLabel,
  } = useTradingShellState(
    (state) => ({
      coreRowModelMode: state.coreRowModelMode,
      rendererMode: state.rendererMode,
      updateSparklines: state.updateSparklines,
      updateQuoteAges: state.updateQuoteAges,
      quoteCount: state.quotes.length,
      displayQuoteCount: state.displayQuotes.length,
      adapterLabel: state.adapterLabel,
      workloadLabel: state.workloadLabel,
    }),
    { compare: shallow },
  )
  return (
    <header className="market-toolbar">
      <div className="watchlist-name">
        <span>WATCHLIST</span>
        <strong>ALL INSTRUMENTS</strong>
      </div>
      <div className="market-context">
        <span>
          {formatInteger(displayQuoteCount)} / {formatInteger(quoteCount)}{' '}
          SYMBOLS
        </span>
        <span>REACT {adapterLabel}</span>
        <span>WORKER STREAM</span>
        <span>IMMUTABLE ROWS</span>
        <span>{workloadLabel}</span>
        <span>
          {coreRowModelMode === 'none'
            ? 'CORE ROW MODEL OFF'
            : `CORE ${coreRowModelMode.toUpperCase()}`}
        </span>
        <span>
          {rendererMode === 'stable' ? 'STABLE CELLS' : 'A/B CELL SWAP'}
        </span>
        <span>{updateSparklines ? 'CHARTS ON' : 'CHARTS OFF'}</span>
        <span>{updateQuoteAges ? 'AGE CLOCK ON' : 'AGE CLOCK OFF'}</span>
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
        BATCH EVENTS <strong>{formatInteger(lastBatchSize)}</strong>
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
      <span>WORKER / ACKNOWLEDGED / IMMUTABLE</span>
    </footer>
  )
}

function Configurator() {
  const state = useTradingShellState(
    (storeState) => ({
      running: storeState.running,
      tableAdapter: storeState.tableAdapter,
      instrumentCount: storeState.instrumentCount,
      feedLoadProfile: storeState.feedLoadProfile,
      targetEventsPerSecond: storeState.targetEventsPerSecond,
      rowWorkloadMode: storeState.rowWorkloadMode,
      coreRowModelMode: storeState.coreRowModelMode,
      coreFilterValue: storeState.coreFilterValue,
      scrollStressMode: storeState.scrollStressMode,
      rendererMode: storeState.rendererMode,
      updateSparklines: storeState.updateSparklines,
      updateQuoteAges: storeState.updateQuoteAges,
    }),
    { compare: shallow },
  )
  const { actions } = useTradingShellController()
  const {
    running,
    tableAdapter,
    instrumentCount,
    feedLoadProfile,
    targetEventsPerSecond,
    rowWorkloadMode,
    coreRowModelMode,
    coreFilterValue,
    scrollStressMode,
    rendererMode,
    updateSparklines,
    updateQuoteAges,
  } = state
  const {
    toggleFeed,
    setInstrumentCount,
    setFeedLoadProfile,
    setTargetEventsPerSecond,
    setRowWorkloadMode,
    setTableAdapter,
    setCoreRowModelMode,
    setCoreFilterValue,
    setScrollStressMode,
    setRendererMode,
    setUpdateSparklines,
    setUpdateQuoteAges,
    runBurst,
    resetMarket,
  } = actions

  return (
    <aside className="configurator" aria-label="Benchmark configurator">
          <header>
            <span>CONFIGURATOR</span>
            <small>RUN PARAMETERS</small>
          </header>

          <section className="config-section" aria-labelledby="react-adapter">
            <h2 id="react-adapter">TABLE ADAPTER</h2>
            <label className="field">
              <span>Implementation</span>
              <select
                data-testid="adapter-select"
                value={tableAdapter}
                onChange={(event) =>
                  setTableAdapter(event.currentTarget.value as TableAdapter)
                }
              >
                <option value="local">React Table local v9</option>
                <option value="v8">React Table 8.21.3</option>
              </select>
              <small>Switching unmounts one adapter and mounts the next.</small>
            </label>
          </section>

          <section className="config-section" aria-labelledby="feed-settings">
            <h2 id="feed-settings">FEED</h2>
            <button
              className="primary-action"
              type="button"
              data-testid="feed-toggle"
              onClick={toggleFeed}
            >
              {running ? 'PAUSE FEED' : 'START FEED'}
            </button>

            <label className="field">
              <span>Instruments</span>
              <select
                data-testid="instrument-count-select"
                value={instrumentCount}
                onChange={(event) =>
                  setInstrumentCount(Number(event.currentTarget.value))
                }
              >
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="150">150</option>
                <option value="250">250</option>
                <option value="350">350</option>
                <option value="500">500</option>
                <option value="750">750</option>
                <option value="1000">1,000</option>
              </select>
            </label>

            <label className="field">
              <span>Load profile</span>
              <select
                data-testid="load-profile-select"
                value={feedLoadProfile}
                onChange={(event) =>
                  setFeedLoadProfile(
                    event.currentTarget.value as FeedLoadProfile,
                  )
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
                Target event rate
                <strong>{formatRate(targetEventsPerSecond)}/s</strong>
              </span>
              <input
                data-testid="target-rate-slider"
                type="range"
                min="100"
                max="100000"
                step="100"
                value={targetEventsPerSecond}
                onChange={(event) =>
                  setTargetEventsPerSecond(
                    Number(event.currentTarget.value),
                  )
                }
              />
              <small>100 — 100,000 events/s</small>
            </label>
          </section>

          <section className="config-section" aria-labelledby="render-settings">
            <h2 id="render-settings">RENDER PATH</h2>
            <label className="field">
              <span>Row workload</span>
              <select
                data-testid="row-workload-select"
                value={rowWorkloadMode}
                onChange={(event) =>
                  setRowWorkloadMode(
                    event.currentTarget.value as RowWorkloadMode,
                  )
                }
              >
                <option value="stable">Stable universe</option>
                <option value="price-sort">Continuously sort by Last</option>
                <option value="rotating-filter">
                  Rotate 20% filtered rows
                </option>
                <option value="identity-churn">
                  Replace 10% of ticker IDs
                </option>
              </select>
              <small>
                Reorder preserves IDs; filter removes/reinserts rows;
                replacement forces new row identities.
              </small>
            </label>

            <label className="field">
              <span>TanStack core row model</span>
              <select
                data-testid="core-row-model-select"
                value={coreRowModelMode}
                onChange={(event) =>
                  setCoreRowModelMode(
                    event.currentTarget.value as CoreRowModelMode,
                  )
                }
              >
                <option value="none">Off · source order</option>
                <option value="sort">Sort Last descending</option>
                <option value="filter">Filter Ticker</option>
                <option value="sort-filter">Filter + sort Last</option>
              </select>
              <small>
                Runs inside the selected adapter; unlike Row workload, this is
                not a pre-transformed array.
              </small>
            </label>

            {(coreRowModelMode === 'filter' ||
              coreRowModelMode === 'sort-filter') && (
              <label className="field">
                <span>Ticker contains</span>
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
                  setRendererMode(
                    event.currentTarget.checked ? 'swap' : 'stable',
                  )
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
                  setUpdateSparklines(event.currentTarget.checked)
                }
              />
              <span>
                Update sparklines
                <small>new history input every four quote events</small>
              </span>
            </label>

            <label className="toggle-field">
              <input
                type="checkbox"
                checked={updateQuoteAges}
                onChange={(event) =>
                  setUpdateQuoteAges(event.currentTarget.checked)
                }
              />
              <span>
                Update quote age clock
                <small>
                  invalidates every Age cell on a shared 100 ms clock
                </small>
              </span>
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
                  setScrollStressMode(
                    event.currentTarget.value as ScrollStressMode,
                  )
                }
              >
                <option value="off">Off</option>
                <option value="vertical">Vertical · 700 px/s</option>
                <option value="horizontal">Horizontal · 420 px/s</option>
                <option value="both">Vertical + horizontal</option>
              </select>
              <small>
                Bounces the real table viewport and records callback rate,
                distance, and delayed scroll frames.
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
  const { metrics, longAnimationFramesSupported } =
    useTradingShellState(
      (state) => ({
        metrics: state.metrics,
        longAnimationFramesSupported: state.longAnimationFramesSupported,
      }),
      { compare: shallow },
    )
  return (
    <section className="metrics-strip" aria-label="Live performance metrics">
      <article>
        <span>THROUGHPUT</span>
        <strong data-testid="actual-rate">
          {formatRate(metrics.actualEventsPerSecond)}
        </strong>
        <small>events/s</small>
      </article>
      <article>
        <span>RAF RATE</span>
        <strong data-testid="raf-rate">
          {metrics.rafCallbacksPerSecond.toFixed(1)}
        </strong>
        <small>callbacks/s</small>
      </article>
      <article>
        <span>TABLE RENDERS</span>
        <strong data-testid="table-render-rate">
          {metrics.tableRendersPerSecond.toFixed(1)}
        </strong>
        <small>worker batches/s</small>
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
      <article>
        <span>TOTAL EVENTS</span>
        <strong data-testid="total-events">
          {formatInteger(metrics.totalEvents)}
        </strong>
        <small>since reset</small>
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
            {profilerEnabled
              ? formatMs(metrics.profilerAverageBaseMs)
              : 'N/A'}
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
          <dt>Last batch events / rows</dt>
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
  const selectedQuote = useTradingShellState(
    (state) => state.selectedQuote,
  )
  return (
    <section className="config-section selected-instrument">
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
                {selectedQuote.bid.toFixed(2)} /{' '}
                {selectedQuote.ask.toFixed(2)}
              </dd>
            </div>
          </dl>
        </>
      ) : (
        <p>Click a value in the Last column to inspect its output.</p>
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
        .map(
          (rate) => `${rate.name} ${formatRate(rate.callsPerSecond)}`,
        )
        .join(' · ')
}
