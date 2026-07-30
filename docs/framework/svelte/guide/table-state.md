---
title: Table State (Svelte) Guide
---

## Examples

Want to skip to the implementation? Check out these examples:

- [Basic createTable](../examples/basic-create-table)
- [Basic External Atoms](../examples/basic-external-atoms)
- [Basic External State](../examples/basic-external-state)
- [With TanStack Query](../examples/with-tanstack-query)

## Table State (Svelte) Guide

> **If you boil TanStack Table down to one sentence: TanStack Table is a large state-management coordinator for table states.**

Understanding this guide is fundamental to understanding how TanStack Table works and how to interact with it for the best results.

### Do you need to Manage External State?

You usually do NOT need to manage table state yourself. If you pass nothing to `initialState`, `atoms`, `state`, or any of the `on[State]Change` table options, TanStack Table will manage its own state internally.

There will be situations where you need to customize how you interact with the internal table state, or even hoist it into your own scopes. TanStack Table lets you read or own the state slices that matter to your app. This guide explains how table state works in Svelte, how native rune tracking applies to table reads, and when to use external atoms or external state.

### State in v9

TanStack Table v9 overhauled state management around TanStack Store. For Svelte 5, the adapter supplies a bridge between TanStack Store dependency tracking and Svelte runes.

A table instance has three state surfaces:

- `table.baseAtoms` are the internal writable TanStack Store atoms created from the resolved initial state.
- `table.atoms` are readonly derived atoms exposed per registered state slice.
- `table.store` is a readonly flat TanStack Store derived by combining all registered `table.atoms`.

Readonly table atoms bridge their Store dependencies into Svelte `$derived` values. The table options store is rune-backed so table APIs also see reactive options such as `data`, `columns`, and controlled state before Svelte updates the DOM.

As a result, table APIs, atom `.get()` calls, and `table.store.get()` participate in Svelte dependency tracking when they run in a template, `$derived`, `$derived.by`, or `$effect`. Svelte does not need a separate table-level selector API.

### Feature-based State

State slices are only created for the features registered in `features`. This keeps TanStack Table tree-shakeable and gives TypeScript more accurate state inference.

```ts
const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const table = createTable({
  features,
  columns,
  get data() {
    return data
  },
})

table.atoms.pagination.get()
table.atoms.sorting.get()

// table.atoms.rowSelection // TypeScript error unless rowSelectionFeature is registered
```

If `features` does not include a feature, its state is not available in `table.atoms`, `table.store.get()`, `initialState`, `state`, or `atoms`.

### Accessing Table State

There are two questions to consider when reading table state:

- Do you need one state slice or the complete state?
- Is the read happening inside a Svelte tracked context?

Prefer `table.atoms.<slice>.get()` for narrow reads. Use `table.store.get()` for full-state debug output or when a computation intentionally depends on every registered state slice.

#### Reading State

Read a specific state slice from its atom:

```ts
const pagination = table.atoms.pagination.get()
const sorting = table.atoms.sorting.get()
```

Read the current flat state from the store:

```ts
const tableState = table.store.get()
const pagination = table.store.get().pagination
```

Outside a tracked Svelte scope, these are current-value snapshots. Inside a template, `$derived`, `$derived.by`, or `$effect`, the same calls register reactive dependencies.

TanStack Store also exposes the equivalent `table.store.state` snapshot property. This guide uses `.get()` consistently so slice and full-store reads have the same explicit shape and match the other signal-based table adapters.

#### Reading Reactive State with Svelte

Use native runes to name or project reactive table values:

```svelte
<script lang="ts">
  const table = createTable({
    features,
    columns,
    get data() {
      return data
    },
  })

  const pagination = $derived(table.atoms.pagination.get())
  const pageIndex = $derived(table.atoms.pagination.get().pageIndex)
  const rows = $derived(table.getRowModel().rows)
  const tableStateJson = $derived(JSON.stringify(table.store.get(), null, 2))
</script>
```

`$derived` replaces the old adapter selector for projections. Svelte only notifies consumers of a derived primitive when that projected value changes.

Atom and table API reads can also be used directly in markup:

```svelte
<span>
  Page {table.atoms.pagination.get().pageIndex + 1} of
  {table.getPageCount()}
</span>
```

An effect should read only the slices that trigger its side effect:

```ts
$effect(() => {
  const sorting = table.atoms.sorting.get()
  persistSorting(sorting)
})
```

Avoid reading `table.store.get()` in an effect that only needs one slice. A full-store read correctly re-runs for every table state change, which is broader than most effects need.

### Setting Table State

You should almost never need to set table state directly. TanStack Table features expose dedicated APIs for interacting with their state, and those APIs are the safest way to make changes.

```ts
table.nextPage()
table.previousPage()
table.setPageIndex(0)
table.setPageSize(25)
```

Use APIs like `table.setSorting(...)`, `table.setColumnFilters(...)`, `column.toggleVisibility()`, or `row.toggleSelected()` instead of manually editing the underlying state object.

If you only care about setting starting values, use `initialState`. If you want to reset a state slice to its initial value, use that feature's reset API.

