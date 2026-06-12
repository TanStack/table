---
title: Table State (Angular) Guide
---

## Examples

Want to skip to the implementation? Check out these examples:

- [Basic injectTable](../examples/basic-inject-table)
- [Basic External Atoms](../examples/basic-external-atoms)
- [Basic External State](../examples/basic-external-state)
- [Row Selection (Signals)](../examples/row-selection-signal)
- [With TanStack Query](../examples/with-tanstack-query)

## Table State (Angular) Guide

> **If you boil TanStack Table down to one sentence: TanStack Table is a large state-management coordinator for table states.**

Understanding this guide is fundamental to understanding how TanStack Table works and how to interact with it for the best results.

### Do you need to Manage External State?

You usually do NOT need to manage table state yourself. If you pass nothing to `initialState`, `atoms`, `state`, or any of the `on[State]Change` table options, TanStack Table will manage its own state internally.

There will be situations where you need to customize how you interact with the internal table state, or even hoist it up to your own scopes. TanStack Table lets you read, subscribe to, or own the state slices that matter to your app. This guide explains how table state works in Angular, how to read it, and when to use Angular signals or external state.

### State in v9

TanStack Table v9 overhauled state management around TanStack Store. TanStack Store uses the `alien-signals` implementation and supports performant derived state. For Angular, the table adapter supplies reactivity bindings so table state atoms are backed by Angular signals.

A table instance has a few state surfaces:

- `table.baseAtoms` are the internal writable atoms created from the resolved initial state.
- `table.atoms` are readonly derived atoms exposed per registered state slice.
- `table.store` is the readonly flat TanStack Store derived by putting all of the registered `table.atoms` together.

The Angular adapter provides `angularReactivity(injector)` as the table's reactivity binding. Core readonly atoms are Angular `computed` values, writable atoms are Angular `signal` values, and subscriptions bridge through `toObservable(computed(...), { injector })`. `injectTable` reruns the options initializer when Angular signals read inside it change, then calls `table.setOptions`.

The returned table is also signal-reactive: table state and table APIs are wired for Angular signals, so you can consume table methods inside `computed(...)` and `effect(...)` and have those computations update when the underlying atom reads change.

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

readonly table = injectTable(() => ({
  features,
  columns,
  data: this.data(),
}))

this.table.atoms.pagination.get()
this.table.atoms.sorting.get()

// this.table.atoms.rowSelection // TypeScript error unless rowSelectionFeature is registered
```

If `features` does not include a feature, its state should not be available in `table.atoms`, `table.store.get()`, `initialState`, `state`, or `atoms`.

### Accessing Table State

There are two different questions when reading table state:

- Do you only need the current value?
- Or should an Angular signal, computed value, effect, or template update when that value changes?

Use a direct atom read for the current value. Because Angular table atoms are backed by Angular signals, the same read also participates in Angular dependency tracking when it happens inside a template, `computed(...)`, or `effect(...)`.

#### Reading State

The simplest and most performant way to read a state value is to read the matching atom:

```ts
const pagination = this.table.atoms.pagination.get()
const sorting = this.table.atoms.sorting.get()
```

Use `table.store.get()` when you need the current flat state shape, such as debug JSON:

```ts
const tableState = this.table.store.get()
const stateJson = JSON.stringify(this.table.store.get(), null, 2)
```

Atom reads are signal reads in Angular. If `this.table.atoms.pagination.get()` is used in a template expression, `computed(...)`, or `effect(...)`, Angular tracks it and updates when that atom changes.

#### Selecting State with Angular computed

Use Angular's native `computed(...)` when you want to derive a value from table state or apply a custom equality function. For object or array slices, pass `shallow` to avoid unnecessary downstream work when the selected value is structurally unchanged.

```ts
import { computed } from '@angular/core'
import { shallow } from '@tanstack/angular-table'

readonly table = injectTable(() => ({
  features,
  columns,
  data: this.data(),
}))

