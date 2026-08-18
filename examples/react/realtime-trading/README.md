# React realtime trading benchmark

This is a standalone stress example for the current TanStack React Table
adapter. It combines a high-frequency synthetic market feed, immutable row
snapshots, sortable and resizable columns, range selection, dynamic React cell
components, optional row virtualization, React Profiler measurements, and
browser performance instrumentation.

The goal is to make feed work, message delivery, state application, table work,
React commits, and browser layout independently observable. It is a repeatable
rendering benchmark, not an exchange or network simulator.

## Run and verify

```bash
pnpm --dir examples/react/realtime-trading dev
```

Open `http://localhost:7778`.

For React commit timings, use the profiling production build:

```bash
pnpm --dir examples/react/realtime-trading build:profile
```

The normal verification commands are:

```bash
pnpm --dir examples/react/realtime-trading test:types
pnpm --dir examples/react/realtime-trading lint
pnpm --dir examples/react/realtime-trading build
pnpm --dir examples/react/realtime-trading test:e2e
```

Development builds include React checks and produce deliberately pessimistic
timings. The standard production build disables Profiler callbacks; the
`profile` mode aliases the profiling React DOM client so commit metrics remain
available.

## Directory structure

| Path | Responsibility |
| --- | --- |
| `src/feed/` | Market types, instruments, feed configuration, immutable update helpers, controller, and React lifecycle hook. |
| `src/feed/worker/` | Worker protocol, deterministic market engine, and the module Web Worker. |
| `src/benchmark/` | Browser monitor, benchmark controller, table observers, and React Profiler integration. |
| `src/shell/` | Store contexts, full-viewport shell, metrics, configurator, diagnostics, selected instrument, and status bar. |
| `src/table/table-config/` | Grouped columns, row boundary, custom cells, and render counters. |
| `src/table/` | Table instance, subscription boundaries, interactions, pointer hook, initial fit, and virtualization. |
| `src/App.tsx` | Composition root; creates controllers, providers, shell, table, and Profiler boundary. |

Feed state and benchmark state are intentionally separate. `MarketFeedController`
can run without `TradingBenchmarkController`; the latter observes feed lifecycle
events and owns only controls/metrics used by this benchmark UI.

## Data and worker pipeline

The initial configuration is 100 instruments, 10K generated samples per
second, a 20 ms delivery interval, enabled intraday charts, and 16 ms intraday
sampling.

1. `MarketFeedController` starts a module worker and sends the active config.
2. `market-feed-engine.ts` mutates worker-private quote state using a
   deterministic PRNG and stable instrument IDs.
3. A 16 ms loop accrues a fractional sample budget and produces the requested
   amount of synthetic market work.
4. A `Map` keyed by row index retains the latest pending update for each
   instrument, coalescing repeated samples.
5. A separate timer publishes at the selected delivery interval. Worker work
   rate and `postMessage` rate are deliberately independent.
6. The main thread creates a new outer quotes array and replaces only the rows
   present in the message. Unchanged row objects remain referentially stable.
7. History arrays change only on an intraday sample. A session ID discards stale
   messages after reset or instrument-count changes.

UI terminology:

- **Synthetic quote workload** means generated samples per second inside the
  worker, not browser events, React renders, or messages.
- **Worker delivery interval** is the target coalesced-message cadence; 20 ms
  targets approximately 50 messages per second.
- **Row updates** counts unique immutable row objects applied on the main
  thread, often fewer than generated samples.
- **Message samples** is the generated work represented by the latest message.

Intraday history sampling is independent of the quote workload, and the 25K
burst creates one intentionally expensive immediate batch. The worker resembles
an upstream WebSocket/SSE producer but does not include network latency.

## React state and rendering architecture

- Feed and benchmark controllers use TanStack Store.
- `createStoreContext` provides the controllers without making every consumer
  subscribe to the complete state object.
- Shell components call `useSelector` with narrow slices and shallow comparison
  where a selector returns an object.
- Selected symbol and renderer mode are dedicated atoms because they have
  different consumers and update frequencies from aggregate diagnostics.
- `TradingTable` subscribes directly to quote data and the virtualization
  inputs it needs; the parent shell does not receive the quotes array.
- `table.Subscribe` boundaries isolate sorting/filtering/order changes, each
  resize handle, and each row's selection state.
