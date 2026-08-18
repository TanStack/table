# Svelte realtime trading benchmark

This standalone example exercises the current TanStack Svelte Table adapter
with a high-frequency worker feed, immutable market snapshots, interactive
columns, custom Svelte cells, virtual rows, and browser diagnostics. It is a
repeatable rendering workload rather than an exchange/network simulator.

## Run and verify

```bash
pnpm --dir examples/svelte/realtime-trading dev
```

Open `http://localhost:7782`.

```bash
pnpm --dir examples/svelte/realtime-trading test:types
pnpm --dir examples/svelte/realtime-trading lint
pnpm --dir examples/svelte/realtime-trading build
pnpm --dir examples/svelte/realtime-trading test:e2e
```

Use a production build for performance recordings.

## Structure and ownership

| Path | Responsibility |
| --- | --- |
| `src/feed/` | Market model, instrument universe, feed config, immutable updates, and feed controller. |
| `src/feed/worker/` | Typed worker protocol, deterministic engine, and module worker. |
| `src/benchmark/` | Browser monitor, benchmark controller, table observer, and row-model timing. |
| `src/shell/` | Svelte context plus separate header, metrics, configurator, diagnostics, selected-instrument, and status components. |
| `src/table/table-config/` | Grouped columns and dedicated Price/Move/Percent/Sparkline Svelte components. |
| `src/table/` | Svelte Table setup, table view, delegated interactions, column layout, and Svelte Virtual integration. |
| `src/App.svelte` | Creates/provides controllers and starts/stops them with the app lifecycle. |

The feed and benchmark are separate controllers. The feed owns worker state and
quotes; the benchmark registers observers and owns metrics/view controls.
Svelte context passes those controllers without routing the quote array through
the root component. Shell pieces subscribe only to the stores they display.

## Feed and worker pipeline

The default is 100 instruments, 10K generated samples/s, 20 ms delivery,
enabled intraday charts, and 16 ms chart sampling.

Worker-private mutable quotes are changed by a deterministic 16 ms budget loop.
A row-indexed `Map` coalesces repeated instrument changes. An independent timer
publishes the latest unique rows at the selected cadence. Applying a message
creates a new outer array and new objects only for changed rows; untouched rows
and unsampled histories retain their references. Session IDs prevent late
messages from an old reset/row-count session from entering current state.

- **Synthetic quote workload** is worker-side generated samples/s, not messages
  or Svelte updates.
- **Worker delivery interval** controls coalesced messages; 20 ms targets around
  50 messages/s.
- **Row updates** counts unique immutable row objects applied.
- **Message samples** is the generated work represented by the latest message.

Intraday history sampling is independent. The 25K burst deliberately publishes
one heavy batch. This resembles an upstream stream but excludes network delay.

## Svelte table architecture

The 14 leaf columns are grouped into Instrument, Price & Change, Order Book,
Session, and Chart. Sorting/filtering, on-change resizing, double-click reset,
drag column ordering, row selection, drag cell ranges, keyboard navigation,
CSS-only hover, and component-based quote cells are included.

`TradingTable.svelte` owns the view, while `trading-table.ts` and
`table-config/` isolate table construction and columns. Stable instrument IDs
back row identity. The custom quote components make component executions and
lifecycle churn measurable; the A/B move mode intentionally changes component
type and is not the normal rendering baseline.

Selection uses one delegated body-level interaction controller and resolves
cells from `composedPath()` plus data attributes. Column dimensions are CSS
custom properties updated only for sizing/order. A `ResizeObserver` performs
initial fitting and yields after the user resizes.

## Virtualization

- Below 200 rows, automatic mode chooses Full DOM, but Virtual can be enabled.
- From 200 through 1,499 rows, automatic mode chooses TanStack Virtual and Full
  DOM remains selectable.
- At 1,500 rows or more, Virtual is forced and the control is disabled.

Svelte Virtual uses a 32 px estimate, 10-row overscan, row IDs for item keys,
transformed rows, and a spacer body. The virtualizer range feeds the current-row
footer. Both modes use `content-visibility: auto`; Full DOM still creates every
Svelte row/cell even if the browser skips offscreen paint/layout work.

## Performance decisions

- worker generation and pre-message coalescing;
- immutable structural sharing for unchanged rows/history;
- controller context instead of root-level data prop drilling;
- stable keyed row identity;
- table/config/cell component boundaries with localized store reads;
- delegated pointer selection and CSS hover;
- CSS variables for column width propagation;
- configurable chart frequency and opt-in component churn;
- virtual mounting for larger row sets;
- low-frequency metric publication relative to feed updates.

Publishing immutable state necessarily changes the outer array. Stable inner
references reduce downstream work, but sorting/filtering can still require a
new table row-model pass.

## Diagnostics and interpretation

The benchmark reports generated samples, worker messages, unique row updates,
state applies, table commits, average mutation-to-render latency, long animation
frames, mounted hosts, component lifecycle/execution rates, callbacks by
column, DOM mutation records, row-model timing, and optional heap information.

Renderer callbacks and DOM mutations measure different layers. Heap growth is
not automatically a leak; verify retained objects after GC. Use identical
production settings, Chrome Performance, and Svelte DevTools when comparing
runs.

## Standalone policy

This directory deliberately contains copies of the feed, worker, instruments,
benchmark, shell, styles, and table code. It can run independently or be copied
to StackBlitz, so shared code and README sections are repeated across adapters
by design.

The workspace resolves the pinned `@tanstack/svelte-table` dependency to the
local adapter package while preserving a release-like manifest.
