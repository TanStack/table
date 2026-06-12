---
title: Table State (Solid) Guide
---

## Examples

Want to skip to the implementation? Check out these examples:

- [Basic createTable](../examples/basic-use-table)
- [Basic External Atoms](../examples/basic-external-atoms)
- [Basic External State](../examples/basic-external-state)
- [With TanStack Query](../examples/with-tanstack-query)

## Table State (Solid) Guide

> **If you boil TanStack Table down to one sentence: TanStack Table is a large state-management coordinator for table states.**

Understanding this guide is fundamental to understanding how TanStack Table works and how to interact with it for the best results.

### Do you need to Manage External State?

You usually do NOT need to manage table state yourself. If you pass nothing to `initialState`, `atoms`, `state`, or any of the `on[State]Change` table options, TanStack Table will manage its own state internally.

There will be situations where you need to customize how you interact with the internal table state, or even hoist it up to your own scopes. TanStack Table lets you read, subscribe to, or own the state slices that matter to your app. This guide explains how table state works in Solid, how to read it, and when to use external atoms or external state.

### State in v9

TanStack Table v9 overhauled state management around TanStack Store. TanStack Store uses the `alien-signals` implementation and supports performant derived state. For Solid, the table adapter supplies custom reactivity so table state atoms are backed by Solid primitives.

A table instance has a few state surfaces:

- `table.baseAtoms` are the internal writable atoms created from the resolved initial state.
- `table.atoms` are readonly derived atoms exposed per registered state slice.
- `table.store` is a readonly flat TanStack Store derived by putting all of the registered `table.atoms` together.

The Solid adapter provides `solidReactivity(owner)` to the table's `coreReactivityFeature`. Core readonly atoms are Solid `createMemo` values and core writable atoms are Solid `createSignal` values. Because atom `.get()` reads through Solid signals and memos, table APIs can be consumed inside Solid computations and update only the computations that read the relevant state.

### Feature-based State

State slices are only created for the features that are registered in `features`. This keeps TanStack Table tree-shakeable and gives TypeScript more accurate state inference.

```tsx
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
    return data()
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
- Or should a Solid computation update when that value changes?

Use direct atom reads for slice values. Use `table.store.get()` for the current flat state snapshot. Because Solid table atoms are backed by Solid signals and memos, atom reads participate in Solid dependency tracking when they happen inside JSX, `createMemo(...)`, `createEffect(...)`, or `table.Subscribe`.

#### Reading State

The simplest and most performant way to read a current state value is to read the matching atom:

```tsx
const pagination = table.atoms.pagination.get()
const sorting = table.atoms.sorting.get()
```

You can also read the current flat store snapshot:

```tsx
const tableState = table.store.get()
const pagination = table.store.get().pagination
```

These reads are current-value reads. They only participate in Solid dependency tracking when they are called inside a Solid reactive scope that tracks those reads. Prefer `table.atoms.<slice>.get()` for narrow reactive reads. Use `table.store.get()` for full-state debug output or when a computation intentionally depends on the whole table state.

#### Reading Reactive State with Solid

Use Solid's native primitives to derive reactive values from table atoms or the flat store snapshot.

```tsx
const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
})

const pagination = createMemo(() => table.atoms.pagination.get())
const pageIndex = createMemo(() => pagination().pageIndex)

const tableStateJson = createMemo(() =>
  JSON.stringify(table.store.get(), null, 2),
)
```

You can use atom reads directly in JSX too:

```tsx
<span>
  Page {table.atoms.pagination.get().pageIndex + 1} of {table.getPageCount()}
</span>
```

#### Fine-grained Updates with table.Subscribe

Use `table.Subscribe` when you want a specific part of the Solid tree to create a reactive render boundary. Its child function receives `table.atoms`. As with any Solid component, the child function body runs once and is untracked, so perform atom reads inside JSX expressions or in thunks called from JSX; Solid tracks only those reads.

```tsx
<table.Subscribe>
  {(atoms) => {
    // a thunk: the reads run (and track) when JSX calls it, not in the body
    const rows = () => {
      atoms.columnFilters.get()
      atoms.globalFilter.get()
      atoms.pagination.get()
      return table.getRowModel().rows
    }

    return (
      <tbody>
        <For each={rows()}>
          {(row) => <tr>{/* ... */}</tr>}
        </For>
      </tbody>
    )
  }}
