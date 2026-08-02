---
name: table-state
description: >
  Use Angular-signal-backed table.atoms, direct template reads, computed selectors, controlled signals, value-or-updater callbacks, and external Angular Store atoms while accounting for injectTable initializer reruns.
metadata:
  type: framework
  library: '@tanstack/angular-table'
  framework: angular
  library_version: '9.0.0-beta.74'
requires:
  - '@tanstack/table-core#core'
  - getting-started
sources:
  - 'TanStack/table:docs/framework/angular/guide/table-state.md'
  - 'TanStack/table:examples/angular/basic-external-state'
  - 'TanStack/table:packages/angular-table/src/injectTable.ts'
---

This skill builds on `@tanstack/table-core#core` and `getting-started`. Read them first for state ownership and Angular construction.

## State Mental Model

TanStack Table is primarily a state coordinator. Keep state internal unless another system must read, persist, or drive it. Without `initialState`, `atoms`, `state`, or `on[State]Change`, the table owns all registered slices.

- `table.baseAtoms` are internal writable atoms initialized from resolved initial state.
- `table.atoms` are readonly derived atoms for the active owner of each registered slice.
- `table.store` combines those atoms into one readonly flat store.

The Angular adapter backs atoms with Angular signals. Reads participate in tracking inside templates, `computed`, and `effect`; signal reads inside the `injectTable` initializer also rerun that initializer and call `setOptions`. State is feature-based: missing pagination state or APIs indicate a missing `rowPaginationFeature`. Hoist stable `features` and `columns` outside the initializer, and return signal-backed `data` without mapping or slicing inline.

## Setup

```ts
import { computed, signal } from '@angular/core'
import {
  injectTable,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/angular-table'

const features = tableFeatures({ rowPaginationFeature })
const columns = [{ accessorKey: 'name' }]

export class TableComponent {
  readonly data = signal([{ name: 'Ada' }])
  readonly table = injectTable(() => ({ features, columns, data: this.data() }))
  readonly pageIndex = computed(
    () => this.table.atoms.pagination.get().pageIndex,
  )
}
```

Angular-backed table atom reads are signal reads. Templates, `computed`, and `effect` track them directly.

## Core Patterns

### Prefer external atoms for cross-system state

```ts
import { createAtom } from '@tanstack/angular-store'
import type { PaginationState } from '@tanstack/angular-table'

readonly paginationAtom = createAtom<PaginationState>({ pageIndex: 0, pageSize: 20 })
readonly table = injectTable(() => ({
  features, columns, data: this.data(), atoms: { pagination: this.paginationAtom },
}))
```

The atom can feed Query without making every state write rerun the Table initializer.

### Resolve controlled signal updaters

```ts
readonly pagination = signal({ pageIndex: 0, pageSize: 20 })
readonly table = injectTable(() => ({
  features, columns, data: this.data(), state: { pagination: this.pagination() },
  onPaginationChange: next => typeof next === 'function' ? this.pagination.update(next) : this.pagination.set(next),
}))
```

## Choose State Ownership

Use one owner for each slice:

- Prefer internal state and feature APIs for local interaction.
- Use `initialState` for starting/reset values; later changes do not reset current state.
- Prefer a stable atom from `@tanstack/angular-store` in `atoms` for Query or other cross-system state. Table APIs update it without a change callback.
- Use an Angular signal read in `state.<slice>` plus the matching callback for simple controlled state. Handle raw values and updater functions.

External atoms win over controlled `state`, which syncs into the internal base atom. Do not give a slice two owners. The global v8 `onStateChange` option is gone; subscribe to `table.store` when all state changes must be observed.

## Initialize, Update, and Reset

Prefer feature methods such as `setSorting`, `nextPage`, `toggleVisibility`, and `toggleSelected`. Direct base-atom writes are a rare escape hatch for internal state; write the external atom when it owns a slice.

```ts
this.table.resetSorting()
this.table.resetPagination()
this.table.resetPagination(true)
```

Feature resets use `table.initialState` unless `true` requests the feature default, and can update external owners. Core `table.reset()` resets internal base atoms only. Use feature-specific types such as `PaginationState`; use `TableState<typeof features>` when the complete registered state type is needed.

## Common Mistakes

### MEDIUM Wrapping atoms redundantly

Wrong:

```ts
readonly pagination = computed(() => computed(() => this.table.atoms.pagination.get())())
```

Correct:

```ts
readonly pagination = computed(() => this.table.atoms.pagination.get())
```

Table atoms already bridge to Angular signals; one tracked read is sufficient.

Source: `docs/framework/angular/guide/table-state.md`

### HIGH Ignoring initializer reruns

Wrong:

```ts
injectTable(() => ({
  features: tableFeatures({ rowPaginationFeature }),
  columns: makeColumns(),
  state: { pagination: this.pagination() },
  data,
}))
```

Correct:

```ts
injectTable(() => ({
  features,
  columns,
  state: { pagination: this.pagination() },
  data,
}))
```

Controlled signal writes rerun the initializer, so static work must remain outside it.

Source: `packages/angular-table/src/injectTable.ts`

### HIGH Storing updater functions

Wrong:

```ts
onPaginationChange: (next) => this.pagination.set(next)
```

Correct:

```ts
onPaginationChange: (next) =>
  typeof next === 'function'
    ? this.pagination.update(next)
    : this.pagination.set(next)
```

Callbacks receive a value or updater; assigning the function corrupts owned state.

Source: `examples/angular/basic-external-state/src/app/app.ts`

### MEDIUM Giving one slice multiple owners

Wrong:

```ts
{ initialState: { pagination: start }, atoms: { pagination: this.paginationAtom } }
```

Correct:

```ts
{
  atoms: {
    pagination: this.paginationAtom
  }
}
```

External atoms/state override initial state; choose one owner for each slice.

Source: `docs/framework/angular/guide/table-state.md`

## API Discovery

Inspect `node_modules/@tanstack/angular-table/dist/types/` and `reactivity.d.ts`; inspect `@tanstack/angular-store/dist/` for external atoms and installed core feature source for state APIs.
