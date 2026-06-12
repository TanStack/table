---
name: solid/compose-with-tanstack-store
description: >
  Use `@tanstack/solid-store` (`createAtom`, `useSelector`, `shallow`) with
  `@tanstack/solid-table` v9. The table is built on TanStack Store: every state
  slice is an atom. Three read surfaces — `table.atoms.<slice>` (per-slice
  readonly memo), `table.store` (flat readonly), and `table.state()` (Solid
  accessor from the selector). Own slices externally by passing
  `atoms: { sorting: someAtom }`.
type: composition
library: tanstack-table
framework: solid
library_version: '9.0.0-alpha.48'
requires:
  - state-management
  - solid/table-state
sources:
  - docs/framework/solid/guide/table-state.md
  - packages/solid-table/src/createTable.ts
  - packages/solid-table/src/reactivity.ts
  - examples/solid/basic-external-atoms/
---

# Compose with `@tanstack/solid-store`

v9 is built on TanStack Store. The Solid adapter installs `solidReactivity` so
readonly atoms are `createMemo` and writable atoms are `createSignal` under the
hood. Everything Solid-Store offers — atoms, selectors, shallow comparison —
works directly with the table's state surfaces.

## The three read surfaces

| Surface               | Shape                                                                                                   | Use for                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `table.atoms.<slice>` | `ReadonlyAtom<TSlice>` (memo-backed). `.get()` for current value, `.subscribe(fn)` for raw subscription | Per-slice fine-grained reads, especially with `useSelector`. |
| `table.store`         | Readonly flat store; `.state.<slice>` for current value                                                 | Snapshot reads, debugging, JSON-dumps.                       |
| `table.state()`       | `Accessor<TSelected>` — call it                                                                         | Solid-idiomatic reactive read of the selector projection.    |

`table.baseAtoms.<slice>` exists too — those are the writable internal signals.
Reach for them only if you genuinely need a low-level write; prefer the table's
feature APIs (`table.setSorting(...)`, `table.nextPage()`, etc.).

## Reading slices reactively

### Native: just read `table.state()` or `table.atoms.<slice>.get()` in a tracked scope

```tsx
// JSX — automatically reactive
<span>Selected: {Object.keys(table.atoms.rowSelection.get()).length}</span>
<span>Page {table.state().pagination.pageIndex + 1}</span>

// createMemo — also tracked
const pageCount = createMemo(() => table.getPageCount())
```

### `useSelector` from `@tanstack/solid-store`

`useSelector` returns a Solid accessor with shallow equality by default.

```tsx
import { useSelector } from '@tanstack/solid-store'

const pagination = useSelector(table.atoms.pagination)
// pagination is Accessor<PaginationState>
const pageIndex = () => pagination().pageIndex
```

Narrow further with a selector + optional `shallow`:

```tsx
import { shallow, useSelector } from '@tanstack/solid-store'

const visibleColumnIds = useSelector(
  table.store,
  (s) =>
    Object.keys(s.columnVisibility ?? {}).filter(
      (id) => s.columnVisibility[id] !== false,
    ),
  { compare: shallow },
)
```

### `table.Subscribe`

When you want an explicit isolation boundary:

```tsx
<table.Subscribe selector={(s) => s.rowSelection}>
  {(rowSelection) => (
    <SelectedCount count={Object.keys(rowSelection()).length} />
  )}
</table.Subscribe>
```

With a `source`:

```tsx
<table.Subscribe
  source={table.atoms.rowSelection}
  selector={(rs) => !!rs[row.id]}
>
  {(isSelected) => (
    <input
      type="checkbox"
      checked={isSelected()}
      onChange={row.getToggleSelectedHandler()}
    />
  )}
</table.Subscribe>
```

## Owning a slice externally with `createAtom`

This is the recommended cross-component / cross-app pattern in v9.

```tsx
import { createAtom, useSelector } from '@tanstack/solid-store'
import {
  createTable,
  type PaginationState,
  type SortingState,
} from '@tanstack/solid-table'

const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})
const sortingAtom = createAtom<SortingState>([])

const pagination = useSelector(paginationAtom)
const sorting = useSelector(sortingAtom)

const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
  atoms: {
    pagination: paginationAtom,
    sorting: sortingAtom,
  },
})
```

When `atoms.<slice>` is provided:

- The table reads/writes the **external** atom for that slice.
- `table.atoms.<slice>` is a readonly derived view over the external atom.
- Don't also supply `state.<slice>` + `on[State]Change` for the same slice;
  the atom wins.
- `table.setSorting(...)` etc. still work — they call through to the external
  atom's setter.

### Mutating the atom directly

You don't need `table.setSorting(...)` to update — write to the atom from
anywhere:

```tsx
paginationAtom.set((old) => ({ ...old, pageIndex: 0 }))
sortingAtom.set([{ id: 'lastName', desc: true }])
```

This is what makes external atoms valuable: a "Clear filters" button in the
page header or a URL-sync effect can talk to the same atom without holding a
reference to the table.

## Pattern: per-slice readers in other components

```tsx
// pagination.ts
import { createAtom, useSelector } from '@tanstack/solid-store'
export const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})
export const usePagination = () => useSelector(paginationAtom)

// PageStatus.tsx — no `table` reference at all
import { usePagination } from './pagination'
export function PageStatus() {
  const pagination = usePagination()
  return <span>Page {pagination().pageIndex + 1}</span>
}

// UsersTable.tsx
const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
  atoms: { pagination: paginationAtom },
})
```

## When to use atoms vs. `state`+`on*Change`

| Use atoms when                         | Use `state`+`on*Change` when                          |
| -------------------------------------- | ----------------------------------------------------- |
| Sharing the slice across components    | One component owns the slice                          |
| Driving a server fetcher (Query)       | Local UI-only state                                   |
| Syncing with URL params / storage      | Migrating from v8                                     |
| You want one source of truth per slice | You want a Solid signal pattern with explicit setters |

Both work. Atoms are more atomic; `state`+`on*Change` is more familiar.

## Failure modes

### CRITICAL — `table.state` treated as a value

`table.state` is an Accessor in Solid. Call it. Same caveat applies if you used
`useSelector(table.atoms.pagination)` — the return is also an accessor.

### CRITICAL — supplying both `atoms.pagination` and `state.pagination`

Both surfaces compete for the same slice. The atom silently wins; the `state` +`on*Change` pair is ignored. Pick one.

### HIGH — re-creating atoms in render

`createAtom(...)` inside a component creates a new atom every call. Atoms must
be module-scoped (or memoized at component creation, never inside a JSX render
expression).

### MEDIUM — passing `table.store` to `useSelector` without a selector

`useSelector(table.store)` works but subscribes to the whole flat store —
shallow-equality on a big object is wasted work. Pass a selector to narrow.

### MEDIUM — confusing `table.atoms` with `table.baseAtoms`

`table.atoms.<slice>` is the **readonly** outward-facing atom (memo-backed) —
even when an external atom is supplied, this is what consumers read.
`table.baseAtoms.<slice>` is the internal writable signal used when the table
owns the slice. Writes should go through feature APIs or the external atom you
own; not through `baseAtoms` unless you have a specific reason.