</table.Subscribe>
```

```tsx
<table.Subscribe>
  {(atoms) => (
    <tbody>
      <For each={table.getRowModel().rows}>
        {(row) => {
          const isSelected = () => atoms.rowSelection.get()[row.id]

          return (
            <tr>
              <td>
                <input
                  type="checkbox"
                  checked={!!isSelected()}
                  onChange={row.getToggleSelectedHandler()}
                />
              </td>
            </tr>
          )
        }}
      </For>
    </tbody>
  )}
</table.Subscribe>
```

### Setting Table State

You should almost never need to set table state directly. TanStack Table features expose dedicated APIs for interacting with their state, and those APIs are the safest way to make changes.

```tsx
table.nextPage()
table.previousPage()
table.setPageIndex(0)
table.setPageSize(25)
```

Use APIs like `table.setSorting(...)`, `table.setColumnFilters(...)`, `column.toggleVisibility()`, or `row.toggleSelected()` instead of manually editing the underlying state object.

If you only care about setting starting values, use `initialState`. If you want to reset a state slice back to its initial value, use that feature's reset API.

If you really do need to write a state slice directly, the low-level write surface for internally owned state is the matching base atom:

```tsx
table.baseAtoms.pagination.set((old) => ({
  ...old,
  pageIndex: 0,
}))
```

Direct base atom writes should be rare. If a slice is owned by an external atom passed through `atoms`, write to that external atom instead; `table.atoms.pagination` will read from the external atom, not the internal base atom.

### Custom Initial State

If you only need to customize the starting value for some table state, use `initialState`. You still do not need to manage that state yourself.

`initialState` only applies to registered state slices. It is used to create the table's initial state and is also used by reset APIs such as `table.resetSorting()` or `table.resetPagination()`. Changing the `initialState` object later does not reset table state.

```tsx
const table = createTable({
  features,
  columns,
  get data() {
    return data()
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

```tsx
table.resetSorting()
table.resetPagination()
table.resetPagination(true)
```

Slice reset APIs like `resetPagination()` update through that feature's state updater and can update an externally owned atom. The core `table.reset()` API resets the internal base atoms, so do not use it as the primary way to reset state that is owned by external atoms.

### Controlled State

If you need easy access to table state in other parts of your application, you can control individual state slices. In Solid, use native signals with `state` plus `on[State]Change` when you want Solid to own the slice. Use external TanStack Store atoms when you already want app-level atom sharing or direct atom subscriptions outside the table.

#### External Atoms

Use external atoms when the app should own one or more table state slices as TanStack Store atoms. Create stable writable atoms with `createAtom`, pass them to `atoms`, and subscribe to them with `useSelector` anywhere else in your app. `@tanstack/solid-store` is only needed by your app if you choose this pattern; the Solid table adapter itself uses Solid-native reactivity.

```tsx
import { createAtom, useSelector } from '@tanstack/solid-store'
import {
  createTable,
  rowPaginationFeature,
  tableFeatures,
  type PaginationState,
} from '@tanstack/solid-table'

const features = tableFeatures({
  rowPaginationFeature,
})

const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const pagination = useSelector(paginationAtom)

const dataQuery = useQuery(() => ({
  queryKey: ['data', pagination()],
  queryFn: () => fetchData(pagination()),
}))

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
```

When using the `atoms` option for a slice, you do not need to add the matching `on[State]Change` option.

#### External State

Use `state` plus `on[State]Change` when Solid signals should own a table state slice.

```tsx
const [sorting, setSorting] = createSignal<SortingState>([])
const [pagination, setPagination] = createSignal<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
  state: {
    get sorting() {
      return sorting()
    },
    get pagination() {
      return pagination()
    },
  },
  onSortingChange: setSorting,
  onPaginationChange: setPagination,
})
```

Use the per-slice `on[State]Change` callbacks to keep controlled table state slices atomic and separated.

##### On State Change Callbacks

The `on[State]Change` callbacks are useful when you are controlling a matching slice through the `state` option. They work like setters: an updater can be a raw value or a function that receives the previous value and returns the next value.

If you provide an `on[State]Change` callback, also provide the corresponding value in `state`. For example, `onSortingChange` should be paired with `state.sorting`.

```tsx
onPaginationChange: (updater) => {
  setPagination((old) => {
    const next = updater instanceof Function ? updater(old) : updater

    // side effects or validation can happen here

    return next
  })
}
```

### State Types

Most complex states in TanStack Table have their own TypeScript types that you can import and use.

```tsx
import {
  createTable,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableState,
} from '@tanstack/solid-table'

const [sorting, setSorting] = createSignal<SortingState>([
  {
    id: 'age',
    desc: true,
  },
])
```

`TableState<typeof features>` is inferred from the features registered on that table:

```tsx
type MyTableState = TableState<typeof features>
```
