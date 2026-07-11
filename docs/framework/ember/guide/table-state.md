---
title: Table State (Ember) Guide
---

## Examples

Want to skip to the implementation? Check out these Ember examples:

- [Basic Table](../examples/basic-table)
- [Basic External Atoms](../examples/basic-external-atoms)
- [Basic External State](../examples/basic-external-state)
- [Kitchen Sink](../examples/kitchen-sink)

## Table State (Ember) Guide

> **If you boil TanStack Table down to one sentence: TanStack Table is a large state-management coordinator for table states.**

Understanding this guide is fundamental to understanding how TanStack Table works and how to interact with it for the best results.

### Do you need to Manage External State?

You usually do NOT need to manage table state yourself. If you pass nothing to `initialState`, `atoms`, `state`, or any of the `on[State]Change` table options, TanStack Table will manage its own state internally.

There will be situations where you need to customize how you interact with the internal table state, or even hoist it up to your own scopes. TanStack Table lets you read, subscribe to, or own the state slices that matter to your app. This guide explains how table state works in Ember, how to read it, and when to use external atoms or external state.

### State in v9

TanStack Table v9 overhauled state management around TanStack Store. TanStack Store uses the `alien-signals` implementation and supports performant derived state.

A table instance has a few state surfaces:

- `table.baseAtoms` are the internal writable atoms created from the resolved initial state.
- `table.atoms` are readonly derived atoms exposed per registered state slice.
- `table.store` is a readonly flat TanStack Store derived by putting all of the registered `table.atoms` together.

The Ember adapter bridges these atoms into Glimmer's tracking system with an Ember-native reactivity feature, so the atoms are backed by TanStack Store and made reactive to Glimmer. You pass options to `useTable` as a thunk (`useTable(() => ({ ... }))`); any tracked property the thunk reads (like `this.data` or a controlled `state` slice) re-runs the table when it changes, and any template binding or getter that reads a table API re-renders automatically when the underlying state changes. You do not pass a state selector, and there is no `table.Subscribe`: reactivity is tracked per read.

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

// inside a Glimmer component:
table = useTable(() => ({
  features,
  columns,
  data: this.data,
}))

this.table.atoms.pagination.get()
this.table.atoms.sorting.get()