readonly pagination = computed(
  () => this.table.atoms.pagination.get(),
  // if you want to pass a custom equality function
  // { equal: shallow },
)

readonly pageIndex = computed(() => this.pagination().pageIndex)
```

You can also select from the flat store snapshot if that is more convenient, but prefer direct atoms for narrow render reads.

```ts
readonly pagination = computed(
  () => this.table.store.get().pagination,
  { equal: shallow },
)
```

Use `computed(...)` for selection, derivation, and equality control. You do not need it just to make an atom reactive; the atom already is backed by an Angular signal.

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
  features,
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

If you need easy access to table state in other parts of your application, you can control individual state slices. In v9, external atoms are the recommended way to do this because they preserve the atomic state model and keep fine-grained subscriptions intact.

#### External Atoms

Use external atoms when the app should own one or more table state slices. Create stable writable atoms with `createAtom` from `@tanstack/angular-store` (class fields work well, since they are created once per component instance) and pass them to the table's `atoms` option. The table's derived `table.atoms.<slice>` reads then come from your atom, and they stay signal-reactive in templates, `computed(...)`, and `effect(...)` just like internally owned slices.

To consume the external atom itself inside Angular's reactive contexts, wrap it with `injectAtom` (or `injectSelector`) from `@tanstack/angular-store`, which returns an Angular signal. A plain `.get()` read returns the current snapshot and is fine in event handlers and other imperative code.

This is especially useful for server-side data fetching. Pagination, sorting, or filters often belong in a query key, and external atoms let the app and the table share those values without funneling them through the `injectTable` options initializer (which re-runs whenever a signal read inside it changes).

```ts
import { Component } from '@angular/core'
import { createAtom, injectAtom } from '@tanstack/angular-store'
import { injectQuery } from '@tanstack/angular-query-experimental'
import {
  injectTable,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/angular-table'
import type { PaginationState } from '@tanstack/angular-table'

const features = tableFeatures({
  rowPaginationFeature,
})

@Component({
  /* ... */
})
export class App {
  readonly paginationAtom = createAtom<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // an Angular signal view of the atom for reactive reads
  readonly pagination = injectAtom(this.paginationAtom)

  readonly dataQuery = injectQuery(() => ({
    queryKey: ['data', this.pagination()],
    queryFn: () => fetchData(this.pagination()),
  }))

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.dataQuery.data()?.rows ?? [],
    rowCount: this.dataQuery.data()?.rowCount,
    atoms: {
      pagination: this.paginationAtom,
    },
    manualPagination: true,
  }))

  // table pagination APIs update paginationAtom
}
```

When using the `atoms` option for a slice, you do not need to add the matching `on[State]Change` option. For example, if you pass `atoms.pagination`, table pagination APIs update that atom directly.

See the [Basic External Atoms example](../examples/basic-external-atoms) for a complete working version of this pattern (sorting and pagination owned by atoms), and the [With TanStack Query example](../examples/with-tanstack-query) for the server-side data fetching workflow (that example owns the slice with an Angular signal, but the query-key idea is the same).

#### External State

The classic `state` plus `on[State]Change` pattern is still supported. In Angular this means owning the slice with an Angular signal, passing its current value through `state`, and writing it back in the matching callback. This can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms: every signal write re-runs the `injectTable` options initializer and calls `table.setOptions`. The [Basic External State example](../examples/basic-external-state) shows this pattern in full.

```ts
readonly sorting = signal<SortingState>([])
readonly pagination = signal<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

readonly table = injectTable(() => ({
  features,
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

Use the per-slice `on[State]Change` callbacks to keep controlled table state slices atomic and separated.

The v8-style `onStateChange` option (a single global state callback) is gone in v9. Use per-slice `on[State]Change` callbacks paired with `state.<slice>`, or external atoms via the `atoms` option. If you truly need to observe every state change, subscribe to `table.store` directly.

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

`TableState<typeof features>` is inferred from the features registered on that table:

```ts
type MyTableState = TableState<typeof features>
```
