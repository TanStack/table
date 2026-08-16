# Solid realtime trading benchmark

This example stresses the current Solid Table adapter with a synthetic market
feed, immutable quote snapshots, fine-grained cell updates, dynamic components,
and browser performance diagnostics.

## Run

```bash
pnpm --dir examples/solid/realtime-trading dev
```

Open `http://localhost:7779`.

Use a production build for performance recordings:

```bash
pnpm --dir examples/solid/realtime-trading build
```

## Architecture

- `createTradingBenchmarkController` owns benchmark metrics and shell actions.
- `market-feed.worker.ts` produces synthetic quote samples outside the main
  thread and coalesces repeated instruments into one row update per message.
- `trading-table.tsx` owns the current Solid Table instance, columns, and cell
  renderers.
- `benchmark/` tracks update latency, render calls, DOM mutations, long frames,
  and heap usage when supported.
- `shell/` owns the terminal layout and benchmark configurator.

The application renders one table implementation directly. Historical adapter
switching and compatibility code are not part of the benchmark.

## Row rendering

The example starts with 100 instruments. Below 250 instruments, the row-rendering
select can compare **Full DOM** with **TanStack Virtual**. At 250 instruments or
more, virtualization is enabled and locked so large row counts cannot
accidentally mount the complete table.

## Workloads

- Stable market snapshots with interactive table sorting.
- Stable or alternating cell component types.
- Optional sparkline and quote-age invalidation.
- Per-instrument Intraday history sampling with a configurable 16–2,000 ms
  worker interval, defaulting to 16 ms for the initial 100-row workload.
- Discrete worker-side sample workloads and explicit sample bursts.

The sample rate controls synthetic quote generation inside the worker; it is not
a browser event or `postMessage` rate. The publish interval separately controls
the target message cadence. The worker coalesces repeated instruments in each
message and posts independently of Solid updates, like an external stream.

## Dependency resolution

The example pins `@tanstack/solid-table` to the current repository version. The
root workspace override resolves it to `packages/solid-table` while preserving a
release-like manifest.

## Verification

```bash
pnpm --dir examples/solid/realtime-trading test:types
pnpm --dir examples/solid/realtime-trading lint
pnpm --dir examples/solid/realtime-trading build
pnpm --dir examples/solid/realtime-trading test:e2e
```
