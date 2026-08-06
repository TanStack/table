# React real-time trading FlexRender lab

This standalone example generates deterministic synthetic quote events in the
browser and stresses two React Table render paths. It is not a real
exchange feed and does not display financial advice or real market data.

The workload is inspired by the public
[AG Grid finance demo](https://www.ag-grid.com/example-finance/) and its
[source](https://github.com/ag-grid/ag-grid-demos/tree/main/finance), but is
focused on renderer lifecycle, immutable high-frequency updates, backpressure,
and browser performance APIs.

## Run it

From the repository root:

```sh
pnpm --filter tanstack-react-table-example-realtime-trading dev
```

Open `http://localhost:7778`. For measurements, build and serve the production
bundle so development checks do not distort the result. Use the dedicated
profiling build when the in-page React Profiler metrics are part of the run:

```sh
pnpm --filter tanstack-react-table-example-realtime-trading build:profile
pnpm --filter tanstack-react-table-example-realtime-trading serve
```

The regular `build` command deliberately keeps React's smaller standard
production bundle. React disables `<Profiler>` callbacks in that build, so the
widget labels its commit timings as unavailable. `build:profile` aliases the
root renderer to React's production profiling bundle.

Like the other React examples in this repository, `index.html` also loads the
React Scan widget from `https://unpkg.com/react-scan/dist/auto.global.js`.
React Scan provides the visual rerender overlay and interactive diagnostics;
the in-page Profiler metrics provide repeatable numeric samples. Keep React
Scan enabled while locating unnecessary rerenders, then disable or stub it when
recording final adapter comparisons because its instrumentation adds work.

## What is copied into this example

This directory is self-contained. It does not import the feed implementation,
styles, components, or benchmark shell from the Angular or Solid examples:

- `market-feed-engine.ts` owns the deterministic quote algorithm.
- `market-feed.worker.ts` schedules, batches, coalesces, and applies
  backpressure.
- `market-feed-protocol.ts` defines commands and events across the worker
  boundary.
- `market-data.ts` creates a new data array and new objects for changed rows.
- `quote-cells.tsx` implements all dynamic React cells and lifecycle counters.
- `trading-table-local.tsx` and `trading-table-v8.tsx` isolate the two adapter
  implementations.
- `trading-table-shared.tsx` owns the stable column definition, leaf-level
  Store subscriptions, shared types, and row-model measurement.
- `core/trading-benchmark-controller.ts` owns the TanStack Store, worker
  transport, derived table inputs, and user commands.
- `core/use-trading-benchmark-controller.ts` only binds that stable controller
  to the React mount lifecycle.
- `core/use-trading-table-runtime.ts` gives each adapter only its own data and
  benchmark subscriptions.
- `benchmark/benchmark-monitor.ts` owns Profiler samples, browser observers,
  render acknowledgements, scroll pressure, and published metrics.
- `benchmark/use-table-benchmark.ts` binds table commits, DOM mutation
  observation, and automated scroll pressure to the mounted adapter.
- `shell/TradingShell.tsx` composes independent header, toolbar, metrics,
  status-bar, diagnostics, and configurator components.
- `shell/trading-shell-context.tsx` lets every shell component consume the
  controller without prop drilling.
- `App.tsx` creates the controller and owns only the projected adapter switch.
- `index.css` is a complete local copy of the trading-terminal styles.

The duplication is intentional: each framework example can be copied, changed,
or profiled on its own. Keep the workload files synchronized manually when
making cross-framework comparisons.

## Adapter matrix

The configurator mounts exactly one implementation at a time:

- **Local v9** imports the React adapter from this workspace.
- **8.21.3** imports the final published React v8 adapter and matching core.

Changing the select unmounts the current table before mounting the next one.
Feed state remains in the controller, so both receive the same immutable
snapshots.
The exact v8 tarball alias prevents this workspace from silently replacing the
published baseline with local packages.

## React Compiler

The Vite build enables React Compiler through `reactCompilerPreset`. The local
v9 table component uses the compiler and its emitted function contains React
memo-cache code.

The v8 adapter lives in its own module with a module-level `'use no memo'`
directive and retains its explicit `memo` wrapper. This prevents compiler
optimization from interacting with v8's mutable table instance while keeping
the rest of the example compiled.

The benchmark-only `recordCellRender` and lifecycle-counter functions also use
function-level `'use no memo'`. They intentionally mutate write-only diagnostic
counters on every invocation; compiling or memoizing that instrumentation
would change the measurement. This is safe only because those counters do not
participate in rendered output. `recordCellRender` receives an already-evaluated
value and a typed column name rather than an anonymous callback.

## Architecture

`App` deliberately has no knowledge of workers, timers, data, or table render
options. It provides the stable controller, subscribes only to the adapter
choice, and projects that table into the shell layout.
`TradingBenchmarkController` subscribes to the feed worker, converts protocol
events into immutable row snapshots, derives the selected workload, and
exposes a TanStack Store plus stable actions.

The React context transports only the controller identity. Components call
`useTradingShellState(selector)` to subscribe to the exact state slice they
render. Quote snapshots therefore update the table outlet without rerendering
the header or configurator, while the 500 ms performance snapshot updates only
the metrics strip, status bar, and diagnostics. Multi-field selectors use
TanStack Store's `shallow` comparator, so returning a small object does not
turn it back into a whole-store subscription. Controller operations that
publish several related fields use TanStack Store `batch`, exposing one
coherent snapshot to subscribers.

Each adapter calls its own runtime hook. The local v9 `useTable` owner selects
`null`, so table state does not rerender the entire owner. Sorting and filtering
are external table atoms, and a `table.Subscribe` boundary rerenders only the
row-model body. The body receives the immutable quote snapshot as an explicit
input as well: external table-state subscriptions do not represent changes to
the `data` option, and this dependency prevents React Compiler from retaining
the initial empty body. Renderer mode, quote age, and selection are read by the
leaf cell/row components that use them; they no longer travel through the table
outlet or a broad render-options context. Quote data still rerenders the table
owner and body because `data` is a table option and the row model must process
a new immutable snapshot.

Benchmark instrumentation is a separate collaborator. `BenchmarkMonitor`
contains the mutable sampling runtime and publishes immutable metric snapshots
to the same store. `useTableBenchmark` owns the React/DOM lifecycle bridge.
This keeps measurement policy out of both the table adapters and the
presentational shell.

All deliberate mutable runtime is grouped behind `const` object or ref
identities. Source files do not use `let`; counters and handles change as
properties of those stable runtime owners instead of being scattered mutable
bindings.

## Render workload

The table contains 14 columns and up to 1,000 instruments. Its market-watch
labels are Ticker, Venue, Bid, Ask, Spread, Last, Last Move, Last Qty,
Bid / Ask Qty, Quote Age, Day %, Total Qty, Traded Value, and Intraday. It
combines:

- primitive bid, ask, daily change, quantity, and traded-value cells;
- a clickable price component;
- a stable Tick component or two alternating Up/Down component types;
- spread, market-depth, quote-age, and sparkline components;
- immutable row replacement with stable instrument IDs;
- optional 100 ms quote-age invalidation for every visible Age cell; and
- optional history-array replacement for sparklines.

The feed control provides repeatable load profiles: Low 1k/s, Medium 5k/s,
High 10k/s, Very high 25k/s, and Max 100k/s. High is the default; Max is a
deliberate saturation test. Moving the rate slider switches the profile to
Custom. Available universe sizes are 50, 100, 150, 250, 350, 500, 750, and
1,000.

The row workload selector separates four different behaviors:

- **Stable universe** preserves source order and IDs.
- **Continuously sort by Last** reorders keyed rows as prices move without
  recreating their identity.
- **Rotate 20% filtered rows** changes one excluded index bucket each second,
  forcing row removal and reinsertion.
- **Replace 10% of ticker IDs** changes one bucket's IDs and ticker labels each
  second. Ten percent are replacements at any instant; transitions dispose the
  previous bucket and create the next, crossing lifecycle boundaries for about
  twenty percent of rows.

These transformations run before the selected adapter so both versions
receive the same arrays. They test sorting/filtering consequences and keyed
reconciliation.

The separate **TanStack core row model** selector exercises the adapters'
sorting and filtering APIs:

- **Sort Last descending** installs and executes the sorted row model.
- **Filter Ticker** installs and executes the filtered row model with a
  case-insensitive Ticker accessor.
- **Filter + sort Last** composes both row models.

The local v9 and v8 adapters each configure their own version's factories.
This is intentionally independent of **Row workload**, so a run can
measure core row-model work alone or combine it with upstream identity and
ordering pressure.

React `StrictMode` is deliberately omitted because its development-only mount
replay would contaminate the component create/destroy counters. The table
component is memoized so the 500 ms diagnostics publication does not by itself
rerender every table cell. Data, quote-clock, selection, and renderer changes
still drive the table normally.

`useLifecycleCounter` increments the component-function counter during render,
then uses passive `useEffect` for committed create/destroy lifetimes. A layout
effect would not make these counters more accurate: it would synchronously add
work to every mounted dynamic cell before paint and contaminate the timing this
example is trying to observe. Function-call counters can include concurrent
retries or abandoned render attempts, while effect create/destroy counters
represent committed lifetimes with a short post-paint reporting delay. The
table-scoped React Profiler is the committed-render timing reference.

## Worker transport

The Worker acts like an external WebSocket/SSE transport. It permits one batch
in flight. React acknowledges a batch from `useLayoutEffect`, after the
corresponding commit. While a commit is pending, the Worker coalesces newer
events by instrument in a bounded map instead of growing an unbounded message
queue.

`batch events` therefore counts source events, while `row updates` counts the
final row snapshots copied into a particular UI batch. A batch can contain
thousands of events but at most one final update per instrument.

The Worker removes quote generation and batching from the main thread. React
rendering, TanStack row-model work, DOM reconciliation, layout, and paint still
run on the main thread.

## Metrics

- **Throughput** is the source-event rate represented by acknowledged batches.
- **RAF rate** is actual `requestAnimationFrame` callbacks divided by elapsed
  wall time. It is not an FPS estimate derived from table renders.
- **Table renders** is the rate of feed batches that reach a completed React
  commit and are acknowledged.
- **Average / P95 render** spans worker-message receipt through the layout
  effect after commit. It excludes worker calculation and browser paint.
- **Long frames** uses the browser Long Animation Frames API when available.
- **Heap** uses Chromium's non-standard `performance.memory` when available.
- **Created / destroyed** distinguishes expected type-swap churn from live
  component retention.
- **Cell renderer calls/s** counts executions of column `cell` functions. The
  per-column breakdown identifies which callback was invoked.
- **Component renders/s** counts executions of the dynamic React cell
  component functions. The per-type breakdown identifies the exact component;
  development Strict Mode and abandoned renders can legitimately produce
  function calls without matching DOM mutations.
- **DOM mutation records/s** comes from a `MutationObserver` attached to the
  active `tbody`. It counts observer records, not changed elements or painted
  pixels.
- **React Profiler commits/s** and actual/base durations come directly from a
  `<Profiler>` wrapped around only the active table adapter. Actual duration is
  the work performed for that commit; base duration is React's estimate of the
  subtree cost without memoization.
- **Core row model calls/s** times `table.getRowModel()` around the actual rows
  consumed by the render. It includes memo lookup overhead and, when inputs
  change, sorting/filtering computation.
- **Automated scroll pressure** drives the real table scroll container
  vertically, horizontally, or both. It reports callback rate, distance, and
  frames delayed beyond 34 ms.

The app also writes browser User Timing entries that appear in a Chrome
Performance recording:

- `react-profiler-commit`
- `market-update-to-layout-commit`
- `tanstack-row-model`
- `benchmark:*` marks for adapter, core-mode, and scroll changes

Entries are periodically cleared from the live performance buffer to keep the
benchmark instrumentation itself bounded. A DevTools recording still captures
the marks and measures that occurred while recording.

The heap line is diagnostic. Immutable updates continuously allocate short-lived
arrays, row objects, and render objects, so raw heap can rise before garbage
collection. Compare post-GC plateaus in the browser Memory profiler.

The three counters are deliberately simple but do add instrumentation overhead.
Use them to catch accidental full-table work and compare ratios. For final
timings, corroborate them with a Chrome Performance recording and React
DevTools Profiler. A realistic healthy run keeps source throughput near target,
avoids a cell-render rate equal to every cell on every worker batch, and reaches
a stable post-GC heap plateau.

## Is this a real financial grid?

The presentation and workload shape are realistic for a market-watch blotter,
but the prices, venues, sizes, volume, and traded value are deterministic
synthetic data. There is no order book, exchange calendar, corporate actions,
network jitter, reconnect logic, entitlement processing, or real WebSocket
decoder. That makes the lab reproducible, not production-representative.

For higher confidence, replay a timestamped, sanitized capture through the same
worker protocol. Preserve burstiness and symbol skew, then compare adapters
using the same capture, production build, browser, viewport, and fixed
measurement window.

## Repeatable comparison

1. Use production builds in the same browser and on the same machine.
2. Start at 250 instruments and 10k events/s.
3. Keep stable Tick cells, quote ages, and sparklines enabled.
4. Reset and warm up for 20–30 seconds.
5. Record throughput, RAF rate, table renders/s, cell/component calls, DOM
   mutations, P95, long frames, and post-GC heap over a fixed window.
6. Repeat with the Angular and Solid standalone examples using identical
   controls.
7. Toggle Tick A/B swapping, quote ages, and sparklines separately to isolate
   component churn, shared-clock invalidation, and array-input cost.

The 25k burst is useful for profiling coalescing and a large render, but a
sustained target rate is the better test of steady-state behavior.

For a scroll run, select 750 or 1,000 instruments and start with vertical
pressure. This table is deliberately not virtualized: every row remains mounted,
so the scroll test primarily exposes browser style/layout/paint responsiveness
and main-thread contention. It is not a virtualization benchmark and should not
be interpreted as one. Add a separately named virtualized adapter if that
architecture needs comparison, since virtualization changes the amount of DOM
and React work rather than merely optimizing the same path.