// this.table.atoms.rowSelection // TypeScript error unless rowSelectionFeature is registered
```

If `features` does not include a feature, its state should not be available in `table.atoms`, `table.store.state`, `initialState`, `state`, or `atoms`.

### Accessing Table State

There are two different questions when reading table state:

- Do you only need the current value?
- Or should the markup update when that value changes?

Use direct atom reads for slice values. Use `table.store.state` for the current flat state snapshot. Because the adapter makes table reads reactive, reads inside a template binding or a getter update your markup automatically when the value changes.

#### Reading State

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

Prefer `table.atoms.<slice>.get()` for narrow reads. Use `table.store.state` for full-state debug output or when a binding intentionally depends on the whole table state.

#### Reading State Reactively in Templates

Because the table instance is reactive, expose the values your template needs through getters that read a table API, and render those getters in `<template>`. Each getter tracks the table reads inside it and re-runs when they change.

```gts
export default class PersonTable extends Component {
  @tracked data: Array<Person> = makeData(1_000)

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
  }))

  get rows() {
    return this.table.getRowModel().rows
  }

  get pageCount() {
    return this.table.getPageCount()
  }

  // full-state debug output
  get tableState() {
    return JSON.stringify(this.table.store.state, null, 2)
  }

  <template>
    <span>Page count: {{this.pageCount}}</span>
    <pre>{{this.tableState}}</pre>
  </template>
}
```

> **Note:** TanStack Table v9 uses prototype-based methods that require `this` binding. Ember templates extract function references without binding them, so wrap table, column, and row method calls in small module-level helper functions (or getters) instead of calling them directly in a template. For example, `const getCanSort = (column) => column.getCanSort()`, then call `(getCanSort header.column)` from the template.

### Setting Table State

You should almost never need to set table state directly. TanStack Table features expose dedicated APIs for interacting with their state, and those APIs are the safest way to make changes.

```ts
this.table.nextPage()
this.table.previousPage()
this.table.setPageIndex(0)
this.table.setPageSize(25)
```

Use APIs like `table.setSorting(...)`, `table.setColumnFilters(...)`, `column.toggleVisibility()`, or `row.toggleSelected()` instead of manually editing the underlying state object. These feature methods are the write path for table state.

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

```gts
table = useTable(() => ({
  features,
  columns,
  data: this.data,
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

> **Note:** Do not provide the same state slice in multiple ownership places unless you intentionally want one to win. For a slice like `pagination`, prefer exactly one of `initialState.pagination`, `atoms.pagination`, or `state.pagination` as the source of truth. The precedence is `atoms[key]` > `state[key]` > internal `baseAtoms[key]`: external atoms take precedence over external `state`, and external `state` syncs into the table's internal base atom.

#### Resetting to Initial State

Feature reset APIs reset to `table.initialState` by default. Many reset APIs also accept `true` to reset to that feature's blank/default state instead:

```ts
this.table.resetSorting()
this.table.resetPagination()
this.table.resetPagination(true)
```

Slice reset APIs like `resetPagination()` update through that feature's state updater and can update an externally owned atom. The core `table.reset()` API resets the internal base atoms, so do not use it as the primary way to reset state that is owned by external atoms.

### Controlled State

If you need easy access to table state in other parts of your application, you can control individual state slices. In Ember, you have two options: own the slice in an external TanStack Store atom (good for sharing across modules or subscribing outside the table), or own it in a `@tracked` property and connect it with `state` plus `on[State]Change`.

#### External Atoms

Use external atoms when the app should own one or more table state slices as TanStack Store atoms. `@tanstack/ember-table` re-exports `createAtom`, so it is available directly. Create stable writable atoms, pass them to the `atoms` option, and read, write, or subscribe to them from anywhere.

```gts
import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import {
  useTable,
  createAtom,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  type PaginationState,
  type SortingState,
} from '@tanstack/ember-table'

const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  // ...row models and sortFns
})

export default class BasicExternalAtomsTable extends Component {
  @tracked data: Array<Person> = makeData(1_000)

  sortingAtom = createAtom<SortingState>([])
  paginationAtom = createAtom<PaginationState>({ pageIndex: 0, pageSize: 10 })

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    atoms: {
      sorting: this.sortingAtom,
      pagination: this.paginationAtom,
    },
  }))

  // reads of an ember createAtom are reactive on their own
  get pagination() {
    return this.paginationAtom.get()
  }
}
```

Reads and writes for `sorting` and `pagination` are now routed through the atoms instead of the internal base atoms. Atom changes flow through the derived `table.store`, which the adapter tracks, so the template re-renders. You can also read or write the atom directly from anywhere with `this.paginationAtom.get()` and `this.paginationAtom.set(...)`. When using the `atoms` option for a slice, you do not need to add the matching `on[State]Change` option; table APIs like `table.setPageSize(...)` write straight through to the atom.

#### External State

Use `state` plus `on[State]Change` when a `@tracked` property should own a table state slice. Store the controlled slice in a `@tracked` field, read it through `state`, and write it back in the matching callback so the options thunk re-runs when it changes.

```gts
export default class BasicExternalStateTable extends Component {
  @tracked data: Array<Person> = makeData(1_000)
  @tracked sorting: SortingState = []
  @tracked pagination: PaginationState = { pageIndex: 0, pageSize: 10 }

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    // connect our external state back down to the table
    state: {
      sorting: this.sorting,
      pagination: this.pagination,
    },
    onSortingChange: (updater) => {
      // raise sorting state changes to our own state management
      this.sorting =
        typeof updater === 'function' ? updater(this.sorting) : updater
    },
    onPaginationChange: (updater) => {
      // raise pagination state changes to our own state management
      this.pagination =
        typeof updater === 'function' ? updater(this.pagination) : updater
    },
  }))
}
```

Use the per-slice `on[State]Change` callbacks to keep controlled table state slices atomic and separated.

##### On State Change Callbacks

The `on[State]Change` callbacks are useful when you are controlling a matching slice through the `state` option. They work like setters: an updater can be a raw value or a function that receives the previous value and returns the next value.

If you provide an `on[State]Change` callback, also provide the corresponding value in `state`. For example, `onSortingChange` should be paired with `state.sorting`.

```ts
onPaginationChange: (updater) => {
  this.pagination =
    typeof updater === 'function' ? updater(this.pagination) : updater

  // side effects or validation can happen here
}
```

### State Types

Most complex states in TanStack Table have their own TypeScript types that you can import and use.

```ts
import {
  useTable,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableState,
} from '@tanstack/ember-table'

// @tracked sorting: SortingState = [{ id: 'age', desc: true }]
```

`TableState<typeof features>` is inferred from the features registered on that table:

```ts
type MyTableState = TableState<typeof features>
```
