---
name: table-state
description: >
  Use Svelte 5 rune-aware table atoms and stores, $derived projections, reactive option getters, controlled $state or createTableState slices, external atoms, and auto-reset behavior without broad invalidation or snapshot mismatches.
metadata:
  type: framework
  library: '@tanstack/svelte-table'
  framework: svelte
  library_version: '9.0.0-beta.61'
requires:
  - '@tanstack/table-core#core'
  - getting-started
sources:
  - 'TanStack/table:docs/framework/svelte/guide/table-state.md'
  - 'TanStack/table:docs/framework/svelte/guide/pagination.md'
  - 'TanStack/table:examples/svelte/basic-external-state'
  - 'TanStack/table:packages/svelte-table/src/createTable.svelte.ts'
  - 'TanStack/table:packages/svelte-table/src/createTableState.svelte.ts'
---

This skill builds on `@tanstack/table-core#core` and `getting-started`. Read them first for table ownership and Svelte construction.

## State Mental Model

TanStack Table is primarily a state coordinator. Keep state internal unless another system must read, persist, or drive it. Without `initialState`, `atoms`, `state`, or `on[State]Change`, the table owns all registered slices.

- `table.baseAtoms` are internal writable atoms initialized from resolved initial state.
- `table.atoms` are readonly derived atoms for the active owner of each registered slice.
- `table.store` is the readonly flat store assembled from those atoms.

The Svelte adapter bridges TanStack Store dependency tracking into Svelte runes. `table.atoms.<slice>.get()`, `table.store.get()`, and table APIs become reactive when called in a template, `$derived`, `$derived.by`, or `$effect`. Outside those contexts they return current snapshots.

Only registered features create state and types. If pagination is missing, register `rowPaginationFeature`; do not add a cast or ad hoc state field. Keep `features` and `columns` stable and pass changing `data` through a getter.

## Setup

Keep state internal unless another subsystem needs to own it. Read only the state slices a component needs.

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

  const table = createTable({
    features,
    columns,
    get data() {
      return data
    },
  })

  const pagination = $derived(table.atoms.pagination.get())
</script>

<button onclick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
  Page {pagination.pageIndex + 1}
</button>
```

## Core Patterns

### Read narrow or complete state

```ts
const pagination = $derived(table.atoms.pagination.get())
const pageIndex = $derived(table.atoms.pagination.get().pageIndex)
const rows = $derived(table.getRowModel().rows)
const stateJson = $derived(JSON.stringify(table.store.get(), null, 2))
```

Use atom reads for normal UI. A `table.store.get()` read intentionally re-runs for any registered state change, so reserve it for debug output, persistence, or computations that need the whole state.

### Control a slice with value-or-updater semantics

```ts
import type { PaginationState, Updater } from '@tanstack/svelte-table'

let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 20 })
const updatePagination = (next: Updater<PaginationState>) => {
  pagination = typeof next === 'function' ? next(pagination) : next
}
```

Pass a getter-backed `state.pagination` and `onPaginationChange: updatePagination` to `createTable`.

### Reduce boilerplate with `createTableState`

```ts
import {
  createTable,
  createTableState,
  rowPaginationFeature,
  tableFeatures,
  type PaginationState,
} from '@tanstack/svelte-table'

const features = tableFeatures({ rowPaginationFeature })
const columns = [{ accessorKey: 'name' }]
const data = [{ name: 'Ada' }]
const [pagination, setPagination] = createTableState<PaginationState>({
  pageIndex: 0,
  pageSize: 20,
})

const table = createTable({
  features,
  columns,
  data,
  state: {
    get pagination() {
      return pagination()
    },
  },
  onPaginationChange: setPagination,
})
```

For better or worse, this resembles a small React `useState` hook: `pagination()` reads the current rune-backed value, while `setPagination` accepts either a value or a functional updater and can be passed directly to `onPaginationChange`.

## Choose State Ownership

Use one owner per slice:

- Prefer internal state plus feature APIs for table-local interaction.
- Use `initialState` for starting/reset values; changing it later does not reset state.
- Use Svelte `$state`, a getter-backed `state` entry, and the matching callback for normal Svelte-owned controlled state.
- Use a stable external atom in `atoms` for state shared as a raw TanStack Store atom. Do not also add its change callback.

External atoms win over controlled `state`, which syncs into the internal base atom. Avoid multiple owners. The global v8 `onStateChange` option is gone; subscribe to `table.store` if every state change must be observed imperatively.

When code outside the table consumes a raw external atom, use `useSelector` from `@tanstack/svelte-store`. Inside table-driven UI, read the rune-aware `table.atoms.<slice>.get()` wrapper.

## Initialize, Update, and Reset

Prefer `setSorting`, `nextPage`, `toggleVisibility`, `toggleSelected`, and other feature APIs over direct state writes. Write a base atom only for rare internal-state needs; write the external atom when `atoms.<slice>` owns it.

```ts
table.resetSorting()
table.resetPagination()
table.resetPagination(true)
```

Feature resets use `table.initialState` unless `true` requests the feature default and can flow to external owners. Core `table.reset()` resets internal base atoms only. Use feature types such as `PaginationState` for a slice and `TableState<typeof features>` for the complete registered state.

## Common Mistakes

### HIGH Keeping removed adapter selectors

Wrong:

```ts
const table = createTable(options, (state) => state.pagination)
const pageIndex = table.state.pageIndex
```

Correct:

```ts
const table = createTable(options)
const pagination = $derived(table.atoms.pagination.get())
```

Starting in beta.59, `createTable` and `createAppTable` take only options, `table.state` is absent, and `subscribeTable` and `SubscribeSource` are no longer exported. Use native tracked Svelte reads and `$derived` projections.

Source: `docs/framework/svelte/guide/migrating.md`

### HIGH Controlling without writing back

Wrong:

```ts
const options = { state: { pagination }, onPaginationChange: console.log }
```

Correct:

```ts
const options = {
  state: {
    get pagination() {
      return pagination
    },
  },
  onPaginationChange: updatePagination,
}
```

A controlled slice is frozen unless every updater is resolved into the owning rune.

Source: `docs/framework/svelte/guide/table-state.md`

### HIGH Snapshotting outside tracking

Wrong:

```ts
const pageIndex = table.store.get().pagination.pageIndex
```

Correct inside a component:

```ts
const pageIndex = $derived(table.atoms.pagination.get().pageIndex)
```

The first line is only a current snapshot when it runs outside a template or rune. The second line is a narrow native Svelte derivation.

Source: `packages/svelte-table/src/createTable.svelte.ts`

### MEDIUM Declaring one slice in two owners

Wrong:

```ts
const options = { initialState: { pagination: start }, state: { pagination } }
```

Correct:

```ts
const options = {
  state: {
    get pagination() {
      return pagination
    },
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

Inspect `node_modules/@tanstack/svelte-table/dist/createTable.svelte.d.ts`, `createTableHook.svelte.d.ts`, and `createTableState.svelte.d.ts`; inspect registered state slices in the matching core feature source.
