# Alpine realtime trading benchmark

Standalone Alpine implementation of the common realtime-trading workload. The
feed, worker, instruments, benchmark monitor, shell state, table configuration,
custom quote elements, delegated grid interactions, and Virtual Core instance
all live in this example folder.

```bash
pnpm --dir examples/alpine/realtime-trading dev
pnpm --dir examples/alpine/realtime-trading test:types
pnpm --dir examples/alpine/realtime-trading lint
pnpm --dir examples/alpine/realtime-trading build
```