If you really need to write an internally owned state slice directly, the low-level write surface is its base atom:

```ts
table.baseAtoms.pagination.set((old) => ({
  ...old,
  pageIndex: 0,
}))
```

Direct base-atom writes should be rare. If a slice is owned by an external atom passed through `atoms`, write to that external atom instead; `table.atoms.pagination` will read from the external atom rather than the internal base atom.

### Custom Initial State

If you only need to customize the starting value for some table state, use `initialState`. You still do not need to manage that state yourself.

`initialState` only applies to registered state slices. It creates the table's initial state and is used by reset APIs such as `table.resetSorting()` and `table.resetPagination()`. Changing the `initialState` object later does not reset table state.

```ts
const table = createTable({
  features,
  columns,
  get data() {
    return data
  },
  initialState: {
    sorting: [
      {
        id: 'age',
        desc: true,
      },
    ],
    pagination: {
      pageIndex: 0,
      pageSize: 25,
    },
  },
})
```

> **Note:** Do not provide the same state slice in multiple ownership places unless you intentionally want one to win. For a slice like `pagination`, prefer exactly one of `initialState.pagination`, `atoms.pagination`, or `state.pagination` as the source of truth. External atoms take precedence over external `state`; external `state` syncs into the table's internal base atom.

#### Resetting to Initial State

Feature reset APIs reset to `table.initialState` by default. Many reset APIs also accept `true` to reset to that feature's blank/default state:

```ts
table.resetSorting()
table.resetPagination()
table.resetPagination(true)
```

Slice reset APIs such as `resetPagination()` update through that feature's state updater and can update an externally owned atom. The core `table.reset()` API resets internal base atoms, so do not use it as the primary way to reset state owned by external atoms.

### Controlled State

If your application should own a table state slice, Svelte `$state` plus `state` and `on[State]Change` is the native default. Use external TanStack Store atoms when the state must also be shared as raw atoms outside the table.

#### Svelte-owned State

Use `$state` values with getter-backed `state` entries and matching per-slice callbacks:

```svelte
<script lang="ts">
  import type { PaginationState, SortingState } from '@tanstack/svelte-table'

  let sorting: SortingState = $state([])
  let pagination: PaginationState = $state({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = createTable({
    features,
    columns,
    get data() {
      return data
    },
    state: {
      get sorting() {
        return sorting
      },
      get pagination() {
        return pagination
      },
    },
    onSortingChange: (updater) => {
      sorting = updater instanceof Function ? updater(sorting) : updater
    },
    onPaginationChange: (updater) => {
      pagination = updater instanceof Function ? updater(pagination) : updater
    },
  })
</script>
```

#### `createTableState`

`createTableState` removes a little of the controlled-state boilerplate. For better or worse, it resembles a small React `useState` hook: it returns a getter and a setter, and the setter accepts either a value or a functional TanStack Table updater.

```ts
import {
  createTable,
  createTableState,
  type PaginationState,
} from '@tanstack/svelte-table'

const [pagination, setPagination] = createTableState<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const table = createTable({
  features,
  columns,
  state: {
    get pagination() {
      return pagination()
    },
  },
  onPaginationChange: setPagination,
})
```

Call `pagination()` to read the current value. The getter keeps the `$state` value reactive, while `setPagination` can be passed directly to `onPaginationChange` without repeating the `updater instanceof Function` handling.

If you provide an `on[State]Change` callback, also provide the corresponding value in `state`. The v8-style global `onStateChange` callback is gone in v9.

#### External Atoms

Use external atoms when the app should own and share one or more table state slices as TanStack Store atoms. Create stable writable atoms with `createAtom` and pass them through `atoms`.

```svelte
<script lang="ts">
  import { createAtom, useSelector } from '@tanstack/svelte-store'
  import type { PaginationState } from '@tanstack/svelte-table'

  const paginationAtom = createAtom<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Only needed when code outside the table consumes the raw atom.
  const sharedPagination = useSelector(paginationAtom)

  const table = createTable({
    features,
    columns,
    get data() {
      return dataQuery.data?.rows ?? []
    },
    get rowCount() {
      return dataQuery.data?.rowCount
    },
    atoms: {
      pagination: paginationAtom,
    },
    manualPagination: true,
  })

  // Inside table-driven UI, this is already rune-aware.
  const tablePagination = $derived(table.atoms.pagination.get())
</script>
```

`@tanstack/svelte-store` is only a direct app dependency when the app creates or consumes raw external atoms. When using the `atoms` option for a slice, you do not need the matching `on[State]Change` option.

If you truly need an imperative listener for every table state change, subscribe to `table.store` directly and clean up the subscription:

```ts
const subscription = table.store.subscribe((state) => {
  persistTableState(state)
})

onDestroy(() => subscription.unsubscribe())
```

### State Types

Most complex states in TanStack Table have their own TypeScript types that you can import and use.

```ts
import {
  createTable,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableState,
} from '@tanstack/svelte-table'

let sorting: SortingState = $state([
  {
    id: 'age',
    desc: true,
  },
])
```

`TableState<typeof features>` is inferred from the features registered on that table:

```ts
type MyTableState = TableState<typeof features>
```
