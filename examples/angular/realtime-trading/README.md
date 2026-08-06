# Angular real-time trading flexRender lab

This example generates deterministic synthetic quote events in the browser. It
is designed to stress Angular Table's `flexRender` paths, not to model an
exchange or display real financial data.

The workload is inspired by the public
[AG Grid finance demo](https://www.ag-grid.com/example-finance/) and its
[source repository](https://github.com/ag-grid/ag-grid-demos/tree/main/finance),
but is intentionally smaller and focused on Angular `flexRender` lifecycle
behavior rather than matching that demo's features.

## Run it

From the repository root:

```sh
pnpm --filter tanstack-angular-table-example-realtime-trading dev
```

For representative measurements, serve the production configuration:

```sh
pnpm --filter tanstack-angular-table-example-realtime-trading ng serve --configuration production --port 7777
```

Open `http://localhost:7777`.

## What it exercises

The feed control has named load profiles so comparisons do not depend on
remembering slider positions:

- **Low** is 1k events/s.
- **Medium** is 5k events/s.
- **High** is the 10k events/s default.
- **Very high** is 25k events/s.
- **Max** requests 100k events/s and is intentionally a saturation test.
- Moving the rate slider selects **Custom**.

Available universe sizes are 50, 100, 150, 250, 350, 500, 750, and 1,000.
The intermediate sizes make it easier to locate the point where an adapter
stops meeting its frame or throughput target.

The row workload selector separates four different costs:

- **Stable universe** preserves row IDs and source order.
- **Continuously sort by Last** changes input order as prices move but keeps the
  same IDs, testing keyed row movement rather than destruction.
- **Rotate 20% filtered rows** excludes one of five index buckets and changes
  the excluded bucket once per second, testing removal and reinsertion.
- **Replace 10% of ticker IDs** gives one of ten buckets new IDs and ticker
  labels once per second. Ten percent are replacements at any instant; because
  the previous bucket returns while the next enters, each transition crosses
  lifecycle boundaries for roughly twenty percent of rows.

These transformations happen before the selected adapter, so every version
receives identical arrays. They test row-model and rendering consequences; they
do not benchmark each version's public sorting or filtering API.

The configurator can mount three implementations against the same workload:

- **Local optimized (v9)** uses the adapter and table core from this workspace.
- **Published 9.0.0-beta.80** uses the exact npm release and its matching
  `@tanstack/table-core`.
- **Published 8.21.4** uses the final v8 Angular adapter and table core 8.21.3.

Changing the implementation select destroys the current table component and
mounts the selected one. The current immutable quote array, selected symbol,
renderer mode, and performance counters stay in the parent component, so every
adapter receives the same live state.

The local v9 adapter also exposes a **Worker row model** checkbox. It replaces
the normal local table with a v9 table using the experimental worker plugin for
the filtered row-model stage. The row-model worker is a second worker, separate
from the market-feed worker. The checkbox is disabled for beta.80 and v8 because
those published versions do not expose this plugin. Turning it off destroys the
worker-backed table and terminates its worker.

This table currently has no active user filter, so the worker stage returns the
full row order. That is intentional: it isolates the serialization,
postMessage, stale-while-revalidate, and row-model reconstruction overhead under
rapid immutable data replacement. It is not expected to be faster at 250–1,000
unfiltered rows; the plugin becomes more compelling when expensive filtering,
grouping, or sorting dominates the transfer cost.

- Quote fields are plain values, matching decoded WebSocket/SSE records rather
  than embedding Angular signals in the data model.
- Every worker batch publishes a new data-array reference and recreates each
  changed quote object. Unchanged quotes preserve their identity, and
  `getRowId` keeps table rows associated with their instruments.
- This deliberately exercises adapter option updates and table row-model
  recomputation in addition to `flexRender` input updates.
- A Web Worker owns quote generation, random-walk calculations, event-rate
  scheduling, history updates, and burst processing.
- One quote event updates price, bid, ask, direction, and volume; the event
  counter therefore represents market messages rather than individual field
  changes.
- The market-watch columns use Ticker, Last Qty, Bid / Ask Qty, Day %, Total
  Qty, Traded Value, and Intraday terminology. Total Qty and Traded Value are
  cumulative synthetic session fields; Last Qty is the most recent trade size.
- Bid, ask, percentage change, quantities, and traded value are primitive
  renderers.
- Last price is a stable Angular component whose inputs and output callback are
  updated frequently.
- Tick direction can use one stable component or switch between separate up and
  down component types.
- Spread components receive bid and ask updates and recompute absolute and
  basis-point spreads.
- Depth components receive bid/ask sizes on every quote and redraw a two-sided
  liquidity imbalance bar.
- Quote-age components share a 100 ms clock. This intentionally invalidates the
  whole Age column at once and can be disabled independently.
- Sparkline components receive new array references at a configurable cadence.
- Component create/destroy counters and the optional Chrome heap estimate help
  expose unintended churn or retained component state.

## Shared code and adapter boundaries

Most of the example is deliberately shared:

- `market-feed-engine.ts` is the framework-free quote algorithm that runs in
  the worker.
- `market-feed.worker.ts` owns scheduling, batching, coalescing, and
  backpressure.
- `market-feed-protocol.ts` defines typed commands and events shared across the
  worker boundary.
- `market-data.ts` hydrates initial worker snapshots and immutably recreates
  changed application rows on the main thread.
- `table-row-model.worker.ts` hosts the optional v9 shadow table used by the
  experimental row-model worker plugin.
- `worker-trading-table.ts` wires the local v9 table to that worker-backed
  filtered row model and terminates it when the component is destroyed.
- `quote-cells.ts` owns all dynamic Angular cell components and lifecycle
  instrumentation.
- `trading-column-types.ts` contains only the renderer-mode/state contract and
  the diagnostics column count.
- `trading-columns.ts` is the local-v9 column factory shared by the current and
  worker-backed tables. It calls the local adapter's `flexRenderComponent`
  directly only for genuine Angular component cells.
- `trading-columns-beta.ts` and `trading-columns-v8.ts` intentionally duplicate
  the complete adapter-specific column configuration, including IDs, labels,
  widths, and formatters. Each calls its own package's typed
  `flexRenderComponent`; no token spreads, generic renderer callback, or
  `unknown` cast crosses the version boundary. Primitive cells continue to
  return primitive values.
- `core/trading-benchmark.controller.ts` owns application signals, worker
  transport, derived table inputs, and user commands.
- `benchmark/benchmark-monitor.ts` owns browser observers, render
  acknowledgements, and published metrics.
- `shell/` contains independent header, toolbar, metrics, status-bar,
  diagnostics, selected-instrument, and configurator components. Each injects
  the same controller directly.
- `shell/trading-shell.html` is only the layout and `<ng-content>` projection
  point.
- `app.ts` owns the projected local/beta/v8 adapter switch.

Table construction and component-render descriptors are version-specific. The
local and beta v9 components share `table-v9.html` and use `injectTable`,
`stockFeatures`, and the `flexRenderCell` / `flexRenderHeader` shorthand
directives. The v8 component uses `createAngularTable`, `getCoreRowModel`, and
the older direct `flexRender` microsyntax in `table-v8.html`.

## Architecture

`App` deliberately has no knowledge of workers, timers, render callbacks, or
adapter commands. It selects the active adapter and projects it through
`TradingShell`. The injected `TradingBenchmarkController` is the single
stateful boundary: it subscribes to the feed worker, converts protocol events
into immutable row snapshots, derives the selected workload, and exposes
signals plus commands to every shell component.

Benchmark instrumentation is a separate collaborator. `BenchmarkMonitor`
contains the mutable sampling runtime and publishes immutable metric snapshots
back through the controller. This keeps measurement policy out of both the
table adapters and the presentational shell.

All deliberate mutable runtime is grouped behind `const` object or class
identities. TypeScript source files do not use `let`; counters and handles
change as properties of those stable runtime owners instead of being scattered
mutable bindings. Angular template `@for (...; let index = ...)` declarations,
where present, are template syntax rather than JavaScript mutable bindings.

The beta and v8 dependencies use exact npm tarball URLs. This is intentional:
the repository globally redirects `@tanstack/angular-table` to the local
workspace package, and a normal npm alias would therefore not provide an
independent published baseline. Version-specific overrides also keep each
adapter paired with the table-core version it was released against.

## Worker transport and backpressure

The worker is intentionally shaped like an external market-data transport. The
Angular application sends configuration commands and listens for `ready` and
`batch` messages, much as an application would listen to a WebSocket or SSE
client.

The worker does not post one browser message for every quote event. It
coalesces all pending changes by instrument and allows only one batch to be in
flight. Angular acknowledges that batch after `afterEveryRender`; only then can
the worker send the next one. While the main thread is busy, the worker keeps
the newest snapshot for each instrument in a bounded map rather than building
an unbounded message queue.

For that reason, **batch events** and **row updates** are separate diagnostics.
A batch may represent thousands of source events but contain at most one final
update per instrument. The event counter still measures the requested source
load, while row updates describe the amount of data copied and applied by the
UI.

This protects the main thread from quote-generation work and queue growth, but
it does not make rendering free. Recreating changed rows, publishing the new
data array, Angular change detection, table row-model work, `flexRender`,
layout, and paint must still happen on the main thread.
In a production application, the WebSocket connection and parsing could also
live inside the worker and use this same message protocol. If the WebSocket or
`EventSource` is created in the window instead, its JavaScript event handlers
still run on the main thread.

## Performance metrics

The dashboard keeps browser scheduling and Angular work separate:

- **RAF rate** counts `requestAnimationFrame` callbacks and divides them by the
  real wall-clock sampling duration. It is not clamped and therefore includes
  long main-thread stalls. It describes browser frame opportunities, not table
  renders, and will normally follow the display refresh rate.
- **Table renders** counts worker batches that reach `afterEveryRender` and are
  acknowledged back to the worker. This is the UI's actual feed-render
  throughput.
- **Average / P95 render** measures worker-message reception through Angular's
  completed render callback. It excludes worker calculation, browser paint,
  and time coalescing behind an in-flight batch.
- **Long frames** uses a feature-detected `PerformanceObserver` with the
  `long-animation-frame` entry type. It counts complete browser animation
  frames longer than 50 ms and records the worst duration since reset.
- **Renders over 16.7 ms** remains an application-level diagnostic for the most
  recent sample. It assumes a 60 Hz frame budget and is intentionally distinct
  from the browser's Long Animation Frames API.

Long Animation Frames are currently supported by Chromium-based browsers. The
dashboard shows `N/A` when the browser does not expose that performance entry
type. For exact frame, layout, paint, and compositor attribution, record the
same workload in the browser's Performance tools.

## A repeatable comparison

1. Use the same production browser build and machine for both commits.
2. Start at 250 instruments, 10k events/s, stable Tick renderer, quote ages,
   and sparklines enabled.
3. Select one implementation, reset the session, and let it warm up for 20–30
   seconds.
4. Record actual throughput, RAF rate, table renders/s, P95 render time, long
   frames, live components, and heap over a fixed measurement window.
5. Repeat step 3 for the other implementations without changing the controls.
6. Increase the event target until actual throughput cannot keep up or P95
   exceeds the 16.7 ms frame budget.
7. Repeat with component swapping, quote ages, and sparklines toggled
   separately. The 25k burst is useful for profiling worker aggregation and one
   large coalesced UI update.

Component create/destroy totals are cumulative across adapter switches. A
switch should destroy the old table's dynamic cell components and create the
new table's components, so both totals jump by design. Likewise, the JS heap
can rise temporarily while the old tree waits for garbage collection. Compare
post-GC heap plateaus after several identical switch cycles; a rising raw heap
line by itself does not prove a leak.

Immutable batches also allocate a new array plus one object per changed row.
Those short-lived objects are expected garbage. Memory analysis should compare
post-GC plateaus rather than expecting a flat allocation graph.

The displayed Chrome heap estimate is diagnostic only. Treat the browser's
Memory profiler as the source of truth when separating the main realm, worker
realm, detached DOM, and garbage awaiting collection.

Because this lab bundles three adapter and table-core generations, its download
size is intentionally larger than a normal application and should not be used
for bundle-size comparison.

The UI resembles a market-watch blotter, but the feed is deterministic
synthetic data rather than an exchange simulator. A production-confidence test
should replay a timestamped, sanitized capture through the worker protocol so
burstiness and symbol skew are preserved. Use browser Performance and Memory
recordings as the source of truth for scripting, layout, paint, detached nodes,
and post-GC heap; the in-app counters are comparison aids.
