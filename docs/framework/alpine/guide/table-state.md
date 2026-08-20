---
title: Table State (Alpine) Guide
---

## Examples

Want to skip to the implementation? Check out these examples:

- [Basic createTable](../examples/basic-create-table)
- [Basic External Atoms](../examples/basic-external-atoms)
- [Basic External State](../examples/basic-external-state)

## Table State (Alpine) Guide

> **If you boil TanStack Table down to one sentence: TanStack Table is a large state-management coordinator for table states.**

Understanding this guide is fundamental to understanding how TanStack Table works and how to interact with it for the best results.

### Do you need to Manage External State?

You usually do NOT need to manage table state yourself. If you pass nothing to `initialState`, `atoms`, `state`, or any of the `on[State]Change` table options, TanStack Table will manage its own state internally.

There will be situations where you need to customize how you interact with the internal table state, or even hoist it up to your own scopes. TanStack Table lets you read, subscribe to, or own the state slices that matter to your app. This guide explains how table state works in Alpine, how to read it, and when to use external atoms or external state.

### State in v9

TanStack Table v9 overhauled state management around TanStack Store. TanStack Store uses the `alien-signals` implementation and supports performant derived state.

A table instance has a few state surfaces:

- `table.baseAtoms` are the internal writable atoms created from the resolved initial state.
- `table.atoms` are readonly derived atoms exposed per registered state slice.
- `table.store` is a readonly flat TanStack Store derived by putting all of the registered `table.atoms` together.

The Alpine adapter provides `alpineReactivity()` to the table's `coreReactivityFeature`, so the atoms are backed directly by TanStack Store. `createTable` then makes the instance reactive to Alpine: it returns the table wrapped in a proxy and subscribes to `table.store`. Because of this, any reactive Alpine binding that reads a table API re-runs when state changes, whether that read is in `x-text`, `x-html`, `x-for`, `x-if`, a bound attribute (`:value`), `x-effect`, or a getter/method on your `Alpine.data` object. (Event handlers like `@click` are not reactive; they simply read the current value whenever they fire.) You do not pass a state selector, and there is no `table.Subscribe`: reactivity is automatic per binding. When any registered slice changes, Alpine re-evaluates the bindings that read table APIs and patches only the DOM that actually changed.

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
    return local.data
  },
})

table.atoms.pagination.get()
table.atoms.sorting.get()

// table.atoms.rowSelection // TypeScript error unless rowSelectionFeature is registered
```

If `features` does not include a feature, its state should not be available in `table.atoms`, `table.store.get()`, `initialState`, `state`, or `atoms`.

### Accessing Table State

There are two different questions when reading table state:

- Do you only need the current value?
- Or should the markup update when that value changes?

Use direct atom reads for slice values. Use `table.store.get()` for the current flat state snapshot. Because the adapter makes table reads reactive, both update your markup automatically when read inside an Alpine binding.

#### Reading State

The simplest and most performant way to read a current state value is to read the matching atom:

```ts
const pagination = table.atoms.pagination.get()
const sorting = table.atoms.sorting.get()
```

You can also read the current flat store snapshot:

```ts
const tableState = table.store.get()
const pagination = table.store.get().pagination
```

Prefer `table.atoms.<slice>.get()` for narrow reads. Use `table.store.get()` for full-state debug output or when a binding intentionally depends on the whole table state.

#### Reading State Reactively in Markup

Because the table instance is reactive, you read state directly in your Alpine expressions. There is nothing extra to subscribe to: each binding tracks the table reads inside it and re-runs when they change.

```html
<span>
  Page
  <span x-text="table.atoms.pagination.get().pageIndex + 1"></span>
  of
  <span x-text="table.getPageCount()"></span>
</span>

