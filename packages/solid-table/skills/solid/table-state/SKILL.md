---
name: solid/table-state
description: >
  Reactivity, atom subscription, and rendering for `@tanstack/solid-table` v9.
  Covers `createTable(options, selector?)`, the `table.state()` accessor (callable, not a value),
  `table.Subscribe`, `FlexRender`, native `createSignal`/`createMemo` reactivity,
  `solidReactivity` (readonly atoms = memos, writable atoms = signals), and
  `@tanstack/solid-store` (`createAtom`, `useSelector`) for external slices.
type: framework
library: tanstack-table
framework: solid
library_version: '9.0.0-alpha.48'
requires:
  - state-management
  - setup
sources:
  - docs/framework/solid/guide/table-state.md
  - docs/framework/solid/solid-table.md
  - packages/solid-table/src/createTable.ts
  - packages/solid-table/src/reactivity.ts
  - packages/solid-table/src/FlexRender.tsx
  - packages/solid-table/src/createTableHook.tsx
  - examples/solid/basic-use-table/
  - examples/solid/basic-external-atoms/
  - examples/solid/basic-external-state/
---

# Solid Table State, Subscribe & createTableHook

TanStack Table v9 is a state-management coordinator. The Solid adapter wires that
coordinator into Solid's fine-grained reactivity. Readonly atoms are backed by
`createMemo`. Writable atoms are backed by `createSignal`. Most Solid tables read
state directly through table APIs inside reactive scopes and never need
`table.Subscribe`.

## Mental model

A `createTable(...)` call produces a `SolidTable` with several state surfaces:

- `table.baseAtoms.<slice>` — internal writable TanStack Store atoms. Treat these as write plumbing, not a render read surface.
- `table.atoms.<slice>` — readonly derived atoms (memos). One per registered feature slice. Use `table.atoms.pagination.get()` for slice-level reactive reads.
- `table.store` — flat readonly TanStack Store snapshot for explicit subscriptions. Prefer `table.state()` or `table.atoms.<slice>.get()` in JSX.
- `table.state()` — **a Solid accessor**, not a value. Returns the result of the selector passed as the second argument to `createTable`. Default selector is identity.

State slices only exist for features registered through `features`. If
`rowSortingFeature` is not in `features`, then `table.atoms.sorting`,
`table.state().sorting`, and `state.sorting` are all absent (TS error + missing at runtime).

## Creating a table — native signals

`createTable(options, selector?)`. Use getters on reactive options like `data` so
the table tracks the upstream signal.

```tsx
import { createTable, tableFeatures, type ColumnDef } from '@tanstack/solid-table'
import { createSignal, For } from 'solid-js'

const features = tableFeatures({})

function App() {
  const [data, setData] = createSignal<Array<Person>>([])

  const table = createTable({
    features,
    columns,
    // Reactive getter — required so the table re-derives when data() changes.
    get data() {
      return data()
    },
  })

  return <For each={table.getRowModel().rows}>{(row) => /* ... */}</For>
}
```

> Missing the getter on `data` is the most common Solid-specific bug.
> `data: data()` reads once at table construction; `get data() { return data() }`
> tracks the signal.

## Reading state — `table.state()` is an accessor

This is the **#1 Solid failure mode**: agents who learned React patterns try to
read `table.state.sorting`. In Solid, `table.state` is an `Accessor<TSelected>` —
it must be called.

```tsx
// ❌ WRONG — `state` is the accessor function itself, not a value
table.state.sorting

// ✅ CORRECT — call the accessor first, then read the slice
table.state().sorting
```

Pass a selector to narrow what `table.state()` returns:

```tsx
const table = createTable(
  {
    features,
    columns,
    get data() {
      return data()
    },
  },
  (state) => ({ pagination: state.pagination }),
)

// Reactive in JSX / createMemo / createEffect:
const pageIndex = () => table.state().pagination.pageIndex
```

