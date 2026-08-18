# Lit realtime trading benchmark

This standalone example exercises the current TanStack Lit Table adapter with
a high-frequency worker feed, immutable snapshots, interactive columns, custom
elements for quote cells, Lit Virtual, and browser diagnostics. It is a
repeatable rendering workload, not an exchange or network benchmark.

## Run and verify

```bash
pnpm --dir examples/lit/realtime-trading dev
```

Open `http://localhost:7783`.

```bash
pnpm --dir examples/lit/realtime-trading test:types
pnpm --dir examples/lit/realtime-trading lint
pnpm --dir examples/lit/realtime-trading build
pnpm --dir examples/lit/realtime-trading test:e2e
```

Use the production build for measurements.

## Structure and ownership

| Path                              | Responsibility                                                                                       |
| --------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `src/feed/`                       | Market types, instruments, configuration, immutable updates, and direct TanStack atom feed controller. |
| `src/feed/worker/`                | Protocol, deterministic engine, and module worker.                                                   |
| `src/benchmark/`                  | Browser monitor, benchmark controller, table timing, and row-model diagnostics.                      |
| `src/shell/`                      | Custom elements for header, metrics, controls, diagnostics, selected instrument, status, and layout. |
| `src/shell/controller-element.ts` | Base element that subscribes to controller sources and releases subscriptions on disconnect.         |
| `src/table/table-config/`         | Grouped columns and custom quote cell elements.                                                      |
| `src/table/`                      | Lit Table element, delegated interactions, column layout, and Lit Virtual integration.               |
| `src/main.ts`                     | Root custom element that creates, starts, stops, and passes the controllers.                         |

The feed controller is independent from the benchmark controller. The root
passes stable controller objects; each shell/table custom element observes the
specific atom/store sources it consumes. Quotes and every feed control/status
value are independent direct atoms; the table observes only `quotes` and
`instrumentCount`. `ControllerElement` converts those
notifications into `requestUpdate()` and guarantees unsubscribe on disconnect,
avoiding one broad application-level subscription.

## Feed and worker pipeline

Defaults are 100 instruments, 10K generated samples/s, 20 ms delivery, enabled
intraday charts, and 16 ms chart sampling.

Mutable market state stays inside the worker. A deterministic 16 ms budget loop
generates samples, a row-indexed `Map` coalesces repeated instrument changes,
and an independent timer publishes the latest unique rows. The main thread
creates a new outer array and only new changed rows; untouched rows and
unsampled histories retain identity. Session IDs reject obsolete batches after
reset or instrument-count changes.

- **Synthetic quote workload** is worker-generated samples/s, not custom-element
  updates or messages.
- **Worker delivery interval** controls coalesced `postMessage` cadence; 20 ms
  targets about 50 messages/s.
- **Row updates** is the count of unique immutable rows applied.
- **Message samples** is generated work represented by the latest batch.

Intraday sampling is independent. The 25K burst deliberately publishes one
heavy batch. Worker messaging resembles an upstream stream without including
network latency.

## Lit table architecture

The 14 leaf columns are grouped into Instrument, Price & Change, Order Book,
Session, and Chart. The grid supports sorting/filtering, on-change resizing,
double-click reset, drag column ordering, CSS hover, row selection, drag cell
ranges, keyboard navigation, and Price/Move/Percent/Sparkline custom elements.

Stable instrument IDs define row identity. One body-level interaction
controller resolves cells from `event.composedPath()` and data attributes,
avoiding handlers on every cell. Column widths are CSS variables written only
when sizing/order changes; a `ResizeObserver` performs initial fitting until a
manual resize. The A/B move option is intentionally a custom-element lifecycle
stress path.

## Virtualization

- Below 200 rows, automatic mode uses Full DOM, with Virtual still selectable.
- From 200 through 1,499 rows, automatic mode uses TanStack Virtual, with Full
  DOM still selectable.
- At 1,500 rows or more, Virtual is forced and its control is disabled.

Lit Virtual uses a 32 px estimate, 10-row overscan, stable row IDs, transformed
rows, and a spacer body. The footer derives the visible interval from the
virtualizer. Both modes apply `content-visibility: auto`; Full DOM still creates
all elements even when the browser skips some offscreen layout/paint.

## Performance decisions

- worker-side generation and coalescing;
- structural sharing for unchanged rows/history arrays;
- source-specific atom/store subscriptions in custom elements;
- stable keyed row/virtual identity;
- lifecycle-safe controller element subscriptions;
- delegated pointer input and CSS hover;
- CSS variables for width propagation;
- independently configurable chart/component stress;
- virtual mounting at larger sizes;
- metrics published below feed frequency.

A new outer array is required by the immutable contract. Stable row references
help rendering, but sorting/filtering may still recompute the row model when
data changes.

## Diagnostics and interpretation

The sidebar keeps four cross-framework health signals prominent: estimated
frame callbacks, average snapshot-to-DOM-commit latency, cumulative long
animation frames, and changed-row/snapshot throughput. The remaining counters
stay in Diagnostics so they do not look like equally important scores.

`AVG COMMIT` is not the duration of `render()` and it does not include the
browser's later layout or paint. It starts when a new immutable snapshot is
applied and ends in a guarded microtask queued from `updated()`. That extra
microtask lets nested quote-cell custom elements finish their Lit updates
before the sample closes. The average uses a rolling 3-second window; diagnostic
p95/max use 10 seconds. The frame-rate estimate counts standard
`requestAnimationFrame` callbacks over one second. It is refresh-rate dependent
and is not a GPU/compositor FPS measurement.

Callback counts and DOM mutations describe different layers.
`Observed MutationRecords/s` is the number delivered by a `MutationObserver`
on the table body, not the number of browser DOM operations. The observer tracks
text, child-list, class, and style changes; it excludes selection data
attributes to reduce noise. Registering an observer still adds work at very high
mutation rates, so confirm close results with a Performance recording without
treating this counter as a score. Heap is Chrome-only, current and GC-sensitive;
growth is not a leak without post-GC retention. React Scan is not part of these
shared measurements. User Timing commit and row-model entries are sampled once
every 20 candidates; the numeric counters remain exact, while the Performance
timeline avoids one retained entry per hot-path execution.

## Standalone policy

All instruments, feed, worker, benchmark, shell, styles, and table code live in
this folder intentionally. It runs independently and can be copied to
StackBlitz, so shared implementation and README text are duplicated by design.

The workspace resolves the pinned `@tanstack/lit-table` dependency to the local
adapter package while keeping the manifest release-like.
