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

There will be situations where you need to customize how you interact with the internal table state, or even hoist it up to your own scopes. TanStack Table lets you read, subscribe to, or own the state slices that matter to your app. This guide explains how table state works in Svelte, how to read it, and when to use external atoms or external state.

### State in v9

TanStack Table v9 overhauled state management around TanStack Store. TanStack Store uses the `alien-signals` implementation and supports performant derived state. For Svelte 5, the table adapter supplies custom reactivity so table state atoms are backed by runes.

A table instance has a few state surfaces:

- `table.baseAtoms` are the internal writable atoms created from the resolved initial state.
- `table.atoms` are readonly derived atoms exposed per registered state slice.
- `table.store` is a readonly flat TanStack Store derived by putting all of the registered `table.atoms` together.
- `table.state` is Svelte-only selected state. It is the value returned from the selector passed as the second argument to `createTable`.

The Svelte adapter provides `svelteReactivity()` to the table's `coreReactivityFeature`. Core readonly atoms are backed by `$derived.by`, writable atoms are backed by `$state`, and `createTable` uses `$effect.pre` to sync options and controlled state before DOM updates. Table APIs that read atoms participate in Svelte dependency tracking through those rune-backed atom reads.

### Feature-based State

State slices are only created for the features that are registered in `features`. This keeps TanStack Table tree-shakeable and gives TypeScript more accurate state inference.

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

If `features` does not include a feature, its state should not be available in `table.atoms`, `table.store.state`, `table.state`, `initialState`, `state`, or `atoms`.

### Accessing Table State

There are two different questions when reading table state:

- Do you only need the current value?
- Or should a Svelte reactive update happen when that value changes?

Use a direct atom or store read for the current value. Use selected state, `useSelector`, or `subscribeTable` when you want fine-grained reactive updates.

#### Reading State Without Subscribing

The simplest and most performant way to read a current state value is to read the matching atom:

```ts
const pagination = table.atoms.pagination.get()
const sorting = table.atoms.sorting.get()
```

You can also read the current flat store snapshot:

```ts
const tableState = table.store.state
const pagination = table.store.state.pagination
```

These reads are current-value reads. They only participate in Svelte dependency tracking when they are called in a rune-tracked context. If the UI needs to stay reactive to table state changes, use `table.state`, `subscribeTable`, or even a `useSelector` hook from TanStack Store.

#### Reading Reactive State with createTable

The second argument to `createTable` is a TanStack Store selector. The selected value is exposed as `table.state`. The default selector selects all registered table state.

```ts
const table = createTable(
  {
    features,
    columns,
    get data() {
      return data
    },
  },
  (state) => ({
    pagination: state.pagination,
  }),
)

table.state.pagination
```

#### Fine-grained Updates with subscribeTable

Use `subscribeTable` when you want a specific part of Svelte code to subscribe to one atom or store source. It uses TanStack Store selection and exposes the selected value through `.current`.

```ts
import { subscribeTable } from '@tanstack/svelte-table'

const pagination = subscribeTable(table.atoms.pagination)
const pageIndex = subscribeTable(
  table.atoms.pagination,
  (pagination) => pagination.pageIndex,
)
```

```svelte
<strong>
  Page {pagination.current.pageIndex + 1} of {table.getPageCount()}
</strong>
```

### Setting Table State

You should almost never need to set table state directly. TanStack Table features expose dedicated APIs for interacting with their state, and those APIs are the safest way to make changes.

```ts
table.nextPage()
table.previousPage()
table.setPageIndex(0)
table.setPageSize(25)
```

Use APIs like `table.setSorting(...)`, `table.setColumnFilters(...)`, `column.toggleVisibility()`, or `row.toggleSelected()` instead of manually editing the underlying state object.

If you only care about setting starting values, use `initialState`. If you want to reset a state slice back to its initial value, use that feature's reset API.

If you really do need to write a state slice directly, the low-level write surface for internally owned state is the matching base atom:

```ts
table.baseAtoms.pagination.set((old) => ({
  ...old,
  pageIndex: 0,
}))
```

Direct base atom writes should be rare. If a slice is owned by an external atom passed through `atoms`, write to that external atom instead; `table.atoms.pagination` will read from the external atom, not the internal base atom.

### Custom Initial State

If you only need to customize the starting value for some table state, use `initialState`. You still do not need to manage that state yourself.

`initialState` only applies to registered state slices. It is used to create the table's initial state and is also used by reset APIs such as `table.resetSorting()` or `table.resetPagination()`. Changing the `initialState` object later does not reset table state.

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

Feature reset APIs reset to `table.initialState` by default. Many reset APIs also accept `true` to reset to that feature's blank/default state instead:

```ts
table.resetSorting()
table.resetPagination()
table.resetPagination(true)
```

Slice reset APIs like `resetPagination()` update through that feature's state updater and can update an externally owned atom. The core `table.reset()` API resets the internal base atoms, so do not use it as the primary way to reset state that is owned by external atoms.

### Controlled State

If you need easy access to table state in other parts of your application, you can control individual state slices. In v9, external atoms are the recommended way to do this when you want atomic ownership and fine-grained Svelte updates.

#### External Atoms

Use external atoms when the app should own one or more table state slices. Create stable writable atoms with `createAtom`, pass them to `atoms`, and subscribe to them with `useSelector` or `subscribeTable`.

```ts
import { createAtom, useSelector } from '@tanstack/svelte-store'
import {
  createTable,
  rowPaginationFeature,
  tableFeatures,
  type PaginationState,
} from '@tanstack/svelte-table'

const features = tableFeatures({
  rowPaginationFeature,
})

const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const pagination = useSelector(paginationAtom)

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

// pagination.current is reactive, and table pagination APIs update paginationAtom
```

When using the `atoms` option for a slice, you do not need to add the matching `on[State]Change` option.

#### External State

The classic `state` plus `on[State]Change` pattern is still supported. This can be convenient for simple integrations or when migrating v8 code, but it is less atomic than external atoms.

```ts
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
```

The v8-style `onStateChange` option (a single global state callback) is gone in v9. Use per-slice `on[State]Change` callbacks paired with `state.<slice>`, or external atoms via the `atoms` option. If you truly need to observe every state change, subscribe to `table.store` directly.

##### On State Change Callbacks

The `on[State]Change` callbacks are useful when you are controlling a matching slice through the `state` option. They receive either a raw value or an updater function.

If you provide an `on[State]Change` callback, also provide the corresponding value in `state`. For example, `onSortingChange` should be paired with `state.sorting`.

```ts
onPaginationChange: (updater) => {
  pagination = updater instanceof Function ? updater(pagination) : updater
}
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
