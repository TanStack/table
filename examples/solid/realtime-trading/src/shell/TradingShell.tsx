import { Show } from 'solid-js'
import { longAnimationFramesSupported } from '../benchmark/benchmark-monitor'
import { useTradingShellController } from './trading-shell-context'
import type { JSX } from 'solid-js'
import type { FeedMetrics } from '../benchmark/benchmark-monitor'
import type { FeedLoadProfile, RowWorkloadMode } from '../benchmark-profiles'
import type { TableAdapter } from '../trading-table'

const integerFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})
const rateFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})
export function TradingShell(props: { children: JSX.Element }) {
  return (
    <main class="trading-terminal">
      <AppHeader />

      <Show when={import.meta.env.DEV}>
        <aside class="development-warning">
          DEV BUILD — use the production configuration before recording results.
        </aside>
      </Show>

      <div class="workspace">
        <section class="market-panel" aria-label="Live synthetic quotes">
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
  const { workerReady, running } = useTradingShellController().state
  return (
    <header class="app-bar">
      <div class="brand">
        <span class="brand-mark">TT</span>
        <strong>MARKET MONITOR</strong>
        <span class="environment">SIMULATED</span>
      </div>
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
    </header>
  )
}

function MarketToolbar() {
  const {
    rendererMode,
    updateSparklines,
    updateQuoteAges,
    quotes,
    displayQuotes,
    adapterLabel,
    workloadLabel,
  } = useTradingShellController().state
  return (
    <header class="market-toolbar">
      <div class="watchlist-name">
        <span>WATCHLIST</span>
        <strong>ALL INSTRUMENTS</strong>
      </div>
      <div class="market-context">
        <span>
          {formatInteger(displayQuotes().length)} /{' '}
          {formatInteger(quotes().length)} SYMBOLS
        </span>
        <span>SOLID {adapterLabel()}</span>
        <span>WORKER STREAM</span>
        <span>IMMUTABLE ROWS</span>
        <span>{workloadLabel()}</span>
        <span>
          {rendererMode() === 'stable' ? 'STABLE CELLS' : 'A/B CELL SWAP'}
        </span>
        <span>{updateSparklines() ? 'CHARTS ON' : 'CHARTS OFF'}</span>
        <span>{updateQuoteAges() ? 'AGE CLOCK ON' : 'AGE CLOCK OFF'}</span>
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
        BATCH EVENTS <strong>{formatInteger(metrics().lastBatchSize)}</strong>
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
      <span>WORKER / ACKNOWLEDGED / IMMUTABLE</span>
    </footer>
  )
}

function Configurator() {
  const { state, actions } = useTradingShellController()
  const {
    running,
    tableAdapter,
    instrumentCount,
    feedLoadProfile,
    targetEventsPerSecond,
    rowWorkloadMode,
    rendererMode,
    updateSparklines,
    updateQuoteAges,
    metrics,
    selectedQuote,
    mountedCells,
    liveComponents,
  } = state
  const {
    toggleFeed,
    setInstrumentCount,
    setFeedLoadProfile,
    setTargetEventsPerSecond,
    setRowWorkloadMode,
    setTableAdapter,
    setRendererMode,
    setUpdateSparklines,
    setUpdateQuoteAges,
    runBurst,
    resetMarket,
  } = actions
  return (
    <aside class="configurator" aria-label="Benchmark configurator">
          <header>
            <span>CONFIGURATOR</span>
            <small>RUN PARAMETERS</small>
          </header>

          <section class="config-section" aria-labelledby="solid-adapter">
            <h2 id="solid-adapter">TABLE ADAPTER</h2>
            <label class="field">
              <span>Implementation</span>
              <select
                data-testid="adapter-select"
                value={tableAdapter()}
                onChange={(event) =>
                  setTableAdapter(event.currentTarget.value as TableAdapter)
                }
              >
                <option value="local">Solid Table local v9</option>
                <option value="v8">Solid Table 8.21.3</option>
              </select>
              <small>Switching disposes one adapter and mounts the next.</small>
            </label>
          </section>

          <section class="config-section" aria-labelledby="feed-settings">
            <h2 id="feed-settings">FEED</h2>
            <button
              class="primary-action"
              type="button"
              data-testid="feed-toggle"
              onClick={toggleFeed}
            >
              {running() ? 'PAUSE FEED' : 'START FEED'}
            </button>

            <label class="field">
              <span>Instruments</span>
              <select
                data-testid="instrument-count-select"
                value={instrumentCount()}
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

            <label class="field">
              <span>Load profile</span>
              <select
                data-testid="load-profile-select"
                value={feedLoadProfile()}
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

            <label class="field rate-field">
              <span>
                Target event rate
                <strong>{formatRate(targetEventsPerSecond())}/s</strong>
              </span>
              <input
                data-testid="target-rate-slider"
                type="range"
                min="100"
                max="100000"
                step="100"
                value={targetEventsPerSecond()}
                onInput={(event) =>
                  setTargetEventsPerSecond(
                    Number(event.currentTarget.value),
                  )
                }
              />
              <small>100 — 100,000 events/s</small>
            </label>
          </section>

          <section class="config-section" aria-labelledby="render-settings">
            <h2 id="render-settings">RENDER PATH</h2>
            <label class="field">
              <span>Row workload</span>
              <select
                data-testid="row-workload-select"
                value={rowWorkloadMode()}
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

            <label class="toggle-field">
              <input
                type="checkbox"
                checked={rendererMode() === 'swap'}
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

            <label class="toggle-field">
              <input
                type="checkbox"
                checked={updateSparklines()}
                onChange={(event) =>
                  setUpdateSparklines(event.currentTarget.checked)
                }
              />
              <span>
                Update sparklines
                <small>new history input every four quote events</small>
              </span>
            </label>

            <label class="toggle-field">
              <input
                type="checkbox"
                checked={updateQuoteAges()}
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

          <section class="config-section selected-instrument">
            <h2>SELECTED INSTRUMENT</h2>
            <Show
              when={selectedQuote()}
              fallback={
                <p>Click a value in the Last column to inspect its output.</p>
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
        <span>THROUGHPUT</span>
        <strong data-testid="actual-rate">
          {formatRate(metrics().actualEventsPerSecond)}
        </strong>
        <small>events/s</small>
      </article>
      <article>
        <span>RAF RATE</span>
        <strong data-testid="raf-rate">
          {metrics().rafCallbacksPerSecond.toFixed(1)}
        </strong>
        <small>callbacks/s</small>
      </article>
      <article>
        <span>TABLE RENDERS</span>
        <strong data-testid="table-render-rate">
          {metrics().tableRendersPerSecond.toFixed(1)}
        </strong>
        <small>worker batches/s</small>
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
          <small>
            worst {formatMs(metrics().worstLongAnimationFrameMs)}
          </small>
        </Show>
      </article>
      <article>
        <span>TOTAL EVENTS</span>
        <strong data-testid="total-events">
          {formatInteger(metrics().totalEvents)}
        </strong>
        <small>since reset</small>
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
          <dt>Last batch events / rows</dt>
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
        .map(
          (rate) => `${rate.name} ${formatRate(rate.callsPerSecond)}`,
        )
        .join(' · ')
}
