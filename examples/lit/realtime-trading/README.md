# Lit realtime trading benchmark

Standalone Lit implementation of the shared realtime-trading workload. It owns
its market feed, worker, instruments, benchmark monitor, shell, table config,
custom quote elements, delegated grid interactions, and Lit Virtual setup.

It starts with 100 instruments. Full DOM and TanStack Virtual are selectable
below 250 instruments; virtualization is enabled and locked at 250 or more.

```bash
pnpm --dir examples/lit/realtime-trading dev
pnpm --dir examples/lit/realtime-trading test:types
pnpm --dir examples/lit/realtime-trading lint
pnpm --dir examples/lit/realtime-trading build
```
