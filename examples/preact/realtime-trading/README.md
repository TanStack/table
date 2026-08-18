# Preact realtime trading benchmark

This standalone example exercises the current TanStack Preact Table adapter
with an immutable high-frequency feed, table interactions, custom components,
virtual rows, and browser diagnostics. It is a rendering stress lab rather than
an exchange or network-latency simulation.

## Run and verify

```bash
pnpm --dir examples/preact/realtime-trading dev
```

Open `http://localhost:7780`.

```bash
pnpm --dir examples/preact/realtime-trading test:types
pnpm --dir examples/preact/realtime-trading lint
pnpm --dir examples/preact/realtime-trading build
pnpm --dir examples/preact/realtime-trading test:e2e
```

Use the production build for measurements; development checks inflate the
absolute cost.

## Structure and ownership

| Path | Responsibility |
| --- | --- |
| `src/feed/` | Market types, instruments, immutable update helpers, config, controller, and controller hook. |
| `src/feed/worker/` | Worker protocol, deterministic market engine, and module worker. |
| `src/benchmark/` | Feed/render timing, DOM/long-frame observers, row-model and component diagnostics. |
| `src/shell/` | TanStack Store contexts, viewport shell, metrics, controls, selected instrument, and diagnostics. |
| `src/table/table-config/` | Grouped columns, row/cell components, and render counters. |
| `src/table/` | Preact Table instance, subscriptions, interactions, column layout, and Virtual Core hook. |
| `src/App.tsx` | Creates the controllers and composes providers, shell, and table. |

Feed state and benchmark state are different controllers. The feed does not
depend on the monitor; the benchmark subscribes to feed lifecycle callbacks.
TanStack Preact Store contexts pass stable controller objects, while components
use selectors for the state slices they actually display. Renderer mode and
selected symbol are separate atoms so their updates do not invalidate unrelated
shell content.

## Feed and worker pipeline

The initial setup is 100 instruments, 10K generated samples/s, 20 ms worker
delivery, enabled intraday charts, and 16 ms chart sampling.

The module worker keeps mutable quote state private. A deterministic PRNG and a
16 ms budget loop generate samples; a `Map` coalesces repeated updates for the
same row. A separate publication timer sends the latest unique row updates at
the configured interval. The main thread creates a new outer array and new
objects only for changed rows, preserving every untouched row reference.
History arrays are replaced only when their sampling interval elapses. Session
IDs reject stale messages after reset or row-count changes.

- **Synthetic quote workload** is worker-side generated samples per second. It
  is not pointer events, renders, or messages.
- **Worker delivery interval** controls coalesced `postMessage` cadence; 20 ms
  targets about 50 messages/s.
- **Row updates** counts unique row snapshots applied on the main thread.
- **Message samples** shows how much generated work the latest message contains.

The 25K burst deliberately creates and flushes one expensive batch. The worker
mimics an external streaming producer, but network transport is not measured.

## Table and interaction architecture

The 14 leaf columns are grouped into Instrument, Price & Change, Order Book,
Session, and Chart. The example supports core sorting/filtering, on-change
resizing, double-click size reset, drag column ordering, row selection, drag
cell ranges, keyboard navigation, and custom Price/Move/Percent/Sparkline cells.
Stable instrument IDs are supplied through `getRowId`.

`table.Subscribe` boundaries isolate table state, resize handles, and row
selection. `TradingGridPointerController` is allocated once for the body and
receives delegated mouse/pointer events. It resolves cells from
`event.composedPath()` and data attributes, eliminating listeners per cell.
Row hover is CSS-only.

Column widths are table-level CSS custom properties updated only when sizing or
ordering changes. Initial sizes expand to the viewport through a
`ResizeObserver`; manual resizing turns off further auto-fit. The optional move
component A/B mode intentionally destroys/recreates component types and should
not be treated as the normal baseline.

## Virtualization

The preference is `auto`, `tanstack`, or `none`:

- below 200 rows, `auto` means Full DOM, while Virtual remains selectable;
- 200–1,499 rows default to TanStack Virtual but can be switched to Full DOM;
- 1,500 or more rows force Virtual and lock the control.

Because this adapter consumes `@tanstack/virtual-core` directly, the local
`useVirtualizer` hook owns the Virtualizer instance and synchronizes its change
notifications with Preact. It uses 32 px rows, 10-row overscan, row IDs as item
keys, transformed rows, and a spacer body. The footer reads the virtualizer
range. Both modes use `content-visibility: auto`; that browser hint does not
avoid mounting every component in Full DOM mode.

## Performance decisions

- worker-side generation and pre-message coalescing;
- structural sharing for unchanged rows and histories;
- stable table/virtualizer keys;
- selector-based Preact Store subscriptions;
- table/row/resize subscription boundaries;
- one delegated grid interaction controller;
- CSS variables for column sizing;
- opt-in component churn and independently sampled sparklines;
- virtual mounting for large row counts;
- benchmark publication slower than the data stream.

The immutable outer array must change when a batch is applied. Stable inner
references reduce renderer work, but sorting/filtering may still require a core
row-model pass when data changes.

## Diagnostics and interpretation

Diagnostics cover worker samples, messages, unique row updates, state applies,
completed renders, average mutation-to-render latency, long animation frames,
mounted hosts, component creation/destruction, cell callbacks by column,
component executions by type, DOM mutation records, row-model timing, and heap
data where supported.

Callback execution does not imply a DOM mutation, and temporary heap growth is
not by itself a leak. Compare identical production configurations and confirm
retention with post-GC heap snapshots. Use browser Performance tooling and
Preact DevTools for call stacks alongside the in-app counters.

## Standalone policy

All feed, worker, instrument, shell, style, and benchmark files are copied into
this directory intentionally. The example can run alone or be moved to
StackBlitz without a shared example package, so common implementation and README
sections are duplicated across adapters by design.

The workspace resolves the pinned `@tanstack/preact-table` dependency to the
repository package while keeping the example manifest release-like.
