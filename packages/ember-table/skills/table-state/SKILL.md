---
name: table-state
description: >
  Read, track, initialize, control, and reset TanStack Ember Table v9 state through Glimmer-reactive table APIs, baseAtoms, atoms, store, Ember createAtom, or @tracked state plus on*Change. Load for ownership precedence, updater callbacks, stale template state, options-thunk reactivity, or incorrect table.Subscribe/store.subscribe usage.
metadata:
  type: framework
  library: '@tanstack/ember-table'
  framework: ember
  library_version: '9.0.0-beta.43'
requires:
  - '@tanstack/table-core#core'
  - getting-started
sources:
  - 'TanStack/table:docs/framework/ember/guide/table-state.md'
  - 'TanStack/table:examples/ember/basic-external-atoms'
  - 'TanStack/table:examples/ember/basic-external-state'
  - 'TanStack/table:packages/ember-table/src/use-table.ts'
  - 'TanStack/table:packages/ember-table/src/reactivity.ts'
  - 'TanStack/table:packages/ember-table/src/signal.ts'
---

This skill builds on `@tanstack/table-core#core` and `getting-started`. Keep state internal unless another part of the application must read, persist, validate, or drive a slice.

## State Surfaces

State exists only for registered features:

- `table.baseAtoms` are the table's internal writable atoms.
- `table.atoms` are readonly, ownership-aware atoms for each registered slice.
- `table.store.state` exposes the current flat state.
- Feature methods such as `setSorting`, `setPageSize`, and `row.toggleSelected()` are the preferred write path.

Ember's reactivity feature bridges these reads into Glimmer tracking. There is no `table.Subscribe`, no selector argument to `useTable`, and no need to subscribe during rendering. Read the relevant API inside a template-consumed getter:

```gts
get rows() {
  return this.table.getRowModel().rows
}

get pageIndex() {
  return this.table.atoms.pagination.get().pageIndex
}
```

`table.store.subscribe` is not the Ember rendering mechanism. The adapter's store is pull-based; Glimmer tracks individual property and atom reads.

`features` and `atoms` are construct-time inputs in this adapter. Create them once before `useTable`; rerunning the options thunk updates ordinary live options but does not swap the table's feature set or atom owners.

## Choose One Owner Per Slice

For a slice such as pagination, choose one source of truth:

1. Internal `baseAtoms` by default.
2. `initialState.pagination` for an internally owned starting value.
3. An external writable atom in `atoms.pagination`.
4. A `@tracked` value in `state.pagination`, paired with `onPaginationChange`.

Read precedence is `atoms[key]` over `state[key]` over the internal `baseAtoms[key]`. Do not configure multiple owners merely as fallbacks.

## Internal and Initial State

With no `initialState`, `atoms`, `state`, or `on[State]Change`, Table owns registered state internally. Use `initialState` when only the starting/reset value differs:

```gts
table = useTable(() => ({
  features,
  columns,
  data: this.data,
  initialState: {
    pagination: { pageIndex: 0, pageSize: 25 },
  },
}))
```

Changing `initialState` later does not reset existing state. Prefer feature reset methods such as `resetPagination()`; passing `true` requests that feature's blank/default state. Core `table.reset()` resets internal base atoms and is not the primary reset path for externally owned atoms.

## External Ember Atoms

Use the adapter's re-exported `createAtom` when a slice should be shared or read directly outside Table. It satisfies the TanStack Store atom contract and its reads are Glimmer-reactive:

```gts
import {
  createAtom,
  useTable,
  type PaginationState,
} from '@tanstack/ember-table'

paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

table = useTable(() => ({
  features,
  columns,
  data: this.data,
  atoms: { pagination: this.paginationAtom },
}))

get pagination() {
  return this.paginationAtom.get()
}
```

Feature APIs write through the external atom, so do not add `onPaginationChange` for the same atom-owned slice. Write the external atom itself when using the low-level path.

## Controlled Tracked State

Use `state` plus the matching callback when a `@tracked` property owns a slice. Resolve both raw values and updater functions:

```gts
import {
  createPaginatedRowModel,
  rowPaginationFeature,
  tableFeatures,
  type PaginationState,
} from '@tanstack/ember-table'

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

@tracked pagination: PaginationState = { pageIndex: 0, pageSize: 10 }

table = useTable(() => ({
  features,
  columns,
  data: this.data,
  state: { pagination: this.pagination },
  onPaginationChange: (updater) => {
    this.pagination =
      typeof updater === 'function' ? updater(this.pagination) : updater
  },
}))
```

The pagination feature owns the state and APIs; the row-model slot enables client-side pagination. For server-owned pagination, keep `rowPaginationFeature`, omit the client row-model slot, and configure the matching manual/server data options. The options thunk must read `this.pagination`; assigning the tracked field reruns the thunk and feeds the controlled value back into Table. V9 has no global `onStateChange` option.

## Low-Level Writes and Types

Use a feature method first. If internally owned state truly needs a low-level update:

```ts
this.table.baseAtoms.pagination.set((old) => ({ ...old, pageIndex: 0 }))
```

Do not write `table.atoms.pagination`; it is readonly and may point at an external owner. Infer the complete registered shape with `TableState<typeof features>` and use feature-specific types such as `PaginationState` or `SortingState` for owned fields.

## Common Mistakes

### CRITICAL Controlling a slice without writing callbacks back

Wrong:

```gts
state: { pagination: this.pagination },
onPaginationChange: () => {},
```

Correct: apply the value-or-updater to the tracked owner. Otherwise the slice is frozen at the controlled value.

### HIGH Expecting a snapshot read or subscription component

Wrong: invent `<table.Subscribe>`, call `table.store.subscribe(...)` for rendering, or cache `table.store.state.pagination` outside a tracked getter.

Correct: read `table.atoms.pagination.get()`, `table.store.state.pagination`, or the relevant Table API inside a template-consumed getter.

`table.getState()` is removed v8 API, not an Ember state-read alternative.

### HIGH Mixing atom and state ownership

If both `atoms.pagination` and `state.pagination` are present, the atom wins. Choose one owner so resets and writes have an unambiguous destination.

### HIGH Mutating controlled objects in place

Wrong: `this.pagination.pageIndex++`.

Correct: assign a new tracked value or let `table.setPageIndex(...)` invoke the controlled updater. Glimmer and the options thunk need an observable owner update.

### MEDIUM Writing the internal base atom for an external owner

When `atoms.pagination` owns the slice, changing `baseAtoms.pagination` does not replace the active value. Write the external atom or use the feature API.

## API Discovery

Inspect `node_modules/@tanstack/ember-table/src/use-table.ts` for option/state precedence and the Glimmer bridge, `signal.ts` for `createAtom` behavior, and `reactivity.ts` for scheduling/tracking. Inspect the registered feature under `node_modules/@tanstack/table-core/src/features/<feature>/` for its state type, update API, and reset semantics.