- Stable row IDs come from instrument IDs through `getRowId`.

React Compiler is enabled in the Vite Babel pipeline for `src`. The current
adapter is compiled normally; there is no historical v8 implementation or
`use no memo` compatibility boundary in this example. Compiler optimization
does not replace correct subscription ownership: components still subscribe to
the smallest practical state slice.

## Table behavior

The grid has 14 leaf columns grouped into Instrument, Price & Change, Order
Book, Session, and Chart sections. It provides:

- core sorting and filtering;
- on-change column resizing with double-click reset;
- drag-and-drop leaf-column ordering;
- CSS-only row hover;
- click/modified-click row selection;
- mouse-drag cell range selection and keyboard navigation;
- custom Price, Move, Percent Change, and Sparkline components;
- an opt-in mode that swaps move component A/B as direction changes.

`useTradingGridPointer` installs handlers once on `tbody`. It uses
`event.composedPath()` and data attributes to resolve the TanStack cell, so the
table does not allocate pointer handlers for every cell. Refs retain transient
drag state without triggering React renders.

Column sizes are written to CSS custom properties only when sizing or ordering
changes. Cells reference those properties, avoiding width-object churn during
quote updates. A `ResizeObserver` expands the initial column sizes to the
available viewport; the first manual resize disables later automatic fitting.

## Full DOM and virtual rows

The internal preference is `auto`, `tanstack`, or `none`:

- Below 200 rows, `auto` resolves to **Full DOM**, while virtualization remains
  manually selectable.
- From 200 through 1,499 rows, `auto` resolves to **TanStack Virtual**, but the
  user may still choose Full DOM.
- At 1,500 rows or more, virtualization is forced and the control is locked.

React Virtual uses a fixed 32 px estimate, 10-row overscan, stable row IDs as
item keys, transformed rows, and a body-sized spacer. The footer reports the
current range from the virtualizer. Full DOM maps the complete row model.

Both paths apply `content-visibility: auto` with a matching intrinsic height.
For Full DOM this can reduce browser work but not React element creation or DOM
mount count. Virtualization is what limits mounted row components.

## Performance decisions

- Market calculations run outside the main thread.
- Repeated samples are coalesced before worker messaging.
- Immutable snapshots preserve untouched row/history references.
- Stable row keys and `getRowId` preserve identity through sorting.
- Controller contexts carry stable objects; selectors subscribe to slices.
- Table, header, resize handle, row selection, and cell renderer boundaries are
  independently subscribable.
- Pointer selection is delegated and transient pointer state lives in refs.
- Column widths use CSS variables instead of per-tick style recalculation.
- Dynamic component destruction is opt-in; stable components are the baseline.
- Virtualization limits React and DOM work at larger row counts.
- Benchmark publication is throttled separately from the feed.

A new outer data array is required to publish immutable state. Referentially
stable untouched rows, keyed rows, and narrow subscriptions reduce downstream
work; they do not guarantee that the table's sorted/filtered row model can skip
all processing when its data input changes.

## Diagnostics

The benchmark monitor reports generated samples, unique row updates, messages,
state applies, completed commits, average mutation-to-render latency, long
animation frames, mounted hosts, component lifecycle counts, callbacks by
column, executions by component type, DOM mutation records, core row-model
timing, and optional heap information.

The React Profiler additionally records actual/base duration and commit counts
when using development or the profiling build. User Timing marks connect a feed
mutation to its completed render; old measures are periodically pruned.

Callback counts are not DOM mutation counts. A cell callback can execute while
React reuses the existing component and DOM. Likewise, a rising heap during the
component-swap stress test is not proof of a leak until repeated post-GC heap
snapshots show retained instances.

Use Chrome Performance and React DevTools for call stacks/flamegraphs, and keep
the instrument count, workload, delivery interval, renderer mode, build mode,
and virtualization mode fixed between comparisons.

## Standalone example policy

This directory owns its instrument list, feed engine, worker, diagnostics,
styles, and UI instead of importing a common demo package. The duplication is
intentional: each adapter example must run independently and remain easy to
copy to StackBlitz. Shared architectural explanations are repeated in the
READMEs for the same reason.

The package pins `@tanstack/react-table` to the repository version. The root
workspace override resolves it to `packages/react-table` while preserving a
release-like manifest.
