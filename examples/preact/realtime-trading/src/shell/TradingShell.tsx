import { shallow, useSelector } from '@tanstack/preact-store'
import { useState } from 'preact/hooks'
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
  useTradingShellState,
} from './trading-shell-context'
import { configuratorOptions } from './configurator-options'
import type { ComponentChildren } from 'preact'
import type { FeedMetrics } from '../benchmark/benchmark-monitor'

const integerFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})
const rateFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})
export function TradingShell(props: { children: ComponentChildren }) {
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
            DEV BUILD — use the production build before recording results.
          </aside>
        )}
      </div>

      <section className="market-panel" aria-label="Live synthetic quotes">
        {props.children}
      </section>
      <MarketStatusbar />
      <div className="sidebar-slot">{sidebarOpen && <Configurator />}</div>
    </main>
  )
}

function AppHeader(props: {
  sidebarOpen: boolean
  onSidebarToggle: () => void
}) {
  const feed = useMarketFeedController()
  const workerReady = useSelector(feed.workerReady)
  const running = useSelector(feed.running)
  return (
    <header className="app-bar">
      <div className="brand">
        <strong>MARKET MONITOR</strong>
      </div>
      <div className="header-actions">
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
        MESSAGE SAMPLES <strong>{formatInteger(lastBatchSize)}</strong>
      </span>
      <span>
        CHANGED ROWS <strong>{formatInteger(lastUpdateCount)}</strong>
      </span>
      <span>
        HOSTS <strong>{formatInteger(mountedCells)}</strong>
      </span>
      <span>
        COMPONENTS <strong>{formatInteger(liveComponents)}</strong>
      </span>
    </footer>
  )
}

