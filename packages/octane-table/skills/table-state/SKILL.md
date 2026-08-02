---
name: table-state
description: >
  Read and own Octane Table v9 state with useTable selectors, table.state, table.Subscribe, controlled slices, and @tanstack/octane-store atoms. Load for state ownership, render timing, snapshot-versus-subscription bugs, or fine-grained rendering.
metadata:
  {
    type: framework,
    library: '@tanstack/octane-table',
    library_version: '9.0.0-beta.75',
    framework: octane,
  }
requires: ['@tanstack/table-core#core', getting-started]
sources:
  - 'TanStack/table:docs/framework/octane/guide/table-state.md'
  - 'TanStack/table:examples/octane/basic-subscribe'
  - 'TanStack/table:examples/octane/basic-external-atoms'
  - 'TanStack/table:packages/octane-table/src/useTable.tsrx'
  - 'TanStack/table:packages/octane-table/src/Subscribe.tsrx'
---

This skill builds on `@tanstack/table-core#core` and `getting-started`. Octane has a render/commit split: options are visible to same-render reads, while controlled state is published only from an accepted layout commit.

## State Mental Model

Keep state internal unless another subsystem must read, persist, or drive it. With no `initialState`, `atoms`, `state`, or `on[State]Change`, the table owns every registered state slice.

- `table.baseAtoms` are internal writable atoms initialized from resolved initial state.
- `table.atoms` are readonly derived atoms for the active owner of each registered slice.
- `table.store` is the readonly flat store assembled from those atoms.
- `table.state` contains only the result of the second `useTable` selector.

Only registered features contribute state and types. If pagination is absent, add `rowPaginationFeature`; do not cast around the missing API.

## Setup

```tsrx
function PageStatus() @{
  const table = useTable(
    { features, columns, data },
    (state) => ({ pagination: state.pagination }),
  )

  <output>Page {String(table.state.pagination.pageIndex + 1)}</output>
}
```

The selector shallow-gates owner rerenders and determines the shape of `table.state`. Omitting it selects all registered state.

## Core Patterns

### Fine-grained subscription islands

```tsrx
<table.Subscribe source={table.atoms.rowSelection}>
  {(selection) => <output>{String(Object.keys(selection).length)}</output>}
</table.Subscribe>
```

Render every `Subscribe` call site as a component. Each mounted island gets an independent hook scope and still receives the post-commit update when the owner drops its matching redundant notification.

### External atom ownership

```tsrx
import { useCreateAtom } from '@tanstack/octane-store'

function Grid() @{
  const pagination = useCreateAtom({ pageIndex: 0, pageSize: 20 })
  const table = useTable({ features, columns, data, atoms: { pagination } })
  <button onClick={() => table.nextPage()}>Next</button>
}
```

External atoms are direct synchronous owners. They take precedence over `options.state`, and table API writes reach them.

### Controlled slice ownership

```tsrx
const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 })
const table = useTable({
  features,
  columns,
  data,
  state: { pagination },
  onPaginationChange: setPagination,
})
```

Staged options and callbacks are available during the same render. Controlled state publication waits for the accepted layout commit, so suspended or abandoned work cannot notify subscribers with speculative state.

## Choose State Ownership

Use one owner per slice:

- Prefer internal state and feature APIs when state is local to the table.
- Use `initialState` for starting/reset values; changing it later does not reset current state.
- Prefer a stable `@tanstack/octane-store` atom in `atoms` when state must be shared. Do not pair it with `on[State]Change`.
- Use `state.<slice>` plus its matching callback for a controlled slice. Feed the next value back and handle value-or-updater semantics.

Use feature methods such as `setSorting`, `nextPage`, `toggleVisibility`, and `toggleSelected` for writes. The v8 global `onStateChange` option is gone.

## Common Mistakes

### HIGH Reading snapshots as subscriptions

Wrong:

```tsrx
const page = table.store.state.pagination.pageIndex
```

Correct:

```tsrx
const page = table.state.pagination.pageIndex
```

Store and atom `.get()` reads are current snapshots. Selected `table.state` or a rendered `table.Subscribe` connects an Octane render.

Source: `packages/octane-table/src/useTable.tsrx`

### HIGH Calling Subscribe as a normal function

Wrong:

```tsrx
{table.Subscribe({ source: table.atoms.rowSelection, children: renderCount })}
```

Correct:

```tsrx
<table.Subscribe source={table.atoms.rowSelection}>{renderCount}</table.Subscribe>
```

Direct invocation shares the owner's compiler slots instead of creating an independent component and hook scope.

Source: `packages/octane-table/src/Subscribe.tsrx`

### HIGH Controlling only the callback

Wrong:

```tsrx
useTable({ features, columns, data, onPaginationChange: setPagination })
```

Correct:

```tsrx
useTable({
  features,
  columns,
  data,
  state: { pagination },
  onPaginationChange: setPagination,
})
```

The callback must write into the value supplied for that controlled slice.

Source: `docs/framework/octane/guide/table-state.md`

## API Discovery

Inspect `node_modules/@tanstack/octane-table/dist/useTable.d.ts`, `Subscribe.d.ts`, and `types.d.ts`. Use `@tanstack/octane-store`, not another framework's Store hooks.
