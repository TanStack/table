# Vue realtime trading benchmark

This standalone example exercises the current TanStack Vue Table adapter with
a high-frequency worker feed, immutable quote snapshots, interactive columns,
custom Vue cells, optional virtualization, and browser diagnostics. It is a
repeatable UI stress workload, not an exchange or network benchmark.

## Run and verify

```bash
pnpm --dir examples/vue/realtime-trading dev
```

Open `http://localhost:7777`.

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
stable controller objects. The controllers use Vue primitives directly:
`quotes` and metrics are independent `shallowRef` values, while feed status,
configuration, selection, and view state use focused `ref` values. Consumers
read only the refs they need, and the root never consumes the quote stream.
Cleanup stops both controllers on application unmount.

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

The table accepts the dedicated quotes `shallowRef` directly and uses the
instrument ID for `getRowId`. TanStack Vue Table's state atoms are Vue-backed,
so row-model computations and layout watchers read only the required atoms from
native `computed`/`watch` boundaries. Dedicated row views keep row markup and
selected-instrument state below the whole-table boundary.

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
- focused Vue refs and computed values narrow reactive invalidation;
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

The sidebar starts with four cross-framework health signals: estimated rAF
callbacks/s over one second, average snapshot-to-DOM-commit latency over three
seconds, long animation frames accumulated since reset, and throughput as
changed rows/s plus applied snapshots/s. “Changed rows” is deduplicated within
each snapshot; the same instrument can count again in a later snapshot. The
advanced diagnostics retain worker samples/messages, DOM commits, a rolling
10-second p95/max commit latency, slow commits, lifecycle/execution rates,
row-model timing, DOM mutation records, and optional heap data.

The frame figure is deliberately labeled estimated: it counts this page's rAF
callbacks, is capped by the display refresh rate, and falls when a tab is
throttled. It is a portable responsiveness signal, not compositor-presented
FPS.

Vue closes the pending measurement from the table's mounted/updated commit
hooks. User Timing entries for commits and row-model work are sampled at one in
20 calls; the in-memory counters and latency windows still measure every call.

Callback counts are not DOM mutation counts. Temporary heap growth during the
swap workload is not a leak unless post-GC snapshots retain instances. The heap
value is Chromium-only and GC-sensitive, not retained size. The DOM rate counts
`MutationRecord` objects rather than browser operations, and records may be
coalesced; the observer watches text/child changes plus only `class`/`style`
attributes to limit its own overhead. Non-feed text/child changes and
interaction-driven `class`/`style` changes (including virtual scrolling) are
included, so this is not a feed-only rate. Compare identical production
configurations and use Chrome Performance plus Vue DevTools for call stacks and
component detail.

## Standalone policy

The instruments, feed, worker, benchmark, shell, styles, and table code are
intentionally copied into this folder. This keeps the example independently
runnable and StackBlitz-ready, so shared implementation and README explanations
are duplicated across adapters by design.

The workspace resolves the pinned `@tanstack/vue-table` dependency to the local
adapter package while retaining a release-like manifest.
