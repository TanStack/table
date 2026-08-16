# Angular realtime trading benchmark

This example stresses the current Angular Table adapter with a synthetic market
feed, immutable quote snapshots, dynamic cell components, row-model workloads,
and optional row virtualization.

## Run

```bash
pnpm --dir examples/angular/realtime-trading dev
```

Open `http://localhost:7777`.

Use a production build for performance recordings:

```bash
pnpm --dir examples/angular/realtime-trading build
```

## Architecture

- `TradingBenchmarkController` owns feed state, benchmark controls, derived
  quote snapshots, and diagnostics.
- `market-feed.worker.ts` produces synthetic quote samples outside the main
  thread. Multiple samples for the same instrument are coalesced into one row
  update per published message.
- `CurrentTradingTable` renders the current Angular Table implementation.
- `WorkerTradingTable` uses the same columns and template while moving the
  filtered row-model stage to the experimental table worker plugin.
- `trading-row-virtualizer.ts` integrates TanStack Virtual and reports the
  visible and mounted row ranges.
- Components under `shell/` own the surrounding terminal UI and inject the
  controller directly.

The application root only selects between the normal and worker-backed current
table. There are no historical adapter implementations in this benchmark.

The Angular 22 application is zoneless by default. Components use signal
inputs, outputs, queries and derived state; resource cleanup is registered with
`DestroyRef`, and no `ngOnInit`, `ngOnDestroy`, `@HostBinding`, or
`@HostListener` hooks are used.

## Row rendering

The example starts with 100 instruments. The row count and the row-rendering
control select the rendering path:

- Below 250 instruments, **TanStack Virtual** can be enabled or disabled to
  compare it with **Full DOM**.
- At 250 instruments or more, **TanStack Virtual** is enabled and locked. It
  mounts a keyed overscan window and positions rows with a transform.
- Both paths apply `content-visibility: auto` and a fixed intrinsic row height;
  the Full DOM path can therefore skip offscreen browser rendering without
  avoiding framework work or DOM creation.

Angular CDK scrolling is intentionally not part of this example.

## Feed rate

The configured sample rate controls synthetic quote generation inside the
worker. It is not a browser event or `postMessage` rate. The publish interval
separately controls the target message cadence. The worker coalesces repeated
instruments in each message and posts independently of render completion, like
an external stream. Random seeds stay private to the feed engine.

## Workloads

- The market-data universe preserves row order and IDs.
- **Swap Tick component A ↔ B** exercises component destruction and creation.
- Sparkline and quote-age toggles control high-frequency component input
  invalidation.
- Intraday history is sampled independently per instrument in the worker. Its
  sampling interval is configurable from 16 ms to 2,000 ms and defaults to
  16 ms for the initial 100-row workload.

## Dependency resolution

The example pins `@tanstack/angular-table` to the current repository version.
The root workspace override resolves that dependency to `packages/angular-table`
while preserving a release-like manifest.

## Verification

```bash
pnpm --dir examples/angular/realtime-trading test:types
pnpm --dir examples/angular/realtime-trading lint
pnpm --dir examples/angular/realtime-trading build
pnpm --dir examples/angular/realtime-trading test:e2e
```
