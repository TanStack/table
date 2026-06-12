---
title: Table State (Lit) Guide
---

## Examples

Want to skip to the implementation? Check out these examples:

- [Basic TableController](../examples/basic-table-controller)
- [Basic App Table](../examples/basic-app-table)
- [Basic External Atoms](../examples/basic-external-atoms)
- [Basic External State](../examples/basic-external-state)

## Table State (Lit) Guide

> **If you boil TanStack Table down to one sentence: TanStack Table is a large state-management coordinator for table states.**

Understanding this guide is fundamental to understanding how TanStack Table works and how to interact with it for the best results.

### Do you need to Manage External State?

You usually do NOT need to manage table state yourself. If you pass nothing to `initialState`, `atoms`, `state`, or any of the `on[State]Change` table options, TanStack Table will manage its own state internally.

There will be situations where you need to customize how you interact with the internal table state, or even hoist it up to your own scopes. TanStack Table lets you read, subscribe to, or own the state slices that matter to your app. This guide explains how table state works in Lit, how to read it, and when to use external atoms or external state.

### State in v9

TanStack Table v9 overhauled state management around TanStack Store. TanStack Store uses the `alien-signals` implementation and supports performant derived state. For Lit, the table adapter wires TanStack Store atoms into a `TableController`.

A table instance has a few state surfaces:

- `table.baseAtoms` are the internal writable atoms created from the resolved initial state.
- `table.atoms` are readonly derived atoms exposed per registered state slice.
- `table.store` is a readonly flat TanStack Store derived by putting all of the registered `table.atoms` together.
- `table.state` is Lit-only selected state. It is the value returned from the selector passed as the second argument to `tableController.table(...)`.

The Lit adapter provides `litReactivity()` to the table's `coreReactivityFeature`. Readonly and writable atoms are TanStack Store atoms. `TableController` subscribes to `table.store` and `table.optionsStore`; atom or options changes flowing through those stores call `host.requestUpdate()`.

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

const table = this.tableController.table({
  features,
  columns,
  data: this._data,
})

table.atoms.pagination.get()
table.atoms.sorting.get()

// table.atoms.rowSelection // TypeScript error unless rowSelectionFeature is registered
```

If `features` does not include a feature, its state should not be available in `table.atoms`, `table.store.state`, `table.state`, `initialState`, `state`, or `atoms`.

### Accessing Table State

There are two different questions when reading table state:

- Do you only need the current value?
- Or should the Lit host update when that value changes?

Use a direct atom or store read for the current value. Use `table.state` or `table.Subscribe` in render output when the host should reflect selected table state.

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

These reads are current-value reads. The `TableController` handles host invalidation through its subscriptions to the table store and options store. If the UI needs to stay reactive to table state changes, use `table.state`, `table.Subscribe`, or a TanStack Store subscription.

#### Reading Reactive State with TableController

The second argument to `tableController.table(...)` is a TanStack Store selector. The selected value is exposed as `table.state`. The default selector selects all registered table state.

```ts
const table = this.tableController.table(
  {
    features,
    columns,
    data: this._data,
  },
  (state) => ({
    pagination: state.pagination,
  }),
)

table.state.pagination
```

#### Selecting State with table.Subscribe

Use `table.Subscribe` in templates to select a slice of table state while rendering.

```ts
${table.Subscribe({
  selector: (state) => ({
    pagination: state.pagination,
  }),
  children: ({ pagination }) => html`
    <span>Page ${pagination.pageIndex + 1}</span>
  `,
})}
```

`table.Subscribe` can also accept a `source`, but in the current Lit adapter host invalidation is wired through the full `table.store` subscription. Treat source mode as a render-time selection convenience, not a guarantee of source-only host invalidation.

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
const table = this.tableController.table({
  features,
  columns,
  data: this._data,
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

If you need easy access to table state in other parts of your application, you can control individual state slices. In v9, external atoms are the recommended way to do this when you want atomic ownership.

#### External Atoms

Use external atoms when the app should own one or more table state slices. Create stable writable atoms with `createAtom` from `@tanstack/store`, pass them to `atoms`, and read them where needed.

```ts
import { createAtom } from '@tanstack/store'
import {
  TableController,
  rowPaginationFeature,
  tableFeatures,
  type PaginationState,
} from '@tanstack/lit-table'

const features = tableFeatures({
  rowPaginationFeature,
})

const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const table = this.tableController.table({
  features,
  columns,
  data: this._data,
  atoms: {
    pagination: paginationAtom,
  },
  manualPagination: true,
})

const pagination = paginationAtom.get()
```

When using the `atoms` option for a slice, you do not need to add the matching `on[State]Change` option.

#### External State

The classic `state` plus `on[State]Change` pattern is still supported. This can be convenient for simple Lit `@state()` integrations or when migrating v8 code, but it is less atomic than external atoms.

```ts
@state()
private _sorting: SortingState = []

protected render() {
  const table = this.tableController.table({
    features,
    columns,
    data: this._data,
    state: {
      sorting: this._sorting,
    },
    onSortingChange: (updater) => {
      this._sorting =
        updater instanceof Function ? updater(this._sorting) : updater
    },
  })

  return html`...`
}
```

The v8-style `onStateChange` option is no longer part of the v9 `TableController` state model. v9 encourages keeping table state slices atomic and separated for performance.

##### On State Change Callbacks

The `on[State]Change` callbacks are useful when you are controlling a matching slice through the `state` option. They receive either a raw value or an updater function.

If you provide an `on[State]Change` callback, also provide the corresponding value in `state`. For example, `onSortingChange` should be paired with `state.sorting`.

```ts
onPaginationChange: (updater) => {
  this._pagination =
    updater instanceof Function ? updater(this._pagination) : updater
}
```

### State Types

Most complex states in TanStack Table have their own TypeScript types that you can import and use.

```ts
import {
  TableController,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableState,
} from '@tanstack/lit-table'

@state()
private _sorting: SortingState = [
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