`table.state()` is also reactive inside Solid computations — `createMemo`,
`createEffect`, JSX expressions, and `<For>` all track it.

## Three ways to read state, ranked

1. **Native Solid reactive read.** Inside any tracking scope (JSX, `createMemo`,
   `createEffect`), call any atom-driven API or `table.state()` directly. Solid
   handles the dependency.

   ```tsx
   <div>Page {table.state().pagination.pageIndex + 1}</div>
   <button disabled={!table.getCanNextPage()}>Next</button>
   ```

2. **Untracked current value.** Read `.get()` or the flat store outside a
   tracking scope (e.g. inside a handler) when you only need a snapshot.

   ```tsx
   const onClick = () => {
     const current = table.atoms.pagination.get()
     console.log(current.pageIndex)
   }
   ```

3. **`table.Subscribe`** — explicit subscription boundary. Less common on Solid
   because signal-based reactivity handles most cases natively. Useful when you
   want a sub-render isolated to one slice.

   ```tsx
   <table.Subscribe selector={(s) => s.rowSelection}>
     {(rowSelection) => (
       <span>Selected: {Object.keys(rowSelection()).length}</span>
     )}
   </table.Subscribe>
   ```

   Or with a `source` to subscribe to a single atom/store:

   ```tsx
   <table.Subscribe
     source={table.atoms.rowSelection}
     selector={(rs) => !!rs[row.id]}
   >
     {(isSelected) => <input type="checkbox" checked={isSelected()} />}
   </table.Subscribe>
   ```

   The child function receives a Solid `Accessor` — call it.

## Setting state — use the feature APIs

```tsx
table.setPageIndex(0)
table.nextPage()
table.setSorting([{ id: 'age', desc: true }])
table.setColumnFilters((old) => [...old, { id: 'firstName', value: 'kev' }])
row.toggleSelected()
column.toggleVisibility()
table.resetSorting()
```

Almost never reach for `table.baseAtoms.<slice>.set(...)` directly.

## State ownership: `initialState` vs `state`/`on*Change` vs `atoms`

| Mode                         | When                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------ |
| `initialState` only          | You only want starting values; table owns state.                                                 |
| `state` + `on[State]Change`  | Migrating v8 code, or simple Solid signal integration.                                           |
| `atoms: { slice: someAtom }` | App owns the slice. Best for sharing pagination/sort/filter across components (e.g. with Query). |

External atoms take precedence over `state`. Don't mix them on the same slice.

### `state` + `on*Change` (signal-backed external state)

```tsx
const [sorting, setSorting] = createSignal<SortingState>([])
const [pagination, setPagination] = createSignal<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
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

> Getters in `state` are required. `state: { sorting: sorting() }` evaluates once.

### External atoms (recommended for shared state)

```tsx
import { createAtom, useSelector } from '@tanstack/solid-store'

const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})
const sortingAtom = createAtom<SortingState>([])

const pagination = useSelector(paginationAtom) // Accessor<PaginationState>

const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
  atoms: {
    sorting: sortingAtom,
    pagination: paginationAtom,
  },
})
```

Pair with `@tanstack/solid-store`'s `useSelector` anywhere else in the app to
read the same atom.

## Rendering headers, cells, and footers

`FlexRender` (top-level) handles plain values and Solid components. `table.FlexRender`
is the same component attached to the instance:

```tsx
import { FlexRender } from '@tanstack/solid-table'

<thead>
  <For each={table.getHeaderGroups()}>
    {(hg) => (
      <tr>
        <For each={hg.headers}>
          {(header) => (
            <th>{header.isPlaceholder ? null : <FlexRender header={header} />}</th>
          )}
        </For>
      </tr>
    )}
  </For>
</thead>
<tbody>
  <For each={table.getRowModel().rows}>
    {(row) => (
      <tr>
        <For each={row.getAllCells()}>
          {(cell) => <td><FlexRender cell={cell} /></td>}
        </For>
      </tr>
    )}
  </For>
