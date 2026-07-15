---
name: table-state
description: >
  Use Svelte 5 rune-backed table.atoms/store and selected table.state, reactive option getters, controlled $state slices, value-or-updater callbacks, external atoms, and auto-reset behavior without snapshot mismatches.
metadata:
  type: framework
  library: '@tanstack/svelte-table'
  framework: svelte
  library_version: '9.0.0-beta.50'
requires:
  - '@tanstack/table-core#core'
  - getting-started
sources:
  - 'TanStack/table:docs/framework/svelte/guide/table-state.md'
  - 'TanStack/table:docs/framework/svelte/guide/pagination.md'
  - 'TanStack/table:examples/svelte/basic-external-state'
  - 'TanStack/table:packages/svelte-table/src/createTable.svelte.ts'
---

This skill builds on `@tanstack/table-core#core` and `getting-started`. Read them first for table ownership and Svelte construction.

## State Mental Model

TanStack Table is primarily a state coordinator. Keep state internal unless another system must read, persist, or drive it. Without `initialState`, `atoms`, `state`, or `on[State]Change`, the table owns all registered slices.

- `table.baseAtoms` are internal writable atoms initialized from resolved initial state.
- `table.atoms` are readonly derived atoms for the active owner of each registered slice.
- `table.store` is the readonly flat store assembled from those atoms.
- `table.state` is only the result selected by the second `createTable` argument.

Svelte 5 backs these surfaces with runes and synchronizes reactive options before DOM updates. Only registered features create state and types. If pagination is missing, register `rowPaginationFeature`; do not add a cast or an ad hoc state field. Keep `features` and `columns` stable and pass changing `data` through a getter.

## Setup

Keep state internal unless another subsystem needs to own it. Select only render state that the component needs.

```svelte
<script lang="ts">
  import {
    createTable,
    rowPaginationFeature,
    tableFeatures,
  } from '@tanstack/svelte-table'

  const features = tableFeatures({ rowPaginationFeature })
  const columns = [{ accessorKey: 'name' }]
  let data = $state([{ name: 'Ada' }])
  const table = createTable(
    {
      features,
      columns,
      get data() {
        return data
      },
    },
    (state) => ({ pagination: state.pagination }),
  )
</script>

<button onclick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
  Page {table.state.pagination.pageIndex + 1}
</button>
```

## Core Patterns

### Control a slice with value-or-updater semantics

```ts
import type { PaginationState, Updater } from '@tanstack/svelte-table'

let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 20 })
const updatePagination = (next: Updater<PaginationState>) => {
  pagination = typeof next === 'function' ? next(pagination) : next
}
```

Pass `get state() { return { pagination } }` and `onPaginationChange: updatePagination` to `createTable`.

### Subscribe narrowly outside selected table.state

```ts
import { subscribeTable } from '@tanstack/svelte-table'

const pageIndex = subscribeTable(
  table.atoms.pagination,
  (value) => value.pageIndex,
)
```

Read `pageIndex.current` in rune-tracked Svelte code. Use feature APIs for writes; `baseAtoms` is a low-level escape hatch.

## Choose State Ownership

Use one owner per slice:

- Prefer internal state plus feature APIs for table-local interaction.
- Use `initialState` for starting/reset values; changing it later does not reset state.
- Prefer a stable external atom in `atoms` for state shared with Query, routing, or another component. Do not also add its change callback.
- Use a `$state` value exposed through a `state` getter plus the matching callback for simple controlled state. Always resolve value-or-updater semantics.

External atoms win over controlled `state`, which syncs into the internal base atom. Avoid multiple owners. The global v8 `onStateChange` option is gone; subscribe to `table.store` if all state changes must be observed.

## Initialize, Update, and Reset

Prefer `setSorting`, `nextPage`, `toggleVisibility`, `toggleSelected`, and other feature APIs over direct state writes. Write a base atom only for rare internal-state needs; write the external atom when `atoms.<slice>` owns it.

```ts
table.resetSorting()
table.resetPagination()
table.resetPagination(true)
```

Feature resets use `table.initialState` unless `true` requests the feature default and can flow to external owners. Core `table.reset()` resets internal base atoms only. Use feature types such as `PaginationState` for a slice and `TableState<typeof features>` for the complete registered state.

## Common Mistakes

### HIGH Controlling without writing back

Wrong:

```ts
const options = { state: { pagination }, onPaginationChange: console.log }
```

Correct:

```ts
const options = {
  get state() {
    return { pagination }
  },
  onPaginationChange: updatePagination,
}
```

A controlled slice is frozen unless every updater is resolved into the owning rune.

Source: `docs/framework/svelte/guide/table-state.md`

### HIGH Reading snapshots outside tracking

Wrong:

```ts
const pageIndex = table.store.state.pagination.pageIndex
```

Correct:

```ts
const pageIndex = subscribeTable(
  table.atoms.pagination,
  (value) => value.pageIndex,
)
```

`store.state` is a current snapshot; it does not create a future Svelte update outside a tracked scope.

Source: `packages/svelte-table/src/createTable.svelte.ts`

### MEDIUM Declaring one slice in two owners

Wrong:

```ts
const options = { initialState: { pagination: start }, state: { pagination } }
```

Correct:

```ts
const options = {
  get state() {
    return { pagination }
  },
}
```

Controlled `atoms` or `state` wins over `initialState`; choose one owner per slice.

Source: `docs/framework/svelte/guide/table-state.md`

### MEDIUM Fighting automatic page reset

Wrong:

```ts
table.setPageIndex(4)
data = filteredData
```

Correct:

```ts
const options = { autoResetPageIndex: false }
```

Client row-model changes reset the page by default; disable it only when the application handles invalid empty pages.

Source: `docs/framework/svelte/guide/pagination.md`

## API Discovery

Inspect `node_modules/@tanstack/svelte-table/src/createTable.svelte.ts`, `createTableState.svelte.ts`, and `subscribe.ts`; inspect registered state slices in the matching core feature source.
