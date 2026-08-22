# Solid realtime trading benchmark

This standalone example exercises the current TanStack Solid Table adapter
with a high-frequency worker feed, immutable snapshots, fine-grained reactive
cells, table interactions, virtual rows, and browser diagnostics. It is a
repeatable UI workload, not an exchange or network benchmark.

## Run and verify

```bash
pnpm --dir examples/solid/realtime-trading dev
```

Open `http://localhost:7779`.

```bash
pnpm --dir examples/solid/realtime-trading test:types
pnpm --dir examples/solid/realtime-trading lint
pnpm --dir examples/solid/realtime-trading build
pnpm --dir examples/solid/realtime-trading test:e2e
```

Record performance against the production build; development checks distort
absolute timings.

## Structure and ownership

| Path                      | Responsibility                                                                                     |
| ------------------------- | -------------------------------------------------------------------------------------------------- |
| `src/feed/`               | Market model, instrument universe, feed config, immutable update logic, and Solid feed controller. |
| `src/feed/worker/`        | Protocol, deterministic market engine, and module worker.                                          |
| `src/benchmark/`          | Benchmark monitor and the controller that exposes benchmark signals/actions.                       |
| `src/shell/`              | Contexts, viewport shell, header, metrics, configurator, diagnostics, and selected instrument.     |
| `src/table/table-config/` | Declarative columns, named cell renderers, component props, and quote value calculations.          |
| `src/table/`              | Table model primitive, view components, interactions, layout, and virtualization.                  |
| `src/App.tsx`             | Creates feed/benchmark controllers and composes their providers with the table.                    |

`createMarketFeedController` and `createTradingBenchmarkController` are
separate. The feed owns worker state and quotes; the benchmark observes feed
events and owns only diagnostic/view state. Solid contexts provide controller
objects, and consumers read individual accessors rather than one global state
snapshot.

## Feed and worker pipeline

The initial setup is 100 instruments, 10K generated samples/s, 20 ms delivery,
enabled intraday charts, and 16 ms chart sampling.

Mutable quotes never leave the worker. A deterministic generator and a 16 ms
budget loop create samples, while a row-indexed `Map` coalesces repeated changes.
A separate timer publishes the latest unique updates. On the main thread the
outer quote array is new, changed rows are new, and untouched rows keep their
references. History arrays change only at their own sampling cadence. Session
IDs prevent stale batches from an old configuration from being applied.

- **Synthetic quote workload** is generated worker samples/s, not messages or
  framework updates.
- **Worker delivery interval** controls coalesced messages; 20 ms targets about
  50 messages/s.
- **Row updates** is the unique immutable rows applied by a message.
- **Message samples** is the worker work represented by the latest message.

The 25K burst immediately generates and flushes an intentionally heavy batch.
The worker is a local stand-in for an upstream stream; network latency is not
part of the test.

## Solid table architecture

The table has 14 leaf columns grouped into Instrument, Price & Change, Order
Book, Session, and Chart. It supports sorting/filtering, on-change resizing,
double-click reset, drag ordering, row selection, drag cell ranges, keyboard
navigation, and component-based Price/Move/Percent/Sparkline cells.

The table reads the feed's quote accessor directly from context; `App` does not
subscribe to or forward quote snapshots. `TradingTable` is only the composition
root for `createTradingTableModel`, row virtualization, layout and commit
effects, plus `TradingTableHeader`, `TradingTableBody`, and
`TradingTableFooter`. Stable instrument IDs back `getRowId`. Full-DOM rows use
Solid's position-owned `<Index>` scopes and a dedicated `TradingTableRow`
boundary. Each position receives the current TanStack `Row`. One row-level memo
keeps its render cells while the row ID, column configuration, and cell order
are unchanged. A small Solid context exposes an `Accessor<MarketQuote>` for that
row, so named renderers and their component props update without replacing the
mounted `FlexRender`. It is a normal accessor, not a proxy or mutable registry.

Row and cell DOM attributes are written directly in JSX. Every cell slot also
receives the current row-model cell at the same visible-column index; selection
edges, focus, selected state, and roving tabindex are computed from that current
cell. This avoids stale selection geometry without `getAllCellsByColumnId()` or
per-cell row/column ID memos. Grid-level pointer interaction remains delegated
to the table body.

`<For>` is intentionally not used for the immutable TanStack row model. Solid
keys `<For>` by item identity, while TanStack creates new `Row` objects after a
new data array. Stable `getRowId` values preserve table state, but do not change
Solid's identity comparison; `<For>` would therefore treat every new row object
as a replacement. `<Index>` keeps the DOM/component slot mounted while replacing
the current `Row` and selection `Cell` props at that position. The separate
render-cell memo changes only for a new row ID, column definition/order, or row
moving into the slot, so quote snapshots update component props without
remounting `FlexRender`. Sorting updates the affected positions as expected.

