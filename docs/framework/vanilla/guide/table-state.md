---
title: Table State (Vanilla JS) Guide
---

## Examples

Want to skip to the implementation? Check out these examples:

- [Basic](../examples/basic)
- [Sorting](../examples/sorting)
- [Pagination](../examples/pagination)

## Table State (Vanilla JS) Guide

> **If you boil TanStack Table down to one sentence: TanStack Table is a large state-management coordinator for table states.**

Understanding this guide is fundamental to understanding how TanStack Table works and how to interact with it for the best results.

### Do you need to Manage External State?

When you use `@tanstack/table-core` directly, there is no framework adapter to render UI or subscribe a component tree for you. The core table still manages state with TanStack Store atoms, but you decide when to read state, subscribe to state, and redraw your UI.

You usually do NOT need to manage table state yourself. If you pass nothing to `initialState`, `atoms`, `state`, or any of the `on[State]Change` table options, TanStack Table will manage its own state internally. There will be situations where you need to customize how you interact with the internal table state, or even hoist it up to your own scopes.

### State in v9

TanStack Table v9 overhauled state management around TanStack Store. TanStack Store uses the `alien-signals` implementation and supports performant derived state. In vanilla usage, you provide the core store reactivity bindings explicitly.

A table instance has a few state surfaces:

- `table.baseAtoms` are the internal writable atoms created from the resolved initial state.
- `table.atoms` are readonly derived atoms exposed per registered state slice.
- `table.store` is a readonly flat TanStack Store derived by putting all of the registered `table.atoms` together.

For vanilla or non-framework use, pass `storeReactivityBindings()` through the table's `coreReactivityFeature`. Table APIs that call atom `.get()` read current values synchronously. UI updates are your responsibility; subscribe to atoms or `table.store` and redraw as needed.

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

const table = constructTable({
  features: {
    coreReactivityFeature: storeReactivityBindings(),
    ...features,
  },
  columns,
  data,
})

table.atoms.pagination.get()
table.atoms.sorting.get()

// table.atoms.rowSelection // TypeScript error unless rowSelectionFeature is registered
```

If `features` does not include a feature, its state should not be available in `table.atoms`, `table.store.state`, `initialState`, `state`, or `atoms`.

### Accessing Table State

There are two different questions when reading table state:

- Do you only need the current value?
- Or should your UI redraw when that value changes?

Use a direct atom or store read for the current value. Use store or atom subscriptions when you want to redraw in response to changes.

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

These reads do not redraw anything by themselves. If the UI needs to stay reactive to table state changes, subscribe to `table.store`, subscribe to a specific atom, or use a TanStack Store selector in your own adapter layer.

#### Reading Reactive State with Store Subscriptions

Subscribe to `table.store` when your UI should redraw for table state changes:

```ts
const subscription = table.store.subscribe(() => {
  renderTable(table)
})

// later
subscription.unsubscribe()
```

You can also subscribe to a single atom:

```ts
const subscription = table.atoms.pagination.subscribe(() => {
  renderPagination(table.atoms.pagination.get())
})
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
const table = constructTable({
  features: {
    coreReactivityFeature: storeReactivityBindings(),
    ...features,
  },
  columns,
  data,
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

If you need easy access to table state outside the table, you can control individual state slices. In vanilla usage, external atoms are usually the cleanest way to share table state between the table and your own UI code.

#### External Atoms

Use external atoms when the app should own one or more table state slices. Create stable writable atoms with `createAtom` from `@tanstack/store`, pass them to `atoms`, and subscribe or read from them wherever your app needs the value.

```ts
import { createAtom } from '@tanstack/store'
import {
  constructTable,
  rowPaginationFeature,
  tableFeatures,
  type PaginationState,
} from '@tanstack/table-core'
import { storeReactivityBindings } from '@tanstack/table-core/store-reactivity-bindings'

const features = tableFeatures({
  rowPaginationFeature,
})

const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const table = constructTable({
  features: {
    coreReactivityFeature: storeReactivityBindings(),
    ...features,
  },
  columns,
  data,
  atoms: {
    pagination: paginationAtom,
  },
  manualPagination: true,
})

paginationAtom.subscribe(() => {
  renderPagination(paginationAtom.get())
})
```

When using the `atoms` option for a slice, you do not need to add the matching `on[State]Change` option.

#### External State

The classic `state` plus `on[State]Change` pattern is still supported. This can be convenient when you already have a plain external state object, but it is less atomic than external atoms.

```ts
const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

let pagination: PaginationState = {
  pageIndex: 0,
  pageSize: 10,
}

const table = constructTable({
  features: {
    coreReactivityFeature: storeReactivityBindings(),
    ...features,
  },
  columns,
  data,
  state: {
    pagination,
  },
  onPaginationChange: (updater) => {
    pagination = updater instanceof Function ? updater(pagination) : updater
    table.setOptions((prev) => ({
      ...prev,
      state: {
        ...prev.state,
        pagination,
      },
    }))
    renderTable(table)
  },
})
```

The v8-style `onStateChange` option is no longer part of the v9 core state model. v9 encourages keeping table state slices atomic and separated for performance.

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
  constructTable,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableState,
} from '@tanstack/table-core'

let sorting: SortingState = [
  {
    id: 'age',
    desc: true,
  },
]
```

`TableState<typeof features>` is inferred from the features registered on that table:

```ts
type MyTableState = TableState<typeof features>
```
