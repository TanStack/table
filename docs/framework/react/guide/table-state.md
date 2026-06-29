---
title: Table State (React) Guide
---

## Examples

Want to skip to the implementation? Check out these examples:

- [Basic useTable](../examples/basic-use-table)
- [Basic External Atoms](../examples/basic-external-atoms)
- [Basic External State](../examples/basic-external-state)
- [Basic Subscribe](../examples/basic-subscribe)
- [With TanStack Query](../examples/with-tanstack-query)

## Table State (React) Guide

> **If you boil TanStack Table down to one sentence: TanStack Table is a large state-management coordinator for table states.** 

Understanding this guide is fundamental to understanding how TanStack Table works and how to interact with it for the best results.

### Do you need to Manage External State?

You usually do NOT need to manage table state yourself. If you pass nothing to `initialState`, `atoms`, `state`, or any of the `on[State]Change` table options, TanStack Table will manage its own state internally.

There will be situations where you need to customize how you interact with the internal table state, or even hoist it up to your own scopes. TanStack Table lets you read, subscribe to, or own the state slices that matter to your app. This guide explains how table state works in React, how to read it, and when to use external atoms or external state.

### State in v9

TanStack Table v9 overhauled state management around TanStack Store. TanStack Store uses the `alien-signals` implementation and supports performant derived state. For TanStack Table, this means the table can derive a full state store from independent state atoms and React can subscribe to only the pieces of table state that a component actually needs.

A table instance has a few state surfaces:

- `table.baseAtoms` are the internal writable atoms created from the resolved initial state.
- `table.atoms` are readonly derived atoms exposed per registered state slice.
- `table.store` is a readonly flat TanStack Store derived by putting all of the registered `table.atoms` together.
- `table.state` is React-only selected state. It is the value returned from the selector passed as the second argument to `useTable`.

The important change from previous versions is that table state is now atomic. React can subscribe to all selected state, a selected subset of state, or a single atom such as `table.atoms.rowSelection`.

### Feature-based State

State slices are only created for the features that are registered in `features`. This keeps TanStack Table tree-shakeable and gives TypeScript more accurate state inference.

For example, if `features` includes `rowPaginationFeature`, TypeScript exposes pagination state APIs and `table.atoms.pagination`. If `features` does not include `rowPaginationFeature`, `pagination` should not be available in `table.atoms`, `table.store.state`, `table.state`, `initialState`, `state`, or `atoms`.

```tsx
const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const table = useTable({
  features,
  columns,
  data,
})

table.atoms.pagination.get()
table.atoms.sorting.get()

// table.atoms.rowSelection // TypeScript error unless rowSelectionFeature is registered
```

The same feature-based typing applies to built-in features and custom feature-provided state.

### Accessing Table State

There are two different questions when reading table state:

- Do you only need the current value?
- Or should this React component re-render when that value changes?

Use a direct atom or store read for the current value. Use a selector subscription for reactive rendering.

#### Reading State Without Subscribing

The simplest and most performant way to read a current state value is to read the matching atom:

```tsx
const pagination = table.atoms.pagination.get()
const sorting = table.atoms.sorting.get()
```

You can also read the current flat store snapshot:

```tsx
const tableState = table.store.state
const pagination = table.store.state.pagination
```

These reads are not React subscriptions. Calling `table.atoms.pagination.get()` or `table.store.state.pagination` during render reads the current value, but future changes will not automatically re-render that component unless something else causes a render. If the UI needs to stay reactive to table state changes, use `useTable` state selection, `table.Subscribe`, or even a `useSelector` hook from TanStack Store.

#### Reading Reactive State with useTable

The second argument to `useTable` is a TanStack Store selector. By default, the selector effectively selects all registered table state, so `table.state` contains the full state and the component re-renders when any selected state changes.

You can pass your own selector to make `table.state` contain only the reactive state values that you want to cause re-renders. The React adapter compares selected values shallowly. The default selector selects all registered table state.

```tsx
const table = useTable(
  {
    features,
    columns,
    data,
  },
  (state) => ({
    pagination: state.pagination,
  }),
)

table.state.pagination
```

For large tables, you can also opt the parent table component out of table-state re-renders and subscribe lower in the tree:

```tsx
const table = useTable(
  {
    features,
    columns,
    data,
  },
  () => null,
)
```

With this pattern, the parent component will not re-render for table state changes. Put reactive reads inside `table.Subscribe` where the UI actually needs them.

#### Optimizing Re-renders with Selectors and table.Subscribe

Use `table.Subscribe` when you want table-state re-renders to happen at a specific place in the React tree. This is useful for large or expensive tables, but it is usually something to reach for after the default `useTable` selector becomes a visible performance issue.

