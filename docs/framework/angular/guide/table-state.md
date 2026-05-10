---
title: Table State (Angular) Guide
---

## Examples

Want to skip to the implementation? Check out these examples:

- [Basic injectTable](../examples/basic-inject-table)

## Table State (Angular) Guide

> **If you boil TanStack Table down to one sentence: TanStack Table is a large state-management coordinator for table states.**

Understanding this guide is fundamental to understanding how TanStack Table works and how to interact with it for the best results.

### Do you need to Manage External State?

You usually do NOT need to manage table state yourself. If you pass nothing to `initialState`, `atoms`, `state`, or any of the `on[State]Change` table options, TanStack Table will manage its own state internally.

There will be situations where you need to customize how you interact with the internal table state, or even hoist it up to your own scopes. TanStack Table lets you read, subscribe to, or own the state slices that matter to your app. This guide explains how table state works in Angular, how to read it, and when to use Angular signals or external state.

### State in v9

TanStack Table v9 overhauled state management around TanStack Store. TanStack Store uses the `alien-signals` implementation and supports performant derived state. For Angular, the table adapter supplies custom reactivity so table state atoms are backed by Angular signals.

A table instance has a few state surfaces:

- `table.baseAtoms` are the internal writable atoms created from the resolved initial state.
- `table.atoms` are readonly derived atoms exposed per registered state slice.
- `table.store` is a readonly flat TanStack Store derived by putting all of the registered `table.atoms` together.
- `table.state()` is Angular-only selected state. It is the signal created from the selector passed as the second argument to `injectTable`.

The Angular adapter provides `angularReactivity(injector)` to the table's `coreReativityFeature`. Core readonly atoms are Angular `computed` values, writable atoms are Angular `signal` values, and subscriptions bridge through `toObservable(computed(...), { injector })`. `injectTable` reruns the options initializer when Angular signals read inside it change, then calls `table.setOptions`.

The returned table is also signal-reactive: table state and table APIs are wired for Angular signals, so you can consume table methods inside `computed(...)` and `effect(...)` and have those computations update when the underlying atom reads change.

### Feature-based State

State slices are only created for the features that are registered in `_features`. This keeps TanStack Table tree-shakeable and gives TypeScript more accurate state inference.

```ts
const _features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
})

readonly table = injectTable(() => ({
  _features,
  _rowModels: {
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(sortFns),
  },
  columns,
  data: this.data(),
}))

this.table.atoms.pagination.get()
this.table.atoms.sorting.get()

// this.table.atoms.rowSelection // TypeScript error unless rowSelectionFeature is registered
```

If `_features` does not include a feature, its state should not be available in `table.atoms`, `table.store.state`, `table.state()`, `initialState`, `state`, or `atoms`.

### Accessing Table State

There are two different questions when reading table state:

- Do you only need the current value?
- Or should an Angular signal, computed value, effect, or template update when that value changes?

Use a direct atom or store read for the current value. Use `table.state()` or `table.computed(...)` when you want signal updates.

#### Reading State Without Subscribing

The simplest and most performant way to read a current state value is to read the matching atom:

```ts
const pagination = this.table.atoms.pagination.get()
const sorting = this.table.atoms.sorting.get()
```

You can also read the current flat store snapshot:

```ts
const tableState = this.table.store.state
const pagination = this.table.store.state.pagination
```

These reads are current-value reads. They only participate in Angular dependency tracking when they are called inside an Angular reactive context that tracks those reads. If the UI needs to stay reactive to table state changes, use `table.state()`, `table.computed(...)`, or even `injectSelector` from TanStack Store.

#### Reading Reactive State with injectTable

The second argument to `injectTable` is a TanStack Store selector. The selected value is exposed as the `table.state()` signal. The default selector selects all registered table state.

```ts
readonly table = injectTable(
  () => ({
    _features,
    _rowModels: {
      paginatedRowModel: createPaginatedRowModel(),
    },
    columns,
    data: this.data(),
  }),
  (state) => ({
    pagination: state.pagination,
  }),
)

readonly pageIndex = computed(() => this.table.state().pagination.pageIndex)
```

#### Fine-grained Updates with table.computed

Use `table.computed({ selector })` when you want an Angular signal for a selected slice of table state. The default equality behavior is shallow comparison.

```ts
readonly pagination = this.table.computed({
  selector: (state) => state.pagination,
})

readonly pageIndex = computed(() => this.pagination().pageIndex)
```

This is the recommended way to keep expensive computed values scoped to the state they actually depend on.

### Setting Table State