<!-- full-state debug output -->
<pre x-text="JSON.stringify(table.store.get(), null, 2)"></pre>
```

For derived values, expose a getter or method on your `Alpine.data` object. These run inside Alpine's reactivity, so reading a table API from them stays reactive:

```ts
Alpine.data('table', () => {
  const local = Alpine.reactive({ data: makeData(1_000) })

  const table = createTable({
    features,
    columns,
    get data() {
      return local.data
    },
  })

  return {
    table,
    FlexRender,
    // derived value used from the template
    get pageCount() {
      return table.getPageCount()
    },
    sortIndicator(isSorted: false | 'asc' | 'desc') {
      return { asc: ' 🔼', desc: ' 🔽' }[isSorted as string] ?? ''
    },
  }
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
const table = createTable({
  features,
  columns,
  get data() {
    return local.data
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

> [!NOTE]
> Do not provide the same state slice in multiple ownership places unless you intentionally want one to win. For a slice like `pagination`, prefer exactly one of `initialState.pagination`, `atoms.pagination`, or `state.pagination` as the source of truth. The precedence is `atoms[key]` > `state[key]` > internal `baseAtoms[key]`: external atoms take precedence over external `state`, and external `state` syncs into the table's internal base atom.

#### Resetting to Initial State

Feature reset APIs reset to `table.initialState` by default. Many reset APIs also accept `true` to reset to that feature's blank/default state instead:

```ts
table.resetSorting()
table.resetPagination()
table.resetPagination(true)
```

Slice reset APIs like `resetPagination()` update through that feature's state updater and can update an externally owned atom. The core `table.reset()` API resets the internal base atoms, so do not use it as the primary way to reset state that is owned by external atoms.

### Controlled State

If you need easy access to table state in other parts of your application, you can control individual state slices. In Alpine, you have two options: own the slice in an external TanStack Store atom (good for sharing across modules or subscribing outside the table), or own it in `Alpine.reactive` state and connect it with `state` plus `on[State]Change`.

#### External Atoms

Use external atoms when the app should own one or more table state slices as TanStack Store atoms. `@tanstack/store` is already a dependency of `@tanstack/alpine-table`, so `createAtom` is available. Create stable writable atoms, pass them to the `atoms` option, and read, write, or subscribe to them from anywhere.

```ts
import { createAtom } from '@tanstack/store'
import {
  createTable,
  rowPaginationFeature,
  tableFeatures,
  type PaginationState,
} from '@tanstack/alpine-table'

const features = tableFeatures({
  rowPaginationFeature,
})

// Create stable external atoms at module scope (or in a shared store module)
const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

Alpine.data('table', () => {
  const local = Alpine.reactive({ data: makeData(1_000) })

  const table = createTable({
    features,
    columns,
    get data() {
      return local.data
    },
    atoms: {
      pagination: paginationAtom,
    },
  })

  return { table, FlexRender }
})
```

Reads and writes for `pagination` are now routed through `paginationAtom` instead of the internal base atom. Atom changes flow through the derived `table.store`, which the adapter subscribes to, so the template re-renders. You can also subscribe to the atom directly from anywhere with `paginationAtom.subscribe(...)`. When using the `atoms` option for a slice, you do not need to add the matching `on[State]Change` option.

#### External State

Use `state` plus `on[State]Change` when an `Alpine.reactive` object should own a table state slice. Read the controlled slices through getters inside `state`: that is what lets the adapter re-apply options when they change.

```ts
const local = Alpine.reactive({
  data: makeData(1_000),
  sorting: [] as SortingState,
  pagination: { pageIndex: 0, pageSize: 10 },
})

const table = createTable({
  features,
  columns,
  get data() {
    return local.data
  },
  // connect our external state back down to the table via getters
  state: {
    get sorting() {
      return local.sorting
    },
    get pagination() {
      return local.pagination
    },
  },
  onSortingChange: (updater) => {
    // raise sorting state changes to our own state management
    local.sorting =
      typeof updater === 'function' ? updater(local.sorting) : updater
  },
  onPaginationChange: (updater) => {
    // raise pagination state changes to our own state management
    local.pagination =
      typeof updater === 'function' ? updater(local.pagination) : updater
  },
})
```

Use the per-slice `on[State]Change` callbacks to keep controlled table state slices atomic and separated.

##### On State Change Callbacks

The `on[State]Change` callbacks are useful when you are controlling a matching slice through the `state` option. They work like setters: an updater can be a raw value or a function that receives the previous value and returns the next value.

If you provide an `on[State]Change` callback, also provide the corresponding value in `state`. For example, `onSortingChange` should be paired with `state.sorting`.

```ts
onPaginationChange: (updater) => {
  local.pagination =
    updater instanceof Function ? updater(local.pagination) : updater

  // side effects or validation can happen here
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
} from '@tanstack/alpine-table'

const local = Alpine.reactive({
  sorting: [{ id: 'age', desc: true }] as SortingState,
})
```

`TableState<typeof features>` is inferred from the features registered on that table:

```ts
type MyTableState = TableState<typeof features>
```