Without a `source` prop, `table.Subscribe` subscribes to `table.store` and requires a selector. With a `source` prop, it can subscribe directly to one atom or store, such as `table.atoms.rowSelection`.

```tsx
const table = useTable(
  {
    features,
    columns,
    data,
  },
  () => null,
)

return (
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
)
```

You can also subscribe directly to a single atom and select one value from it:

```tsx
<table.Subscribe
  source={table.atoms.rowSelection}
  selector={(rowSelection) => rowSelection[row.id]}
>
  {(isSelected) => (
    <input
      type="checkbox"
      checked={!!isSelected}
      onChange={row.getToggleSelectedHandler()}
    />
  )}
</table.Subscribe>
```

Advanced subscription patterns require understanding which table APIs depend on which state slices. For example, a row model may depend on filtering, sorting, and pagination, while one row selection checkbox may only need one row's selection value. Start with the default selector, then optimize with selectors and `table.Subscribe` where render cost matters.

#### Subscribe for React Compiler Compatibility

`useTable` itself was significantly reworked in the v9 upgrade for React Compiler compatibility. It returns a fresh `table` reference on every state change so that the compiler invalidates JSX dependent on it. For most tables that's enough. But state isn't only read through `table`. It's also read through `column.getIsPinned()`, `row.getIsSelected()`, `cell.getIsAggregated()`, `header.column.getCanSort()`, and similar builder-pattern APIs. Those method calls hide their state dependencies from the compiler. When you split header / cell / row rendering into nested React components, the compiler can memoize the inner JSX against the stable `column` / `row` / `cell` / `header` references it sees, and those state-dependent reads never get re-evaluated.

The symptoms are subtle and look like rendering bugs: row-selection checkboxes that don't reflect clicks, pin buttons that don't update, sort indicators that go stale. This is most visible in tables that wrap header or cell rendering inside custom components (for example, a DnD-enabled table where each header is rendered through a `DraggableTableHeader` component, or where you've broken a column's `cell` template out into a named React component for re-use).

`table.Subscribe` (or the standalone `Subscribe` from `@tanstack/react-table`) is the supported way to work around this. It exposes the underlying TanStack Store subscription as a render-prop using `useSelector` under the hood, a hook the compiler recognizes as a real reactive dependency. The JSX inside re-runs on every selected state change, so the builder-pattern reads return current values.

```tsx
import { Subscribe } from '@tanstack/react-table'

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      // work around react compiler memoization for nested components using table APIs
      <Subscribe source={table.store} selector={(s) => s.rowSelection}>
        {() => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        )}
      </Subscribe>
    ),
    cell: ({ row, table }) => (
      // work around react compiler memoization for nested components using row APIs
      <Subscribe
        source={table.atoms.rowSelection}
        selector={(s) => s[row.id]}
      >
        {(isSelected) => (
          <input
            type="checkbox"
            checked={!!isSelected}
            onChange={row.getToggleSelectedHandler()}
          />
        )}
      </Subscribe>
    ),
  }),
])
```

You only need `Subscribe` for UI that reads through TanStack Table's method APIs from inside a component that React Compiler is allowed to memoize. Simpler tables (where headers and cells are rendered inline in the parent component) usually don't need this, because the compiler always re-evaluates inline JSX when the parent re-renders. Reach for `Subscribe` once you start factoring header / cell templates into custom child components.

**Tips:**

- For UI that depends on multiple state slices, return an object from the selector:
  ```tsx
  <Subscribe
    source={table.store}
    selector={(s) => ({ rowSelection: s.rowSelection, rowPinning: s.rowPinning })}
  >
    {() => /* checkbox + pin button */}
  </Subscribe>
  ```
- For per-row or per-column UI, prefer subscribing to a specific atom (`table.atoms.rowSelection`, `table.atoms.columnPinning`, etc.) so only that row's or column's component re-renders on changes.
- Inside cell / header render contexts, the `table` field is typed as the core `Table<TFeatures, TData>`, so `table.Subscribe` isn't available there. Import the standalone `Subscribe` component and pass `source={table.store}` instead. From a top-level component that holds the `ReactTable` returned by `useTable`, `table.Subscribe` works.
- See the [Kitchen Sink](../examples/kitchen-sink) example for a table that combines every stock feature and uses `Subscribe` to stay correct under React Compiler.

### Setting Table State

You should almost never need to set table state directly. TanStack Table features expose dedicated APIs for interacting with their state, and those APIs are the safest way to make changes because they preserve the feature's own rules and related updates.

For example, use pagination APIs instead of mutating pagination state yourself:

