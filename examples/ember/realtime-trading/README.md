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
| `app/feed/`                     | Market model, instrument universe, configuration, immutable update helpers, and Store-backed feed controller. |
| `app/feed/worker/`              | Typed protocol, deterministic engine, and module worker.                                                      |
| `app/benchmark/`                | Browser monitor and benchmark controller.                                                                     |
| `app/components/shell/`         | GTS header, metrics, configurator, diagnostics, selected instrument, status bar, and shell layout.            |
| `app/components/table/`         | Trading table Glimmer component.                                                                              |
| `app/table/table-config/`       | Grouped columns and custom GTS quote components.                                                              |
| `app/table/`                    | Table construction, features, delegated interactions, and Virtual Core integration.                           |
| `app/utils/subscriptions.ts`    | Owner-bound Store subscription and cleanup helpers.                                                           |
| `app/templates/application.gts` | Creates feed/benchmark controllers and composes the shell.                                                    |

`MarketFeedController` owns worker/feed state. `TradingBenchmarkController`
observes feed lifecycle callbacks and owns diagnostic/view state. The
application passes stable controllers to shell/table components; owner-bound
subscription helpers bridge selected TanStack Store values into Glimmer and
register destruction automatically. The root does not proxy every quote or
metric as application state.

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
`ResizeObserver` performs initial fitting until manual resize. A/B move
component swapping is an explicit lifecycle stress mode.

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
- owner-bound, slice-oriented Store subscriptions;
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

The benchmark records worker samples, messages, unique row updates, state
applies, completed renders, average mutation-to-render latency, long animation
frames, mounted hosts, component lifecycle/execution, callbacks by column, DOM
mutation records, row-model timing, and optional heap information.

Renderer callbacks and DOM mutations are different measurements. Temporary
heap growth during component swapping is not a leak without post-GC retention.
Compare identical production runs and use Chrome Performance with the in-app
diagnostics.

## Standalone policy

All instruments, feed, worker, benchmark, shell, styles, and table code are
copied into this directory intentionally. It remains independently runnable and
StackBlitz-friendly, so common implementation and README material is repeated
across adapters by design.

The workspace resolves `@tanstack/ember-table` to the repository adapter while
the example package remains release-like.
