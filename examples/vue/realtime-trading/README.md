# Vue realtime trading benchmark

This standalone example exercises the current TanStack Vue Table adapter with
a high-frequency worker feed, immutable quote snapshots, interactive columns,
custom Vue cells, optional virtualization, and browser diagnostics. It is a
repeatable UI stress workload, not an exchange or network benchmark.

## Run and verify

```bash
pnpm --dir examples/vue/realtime-trading dev
```

Open `http://localhost:7781`.

```bash
pnpm --dir examples/vue/realtime-trading test:types
pnpm --dir examples/vue/realtime-trading lint
pnpm --dir examples/vue/realtime-trading build
pnpm --dir examples/vue/realtime-trading test:e2e
```

Use the production build for recordings; Vue development checks add overhead.

## Structure and ownership

| Path                      | Responsibility                                                                                 |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| `src/feed/`               | Market model, instrument universe, feed configuration, immutable updates, and feed controller. |
| `src/feed/worker/`        | Typed protocol, deterministic market engine, and module worker.                                |
| `src/benchmark/`          | Browser monitor, benchmark controller, table timing, lifecycle, and mutation observers.        |
| `src/shell/`              | Controller injection, viewport shell, controls, metrics, selected instrument, and diagnostics. |
| `src/table/table-config/` | Grouped columns and custom Vue quote cells.                                                    |
| `src/table/`              | Vue Table instance, delegated interactions, column layout, and Vue Virtual integration.        |
| `src/App.tsx`             | Creates/starts controllers, provides them, and composes shell plus table.                      |

`MarketFeedController` owns worker/feed state; `TradingBenchmarkController`
observes it and owns benchmark/view state. Vue `provide`/`inject` distributes
stable controller objects. `@tanstack/vue-store` selectors expose narrow
reactive atoms instead of making the root consume the quotes and every metric.
`quotes` is a dedicated high-frequency atom; feed status and each configuration
value are independent atoms. Cleanup stops both controllers on application
unmount.

## Feed and worker pipeline

The default run uses 100 instruments, 10K generated samples/s, 20 ms delivery,
enabled intraday charts, and 16 ms chart sampling.

The worker keeps mutable market state private. Its deterministic generator runs
from a 16 ms accrued budget, while a row-indexed `Map` coalesces repeated
updates. A separate publication timer sends the latest unique rows. The main
thread publishes a new quote array but replaces only changed row objects;
untouched rows and unsampled history arrays keep their references. Session IDs
discard messages from an obsolete reset/instrument configuration.

- **Synthetic quote workload** is generated samples/s in the worker, not Vue
  renders or `postMessage` calls.
- **Worker delivery interval** is the target coalesced-message cadence; 20 ms
  targets roughly 50 messages/s.
- **Row updates** counts unique immutable rows applied by a message.
- **Message samples** is the generated work represented by the latest batch.

Chart sampling is independent of price sampling. The 25K burst immediately
creates and publishes one heavy batch. Worker messaging approximates an
upstream stream, but actual network latency is outside the benchmark.

## Vue table architecture

The grid has 14 leaf columns grouped into Instrument, Price & Change, Order
Book, Session, and Chart. It supports sorting/filtering, on-change resizing,
double-click reset, drag ordering, CSS row hover, row selection, drag cell
ranges, keyboard navigation, and component-based Price/Move/Percent/Sparkline
cells.

The table reads the dedicated quotes atom through a getter and uses the
instrument ID for `getRowId`. Table state is selected independently from feed
state; computed rows are invalidated only by the inputs relevant to the row
model. Dedicated row views keep row markup and selected-instrument state below
the whole-table boundary.

A single `TradingGridPointerController` handles body pointer events. It maps
`event.composedPath()` and data attributes back to the TanStack cell, avoiding
one handler per cell. Column sizes are CSS variables updated only when sizing
or order changes. `ResizeObserver` performs initial fit until manual resizing.
The A/B Move renderer is an explicit component lifecycle stress mode.

## Virtualization

- Below 200 rows, automatic mode uses Full DOM, but Virtual is selectable.
- From 200 through 1,499 rows, automatic mode uses TanStack Virtual, while Full
  DOM remains selectable.
- At 1,500 rows or more, Virtual is forced and its control is locked.

Vue Virtual uses 32 px row estimates, 10-row overscan, instrument IDs as item
keys, transformed rows, and a spacer body. The visible-range footer reads the
virtualizer range. Both paths apply `content-visibility: auto`; in Full DOM it
can reduce browser rendering but cannot prevent Vue from creating all rows.

## Performance decisions

- market generation/coalescing is moved off the main thread;
- immutable structural sharing preserves untouched rows/histories;
- direct atom selectors and computed values narrow reactive invalidation;
- stable row and virtual item keys preserve identity;
- row rendering is componentized without subscribing the app root to data;
- pointer selection is delegated once;
- CSS variables separate width changes from quote updates;
- component swapping and chart frequency are opt-in stress controls;
- virtualization limits framework and DOM mounts;
- metrics are published more slowly than the feed.

The immutable outer array must change for a batch. Structural sharing can reduce
cell work, but sorted/filtered row models may still run when the data input
changes.

## Diagnostics and interpretation

The monitor records generated samples, worker messages, unique row updates,
state applies, table commits, average mutation-to-render latency, long animation
frames, mounted hosts, component creation/destruction and execution, cell
callbacks by column, DOM mutation records, core row-model timing, and optional
heap data.

Callback counts are not DOM mutation counts. Temporary heap growth during the
swap workload is not a leak unless post-GC snapshots retain instances. Compare
identical production configurations and use Chrome Performance plus Vue
DevTools for call stacks and component detail.

## Standalone policy

The instruments, feed, worker, benchmark, shell, styles, and table code are
intentionally copied into this folder. This keeps the example independently
runnable and StackBlitz-ready, so shared implementation and README explanations
are duplicated across adapters by design.

The workspace resolves the pinned `@tanstack/vue-table` dependency to the local
adapter package while retaining a release-like manifest.