```tsx
table.nextPage()
table.previousPage()
table.setPageIndex(0)
table.setPageSize(25)
```

The same idea applies across features. Use APIs like `table.setSorting(...)`, `table.setColumnFilters(...)`, `column.toggleVisibility()`, or `row.toggleSelected()` instead of manually editing the underlying state object.

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
const table = useTable({
  features,
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

```tsx
table.resetSorting()
table.resetPagination()
table.resetPagination(true)
```

Slice reset APIs like `resetPagination()` update through that feature's state updater and can update an externally owned atom. The core `table.reset()` API resets the internal base atoms, so do not use it as the primary way to reset state that is owned by external atoms.

### Controlled State

If you need easy access to table state in other parts of your application, you can control individual state slices. In v9, external atoms are the recommended way to do this because they preserve the atomic state model and let React subscribe to exactly the slices it needs.

#### External Atoms

Use external atoms when the app should own one or more table state slices. Create stable writable atoms with `useCreateAtom` from TanStack Store, pass them to the table's `atoms` option, and subscribe to them with `useSelector` anywhere else in your app.

This is especially useful for server-side data fetching. Pagination, sorting, or filters often belong in a query key, and external atoms let the app and the table share those values without lifting the entire table state through React state.

```tsx
import { useCreateAtom, useSelector } from '@tanstack/react-store'
import {
  rowPaginationFeature,
  tableFeatures,
  useTable,
  type PaginationState,
} from '@tanstack/react-table'

const features = tableFeatures({
  rowPaginationFeature,
})

function App() {
  const paginationAtom = useCreateAtom<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const pagination = useSelector(paginationAtom)

  const dataQuery = useQuery({
    queryKey: ['data', pagination],
    queryFn: () => fetchData(pagination),
  })

  const table = useTable({
    features,
    columns,
    data: dataQuery.data?.rows ?? [],
    rowCount: dataQuery.data?.rowCount,
    atoms: {
      pagination: paginationAtom,
    },
    manualPagination: true,
  })

  // table pagination APIs update paginationAtom
}
```

When using the `atoms` option for a slice, you do not need to add the matching `on[State]Change` option. For example, if you pass `atoms.pagination`, table pagination APIs update that atom directly.

#### External State

The classic `state` plus `on[State]Change` pattern is still supported. This can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. React state updates re-render the owner component, and that render cannot be avoided by the `useTable` selector in the same way atom subscriptions can be placed lower in the tree.

To control a slice with external state, pass both the state value and the matching callback:

```tsx
const [sorting, setSorting] = React.useState<SortingState>([])
const [pagination, setPagination] = React.useState<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const table = useTable({
  features,
  columns,
  data,
  state: {
    sorting,
    pagination,
  },
  onSortingChange: setSorting,
  onPaginationChange: setPagination,
})
```

The v8-style `onStateChange` option (a single global state callback) is gone in v9. It is not supported by `useTable` or `useLegacyTable`. Use per-slice `on[State]Change` callbacks paired with `state.<slice>`, or external atoms via the `atoms` option. If you truly need to observe every state change, subscribe to `table.store` directly.

##### On State Change Callbacks

The `on[State]Change` callbacks are useful when you are controlling a matching slice through the `state` option. They work like React state setters: an updater can be a raw value or a function that receives the previous value and returns the next value.

If you provide an `on[State]Change` callback, also provide the corresponding value in `state`. For example, `onSortingChange` should be paired with `state.sorting`.

```tsx
const [sorting, setSorting] = React.useState<SortingState>([])

const table = useTable({
  features,
  columns,
  data,
  state: {
    sorting,
  },
  onSortingChange: setSorting,
})
```

If you need to add logic inside a callback, check whether the incoming updater is a function or a value:

```tsx
const [pagination, setPagination] = React.useState<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const table = useTable({
  features,
  columns,
  data,
  state: {
    pagination,
  },
  onPaginationChange: (updater) => {
    setPagination((old) => {
      const next = updater instanceof Function ? updater(old) : updater

      // side effects or validation can happen here

      return next
    })
  },
})
```

### State Types

Most complex states in TanStack Table have their own TypeScript types that you can import and use. This is useful for React state, external atoms, and helper functions that work with table state.

```tsx
import {
  useTable,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableState,
} from '@tanstack/react-table'

const [sorting, setSorting] = React.useState<SortingState>([
  {
    id: 'age',
    desc: true,
  },
])
```

`TableState<typeof features>` is inferred from the features registered on that table:

```tsx
const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
})

type MyTableState = TableState<typeof features>
```

Prefer feature-specific state types like `SortingState`, `PaginationState`, or `RowSelectionState` when you are creating local state or external atoms for one slice.
