# React realtime trading benchmark

This example stresses the current React Table adapter with a synthetic market
feed, immutable quote snapshots, core sorting/filtering, dynamic cells, React
Profiler measurements, and automated scroll pressure.

## Run

```bash
pnpm --dir examples/react/realtime-trading dev
```

Open `http://localhost:7778`.

Use the profiling production build when recording React commit timings:

```bash
pnpm --dir examples/react/realtime-trading build:profile
```

## Architecture

- `TradingBenchmarkController` uses TanStack Store for application state and
  exposes dedicated atoms for table and cell subscriptions.
- `market-feed.worker.ts` produces synthetic quote samples outside the main
  thread and coalesces repeated instruments into one row update per message.
- `trading-table.tsx` owns the current React Table instance and its subscription
  boundaries.
- `trading-table-shared.tsx` owns columns, row rendering, and row-model timing.
- `benchmark/` owns React Profiler, User Timing, DOM mutation, long-frame, and
  scroll-pressure diagnostics.
- `shell/` owns the trading-terminal layout and benchmark controls.

There is one table implementation. The shell and application root do not
subscribe to or switch between historical adapters.

## React Compiler

The Vite build enables React Compiler. The current adapter is compiled normally;
the historical compatibility module and its `use no memo` boundary have been
removed.

## Workloads

- Stable market snapshots with sorting and filtering handled by the table.
- Core Table sorting and filtering controlled through table atoms.
- Stable or alternating cell component types.
- Vertical, horizontal, or combined automated scrolling.
- Per-column renderer and per-component render invocation rates.
- Per-instrument Intraday history sampling with a configurable 100–2,000 ms
  worker interval.

The sample rate controls synthetic quote generation inside the worker; it is not
a browser event or `postMessage` rate. The publish interval separately controls
the target message cadence. The worker coalesces repeated instruments in each
message and posts independently of React render completion, like an external
stream.

## Dependency resolution

The example pins `@tanstack/react-table` to the current repository version. The
root workspace override resolves it to `packages/react-table` while preserving a
release-like manifest.

## Verification

```bash
pnpm --dir examples/react/realtime-trading test:types
pnpm --dir examples/react/realtime-trading lint
pnpm --dir examples/react/realtime-trading build
pnpm --dir examples/react/realtime-trading test:e2e
```