</tbody>
```

`FlexRender` automatically handles grouped/aggregated/placeholder cells when the
column-grouping feature is registered.

## `createTableHook` — app-level table conventions

When multiple tables share `features`, default options, and component
conventions, use `createTableHook` to register them once.

```tsx
import {
  createTableHook,
  tableFeatures,
  rowPaginationFeature,
  createPaginatedRowModel,
} from '@tanstack/solid-table'

const {
  createAppTable,
  createAppColumnHelper,
  useTableContext,
  useCellContext,
  useHeaderContext,
} = createTableHook({
  features: tableFeatures({
    rowPaginationFeature,
    paginatedRowModel: createPaginatedRowModel(),
  }),
  tableComponents: { PaginationControls },
  cellComponents: { TextCell, NumberCell },
  headerComponents: { SortIndicator },
})

const columnHelper = createAppColumnHelper<Person>()

function UsersTable(props: { data: Array<Person> }) {
  const table = createAppTable({
    columns,
    get data() {
      return props.data
    },
  })

  return (
    <table.AppTable>
      <table>
        <thead>
          <For each={table.getHeaderGroups()}>
            {(hg) => (
              <tr>
                <For each={hg.headers}>
                  {(h) => (
                    <table.AppHeader header={h}>
                      {(header) => (
                        <th>
                          <header.FlexRender />
                          <header.SortIndicator />
                        </th>
                      )}
                    </table.AppHeader>
                  )}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody>
          <For each={table.getRowModel().rows}>
            {(row) => (
              <tr>
                <For each={row.getAllCells()}>
                  {(c) => (
                    <table.AppCell cell={c}>
                      {(cell) => (
                        <td>
                          <cell.TextCell />
                        </td>
                      )}
                    </table.AppCell>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
      <table.PaginationControls />
    </table.AppTable>
  )
}

function PaginationControls() {
  const table = useTableContext() // SolidTable<TFeatures, any>
  return (
    <div>
      <button onClick={() => table.previousPage()}>Prev</button>
      <span>Page {table.state().pagination.pageIndex + 1}</span>
      <button onClick={() => table.nextPage()}>Next</button>
    </div>
  )
}
```

Use plain `createTable` when one feature config doesn't cover most of your
tables. Use `createTableHook` when it does.

## How the Solid binding works (reference)

`solidReactivity(owner)` is installed automatically by `createTable` as
`coreReactivityFeature`. Don't pass your own.

- `createReadonlyAtom(fn)` → `createMemo(fn, { equals, name })`
- `createWritableAtom(value)` → `createSignal(value, { equals, name })`
- Each atom exposes `.get()`, `.subscribe()`, and (for writable) `.set()`.
- Subscriptions run with the captured owner so atoms can be read inside Solid
  computations safely.

## Failure modes

### CRITICAL — `table.state` vs `table.state()`

In Solid, `table.state` is an **accessor** (a function). Agents who copied React
patterns will write `table.state.sorting` and get `undefined`. Always call it:
`table.state().sorting`. Same for any selected sub-state.

### CRITICAL — feature not registered → API missing

If you reach for `table.atoms.sorting`, `table.setSorting`, `column.getCanSort`,
etc., the matching feature (`rowSortingFeature`) must be in `features`.
Otherwise TS errors and runtime `undefined`. v9 features are explicit.

### CRITICAL — reactive `data` without a getter

`data: someSignal()` reads once at construction. `get data() { return someSignal() }`
tracks. The same applies to any reactive option (`columns` when computed,
`state.sorting`, etc.). When in doubt: getter.

### HIGH — wrong API name from a previous version

There is no `createSolidTable` (v8 name). The Solid v9 API is `createTable`.
There is no `getCoreRowModel`/`getSortedRowModel` factory option pattern — pass
row model factories directly into `tableFeatures()` (e.g. `tableFeatures({ rowSortingFeature, sortedRowModel: createSortedRowModel(), sortFns })`).
