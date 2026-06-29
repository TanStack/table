---
name: react/compose-with-tanstack-store
description: >
  `@tanstack/react-table` v9 is built on TanStack Store. Each state slice
  (sorting, pagination, rowSelection, columnFilters, …) is a separate atom.
  The table exposes three READ surfaces — `table.atoms.<slice>` (per-slice
  readonly), `table.store` (flat readonly view), `table.state` (selector
  output from `useTable`) — and two WRITE paths — internal
  `table.baseAtoms.<slice>` OR YOUR `options.atoms[slice]` if you opt to own
  the slice. Use `useCreateAtom` from `@tanstack/react-store` for stable
  identity, `useSelector` for fine-grained reads, and pass the atom in
  `options.atoms` so the table writes through it directly — no `on*Change`
  handler required.
type: composition
library: tanstack-table
framework: react
library_version: '9.0.0-alpha.48'
requires:
  - react/table-state
  - state-management
sources:
  - TanStack/table:docs/framework/react/guide/table-state.md
  - TanStack/table:examples/react/basic-external-atoms/src/main.tsx
  - TanStack/table:examples/react/basic-subscribe/src/main.tsx
---

This skill builds on `tanstack-table/state-management` and `tanstack-table/react/table-state`. Read those first — `state-management` explains the atom model conceptually; `table-state` covers the basic React adapter. This skill goes deeper into composition with `@tanstack/react-store`.

## What "compose with TanStack Store" means in practice

A v9 React table is already a Store consumer — every slice (`sorting`, `pagination`, `rowSelection`, `columnFilters`, `columnVisibility`, …) is an atom managed by Store. Composing with Store means **opting to own one or more of those atoms yourself** so you can:

- Share a slice across multiple components without prop-drilling the table instance.
- Share a slice across multiple **tables** (e.g. a global filter atom).
- Persist a slice (subscribe to localStorage outside the table).
- Integrate with other atom-based code (atoms in your data layer).
- Skip the `on*Change` callback dance — the table writes through your atom directly.

## Setup

Install `@tanstack/react-store` if you don't already have it (it's a peer of `@tanstack/react-table`):

```bash
pnpm add @tanstack/react-store
```

Three APIs do the work:

```tsx
import { useCreateAtom, useSelector } from '@tanstack/react-store'
```

- `useCreateAtom<T>(initial)` — create an atom with stable identity inside a component (React-safe replacement for `useRef(createAtom(...))`).
- `useSelector(atomOrStore, selector?)` — subscribe a component to an atom or store.
- The table's `options.atoms` option — hand ownership of named slices to your atoms.

## Core Patterns

### 1. Own a slice externally

```tsx
import { useCreateAtom, useSelector } from '@tanstack/react-store'
import {
  useTable,
  tableFeatures,
  rowSortingFeature,
  rowPaginationFeature,
  createSortedRowModel,
  createPaginatedRowModel,
  sortFns,
} from '@tanstack/react-table'
import type { PaginationState, SortingState } from '@tanstack/react-table'

const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
})

function MyTable({ columns, data }) {
  const sortingAtom = useCreateAtom<SortingState>([])
  const paginationAtom = useCreateAtom<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Fine-grained reads — each component re-renders independently.
  const sorting = useSelector(sortingAtom)
  const pagination = useSelector(paginationAtom)

  const table = useTable({
    features,
    columns,
    data,
    atoms: { sorting: sortingAtom, pagination: paginationAtom },
    // NOTE: no onSortingChange / onPaginationChange — table writes to atoms directly.
  })

  // You own the atom → you own its reset.
  const resetMyState = () => {
    sortingAtom.set([])
    paginationAtom.set({ pageIndex: 0, pageSize: 10 })
  }
}
```

Source: `examples/react/basic-external-atoms/src/main.tsx`.

### 2. Read a table-owned atom from a sibling component

You don't have to own a slice to read it surgically — `table.atoms.<slice>` works with `useSelector` too.

```tsx
function SelectedCount({ table }) {
  // Re-renders ONLY when rowSelection changes.
  const selection = useSelector(table.atoms.rowSelection)
  return <span>{Object.keys(selection).length} selected</span>
}
```

### 3. Persist a slice to localStorage

Because you own the atom, you can do anything you want outside the table render path:

```tsx
const visibilityAtom = useCreateAtom<Record<string, boolean>>(() =>
  JSON.parse(localStorage.getItem('cv') ?? '{}'),
)

React.useEffect(() => {
  return visibilityAtom.subscribe(() => {
    localStorage.setItem('cv', JSON.stringify(visibilityAtom.get()))
  })
}, [visibilityAtom])

const table = useTable({
  features,
  columns,
  data,
  atoms: { columnVisibility: visibilityAtom },
})
```

### 4. Share one slice across multiple tables

Create the atom outside any component (or in a parent and pass down):

```tsx
import { createAtom } from '@tanstack/store'

const globalFilterAtom = createAtom('')

function UsersTable() {
  return <Table data={users} filter={globalFilterAtom} />
}
function OrdersTable() {
  return <Table data={orders} filter={globalFilterAtom} />
}

function Table({ data, filter }) {
  const table = useTable({
    features,
    columns,
    data,
    atoms: { globalFilter: filter },
  })
}
```