The column configuration is memoized by renderer mode. Changing Stable to A/B
therefore refreshes the column definition once, while normal quote batches do
not rebuild columns. `trading-columns.tsx` contains only the declarative schema;
named renderers, component prop interfaces, and market calculations live in
focused colocated modules. In A/B mode the Move renderer selects the direction
component when that row changes, intentionally testing mount/unmount churn.

`createTradingGridSelectionHandlers` creates one delegated body handler object
and resolves cells from `composedPath()` plus identity data attributes. No
pointer listener is added per cell, and hover remains CSS-only. Header drag,
grid attributes, and body attributes use focused reusable prop factories; the
hot row/cell path stays as direct JSX. Column dimensions live in CSS variables
and update only for column sizing/order; a `ResizeObserver` performs the initial
fit until the user resizes manually.

## Virtualization

- Below 200 rows, automatic mode chooses Full DOM, but Virtual is selectable.
- From 200 through 1,499 rows, automatic mode chooses TanStack Virtual and the
  user may still choose Full DOM.
- At 1,500 rows or more, Virtual is forced and the control is disabled.

`createVirtualizer` uses 32 px row estimates, 10-row overscan, stable row IDs,
transformed rows, and a spacer body. Its range drives the current-row footer.
Both rendering paths use `content-visibility: auto`; in Full DOM it can skip
some browser rendering but does not avoid creating every Solid row/cell.

## Performance decisions

- market work and coalescing happen before crossing to the main thread;
- immutable snapshots preserve unchanged row/history references;
- fine-grained signals avoid broad shell or root invalidation;
- position-owned rows/cells preserve DOM slots and render-cell identity while
  an accessor updates the current immutable quote;
- delegated grid interaction avoids per-cell handlers;
- CSS variables isolate width changes from quote updates;
- dynamic component churn and sparkline frequency are explicit controls;
- virtualization limits mounted DOM for larger data;
- metrics publish at a lower cadence than feed updates.

A new outer array is part of the immutable contract. Structural sharing helps
cell rendering, but table sorting/filtering can still rebuild a row model when
the data accessor changes.

## Diagnostics and interpretation

The sidebar starts with four cross-framework health signals: estimated rAF
callbacks/s over one second, average snapshot-to-DOM-commit latency over three
seconds, long animation frames accumulated since reset, and throughput as
changed rows/s plus applied snapshots/s. “Changed rows” is deduplicated within
each snapshot; the same instrument can count again in a later snapshot. The
advanced diagnostics retain worker samples/messages, DOM commits, a rolling
10-second p95/max commit latency, slow commits, lifecycle/execution rates, DOM
mutation records, and optional heap information.

The frame figure is deliberately labeled estimated: it counts this page's rAF
callbacks, is capped by the display refresh rate, and falls when a tab is
throttled. It is a portable responsiveness signal, not compositor-presented
FPS.

Solid applies reactive DOM writes synchronously, but the quote-tracking effect
queues one coalesced microtask before closing a pending commit measurement. This
prevents an effect scheduled early in the reactive graph from reporting a
commit before child bindings have settled. User Timing timeline entries are
sampled at one in 20 commits; the in-memory latency calculation still records
every commit.

Renderer callbacks are not equivalent to DOM mutations. With this example's
immutable outer array, TanStack can produce new row/cell instances, but the
row-ID equality boundary keeps `FlexRender` stable across quote snapshots.
Column mode/order changes, sorting, and virtual-slot reuse replace the relevant
render cell. A/B mode additionally replaces the direction component when the
sign changes. A rising heap during
component swapping is not proof of a leak without stable post-GC retention.
The heap value is Chromium-only, represents the current GC-sensitive JS heap,
and is not a retained-size measurement. The DOM rate counts `MutationRecord`
objects, not individual browser operations; records may be coalesced. Its
observer watches text/child changes and only `class`/`style` attributes to
reduce, but not eliminate, observer overhead. Non-feed text/child changes and
interaction-driven `class`/`style` changes (including virtual scrolling) are
included, so do not interpret the rate as feed-only work. Use a production
build, identical controls, Chrome Performance, and Solid DevTools for meaningful
comparisons.

## Standalone policy

This directory intentionally owns copies of the feed, worker, instruments,
benchmark code, UI, and styles. That makes it independent and StackBlitz-ready;
shared code and explanatory README sections are duplicated across adapters by
design.

The workspace resolves the pinned `@tanstack/solid-table` dependency to the
local adapter package while keeping the manifest release-like.
