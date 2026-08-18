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

| Path | Responsibility |
| --- | --- |
| `src/feed/` | Market model, instrument universe, feed config, immutable update logic, and Solid feed controller. |
| `src/feed/worker/` | Protocol, deterministic market engine, and module worker. |
| `src/benchmark/` | Benchmark monitor and the controller that exposes benchmark signals/actions. |
| `src/shell/` | Contexts, viewport shell, header, metrics, configurator, diagnostics, and selected instrument. |
| `src/table/table-config/` | Grouped columns and custom quote components. |
| `src/table/` | Solid Table instance, interactions, column layout, and Solid Virtual integration. |
| `src/App.tsx` | Creates feed/benchmark controllers and composes their providers with the table. |

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

The table reads the feed's quote accessor directly. Stable instrument IDs back
`getRowId`. Solid's fine-grained accessors and `<For>` keep updates local to the
expressions/components that consume changed values. The renderer-mode stress
control can switch the Move component type by direction, intentionally testing
mount/unmount churn.

One `TradingGridPointerController` handles delegated body events and resolves
cells from `composedPath()` plus data attributes. No pointer listener is added
per cell, and hover remains CSS-only. Column dimensions live in CSS variables
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
- fine-grained signals avoid broad shell invalidation;
- stable IDs preserve keyed row identity through updates and sorting;
- delegated grid interaction avoids per-cell handlers;
- CSS variables isolate width changes from quote updates;
- dynamic component churn and sparkline frequency are explicit controls;
- virtualization limits mounted DOM for larger data;
- metrics publish at a lower cadence than feed updates.

A new outer array is part of the immutable contract. Structural sharing helps
cell rendering, but table sorting/filtering can still rebuild a row model when
the data accessor changes.

## Diagnostics and interpretation

The monitor records generated samples, received messages, unique row updates,
state applies, completed renders, average mutation-to-render latency, long
animation frames, mounted cells, component lifecycle/execution rates, callbacks
by column, DOM mutations, core row-model timing, and optional heap information.

Renderer callbacks are not equivalent to DOM mutations. A rising heap during
component swapping is not proof of a leak without stable post-GC retention.
Use a production build, identical controls, Chrome Performance, and Solid
DevTools for meaningful comparisons.

## Standalone policy

This directory intentionally owns copies of the feed, worker, instruments,
benchmark code, UI, and styles. That makes it independent and StackBlitz-ready;
shared code and explanatory README sections are duplicated across adapters by
design.

The workspace resolves the pinned `@tanstack/solid-table` dependency to the
local adapter package while keeping the manifest release-like.
