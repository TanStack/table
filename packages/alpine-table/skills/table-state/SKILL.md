---
name: table-state
description: >
  Read automatically reactive Alpine table APIs in bindings and own slices with Alpine.reactive getters plus on*Change or external TanStack Store atoms. Load for controlled state, updater callbacks, selector gating, atom precedence, or code incorrectly adding table.Subscribe.
metadata:
  type: framework
  library: '@tanstack/alpine-table'
  framework: alpine
  library_version: '9.0.0-beta.49'
requires:
  - '@tanstack/table-core#core'
  - getting-started
sources:
  - 'TanStack/table:docs/framework/alpine/guide/table-state.md'
  - 'TanStack/table:examples/alpine/basic-create-table'
  - 'TanStack/table:packages/alpine-table/src/createTable.ts'
---

This skill builds on @tanstack/table-core#core and this package's getting-started skill.

## State Mental Model

TanStack Table is primarily a state coordinator. Keep state internal unless another system needs to read, persist, or drive it. Without `initialState`, `atoms`, `state`, or `on[State]Change`, the table owns all registered slices.

- `table.baseAtoms` are internal writable atoms initialized from resolved initial state.
- `table.atoms` are readonly derived atoms for the active owner of each registered slice.
- `table.store` combines those atoms into one readonly flat store.

The Alpine adapter proxies the table and subscribes it to the store. Reads inside `x-text`, `x-for`, `x-if`, bound attributes, `x-effect`, or Alpine getters are reactive automatically; event handlers read the current value when invoked. State is feature-based, so missing state or methods usually mean the feature was not registered. Keep `features`, `columns`, and source `data` stable; expose changing reactive data through a getter rather than filtering, mapping, or slicing inside table options.

## Setup

```ts
import Alpine from 'alpinejs'
import {
  createTable,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/alpine-table'
import type { PaginationState } from '@tanstack/alpine-table'

const features = tableFeatures({ rowPaginationFeature })

Alpine.data('pagedTable', () => {
  const local = Alpine.reactive<{ pagination: PaginationState }>({
    pagination: { pageIndex: 0, pageSize: 10 },
  })
  const table = createTable({
    features,
    columns: [],
    data: [],
    state: {
      get pagination() {
        return local.pagination
      },
    },
    onPaginationChange: (updater) => {
      local.pagination =
        typeof updater === 'function' ? updater(local.pagination) : updater
    },
  })

  return { table }
})
```

## Core Patterns

### Read narrow atoms in bindings

Use `table.atoms.pagination.get().pageIndex` for a narrow state read. The proxy registers the binding as reactive.

### Use a selector only to gate broad proxy updates

The optional second `createTable` argument shallow-compares selected state. Use `() => ({})` only when explicit atom subscriptions handle high-frequency updates such as resizing.

### Choose one owner per slice

Use either an external atom through `atoms.pagination` or Alpine-controlled `state.pagination` plus `onPaginationChange`. An external atom wins if both are supplied.

## Choose State Ownership

- Prefer internal state and feature APIs for table-local interaction.
- Use `initialState` only for starting/reset values; changing it later does not reset current state.
- Prefer a stable external atom in `atoms` when state is shared. Feature APIs write it directly, so omit `on[State]Change`.
- Use an `Alpine.reactive` value exposed through a getter plus its matching callback for simple controlled state. Resolve raw values and updater functions.

External atoms take precedence over external `state`, which syncs into the internal base atom. Do not rely on multiple owners. The global v8 `onStateChange` option is gone; subscribe to `table.store` to observe the complete state.

## Initialize, Update, and Reset

Prefer feature methods such as `setSorting`, `nextPage`, `toggleVisibility`, and `toggleSelected`. Direct `baseAtoms` writes are a rare escape hatch for internal state; write the external atom when it owns a slice.

```ts
table.resetSorting()
table.resetPagination()
table.resetPagination(true)
```

Feature resets use `table.initialState` unless `true` requests the feature default and can update external owners. Core `table.reset()` resets internal base atoms only. Use feature-specific types such as `PaginationState`; use `TableState<typeof features>` for the full state inferred from registered features.

## Common Mistakes

### HIGH Inventing a Subscribe component

Wrong: render a nonexistent `table.Subscribe` wrapper.

Correct: read the relevant table API directly in an Alpine binding.

The Alpine adapter makes proxied table reads reactive; it has no component render boundary.

Source: TanStack/table:docs/framework/alpine/guide/table-state.md

### HIGH Controlled snapshot never refreshes

Wrong: set `state: { pagination: local.pagination }` and later replace `local.pagination`.

Correct: define a getter for the controlled slice and apply each updater back to `local.pagination`.

The adapter effect must read the current reactive value to reapply options.

Source: TanStack/table:packages/alpine-table/src/createTable.ts

### MEDIUM State and atom owners conflict

Wrong: pass both `state.pagination` and `atoms.pagination` expecting two-way synchronization.

Correct: select one ownership mechanism; when an atom owns the slice, write the external atom.

The derived table atom reads the external atom before controlled or internal state.

Source: TanStack/table:docs/framework/alpine/guide/table-state.md

## API Discovery

Inspect `node_modules/@tanstack/alpine-table/src/createTable.ts` and `reactivity.ts`. Inspect `node_modules/@tanstack/table-core/src/core/table/constructTable.ts` for state precedence.
