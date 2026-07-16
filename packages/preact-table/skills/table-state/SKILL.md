---
name: table-state
description: >
  Read and own Preact Table v9 state with useTable selectors, selected table.state, table.Subscribe, table.atoms/store, controlled slices, and external Preact Store atoms. Load for snapshot-versus-subscription bugs or state render tuning.
metadata:
  {
    type: framework,
    library: '@tanstack/preact-table',
    library_version: '9.0.0-beta.51',
    framework: preact,
  }
requires: ['@tanstack/table-core#core', getting-started]
sources:
  - 'TanStack/table:docs/framework/preact/guide/table-state.md'
  - 'TanStack/table:examples/preact/basic-subscribe'
  - 'TanStack/table:packages/preact-table/src/useTable.ts'
---

This skill builds on `@tanstack/table-core#core` and `getting-started`. Preact selection resembles React, but imports and store bindings must remain Preact-native.

## State Mental Model

TanStack Table is primarily a state coordinator. Keep state internal unless another subsystem needs to read, persist, or drive it. With no `initialState`, `atoms`, `state`, or `on[State]Change`, the table owns every registered state slice.

- `table.baseAtoms` are internal writable atoms initialized from resolved initial state.
- `table.atoms` are readonly derived atoms for the active owner of each registered slice.
- `table.store` is the readonly flat store assembled from those atoms.
- `table.state` contains only the result of the second `useTable` selector.

Only registered features contribute state and types. If pagination is absent from `table.atoms`, `table.store`, `table.state`, or table options, add `rowPaginationFeature`; do not cast around the missing API. Keep `features`, `data`, and `columns` stable across renders.

## Setup

```tsx
const table = useTable({ features, columns, data }, (state) => ({
  pagination: state.pagination,
}))
return <output>{table.state.pagination.pageIndex + 1}</output>
```

The selector determines rerenders and the shape exposed on `table.state`; omission selects all registered slices.

## Core Patterns

### Fine-grained Preact subscription

```tsx
return (
  <table.Subscribe source={table.atoms.rowSelection}>
    {(selection) => <output>{Object.keys(selection).length}</output>}
  </table.Subscribe>
)
```

### External atom ownership

```tsx
import { useCreateAtom } from '@tanstack/preact-store'
const pagination = useCreateAtom({ pageIndex: 0, pageSize: 20 })
const table = useTable({ features, columns, data, atoms: { pagination } })
```

## Choose State Ownership

Use one owner per slice:

- Prefer internal state and feature APIs when state is local to the table.
- Use `initialState` for starting/reset values; changing it later does not reset current state.
- Prefer a stable `@tanstack/preact-store` atom in `atoms` when state must be shared. Do not pair it with `on[State]Change`.
- Use `state.<slice>` and the matching callback for simple controlled state. Feed the next value back and handle value-or-updater semantics.

External atoms win over external `state`, which syncs into the internal base atom. Do not use two owners intentionally. The v8 global `onStateChange` option is gone; control slices individually or subscribe to `table.store`.

## Initialize, Update, and Reset

Use feature methods (`setSorting`, `nextPage`, `toggleVisibility`, `toggleSelected`) for writes. Write `baseAtoms` only as a rare low-level escape hatch for internal state; write the external atom when it owns the slice.

```tsx
table.resetSorting() // reset to table.initialState.sorting
table.resetPagination()
table.resetPagination(true) // reset to the feature default
```

Slice resets can update an external owner. Core `table.reset()` only resets internal base atoms. Import types such as `PaginationState` for one slice and use `TableState<typeof features>` when a full feature-inferred state type is actually needed.

## Common Mistakes

### HIGH Reading snapshots as subscriptions

Wrong:

```tsx
const page = table.store.state.pagination.pageIndex
```

Correct:

```tsx
const page = table.state.pagination.pageIndex
```

Store and atom `.get()` reads are snapshots; selected `table.state` or `Subscribe` connects a Preact render.

Source: `packages/preact-table/src/useTable.ts`

### HIGH Controlling only the callback

Wrong:

```tsx
useTable({ features, columns, data, onPaginationChange: setPagination })
```

Correct:

```tsx
useTable({
  features,
  columns,
  data,
  state: { pagination },
  onPaginationChange: setPagination,
})
```

The callback must write into the value supplied for that controlled slice.

Source: `docs/framework/preact/guide/table-state.md`

### MEDIUM Narrowing away rendered dependencies

Wrong:

```tsx
const table = useTable(options, (state) => ({ pagination: state.pagination }))
return table.getSelectedRowModel().rows.length
```

Correct:

```tsx
const table = useTable(options, (state) => ({
  pagination: state.pagination,
  rowSelection: state.rowSelection,
}))
return table.getSelectedRowModel().rows.length
```

If render output depends on selection, the owning render boundary must subscribe to it directly or via `Subscribe`.

Source: `examples/preact/basic-subscribe`

## API Discovery

Inspect `node_modules/@tanstack/preact-table/src/useTable.ts` and `Subscribe.tsx`; use `@tanstack/preact-store` rather than React Store hooks.
