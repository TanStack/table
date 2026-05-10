---
title: Table State (Vue) Guide
---

## Examples

Want to skip to the implementation? Check out these examples:

- [Basic useTable](../examples/basic-use-table)
- [Basic External Atoms](../examples/basic-external-atoms)
- [Basic External State](../examples/basic-external-state)
- [With TanStack Query](../examples/with-tanstack-query)

## Table State (Vue) Guide

> **If you boil TanStack Table down to one sentence: TanStack Table is a large state-management coordinator for table states.**

Understanding this guide is fundamental to understanding how TanStack Table works and how to interact with it for the best results.

### Do you need to Manage External State?

You usually do NOT need to manage table state yourself. If you pass nothing to `initialState`, `atoms`, `state`, or any of the `on[State]Change` table options, TanStack Table will manage its own state internally.

There will be situations where you need to customize how you interact with the internal table state, or even hoist it up to your own scopes. TanStack Table lets you read, subscribe to, or own the state slices that matter to your app. This guide explains how table state works in Vue, how to read it, and when to use external atoms or external state.

### State in v9

TanStack Table v9 overhauled state management around TanStack Store. TanStack Store uses the `alien-signals` implementation and supports performant derived state. For Vue, the table adapter supplies custom reactivity so table state atoms are backed by Vue refs and computed values.

A table instance has a few state surfaces:

- `table.baseAtoms` are the internal writable atoms created from the resolved initial state.
- `table.atoms` are readonly derived atoms exposed per registered state slice.
- `table.store` is a readonly flat TanStack Store derived by putting all of the registered `table.atoms` together.
- `table.state` is Vue-only selected state. It is the value returned from the selector passed as the second argument to `useTable`.

The Vue adapter provides `vueReactivity()` to the table's `coreReativityFeature`. Core readonly atoms are Vue `computed` values, writable atoms are `shallowRef` values, and subscriptions are backed by `watch(..., { flush: 'sync' })`. `useTable` also watches reactive option dependencies and controlled state values so it can call `table.setOptions` when Vue state changes.

### Feature-based State

State slices are only created for the features that are registered in `_features`. This keeps TanStack Table tree-shakeable and gives TypeScript more accurate state inference.

```ts
const _features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
})

const table = useTable({
  _features,
  _rowModels: {
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(sortFns),
  },
  columns,
  data,
})

table.atoms.pagination.get()
table.atoms.sorting.get()

// table.atoms.rowSelection // TypeScript error unless rowSelectionFeature is registered
```

If `_features` does not include a feature, its state should not be available in `table.atoms`, `table.store.state`, `table.state`, `initialState`, `state`, or `atoms`.

### Accessing Table State

There are two different questions when reading table state:

- Do you only need the current value?
- Or should Vue render or computed work update when that value changes?

Use a direct atom or store read for the current value. Use selected state, `useSelector`, or `table.Subscribe` when you want Vue to track the selected value.

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

These reads are current-value reads. They only participate in Vue dependency tracking when they are called in a Vue reactive context that tracks those reads. If the UI needs to stay reactive to table state changes, use `table.state`, `table.Subscribe`, or even a `useSelector` hook from TanStack Store.

#### Reading Reactive State with useTable

The second argument to `useTable` is a TanStack Store selector. The selected value is exposed as `table.state`. The default selector selects all registered table state.

```ts
const table = useTable(
  {
    _features,
    _rowModels: {
      paginatedRowModel: createPaginatedRowModel(),
    },
    columns,
    data,
  },
  (state) => ({
    pagination: state.pagination,
  }),
)

table.state.pagination
```

Vue's `data` option can also be a `ref` or `computed`. The adapter unwraps reactive option values and syncs the table when those values change.

```ts
const data = ref(makeData(100))

const table = useTable({
  _features,
  _rowModels: {},
  columns,
  data,
})

data.value = makeData(200)
```

#### Fine-grained Updates with table.Subscribe

Use `table.Subscribe` in render functions or JSX when you want a specific part of the Vue tree to subscribe to a selected table state value.

Without a `source` prop, `table.Subscribe` subscribes to `table.store` and requires a selector. With a `source` prop, it can subscribe directly to one atom or store.

```tsx
<table.Subscribe
  selector={(state) => ({
    columnFilters: state.columnFilters,
    globalFilter: state.globalFilter,
    pagination: state.pagination,
  })}
>
  {() => (
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <tr key={row.id}>...</tr>
      ))}
    </tbody>
  )}
</table.Subscribe>
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
const table = useTable({
  _features,
  _rowModels: {
    sortedRowModel: createSortedRowModel(sortFns),
    paginatedRowModel: createPaginatedRowModel(),
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

If you need easy access to table state in other parts of your application, you can control individual state slices. In v9, external atoms are the recommended way to do this when you want atomic ownership and fine-grained Vue updates.

#### External Atoms

Use external atoms when the app should own one or more table state slices. Create stable writable atoms with `createAtom`, pass them to `atoms`, and subscribe to them with `useSelector`.

```ts
import { createAtom, useSelector } from '@tanstack/vue-store'
import {
  rowPaginationFeature,
  tableFeatures,
  useTable,
  type PaginationState,
} from '@tanstack/vue-table'

const _features = tableFeatures({
  rowPaginationFeature,
})

const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const pagination = useSelector(paginationAtom)

const table = useTable({
  _features,
  _rowModels: {},
  columns,
  data: tableData,
  rowCount,
  atoms: {
    pagination: paginationAtom,
  },
  manualPagination: true,
})

// pagination.value is reactive, and table pagination APIs update paginationAtom
```

When using the `atoms` option for a slice, you do not need to add the matching `on[State]Change` option.

#### External State

The classic `state` plus `on[State]Change` pattern is still supported. This can be convenient for simple integrations or when migrating v8 code, but it is less atomic than external atoms.

```ts
const sorting = ref<SortingState>([])
const pagination = ref<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const table = useTable({
  _features,
  _rowModels: {
    sortedRowModel: createSortedRowModel(sortFns),
    paginatedRowModel: createPaginatedRowModel(),
  },
  columns,
  data,
  state: {
    get sorting() {
      return sorting.value
    },
    get pagination() {
      return pagination.value
    },
  },
  onSortingChange: (updater) => {
    sorting.value = updater instanceof Function ? updater(sorting.value) : updater
  },
  onPaginationChange: (updater) => {
    pagination.value =
      updater instanceof Function ? updater(pagination.value) : updater
  },
})
```

The v8-style `onStateChange` option is no longer part of the v9 `useTable` state model. v9 encourages keeping table state slices atomic and separated for performance.

##### On State Change Callbacks

The `on[State]Change` callbacks are useful when you are controlling a matching slice through the `state` option. They receive either a raw value or an updater function.

If you provide an `on[State]Change` callback, also provide the corresponding value in `state`. For example, `onSortingChange` should be paired with `state.sorting`.

```ts
onPaginationChange: (updater) => {
  pagination.value =
    updater instanceof Function ? updater(pagination.value) : updater
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
} from '@tanstack/vue-table'

const sorting = ref<SortingState>([
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
