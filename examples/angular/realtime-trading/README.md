# Angular realtime trading benchmark

This is a standalone stress example for the current TanStack Angular Table
adapter. It combines a high-frequency synthetic market feed, immutable row
snapshots, sortable and resizable columns, range selection, dynamic Angular
cell components, optional row virtualization, and browser performance
instrumentation.

The goal is not to reproduce an exchange. It is to provide a repeatable grid
workload in which feed generation, message delivery, state application, table
work, Angular rendering, and browser layout can be measured separately.

## Run and verify

```bash
pnpm --dir examples/angular/realtime-trading dev
```

Open `http://localhost:7777`.

Use a production build before recording representative timings:

```bash
pnpm --dir examples/angular/realtime-trading build
pnpm --dir examples/angular/realtime-trading test:types
pnpm --dir examples/angular/realtime-trading lint
pnpm --dir examples/angular/realtime-trading test:e2e
```

Development mode includes Angular assertions and extra benchmark bookkeeping,
so its absolute timings should not be compared with a production build.

## Directory structure

| Path                          | Responsibility                                                                                                             |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `src/app/feed/`               | Market types, the instrument universe, feed configuration, immutable update helpers, and the Angular feed service.         |
| `src/app/feed/worker/`        | Worker protocol, deterministic market engine, and the module Web Worker that generates and publishes quote updates.        |
| `src/app/benchmark/`          | Performance monitor and the controller that connects feed lifecycle events to UI diagnostics.                              |
| `src/app/shell/`              | Full-viewport layout, header, metrics strip, sidebar configurator, selected-instrument panel, diagnostics, and status bar. |
| `src/app/table/table-config/` | Grouped column definitions and custom quote cell components.                                                               |
| `src/app/table/view/`         | Header component plus table-level selection and cell host directives.                                                      |
| `src/app/table/`              | Current table, table interactions, initial column fitting, and the TanStack Virtual integration.                           |
| `src/app/table/worker/`       | Optional experimental table-worker implementation and its row-model worker.                                                |
| `src/app/app.ts`              | Composition root; it projects only the selected table implementation into the shell.                                       |

The feed, benchmark, shell, and table layers are deliberately separate. The
feed can run without the benchmark monitor, and shell components inject only
the controller or service whose state they display.

## Data and worker pipeline

The initial configuration is 100 instruments, 10K generated samples per
second, a 20 ms delivery interval, enabled intraday charts, and 16 ms intraday
sampling.

1. `MarketFeedService` creates a module worker and sends the current
   configuration.
2. `market-feed-engine.ts` owns mutable quote state inside the worker. A
   deterministic PRNG and stable instrument IDs keep runs reproducible.
3. A 16 ms generation loop accrues a fractional sample budget and applies the
   requested synthetic workload to the worker-owned quotes.
4. Updated instruments are stored in a `Map` by row index. Repeated updates to
   one instrument are coalesced, retaining its latest value.
5. A separate publication timer posts one message at the configured delivery
   interval. Generation rate and message rate are therefore independent.
6. The main thread creates a new outer quotes array and replaces only the row
   objects included in the message. Unchanged rows retain their references.
7. A session ID rejects messages from an obsolete worker configuration after a
   reset or instrument-count change.

The terms in the UI are intentionally distinct:

- **Synthetic quote workload** is generated samples per second inside the
  worker. It is not DOM events, table renders, or `postMessage` calls.
- **Worker delivery interval** is the target cadence for coalesced messages.
  For example, 20 ms targets roughly 50 messages per second.
- **Row updates** is the number of unique immutable row objects applied on the
  main thread. It can be lower than generated samples because of coalescing.
- **Message samples** is the number of generated samples represented by the
  latest delivered batch.

Intraday history is sampled independently of quote generation. Its interval
controls how frequently a row receives a new history array; other quote fields
can continue changing between history samples. The 25K burst command generates
and flushes one intentionally expensive batch immediately.

The worker is analogous to an upstream WebSocket/SSE producer, but it is not a
network benchmark: serialization, browser worker messaging, main-thread state
application, and rendering are in scope; network latency is not.

## Angular state and rendering architecture

- `MarketFeedService` owns feed signals and worker lifecycle.
- `TradingBenchmarkController` owns benchmark-only state, selected symbol,
  renderer mode, virtualization preference, and derived metrics.
- The application is zoneless and uses signal inputs, outputs, queries,
  `computed`, `effect`, `DestroyRef`, and `OnPush` components.
- The root component does not subscribe to individual diagnostics. It only
  chooses the normal or experimental worker-backed table and supplies the same
  signal values to it.
- Custom cells are declared with `flexRenderComponent` only where an Angular
  component is required. Plain columns remain plain render callbacks.
- Stable row IDs come from the instrument ID, so sorting and updates do not
  make row identity depend on the current array position.