function Configurator() {
  const benchmarkState = useTradingShellState(
    (storeState) => ({
      requestedVirtualScrollMode: storeState.requestedVirtualScrollMode,
    }),
    { compare: shallow },
  )
  const controller = useTradingShellController()
  const feed = useMarketFeedController()
  const running = useSelector(feed.running)
  const instrumentCount = useSelector(feed.instrumentCount)
  const targetTicksPerSecond = useSelector(feed.targetTicksPerSecond)
  const publishIntervalMs = useSelector(feed.publishIntervalMs)
  const updateSparklines = useSelector(feed.updateSparklines)
  const sparklineSampleIntervalMs = useSelector(feed.sparklineSampleIntervalMs)
  const rendererMode = useSelector(controller.renderAtoms.rendererMode)
  const { actions } = controller
  const feedActions = feed.actions
  const { requestedVirtualScrollMode } = benchmarkState
  const { setRendererMode, setVirtualScrollEnabled, resetMarket } = actions
  const {
    toggle,
    setInstrumentCount,
    setTargetRate,
    setPublishInterval,
    setSparklineUpdates,
    setSparklineSampleInterval,
    runBurst,
  } = feedActions
  const virtualScrollForced = instrumentCount >= FORCED_VIRTUALIZATION_ROW_COUNT
  const virtualScrollMode = resolveVirtualScrollMode(
    requestedVirtualScrollMode,
    instrumentCount,
  )

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

      <LiveHealth />

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
          <span>Instruments (rows)</span>
          <select
            data-testid="instrument-count-select"
            value={instrumentCount}
            onChange={(event) => {
              actions.resetViewState()
              setInstrumentCount(Number(event.currentTarget.value))
            }}
          >
            {configuratorOptions.instrumentCounts.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field rate-field">
          <span>
            Synthetic quote workload
            <strong data-testid="target-sample-rate">
              {formatRate(targetTicksPerSecond)} samples/s
            </strong>
          </span>
          <input
            data-testid="target-rate-slider"
            type="range"
            min={0}
            max={feedSampleRateOptions.length - 1}
            step={1}
            list="worker-sample-rate-steps"
            value={feedSampleRateIndex(targetTicksPerSecond)}
            aria-valuetext={`${formatRate(
              targetTicksPerSecond,
            )} synthetic quote samples per second`}
            onChange={(event) =>
              setTargetRate(feedSampleRateAt(Number(event.currentTarget.value)))
            }
          />
          <datalist id="worker-sample-rate-steps">
            {feedSampleRateOptions.map((option, index) => (
              <option key={option.value} value={index} label={option.label} />
            ))}
          </datalist>
          <small>
            Fixed worker-side workload levels, from 100 to 100K samples/s.
            Samples are coalesced; this is not the message delivery rate.
          </small>
        </label>

        <label className="field">
          <span>Worker delivery interval</span>
          <select
            data-testid="publish-interval-select"
            value={publishIntervalMs}
            onChange={(event) =>
              setPublishInterval(Number(event.currentTarget.value))
            }
          >
            {configuratorOptions.workerDeliveryIntervals.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <small>
            The worker posts one coalesced update message at this target
            cadence.
          </small>
        </label>
      </section>

      <section className="config-section" aria-labelledby="render-settings">
        <h2 id="render-settings">RENDER PATH</h2>
        <label className="field" data-testid="virtual-scroll-mode">
          <span>Row rendering</span>
          <select
            data-testid="virtual-scroll-select"
            value={virtualScrollMode}
            disabled={virtualScrollForced}
            onChange={(event) =>
              setVirtualScrollEnabled(event.currentTarget.value === 'tanstack')
            }
          >
            {configuratorOptions.rowRenderingModes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <small>
            {virtualScrollForced
              ? 'TanStack Virtual is required and locked at 1,500 or more rows.'
              : 'Full DOM is the default below 200 rows; TanStack Virtual is the default from 200 rows and remains selectable.'}
          </small>
        </label>

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
          <span>Intraday chart sampling</span>
          <select
            data-testid="sparkline-sample-interval-select"
            value={sparklineSampleIntervalMs}
            onChange={(event) =>
              setSparklineSampleInterval(Number(event.currentTarget.value))
            }
          >
            {configuratorOptions.intradaySamplingIntervals.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <small>
            How often each row adds a point to its sparkline. Quote generation
            and worker delivery are unaffected.
          </small>
        </label>
      </section>

      <section className="config-section" aria-labelledby="stress-actions">
        <h2 id="stress-actions">STRESS ACTIONS</h2>
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

function LiveHealth() {
  const { metrics, longAnimationFramesSupported } = useTradingShellState(
    (state) => ({
      metrics: state.metrics,
      longAnimationFramesSupported: state.longAnimationFramesSupported,
    }),
    { compare: shallow },
  )
  return (
    <section className="metrics-strip" aria-labelledby="live-health">
      <h2 id="live-health">LIVE HEALTH</h2>
      <article>
        <span>FRAME RATE (EST.)</span>
        <strong data-testid="frame-rate">
          {metrics.estimatedFrameRate.toFixed(1)}
        </strong>
        <small>rAF callbacks/s · rolling 1 s</small>
      </article>
      <article>
        <span>AVG COMMIT</span>
        <strong data-testid="average-commit-latency">
          {formatMs(metrics.averageCommitLatencyMs)}
        </strong>
        <small>snapshot → DOM · rolling 3 s</small>
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
            <small>
              since reset · worst {formatMs(metrics.worstLongAnimationFrameMs)}
            </small>
          </>
        ) : (
          <>
            <strong data-testid="long-frame-count">N/A</strong>
            <small>unsupported</small>
          </>
        )}
      </article>
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
  return (
    <section
      className="config-section diagnostics"
      aria-labelledby="diagnostics"
    >
      <h2 id="diagnostics">DIAGNOSTICS</h2>
      <dl>
        <div>
          <dt>Worker samples / s</dt>
          <dd data-testid="actual-rate">
            {formatRate(metrics.actualTicksPerSecond)}
          </dd>
        </div>
        <div>
          <dt>Changed rows / s</dt>
          <dd data-testid="row-update-rate">
            {formatRate(metrics.rowUpdatesPerSecond)}
          </dd>
        </div>
        <div>
          <dt>Worker messages / s</dt>
          <dd data-testid="message-rate">
            {metrics.workerMessagesPerSecond.toFixed(1)}
          </dd>
        </div>
        <div>
          <dt>State applies / s</dt>
          <dd data-testid="state-apply-rate">
            {metrics.stateApplicationsPerSecond.toFixed(1)}
          </dd>
        </div>
        <div>
          <dt>Table DOM commits / s</dt>
          <dd data-testid="table-render-rate">
            {metrics.tableCommitsPerSecond.toFixed(1)}
          </dd>
        </div>
        <div>
          <dt>Commit latency p95 / max</dt>
          <dd>
            {formatMs(metrics.p95CommitLatencyMs)} /{' '}
            {formatMs(metrics.maxCommitLatencyMs)}
          </dd>
        </div>
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
          <dt>Renderer callbacks / s</dt>
          <dd data-testid="cell-render-rate">
            {formatRate(metrics.cellRendererCallsPerSecond)}
          </dd>
        </div>
        <div>
          <dt>Component executions / s</dt>
          <dd data-testid="component-render-rate">
            {formatRate(metrics.componentRenderCallsPerSecond)}
          </dd>
        </div>
        <div>
          <dt>Executions by component / s</dt>
          <dd data-testid="component-render-breakdown">
            {formatInvocationRates(metrics.componentRenderRates)}
          </dd>
        </div>
        <div>
          <dt>Callbacks by column / s</dt>
          <dd data-testid="cell-render-breakdown">
            {formatInvocationRates(metrics.cellRendererRates)}
          </dd>
        </div>
        <div>
          <dt>Observed MutationRecords / s</dt>
          <dd data-testid="dom-mutation-rate">
            {formatRate(metrics.domMutationsPerSecond)}
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
          <dt>Last message samples / updated rows</dt>
          <dd>
            {formatInteger(metrics.lastBatchSize)} /{' '}
            {formatInteger(metrics.lastUpdateCount)}
          </dd>
        </div>
        <div>
          <dt>Commits &gt; 16.7 ms since reset</dt>
          <dd>{metrics.slowCommits}</dd>
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
          <dt title="Current used JS heap; Chrome-only and sensitive to garbage collection timing">
            JS heap (GC-sensitive)
          </dt>
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
  const controller = useTradingShellController()
  const feed = useMarketFeedController()
  const selectedSymbol = useSelector(controller.renderAtoms.selectedSymbol)
  const quotes = useSelector(feed.quotes)
  const selectedQuote = feed.getQuoteBySymbol(quotes, selectedSymbol)
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