## Read surfaces and write paths — cheat sheet

| Surface                             | Reactive                    | Use case                                                        |
| ----------------------------------- | --------------------------- | --------------------------------------------------------------- |
| `table.state`                       | ✓ (via `useTable` selector) | Default top-level reads in the component that called `useTable` |
| `<table.Subscribe>` / `<Subscribe>` | ✓                           | Surgical re-render boundaries inside the tree                   |
| `useSelector(table.atoms.X)`        | ✓                           | Narrowest possible subscription to one slice                    |
| `table.atoms.X.get()`               | ✗ current-value read        | Inside event handlers / effects                                 |
| `table.state`                       | ✗ current-value read        | Debugging / one-shot reads                                      |

| Write path                      | Owner             | Effect                                                                             |
| ------------------------------- | ----------------- | ---------------------------------------------------------------------------------- |
| Internal `table.baseAtoms.X`    | The table         | Used when you provide neither `options.atoms.X` nor `options.state.X`              |
| `options.atoms.X` (yours)       | You               | Table writes through; you can `.set()` from anywhere                               |
| `options.state.X` + `onXChange` | You (React state) | Classic controlled state. Cannot coexist with `options.atoms.X` for the same slice |

Precedence: `options.atoms[key]` > `options.state[key]` > internal.

## Common Mistakes

### CRITICAL Creating the atom with `createAtom(...)` inside the component body

Wrong:

```tsx
function MyTable() {
  const sortingAtom = createAtom<SortingState>([]) // new atom every render
  useTable({
    features,
    columns,
    data,
    atoms: { sorting: sortingAtom },
  })
}
```

Correct:

```tsx
function MyTable() {
  const sortingAtom = useCreateAtom<SortingState>([]) // stable across renders
  useTable({
    features,
    columns,
    data,
    atoms: { sorting: sortingAtom },
  })
}
```

A fresh atom every render rebinds the table to a new atom whose state is the initial value — the slice resets on every render.
Source: `examples/react/basic-external-atoms/src/main.tsx`.

### HIGH Passing the same slice via `state` AND `atoms`

Wrong:

```tsx
useTable({
  features,
  columns,
  data,
  state: { sorting: localSorting }, // silently ignored
  onSortingChange: setLocalSorting, // silently ignored
  atoms: { sorting: sortingAtom }, // wins
})
```

Correct:

```tsx
// Pick exactly one ownership mechanism per slice.
useTable({
  features,
  columns,
  data,
  atoms: { sorting: sortingAtom },
})
```

`options.atoms[key]` > `options.state[key]`. Confusing to debug because the `state` plumbing looks live but does nothing.
Source: `docs/framework/react/guide/table-state.md`.

### HIGH Pairing external atoms with `on*Change` handlers

Wrong:

```tsx
useTable({
  features,
  columns,
  data,
  atoms: { sorting: sortingAtom },
  onSortingChange: (next) => sortingAtom.set(next), // redundant + confusing
})
```

Correct:

```tsx
useTable({
  features,
  columns,
  data,
  atoms: { sorting: sortingAtom },
})
```

The table writes directly to the atom you provided via the atom's `set()`. Adding an `on*Change` does nothing useful and confuses readers.
Source: `examples/react/basic-external-atoms/src/main.tsx`.

### HIGH Expecting `table.reset()` to clear externally-owned atoms

Wrong:

```tsx
<button onClick={() => table.reset()}>Reset</button>
// External atoms remain at their current values — table can't reset what it doesn't own.
```

Correct:

```tsx
<button
  onClick={() => {
    sortingAtom.set([])
    paginationAtom.set({ pageIndex: 0, pageSize: 10 })
    table.reset() // resets the slices the table still owns
  }}
>
  Reset
</button>
```

The table only resets slices it manages internally. Your atoms are yours to reset.
Source: `docs/framework/react/guide/table-state.md`.

### MEDIUM Reading via `table.state.sorting` in deeply-nested components

Wrong:

```tsx
function SortIndicator({ table }) {
  const { sorting } = table.state // re-renders when ANY state slice changes
  return <span>{sorting.length} cols</span>
}
```

Correct:

```tsx
import { useSelector } from '@tanstack/react-store'

function SortIndicator({ table }) {
  const sorting = useSelector(table.atoms.sorting) // re-renders only on sorting changes
  return <span>{sorting.length} cols</span>
}
```

`useSelector(table.atoms.X)` is the narrowest subscription surface — skips constructing a state snapshot.
Source: `docs/framework/react/guide/table-state.md`.

## See Also

- `tanstack-table/react/table-state` — the base API, includes `<Subscribe>` and `<table.Subscribe>` shapes.
- `tanstack-table/react/compose-with-tanstack-query` — Query queryKey keyed on a Store atom is the canonical pattern.
- `tanstack-table/react/production-readiness` — narrowing selectors and per-slice subscriptions.
- `tanstack-table/react/client-to-server` — atoms make manual-mode wiring trivial.