You should almost never need to set table state directly. TanStack Table features expose dedicated APIs for interacting with their state, and those APIs are the safest way to make changes.

```ts
this.table.nextPage()
this.table.previousPage()
this.table.setPageIndex(0)
this.table.setPageSize(25)
```

Use APIs like `table.setSorting(...)`, `table.setColumnFilters(...)`, `column.toggleVisibility()`, or `row.toggleSelected()` instead of manually editing the underlying state object.

If you only care about setting starting values, use `initialState`. If you want to reset a state slice back to its initial value, use that feature's reset API.

If you really do need to write a state slice directly, the low-level write surface for internally owned state is the matching base atom:

```ts
this.table.baseAtoms.pagination.set((old) => ({
  ...old,
  pageIndex: 0,
}))
```

Direct base atom writes should be rare. If a slice is owned by an external atom passed through `atoms`, write to that external atom instead; `table.atoms.pagination` will read from the external atom, not the internal base atom.

### Custom Initial State

If you only need to customize the starting value for some table state, use `initialState`. You still do not need to manage that state yourself.

`initialState` only applies to registered state slices. It is used to create the table's initial state and is also used by reset APIs such as `table.resetSorting()` or `table.resetPagination()`. Changing the `initialState` object later does not reset table state.

```ts
readonly table = injectTable(() => ({
  _features,
  _rowModels: {
    sortedRowModel: createSortedRowModel(sortFns),
    paginatedRowModel: createPaginatedRowModel(),
  },
  columns,
  data: this.data(),
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
}))
```

> **Note:** Do not provide the same state slice in multiple ownership places unless you intentionally want one to win. For a slice like `pagination`, prefer exactly one of `initialState.pagination`, `atoms.pagination`, or `state.pagination` as the source of truth. External atoms take precedence over external `state`; external `state` syncs into the table's internal base atom.

#### Resetting to Initial State

Feature reset APIs reset to `table.initialState` by default. Many reset APIs also accept `true` to reset to that feature's blank/default state instead:

```ts
this.table.resetSorting()
this.table.resetPagination()
this.table.resetPagination(true)
```

Slice reset APIs like `resetPagination()` update through that feature's state updater and can update externally owned state. The core `table.reset()` API resets the internal base atoms, so do not use it as the primary way to reset state that is owned outside the table.

### Controlled State

If you need easy access to table state in other parts of your application, you can control individual state slices. In Angular, the common pattern is to own those values with Angular signals and pass them through `state` plus the matching `on[State]Change` callback.

#### External Atoms

The core `atoms` table option is still available in Angular because the adapter re-exports TanStack Table core types. Use it when you already have compatible writable TanStack Store atoms and want a table slice to read from that atom.

Most Angular apps should start with Angular signals and the `state` option instead. That keeps ownership in Angular's signal model while `injectTable` keeps table options synchronized with signal changes.

#### External State

Use `state` plus `on[State]Change` when Angular should own a table state slice.

```ts
readonly sorting = signal<SortingState>([])
readonly pagination = signal<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

readonly table = injectTable(() => ({
  _features,
  _rowModels: {
    sortedRowModel: createSortedRowModel(sortFns),
    paginatedRowModel: createPaginatedRowModel(),
  },
  columns,
  data: this.data(),
  state: {
    sorting: this.sorting(),
    pagination: this.pagination(),
  },
  onSortingChange: (updater) => {
    updater instanceof Function
      ? this.sorting.update(updater)
      : this.sorting.set(updater)
  },
  onPaginationChange: (updater) => {
    updater instanceof Function
      ? this.pagination.update(updater)
      : this.pagination.set(updater)
  },
}))
```

The v8-style `onStateChange` option is no longer part of the v9 `injectTable` state model. v9 encourages keeping table state slices atomic and separated for performance.

##### On State Change Callbacks

The `on[State]Change` callbacks are useful when you are controlling a matching slice through the `state` option. They receive either a raw value or an updater function.

If you provide an `on[State]Change` callback, also provide the corresponding value in `state`. For example, `onSortingChange` should be paired with `state.sorting`.

```ts
onPaginationChange: (updater) => {
  updater instanceof Function
    ? this.pagination.update(updater)
    : this.pagination.set(updater)
}
```

### State Types

Most complex states in TanStack Table have their own TypeScript types that you can import and use.

```ts
import {
  injectTable,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableState,
} from '@tanstack/angular-table'

readonly sorting = signal<SortingState>([
  {
    id: 'age',
    desc: true,
  },
])
```

`TableState<typeof _features>` is inferred from the features registered on that table:

```ts
type MyTableState = TableState<typeof _features>
```
