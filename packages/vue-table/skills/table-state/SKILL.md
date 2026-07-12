---
name: table-state
description: >
  Read Vue-backed table.atoms/store in templates, computed, watch, or table.Subscribe; own slices with refs/computed or external Vue Store atoms; and apply updater callbacks while preserving reactive option shapes.
metadata:
  type: framework
  library: '@tanstack/vue-table'
  framework: vue
  library_version: '9.0.0-beta.44'
requires:
  - '@tanstack/table-core#core'
  - getting-started
sources:
  - 'TanStack/table:docs/framework/vue/guide/table-state.md'
  - 'TanStack/table:examples/vue/basic-external-state'
  - 'TanStack/table:packages/vue-table/src/useTable.ts'
---

This skill builds on `@tanstack/table-core#core` and `getting-started`. Read them first for state ownership and Vue construction.

## State Mental Model

TanStack Table is primarily a state coordinator. Keep state internal unless another system needs to read, persist, or drive it. Without `initialState`, `atoms`, `state`, or `on[State]Change`, the table owns every registered slice.

- `table.baseAtoms` are internal writable atoms created from resolved initial state.
- `table.atoms` are readonly derived atoms for the active owner of each registered slice.
- `table.store` combines those atoms into one readonly flat store.

The Vue adapter backs atoms with refs/computed values and tracks reactive table options. Atom reads become reactive inside templates, `computed`, `watch`, or `table.Subscribe`; a read cached outside tracking is only a snapshot. State is feature-based, so a missing pagination atom or option means `rowPaginationFeature` was not registered. Keep `features` and `columns` stable; pass reactive `data` as a ref/computed instead of recreating arrays in table options.

## Setup

```ts
import { computed, ref } from 'vue'
import {
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'

const features = tableFeatures({ rowPaginationFeature })
const data = ref([{ name: 'Ada' }])
const columns = [{ accessorKey: 'name' }]
const table = useTable({ features, columns, data })
const pageIndex = computed(() => table.atoms.pagination.get().pageIndex)
```

Internal state is usually enough. Atom reads are reactive only when Vue evaluates them in a tracked template, computed, watch, or render boundary.

## Core Patterns

### Control a slice without losing updater semantics

```ts
import { computed, ref } from 'vue'
import type { PaginationState } from '@tanstack/vue-table'

const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 20 })
const controlledState = computed(() => ({ pagination: pagination.value }))
const onPaginationChange = (
  next: PaginationState | ((old: PaginationState) => PaginationState),
) => {
  pagination.value = typeof next === 'function' ? next(pagination.value) : next
}
```

Pass `state: controlledState` and `onPaginationChange` to `useTable`.

### Use Subscribe as a render boundary

```tsx
table.Subscribe({
  children: (atoms) => <span>{atoms.pagination.get().pageIndex + 1}</span>,
})
```

In Vue JSX, `children` is an explicit prop, not a slot child.

## Choose State Ownership

Use exactly one owner per slice:

- Prefer internal state and feature methods for table-local behavior.
- Use `initialState` for starting/reset values; changing it later does not reset current state.
- Prefer a stable `@tanstack/vue-store` atom in `atoms` for cross-system ownership. Feature APIs update it directly, so omit `on[State]Change`.
- Use a ref/computed `state` value plus the matching callback for simple controlled state. Preserve the reactive wrapper and resolve raw values and updater functions.

External atoms take precedence over external `state`, which syncs into the internal base atom. Do not configure multiple owners. The global v8 `onStateChange` option is gone; observe `table.store` if all state changes matter.

## Initialize, Update, and Reset

Use feature methods such as `setSorting`, `nextPage`, `toggleVisibility`, and `toggleSelected`. Direct `baseAtoms` writes are a rare escape hatch for internally owned state; write the external atom when it owns the slice.

```ts
table.resetSorting()
table.resetPagination()
table.resetPagination(true)
```

Feature resets use `table.initialState` unless `true` requests the feature default and can update external owners. Core `table.reset()` only resets internal base atoms. Use slice types such as `PaginationState`; use `TableState<typeof features>` for the complete feature-inferred state.

## Common Mistakes

### HIGH Reading an untracked snapshot

Wrong:

```ts
const pageIndex = table.atoms.pagination.get().pageIndex
```

Correct:

```ts
const pageIndex = computed(() => table.atoms.pagination.get().pageIndex)
```

The first read is current but does not make its consumer reactive.

Source: `docs/framework/vue/guide/table-state.md`

### HIGH Passing state.value once

Wrong:

```ts
const table = useTable({
  features,
  columns,
  data,
  state: controlledState.value,
})
```

Correct:

```ts
const table = useTable({ features, columns, data, state: controlledState })
```

The adapter watches the computed ref; a one-time `.value` breaks future option synchronization.

Source: `packages/vue-table/src/useTable.ts`

### HIGH Assigning updater functions as values

Wrong:

```ts
const onPaginationChange = (next) => {
  pagination.value = next
}
```

Correct:

```ts
const onPaginationChange = (next) => {
  pagination.value = typeof next === 'function' ? next(pagination.value) : next
}
```

Table callbacks accept either a value or a function of the previous value.

Source: `examples/vue/basic-external-state/src/App.tsx`

### MEDIUM Supplying JSX children as a slot

Wrong:

```tsx
<table.Subscribe>
  {(atoms) => <span>{atoms.pagination.get().pageIndex}</span>}
</table.Subscribe>
```

Correct:

```tsx
<table.Subscribe
  children={(atoms) => <span>{atoms.pagination.get().pageIndex}</span>}
/>
```

The Vue adapter declares `Subscribe(props: { children })` and expects the explicit prop.

Source: `packages/vue-table/src/useTable.ts`

## API Discovery

Inspect `node_modules/@tanstack/vue-table/src/useTable.ts` and `reactivity.ts`; inspect the exact state slice in the installed core feature directory.
