# Solid real-time trading FlexRender lab

This standalone example generates deterministic synthetic quote events in the
browser and stresses two Solid Table render paths. It is not a real
exchange feed and does not display financial advice or real market data.

The workload is inspired by the public
[AG Grid finance demo](https://www.ag-grid.com/example-finance/) and its
[source](https://github.com/ag-grid/ag-grid-demos/tree/main/finance), but is
focused on renderer lifecycle, immutable high-frequency updates, backpressure,
and browser performance APIs.

## Run it

From the repository root:

```sh
pnpm --filter tanstack-solid-table-example-realtime-trading dev
```

Open `http://localhost:7779`. For measurements, build and serve the production
bundle so development checks do not distort the result:

```sh
pnpm --filter tanstack-solid-table-example-realtime-trading build
pnpm --filter tanstack-solid-table-example-realtime-trading serve
```

## What is copied into this example

This directory is self-contained. It does not import the feed implementation,
styles, components, or benchmark shell from the Angular or React examples:

- `market-feed-engine.ts` owns the deterministic quote algorithm.
- `market-feed.worker.ts` schedules, batches, coalesces, and applies
  backpressure.
- `market-feed-protocol.ts` defines commands and events across the worker
  boundary.
- `market-data.ts` creates a new data array and new objects for changed rows.
- `quote-cells.tsx` implements all dynamic Solid cells and lifecycle counters.
- `trading-table.tsx` keeps the local v9 and v8 table construction separate
  while sharing one column definition.
- `core/trading-benchmark-controller.ts` owns application state, worker
  transport, derived table inputs, and user commands.
- `benchmark/benchmark-monitor.ts` owns browser observers, render
  acknowledgements, and published metrics.
- `shell/TradingShell.tsx` composes independent header, toolbar, metrics,
  status-bar, diagnostics, and configurator components.
- `shell/trading-shell-context.tsx` lets every shell component consume the
  controller without prop drilling.
- `App.tsx` creates the controller and owns only the projected adapter switch.
- `index.css` is a complete local copy of the trading-terminal styles.

The duplication is intentional: each framework example can be copied, changed,
or profiled on its own. Keep the workload files synchronized manually when
making cross-framework comparisons.

## Architecture

`App` deliberately has no knowledge of workers, timers, observers, or adapter
commands. It provides the controller, selects the active adapter, and projects
that table into the shell layout. `createTradingBenchmarkController` is the
single stateful boundary: it subscribes to the feed worker, converts protocol
events into immutable row snapshots, derives the selected workload, and
exposes a small `state` / `actions` contract to the shell context.

Benchmark instrumentation is a separate collaborator. `BenchmarkMonitor`
contains the mutable sampling runtime and publishes immutable metric snapshots
back through the controller. This keeps measurement policy out of both the
table adapters and the presentational shell.

All deliberate mutable runtime is grouped behind `const` object identities.
Source files do not use `let`; counters and handles change as properties of
those stable runtime owners instead of being scattered mutable bindings.

## Adapter matrix

The configurator mounts exactly one implementation at a time:

- **Local v9** imports the Solid adapter from this workspace.
- **8.21.3** imports the final published Solid v8 adapter and matching core.

Changing the select disposes the current table before mounting the next one.
Feed state remains in the controller, so both receive the same immutable
snapshots.
The exact v8 tarball alias prevents this workspace from silently replacing the
published baseline with local packages.

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
reconciliation, not the adapters' public sorting/filtering APIs.

Solid's lifecycle counters use `onMount` and `onCleanup`. Switching from the
stable Tick renderer to the alternating Up/Down renderers intentionally makes
direction changes destroy one component type and mount the other. Stable mode
updates the same component instead.

## Worker transport

The Worker acts like an external WebSocket/SSE transport. It permits one batch
in flight. A Solid effect tracking only table-driving signals acknowledges the
batch after the corresponding reactive DOM update. While an update is pending,
the Worker coalesces newer events by instrument in a bounded map instead of
growing an unbounded message queue.

`batch events` therefore counts source events, while `row updates` counts the
final row snapshots copied into a particular UI batch. A batch can contain
thousands of events but at most one final update per instrument.

The Worker removes quote generation and batching from the main thread. Solid
rendering, TanStack row-model work, DOM updates, layout, and paint still run on
the main thread.

## Metrics

- **Throughput** is the source-event rate represented by acknowledged batches.
- **RAF rate** is actual `requestAnimationFrame` callbacks divided by elapsed
  wall time. It is not an FPS estimate derived from table renders.
- **Table renders** is the rate of feed batches that reach the completed Solid
  reactive update and are acknowledged.
- **Average / P95 render** spans worker-message receipt through that completed
  effect. It excludes worker calculation and browser paint.
- **Long frames** uses the browser Long Animation Frames API when available.
- **Heap** uses Chromium's non-standard `performance.memory` when available.
- **Created / destroyed** distinguishes expected type-swap churn from live
  component retention.
- **Cell renderer calls/s** counts executions of column `cell` functions. The
  per-column breakdown identifies which callback was invoked.
- **Component renders/s** counts executions of dynamic Solid cell component
  functions, with an exact per-type breakdown. Fine-grained reactive DOM
  updates normally do not re-execute a whole component, so these calls mostly
  indicate component creation rather than React-style rerendering.
- **DOM mutation records/s** comes from a `MutationObserver` attached to the
  active `tbody`. It counts observer records, not changed elements or painted
  pixels.

The heap line is diagnostic. Immutable updates continuously allocate short-lived
arrays, row objects, and render objects, so raw heap can rise before garbage
collection. Compare post-GC plateaus in the browser Memory profiler.

The three counters are deliberately simple but do add instrumentation overhead.
Use them to catch accidental full-table work and compare ratios. For final
timings, corroborate them with a Chrome Performance recording and Solid
DevTools. A realistic healthy run keeps source throughput near target, avoids
reconstructing every cell on every worker batch, and reaches a stable post-GC
heap plateau.

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
6. Repeat with the Angular and React standalone examples using identical
   controls.
7. Toggle Tick A/B swapping, quote ages, and sparklines separately to isolate
   component churn, shared-clock invalidation, and array-input cost.

The 25k burst is useful for profiling coalescing and a large render, but a
sustained target rate is the better test of steady-state behavior.
