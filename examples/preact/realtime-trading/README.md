# Preact realtime trading benchmark

This standalone example stresses the current Preact Table adapter with an
immutable synthetic market feed, core sorting/filtering, dynamic cells,
virtualized rows, selection, and column resizing/reordering.

## Run

```bash
pnpm --dir examples/preact/realtime-trading dev
```

Open `http://localhost:7780`.

## Architecture

- `feed/` owns the market controller, immutable quote snapshots, instruments,
  configuration, and the dedicated feed worker.
- `benchmark/` owns User Timing, DOM mutation, long-frame, and renderer-call
  diagnostics.
- `shell/` owns the full-viewport terminal layout and benchmark controls.
- `table/` owns the Preact Table instance, table configuration, delegated grid
  interactions, row rendering, and the local `@tanstack/virtual-core` hook.

All files required by the example are copied into this folder. It does not
import a shared example package.

The example starts with 100 instruments. Below 250 instruments, row rendering
can switch between **Full DOM** and **TanStack Virtual**. At 250 instruments or
more, virtualization is enabled and locked.

The sample-rate control represents synthetic quote generation inside the
worker, not browser events or worker messages. The publish interval controls
message cadence independently, and repeated instruments are coalesced into one
row update per message.

## Verification

```bash
pnpm --dir examples/preact/realtime-trading test:types
pnpm --dir examples/preact/realtime-trading lint
pnpm --dir examples/preact/realtime-trading build
pnpm --dir examples/preact/realtime-trading test:e2e
```
