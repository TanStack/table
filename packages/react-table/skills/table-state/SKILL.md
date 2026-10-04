---
name: table-state
description: Read and control Table v9 state in react. Use for tracked reads, subscriptions, controlled slices, and framework-specific reactive boundaries.
metadata:
  type: framework
  library: '@tanstack/react-table'
  library_version: '9.2.6'
  framework: react
requires:
  - '@tanstack/table-core#table-state'
sources:
  - TanStack/table:docs/framework/react/guide/table-state.md
  - TanStack/table:docs/framework/react/guide/react-compiler.md
  - TanStack/table:examples/react/basic-subscribe
  - TanStack/table:packages/react-table/src/Subscribe.ts
  - TanStack/table:packages/react-table/src/useTable.ts
---

# React table state

Before starting, run `intent load @tanstack/table-core#table-state` for shared ownership, initialization, updates, and resets. State repair does not require loading setup guidance.

## Read reactive state

`useTable` selects all registered state by default. Its optional second-argument selector controls rerenders and the shape of `table.state`. `table.atoms.<slice>.get()` and `table.store.state` are current snapshots, not React subscriptions.

Use selected `table.state` in the owner render. For narrower boundaries, use `table.Subscribe` or `useSelector` from `@tanstack/react-store`. Without `source`, `table.Subscribe` selects from `table.store`; with `source`, it subscribes to that atom or store. Start with the default selector until render cost requires narrowing.

## Control a slice

Keep features, columns, and data stable. Register the feature that owns the controlled slice. This example controls pagination without adding client row processing:

```tsx
import { useState } from 'react'
import {
  rowPaginationFeature,
  tableFeatures,
  useTable,
  type PaginationState,
} from '@tanstack/react-table'

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

The React setter accepts both a value and a functional updater. Supply the current `state.pagination` together with `onPaginationChange`; a callback alone does not keep the table synchronized.

For an externally owned atom, create it with `useCreateAtom` from `@tanstack/react-store`, pass it in `atoms.<slice>`, and subscribe with `useSelector` where other UI needs its value.

## Reactive boundaries

For React Compiler memoized children, put `Subscribe` inside the component hiding builder-method reads or pass the selected value as a changing prop. An outer subscription that ignores its value cannot refresh a stable child. In core-typed cell/header contexts, import standalone `Subscribe`.

For external-atom examples, selector dependencies, or fine-grained boundaries and React Compiler problems, read [reactivity details](references/reactivity.md). If this task changes processing features, run `intent load @tanstack/table-core#table-features` and read the relevant feature references.

## API discovery

Inspect `node_modules/@tanstack/react-table/dist/useTable.d.ts` and `Subscribe.d.ts`, plus the installed `@tanstack/react-store` declarations for atom hooks.
