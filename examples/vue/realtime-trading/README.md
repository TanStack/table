# Vue realtime trading benchmark

This standalone example applies the same realtime-trading workload used by the
Angular, React, Solid, and Preact examples to the current Vue Table adapter.
It includes the immutable worker feed, sorting/filtering, resizing, drag column
ordering, row and cell selection, dynamic quote components, full-DOM and
TanStack Virtual row rendering and benchmark diagnostics.

## Run

```bash
pnpm --dir examples/vue/realtime-trading dev
```

Open `http://localhost:7781`.

## Structure

- `feed/` owns the copied market data, configuration, instruments, controller,
  protocol, engine, and dedicated Web Worker.
- `benchmark/` owns feed/render timing, lifecycle, DOM mutation, and row-model
  measurements.
- `shell/` owns injected controllers, header, metrics, statusbar, configurator,
  diagnostics, and selected-instrument UI.
- `table/` owns Vue Table, FlexRender components, delegated grid interactions,
  column configuration, and Vue Virtual integration.

The example is self-contained and does not import a shared example package.

## Verification

```bash
pnpm --dir examples/vue/realtime-trading test:types
pnpm --dir examples/vue/realtime-trading lint
pnpm --dir examples/vue/realtime-trading build
pnpm --dir examples/vue/realtime-trading test:e2e
```
