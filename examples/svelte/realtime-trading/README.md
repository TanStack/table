# Svelte realtime trading benchmark

This standalone example applies the shared realtime-trading workload to the
TanStack Svelte Table adapter. It includes the immutable worker feed, sortable
headers, column resizing and drag ordering, delegated row and cell selection,
dynamic quote components, and Full DOM or TanStack Virtual row rendering.

It starts with 100 instruments. Full DOM and TanStack Virtual are selectable
below 250 instruments; virtualization is enabled and locked at 250 or more.

```bash
pnpm --dir examples/svelte/realtime-trading dev
pnpm --dir examples/svelte/realtime-trading test:types
pnpm --dir examples/svelte/realtime-trading lint
pnpm --dir examples/svelte/realtime-trading build
```
