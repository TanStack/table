---
name: table-state
description: Read and control Table v9 state in preact. Use for tracked reads, subscriptions, controlled slices, and framework-specific reactive boundaries.
metadata:
  type: framework
  library: '@tanstack/preact-table'
  library_version: '9.3.0'
  framework: preact
requires:
  - '@tanstack/table-core#table-state'
sources:
  - TanStack/table:docs/framework/preact/guide/table-state.md
  - TanStack/table:examples/preact/basic-subscribe
  - TanStack/table:packages/preact-table/src/useTable.ts
---

# Preact table state

Before starting, run `intent load @tanstack/table-core#table-state` for shared ownership, initialization, updates, and resets. State repair does not require loading setup guidance.

## Read reactive state

`useTable` selects all registered state by default. Its optional second-argument selector controls rerenders and the shape of `table.state`. `table.atoms.<slice>.get()` and `table.store.state` are current snapshots, not Preact subscriptions.

Use selected `table.state` in the owner render. For narrower boundaries, use `table.Subscribe` or `useSelector` from `@tanstack/preact-store`. Without `source`, `table.Subscribe` selects from `table.store`; with `source`, it subscribes to that atom or store. Start with the default selector until render cost requires narrowing.

## Control a slice

Keep features, columns, and data stable. Register the feature that owns the controlled slice. This example controls pagination without adding client row processing:

```tsx
import { useState } from 'preact/hooks'
import {
  rowPaginationFeature,
  tableFeatures,
  useTable,
  type PaginationState,
} from '@tanstack/preact-table'

const features = tableFeatures({ rowPaginationFeature })
const columns = [{ accessorKey: 'name' }]
const data = [{ name: 'Ada' }]

export function PageControl() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })
  const table = useTable({
    features,
    columns,
    data,
    state: { pagination },
    onPaginationChange: setPagination,
  })
  return (
    <button onClick={() => table.setPageSize(50)}>
      {table.state.pagination.pageSize} rows per page
    </button>
  )
}
```

The Preact setter accepts both a value and a functional updater. Supply the current `state.pagination` together with `onPaginationChange`; a callback alone does not keep the table synchronized.

For an externally owned atom, create it with `useCreateAtom` from `@tanstack/preact-store`, pass it in `atoms.<slice>`, and subscribe with `useSelector` where other UI needs its value.

## Reactive boundaries

Use native `@tanstack/preact-store` bindings. A narrowed selector must include every state slice used by rendered builder methods, or those consumers need their own subscription.

For external-atom examples, selector dependencies, or fine-grained boundaries, read [reactivity details](references/reactivity.md). If this task changes processing features, run `intent load @tanstack/table-core#table-features` and read the relevant feature references.

## API discovery

Inspect `node_modules/@tanstack/preact-table/dist/useTable.d.ts` and `Subscribe.d.ts`, plus the installed `@tanstack/preact-store` declarations for atom hooks.
