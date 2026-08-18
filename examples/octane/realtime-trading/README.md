# Octane realtime trading benchmark

This standalone example exercises the current TanStack Octane Table adapter
with a high-frequency worker feed, immutable snapshots, interactive columns,
custom TSRX cells, Virtual Core, and browser diagnostics. It is a repeatable UI
stress workload rather than an exchange/network simulator.

## Run and verify

```bash
pnpm --dir examples/octane/realtime-trading dev
```

Open `http://localhost:7786`.

```bash
pnpm --dir examples/octane/realtime-trading test:types
pnpm --dir examples/octane/realtime-trading lint
pnpm --dir examples/octane/realtime-trading build
pnpm --dir examples/octane/realtime-trading test:e2e
```

Use a production build for representative measurements.

## Structure and ownership

| Path                      | Responsibility                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `src/feed/`               | Market model, instruments, feed config, immutable update helpers, and direct TanStack atom feed controller.  |
| `src/feed/worker/`        | Typed protocol, deterministic engine, and module worker.                                                     |
| `src/benchmark/`          | Browser monitor, benchmark controller, table observer, and row-model timing.                                 |
| `src/shell/`              | Separate TSRX header, metrics, configurator, diagnostics, selected-instrument, status, and shell components. |
| `src/table/table-config/` | Grouped columns and custom TSRX quote components.                                                            |
| `src/table/`              | Octane Table view/setup, interactions, pointer hook, column layout, and Virtual Core hook.                   |
| `src/use-store-value.ts`  | Small Octane hooks that subscribe to an atom, a whole store, or a compared selector slice.                   |
| `src/main.tsrx`           | Creates controllers and renders the shell composition root.                                                  |

`MarketFeedController` owns feed/worker state. `TradingBenchmarkController`
observes it and owns diagnostic/view state. The shell receives stable controller
objects; individual components call `useStoreSelector` or `useStoreValue` for
the values they need. Quotes, feed status, row count, workload, delivery, and
chart controls are direct independent atoms. The table subscribes to `quotes`
and `instrumentCount`, so a configurator/status update cannot invalidate table
data. Benchmark metrics remain an aggregate snapshot store.

## Feed and worker pipeline

Defaults are 100 instruments, 10K generated samples/s, 20 ms delivery, enabled
intraday charts, and 16 ms chart sampling.

The worker keeps mutable quote state private. A deterministic 16 ms budget loop
generates samples, and a row-indexed `Map` coalesces repeated updates. A separate
publication timer posts the latest unique rows. The main thread creates a new
outer array and replaces only changed row objects; untouched rows and unsampled
history arrays retain their references. Session IDs discard stale batches after
reset or instrument-count changes.

- **Synthetic quote workload** means generated worker samples/s, not messages,
  events, or component renders.
- **Worker delivery interval** controls coalesced message cadence; 20 ms targets
  about 50 messages/s.
- **Row updates** counts unique immutable rows applied on the main thread.
- **Message samples** is the generated work represented by the latest message.

The 25K burst immediately generates and flushes one deliberately heavy batch.
The worker approximates an upstream stream but does not measure network delay.

## Octane table architecture

The table has 14 leaf columns grouped into Instrument, Price & Change, Order
Book, Session, and Chart. Sorting/filtering, on-change resizing, double-click
reset, drag ordering, CSS row hover, row selection, drag cell ranges, keyboard
navigation, and custom Price/Move/Percent/Sparkline components are included.

Stable instrument IDs back `getRowId`. Table, row, header, and quote component
boundaries keep ownership explicit. A local hook delegates pointer handling at
the body and stores transient drag state without publishing render state. It
resolves a cell through `event.composedPath()` and data attributes rather than
installing per-cell listeners.

Column widths are table CSS variables updated only for sizing/order. A
`ResizeObserver` performs the initial fit and stops auto-fitting after manual
resize. The move A/B option deliberately changes component type to measure
creation/destruction; stable mode is the realistic baseline.

## Virtualization

- Below 200 rows, automatic mode resolves to Full DOM, while Virtual is
  selectable.
- From 200 through 1,499 rows, automatic mode resolves to TanStack Virtual and
  Full DOM remains selectable.
- At 1,500 rows or more, Virtual is forced and the control is locked.

The local `useVirtualizer` bridge owns one `@tanstack/virtual-core` instance.
It updates options in place, mounts/unmounts through Octane layout effects, and
increments a local render version on virtualizer changes. Configuration uses a
32 px estimate, 10-row overscan, row IDs as keys, transformed rows, and a spacer
body. The footer reads the Virtualizer range.

Both paths use `content-visibility: auto`. This can reduce offscreen browser
work in Full DOM but does not prevent Octane from creating every row/cell.

## Performance decisions

- worker generation and coalescing before main-thread delivery;
- immutable structural sharing for rows and chart histories;
- selector-based subscriptions with explicit equality;
- stable table and virtual row identity;
- componentized shell/table/cells with local state ownership;
- delegated pointer input and CSS hover;
- CSS variables for column sizes;
- opt-in component churn and independently sampled charts;
- virtual mounting for larger data sets;
- benchmark publication slower than feed updates.

The outer array intentionally changes for immutable publication. Structural
sharing reduces renderer work, but sorted/filtered row models may still execute
when the data input changes.

## Diagnostics and interpretation

The monitor records worker samples, messages, unique row updates, state applies,
completed renders, average mutation-to-render latency, long animation frames,
mounted cells, component lifecycle/execution, callbacks by column, DOM mutation
records, row-model timing, and optional heap information.

Octane's completed-render measurement is connected to the feed mutation and
the table's committed layout lifecycle; it should be compared using the same
build and settings. Callback execution does not equal DOM mutation, and heap
growth is not a confirmed leak without post-GC retention. Use Chrome
Performance alongside the in-app diagnostics.

## Standalone policy

This folder owns copies of its feed, worker, instruments, benchmark, shell,
styles, and table implementation. That duplication keeps it independently
runnable and StackBlitz-friendly; shared README explanations are repeated
across adapters intentionally.

The workspace resolves `@tanstack/octane-table` to the repository adapter while
the example manifest remains release-like.