The optional **table worker** is separate from the market-feed worker. The feed
worker always produces market data; the table worker moves the supported
row-model work off the main thread. Both table paths intentionally have their
own column configuration boundary so component render tokens stay explicit.

## Table behavior

The grid has 14 leaf columns grouped into Instrument, Price & Change, Order
Book, Session, and Chart sections. It supports:

- core sorting and filtering;
- on-change column resizing, including double-click reset;
- drag-and-drop leaf-column ordering with a visible drop target;
- CSS-only row hover;
- click/modified-click row selection;
- mouse-drag cell range selection and keyboard navigation;
- custom Price, Move, Percent Change, and Sparkline components;
- a stress mode that swaps the move component type when direction changes,
  intentionally exercising destruction and recreation.

Selection events are delegated once at the table boundary by
`TradingGridSelectionDirective`. It resolves a cell from `event.composedPath()`
and data attributes, avoiding a `mousedown`/move listener per cell. The cell
directive uses signal inputs and host properties for width, focus, ARIA, and
selection-edge attributes; it does not toggle CSS classes imperatively.

Column sizes are written to table-level CSS custom properties. Cells reference
those variables rather than recomputing an inline pixel width during every
quote update. A `ResizeObserver` expands the initial column sizes to available
width; manual resizing disables subsequent automatic fitting.

## Full DOM and virtual rows

The internal preference is `auto`, `tanstack`, or `none`:

- Below 200 rows, `auto` resolves to **Full DOM**, but virtualization remains
  manually selectable.
- From 200 through 1,499 rows, `auto` resolves to **TanStack Virtual**, and the
  user may still switch back to Full DOM.
- At 1,500 rows or more, virtualization is forced and the control is locked to
  prevent an accidental full-table mount.

TanStack Virtual uses a fixed 32 px estimate, 10-row overscan, instrument row
IDs as item keys, cached measurements, and transformed rows inside a body-sized
spacer. Only the visible overscan window creates Angular row views. The footer
reads the virtualizer range and reports the current row interval.

The Angular virtualizer disables application-wide ticks and schedules a local
`detectChanges()` flush for virtualizer changes. This confines scroll-driven
updates to the table instead of checking the complete application shell.

Both Full DOM and virtual rows use `content-visibility: auto` with a matching
intrinsic block size. In Full DOM this may save browser style/layout/paint work,
but Angular still creates every row and cell. In virtual mode it is an
additional browser hint; virtualization remains the mechanism that limits
mounted views.

## Performance decisions

- Market calculations execute off the main thread.
- Repeated worker samples are coalesced before crossing the worker boundary.
- Immutable snapshots preserve unchanged row and history references.
- Stable row IDs and keyed `@for` blocks preserve row identity.
- High-frequency selection input is delegated at the table, not bound per
  cell.
- Column widths use CSS variables and update only on sizing/order changes.
- Shell widgets read narrow signal state and do not make the root consume the
  complete feed.
- Dynamic component churn is opt-in; the stable renderer is the realistic
  baseline.
- Virtualization limits framework and DOM work for larger data sets.
- Benchmark metrics publish at a lower cadence than the data feed.

`content-visibility`, worker generation, and virtualization solve different
problems. None of them prevents the table core from rebuilding a sorted or
filtered row model when its data/state inputs require it.

## Diagnostics

The benchmark layer observes the feed through callbacks, so it can be removed
without changing feed semantics. It reports:

- generated worker samples, unique row updates, received messages, and state
  applies;
- completed table renders and average mutation-to-render latency;
- long animation frames and worst duration when the browser supports the Long
  Animation Frames API;
- mounted cell hosts and live/created/destroyed dynamic components;
- cell-render callbacks by column and component executions by type;
- DOM mutation records from a `MutationObserver`;
- core row-model call rate and average/maximum duration;
- heap information where the browser exposes it.

Renderer callback counts are not DOM mutation counts. A callback can execute
and still reuse a component/view, while a component execution count records the
framework component path itself. Heap growth during the swap stress mode is not
automatically a leak: garbage collection is nondeterministic, so retained
objects must be confirmed with repeated heap snapshots after GC and a stable
workload.

Use Chrome Performance/Angular DevTools for call stacks and frame analysis, and
the in-app diagnostics for controlled comparisons. Keep row count, workload,
delivery interval, renderer mode, and virtual mode identical between runs.

## Standalone example policy

This folder intentionally contains its own instruments, feed engine, worker,
benchmark monitor, styles, and UI instead of importing a shared demo package.
That duplication lets the example run independently and be copied to
StackBlitz. Shared concepts and some README text are therefore repeated across
adapter examples by design.

The package pins `@tanstack/angular-table` to the repository version. The root
workspace override resolves it to `packages/angular-table` while retaining a
release-like example manifest.
