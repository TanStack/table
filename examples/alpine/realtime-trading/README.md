# Alpine realtime trading benchmark

This standalone example exercises the current TanStack Alpine Table adapter
with a high-frequency worker feed, immutable snapshots, interactive columns,
custom quote elements, Virtual Core, and browser diagnostics. It is a
repeatable UI stress workload, not an exchange or network benchmark.

## Run and verify

```bash
pnpm --dir examples/alpine/realtime-trading dev
```

Open `http://localhost:7784`.

```bash
pnpm --dir examples/alpine/realtime-trading test:types
pnpm --dir examples/alpine/realtime-trading lint
pnpm --dir examples/alpine/realtime-trading build
pnpm --dir examples/alpine/realtime-trading test:e2e
```

Use a production build for performance recordings.

## Structure and ownership

| Path                                | Responsibility                                                                                                 |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `src/feed/`                         | Market model, instrument universe, feed config, immutable update helpers, and direct TanStack atom controller. |
| `src/feed/worker/`                  | Typed protocol, deterministic engine, and module worker.                                                       |
| `src/benchmark/`                    | Browser monitor and benchmark controller.                                                                      |
| `src/shell/configurator-options.ts` | Declarative select/range options used by the sidebar.                                                          |
| `src/table/table-config/`           | Grouped columns and custom quote elements.                                                                     |
| `src/table/`                        | Shared interaction helpers and virtualization constants.                                                       |
| `src/main.ts`                       | Alpine component factory and the imperative bridges to Store, Table, Virtual Core, observers, and DOM layout.  |
| `index.html`                        | Declarative full-viewport shell, table template, controls, diagnostics, and status bar.                        |

Alpine keeps the markup declarative in `index.html`; `tradingApp` owns only the
runtime coordination that cannot live in HTML. Feed and benchmark remain
separate controllers. Direct feed atoms are bridged into an Alpine reactive view
object individually: the high-frequency `quotes` atom is independent from
status and configuration atoms. Selected symbol and renderer mode are also
dedicated atoms. Every subscription, observer, virtualizer mount, controller,
and worker has explicit cleanup registered by `init()`/`destroy()`.

## Feed and worker pipeline

Defaults are 100 instruments, 10K generated samples/s, 20 ms delivery, enabled
intraday charts, and 16 ms chart sampling.

Mutable quotes stay in the worker. A deterministic 16 ms budget loop generates
samples, a row-indexed `Map` coalesces repeated instrument changes, and a
separate timer publishes the latest unique rows. The main thread creates a new
outer array and only new changed rows. Unchanged rows and unsampled history
arrays retain identity. Session IDs reject late messages after resets or row
count changes.

- **Synthetic quote workload** is generated worker samples/s, not Alpine DOM
  updates or worker messages.
- **Worker delivery interval** controls coalesced message cadence; 20 ms targets
  about 50 messages/s.
- **Row updates** counts unique immutable row objects applied.
- **Message samples** is the generated work represented by the latest batch.

The 25K burst intentionally creates and flushes one expensive message.
Worker delivery resembles an upstream stream but does not include a network.

## Alpine table architecture

The table has 14 leaf columns grouped into Instrument, Price & Change, Order
Book, Session, and Chart. It supports sorting/filtering, on-change resizing,
double-click reset, drag column ordering, CSS hover, row selection, drag cell
ranges, keyboard navigation, and Price/Move/Percent/Sparkline custom elements.

Stable instrument IDs back `getRowId`. The local `rows()` function caches the
row model by feed-array identity and table-state version so repeated Alpine
template reads do not call `getRowModel()` again during the same state. One
`TradingGridPointerController` handles all body input using `composedPath()` and
data attributes instead of per-cell listeners.

Column widths are CSS custom properties updated only by sizing/order
subscriptions. `ResizeObserver` performs initial fit and stops after manual
resize. Component A/B swapping is an explicit lifecycle stress mode; stable
rendering is the realistic default.

## Virtualization

- Below 200 rows, automatic mode chooses Full DOM, but Virtual remains
  selectable.
- From 200 through 1,499 rows, automatic mode chooses TanStack Virtual and Full
  DOM remains selectable.
- At 1,500 rows or more, Virtual is forced and the control is locked.

`main.ts` owns one `@tanstack/virtual-core` instance, updates its count/options,
and increments a narrow Alpine virtual version when its range changes. It uses
32 px estimates, 10-row overscan, row IDs as keys, transformed rows, and a body
spacer. The footer reads the instance range. Both modes apply
`content-visibility: auto`; Full DOM still creates all rows/cells.

## Performance decisions

- worker generation and coalescing before main-thread delivery;
- structural sharing for unchanged rows and histories;
- cached row-model reads keyed by actual dependencies;
- stable table/virtual row IDs;
- dedicated reactive versions for table and virtualizer changes;
- one delegated grid interaction controller and CSS hover;
- CSS variables for column sizes;
- configurable chart cadence and opt-in component churn;
- virtual mounting for large row sets;
- explicit lifecycle cleanup and low-frequency metrics publication.

The immutable outer array changes by design. Stable inner references reduce
cell work, but sorting/filtering can still require a fresh row-model pass.

## Diagnostics and interpretation

The sidebar keeps four cross-framework health signals prominent: estimated
frame callbacks, average snapshot-to-DOM-commit latency, cumulative long
animation frames, and changed-row/snapshot throughput. The remaining counters
stay in Diagnostics so they do not look like equally important scores.

`AVG COMMIT` is not the duration of an Alpine render function and it does not
include the browser's later layout or paint. It starts when a new immutable
snapshot is applied and ends in one coalesced `Alpine.nextTick()` callback,
after Alpine has flushed the corresponding DOM work. The average uses a rolling
3-second window; diagnostic p95/max use 10 seconds. If several worker
messages arrive before one Alpine flush, they intentionally produce one commit
sample from the earliest pending snapshot.

The frame-rate estimate counts standard `requestAnimationFrame` callbacks over
one second; it is refresh-rate dependent and is not GPU/compositor FPS.
`Observed MutationRecords/s` is observer delivery count, not browser DOM
operations. It tracks text, child-list, class, and style changes while excluding
selection data attributes to reduce noise. The observer itself still adds work
at very high mutation rates. Heap is Chrome-only, current and GC-sensitive;
temporary growth is not proof of a leak without post-GC retention. React Scan is
not part of these shared measurements. User Timing commit and row-model entries
are sampled once every 20 candidates; the numeric counters remain exact, while
the Performance timeline avoids one retained entry per hot-path execution.

## Standalone policy

This folder intentionally contains its own instruments, feed, worker,
benchmark, shell markup, styles, and table code. It can run independently or be
copied to StackBlitz, so common source and README sections are duplicated across
adapters by design.

The workspace resolves the pinned `@tanstack/alpine-table` dependency to the
local adapter package while keeping the manifest release-like.
