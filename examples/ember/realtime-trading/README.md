# Ember realtime trading benchmark

This standalone example exercises the current TanStack Ember Table adapter
with a high-frequency worker feed, immutable snapshots, interactive columns,
Glimmer quote components, Virtual Core, and browser diagnostics. It is a
repeatable rendering stress workload, not an exchange or network benchmark.

## Run and verify

```bash
pnpm --dir examples/ember/realtime-trading dev
```

Open `http://localhost:7785`.

```bash
pnpm --dir examples/ember/realtime-trading test:types
pnpm --dir examples/ember/realtime-trading build
pnpm --dir examples/ember/realtime-trading test:e2e
```

This example currently has no separate `lint` package script. Use a production
build for performance recordings.

## Structure and ownership

| Path                            | Responsibility                                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `app/feed/`                     | Market model, instrument universe, configuration, immutable update helpers, and Ember-native tracked controller. |
| `app/feed/worker/`              | Typed protocol, deterministic engine, and module worker.                                                      |
| `app/benchmark/`                | Browser monitor and benchmark controller.                                                                     |
| `app/components/shell/`         | GTS header, metrics, configurator, diagnostics, selected instrument, status bar, and shell layout.            |
| `app/components/table/`         | Trading table Glimmer component.                                                                              |
| `app/table/table-config/`       | Grouped columns and custom GTS quote components.                                                              |
| `app/table/`                    | Table construction, features, delegated interactions, and Virtual Core integration.                           |
| `app/utils/subscriptions.ts`    | Owner-bound destruction cleanup helper.                                                                       |
| `app/templates/application.gts` | Creates feed/benchmark controllers and composes the shell.                                                    |

`MarketFeedController` owns worker/feed state. `TradingBenchmarkController`
observes feed lifecycle callbacks and owns diagnostic/view state. The
application passes stable controllers to shell/table components; Glimmer
components read the controller's `@tracked` properties directly. `quotes` is
its own high-frequency tracked property; feed status and each configuration
value are separate tracked properties. Derived benchmark values use `@cached`.
There is no foreign Store subscription or mirrored component state, and the
root does not proxy every quote or metric as application state.

## Feed and worker pipeline

Defaults are 100 instruments, 10K generated samples/s, 20 ms delivery, enabled
intraday charts, and 16 ms chart sampling.

Mutable quote state is private to the worker. A deterministic 16 ms budget loop
generates samples, a row-indexed `Map` coalesces repeated changes, and a separate
timer publishes the latest unique rows. The main thread creates a new outer
array and replaces only changed rows; untouched rows and unsampled history
arrays retain references. Session IDs reject stale messages after resets or
instrument-count changes.

- **Synthetic quote workload** is worker-generated samples/s, not Glimmer
  renders, events, or messages.
- **Worker delivery interval** controls coalesced message cadence; 20 ms targets
  around 50 messages/s.
- **Row updates** is the number of unique immutable rows applied.
- **Message samples** is the generated work represented by the latest message.

Intraday history uses its own cadence. The 25K burst deliberately publishes one
heavy batch. The worker resembles an upstream stream, without network latency.

## Ember table architecture

The grid has 14 leaf columns grouped into Instrument, Price & Change, Order
Book, Session, and Chart. It includes sorting/filtering, on-change resizing,
double-click reset, drag ordering, CSS hover, row selection, drag cell ranges,
keyboard navigation, and Price/Move/Percent/Sparkline Glimmer components.

`flexRenderComponent` is used for actual component cells. Stable instrument IDs
back row identity. One table/body interaction path resolves cells through
`event.composedPath()` and data attributes instead of allocating handlers on
every cell. Column widths are CSS variables updated on sizing/order; a
`ResizeObserver` performs initial fitting until manual resize. The
CSS-variable string is an `@cached` getter that reads Ember-reactive table
sizing and order, so the first fit and later table updates reach the DOM
without an imperative Store subscription. A/B move component swapping is an
explicit lifecycle stress mode.

## Virtualization

- Below 200 rows, automatic mode uses Full DOM, while Virtual is selectable.
- From 200 through 1,499 rows, automatic mode uses TanStack Virtual and Full DOM
  remains selectable.
- At 1,500 rows or more, Virtual is forced and its control is disabled.

The local Virtual Core integration owns one instance with 32 px estimates,
10-row overscan, stable row IDs, transformed rows, and a spacer body. Instance
notifications invalidate only the table range, and the footer reads that range.
Both Full DOM and virtual rows use `content-visibility: auto`; Full DOM still
creates every Glimmer row/cell.

## Performance decisions

- worker-side generation and pre-message coalescing;
- immutable structural sharing for rows/history;
- direct `@tracked` feed/view state and `@cached` derived state;
- stable table and virtual row identity;
- componentized GTS shell/table/cell boundaries;
- delegated pointer input and CSS hover;
- CSS variables for width propagation;
- opt-in lifecycle churn and independently sampled charts;
- virtual mounting for larger row counts;
- explicit destructor cleanup and lower-frequency metric publication.

The outer array intentionally changes for an immutable batch. Structural
sharing reduces cell work, but sorting/filtering can still trigger row-model
processing when data changes.

## Diagnostics and interpretation

The compact **Live health** section lives in the configurator and reports the
estimated frame callback rate over 1 second, average market-mutation-to-DOM-
commit latency over 3 seconds, cumulative long animation frames, and throughput
as changed rows plus applied snapshots per second. Detailed diagnostics retain
worker samples/messages, state applies, DOM commits, rolling 10-second p95/max
commit latency, cumulative slow commits, mounted hosts, component
lifecycle/execution, row-model timing, DOM mutation records, and heap.

The frame value counts `requestAnimationFrame` callbacks, not GPU-presented
frames, so its ceiling follows the display refresh rate. Renderer callbacks and
DOM mutations are different measurements. `MutationObserver` counts delivered
records, not individual DOM operations, and has overhead on a hot subtree; it
only observes text, child-list, and `class`/`style` changes to reduce selection
noise. Heap is a Chromium-only, GC-sensitive point-in-time value. User Timing
timeline measures are sampled 1-in-20 while the in-memory latency calculation
keeps every commit, reducing profiler self-interference. Temporary heap growth
during component swapping is not a leak without post-GC retention.
The rAF loop only appends a timestamp; rolling aggregation and heap reads run at
the 500 ms metrics publication cadence. Mutation observation remains the most
intrusive diagnostic because the browser must create records for the observed
subtree.

`Changed rows/s` sums the update array lengths delivered by each snapshot.
Symbols are deduplicated inside one message, but the same row can count again in
the next snapshot; it is applied row throughput, not distinct instruments per
second.

## Standalone policy

All instruments, feed, worker, benchmark, shell, styles, and table code are
copied into this directory intentionally. It remains independently runnable and
StackBlitz-friendly, so common implementation and README material is repeated
across adapters by design.

The workspace resolves `@tanstack/ember-table` to the repository adapter while
the example package remains release-like.
