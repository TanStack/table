---
name: preact/compose-with-tanstack-store
description: >
  `@tanstack/preact-table` v9 is built on TanStack Store. Each registered state
  slice is an atom. The table exposes three reactive surfaces:
  `table.atoms.<slice>` (per-slice readonly), `table.store` (flat readonly
  view), and `table.baseAtoms.<slice>` (internal writable). Use external atoms
  via `useCreateAtom` + `options.atoms` to hand slice ownership to your app,
  share atoms across components with `useSelector`, and subscribe imperatively
  with `atom.subscribe(...)` for persistence/sync. Routing keywords:
  preact-store, useCreateAtom, useSelector, atoms, external state, slice
  ownership, persistence.
type: composition
library: tanstack-table
framework: preact
library_version: '9.0.0-alpha.48'
requires:
  - state-management
  - preact/table-state
sources:
  - TanStack/table:docs/framework/preact/guide/table-state.md
  - TanStack/table:examples/preact/basic-external-atoms/src/main.tsx
  - TanStack/table:examples/preact/basic-subscribe/src/main.tsx
  - TanStack/table:packages/preact-table/src/useTable.ts
  - TanStack/table:packages/preact-table/src/reactivity.ts
---

`@tanstack/preact-table` v9 stores every registered state slice as a TanStack Store atom under the hood, and `useTable` wires Preact to those atoms via `@tanstack/preact-store`. This skill is the bridge between table state and the rest of your TanStack Store-powered app.

## The Three Surfaces

| Surface                   | Shape                                                      | Use when                                            |
| ------------------------- | ---------------------------------------------------------- | --------------------------------------------------- |
| `table.atoms.<slice>`     | `ReadonlyAtom<TSliceState>` per slice                      | Read or subscribe to one slice (preferred)          |
| `table.store`             | `ReadonlyStore<TableState<TFeatures>>` (flat derived view) | Reading full table state, selecting projections     |
| `table.baseAtoms.<slice>` | `Atom<TSliceState>` (writable internal)                    | Low-level writes when the slice is internally owned |

External atoms passed via `options.atoms.<slice>` take precedence over `options.state[<slice>]` and over `table.baseAtoms.<slice>`. Writes from feature APIs (`table.setSorting(...)`, `table.setPageIndex(...)`, etc.) flow into whichever atom owns the slice.

Source: `docs/framework/preact/guide/table-state.md`; `packages/preact-table/src/useTable.ts`.

## Pattern 1 — Hand a slice to your app

```tsx
import { useCreateAtom, useSelector } from '@tanstack/preact-store'
import {
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type PaginationState,
  type SortingState,
} from '@tanstack/preact-table'

const features = tableFeatures({ rowPaginationFeature, rowSortingFeature })

function PeopleTable({ data }) {
  // Stable atoms owned by this component.
  const sortingAtom = useCreateAtom<SortingState>([])
  const paginationAtom = useCreateAtom<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Independent reactive reads — only re-renders for the slice that changed.
  const sorting = useSelector(sortingAtom)
  const pagination = useSelector(paginationAtom)

  const table = useTable({
    features,
    columns,
    data,
    atoms: { sorting: sortingAtom, pagination: paginationAtom },
  })

  // table.setSorting / table.setPageIndex write to your atoms.
  return null
}
```

Source: `examples/preact/basic-external-atoms/src/main.tsx`.

## Pattern 2 — Share an atom across components

Lift the atom to a module / context. Any component can read or write it, and the table stays in sync.

```tsx
// shared/atoms.ts
import { createAtom } from '@tanstack/preact-store'
import type { RowSelectionState } from '@tanstack/preact-table'

export const selectionAtom = createAtom<RowSelectionState>({})
```

```tsx
// TableScreen.tsx
import { selectionAtom } from '../shared/atoms'

const table = useTable({
  features,
  columns,
  data,
  atoms: { rowSelection: selectionAtom },
})
```

```tsx
// SelectionSummary.tsx
import { useSelector } from '@tanstack/preact-store'
import { selectionAtom } from '../shared/atoms'

function SelectionSummary() {
  const sel = useSelector(selectionAtom)
  return <span>{Object.keys(sel).length} selected</span>
}
```

Module-scope atoms are stable identities — no `useCreateAtom` needed. Don't create module-scope atoms inside a component-render body.

Source: `docs/framework/preact/guide/table-state.md`.

## Pattern 3 — Subscribe imperatively for persistence / sync

`Atom.subscribe` returns an `{ unsubscribe }` handle. Persist to `localStorage`, push to a URL, or fan out to other stores.

```tsx
import { useEffect } from 'preact/hooks'

useEffect(() => {
  const sub = paginationAtom.subscribe((next) => {
    localStorage.setItem('table:pagination', JSON.stringify(next))
  })
  return () => sub.unsubscribe()
}, [paginationAtom])
```

You can also subscribe to `table.atoms.<slice>` directly without owning the slice. The subscription fires whenever the slice changes — whoever owns it (your atom or `baseAtoms`).

Source: `packages/preact-table/src/reactivity.ts`.

## Pattern 4 — Read inside cells with the standalone `<Subscribe>`

Inside a cell or header render context, `table` is the core `Table<TFeatures, TData>`, not `PreactTable`. `table.Subscribe` is undefined — import the standalone component.

```tsx
import { Subscribe } from '@tanstack/preact-table'

columnHelper.display({
  id: 'select',
  cell: ({ row, table }) => (
    <Subscribe source={table.atoms.rowSelection} selector={(rs) => rs[row.id]}>
      {(isSelected) => (
        <input
          type="checkbox"
          checked={!!isSelected}
          onChange={row.getToggleSelectedHandler()}
        />
      )}
    </Subscribe>
  ),
})
```

Source: `packages/preact-table/src/Subscribe.ts`; `examples/preact/basic-subscribe/src/main.tsx`.

## Common Mistakes

### CRITICAL Creating an atom inside the render body without `useCreateAtom`

Wrong:

```tsx
function MyTable() {
  const sortingAtom = createAtom<SortingState>([]) // new atom every render
  useTable({ /* … */, atoms: { sorting: sortingAtom } })
}
```

Correct:

```tsx
function MyTable() {
  const sortingAtom = useCreateAtom<SortingState>([]) // stable
  useTable({ /* … */, atoms: { sorting: sortingAtom } })
}
```

A fresh atom each render unbinds the slice and resets it to the initial value on every render.
Source: `examples/preact/basic-external-atoms/src/main.tsx`.

### HIGH Writing to `table.baseAtoms.X.set()` when the slice is externally owned

Wrong:

```tsx
useTable({ /* … */, atoms: { pagination: paginationAtom } })
table.baseAtoms.pagination.set((old) => ({ ...old, pageIndex: 0 })) // updates the wrong atom
```

Correct:

```tsx
// Use the feature API (writes to whichever atom owns the slice).
table.setPageIndex(0)
// Or write to your external atom directly.
paginationAtom.set((old) => ({ ...old, pageIndex: 0 }))
```

`table.baseAtoms` is the internal writable atom — used only when the slice is internally owned. When you hand a slice to an external atom, the external atom is the source of truth.
Source: `docs/framework/preact/guide/table-state.md`.

### HIGH Reading `.get()` and expecting re-renders

Wrong:

```tsx
function Pager() {
  const { pageIndex } = table.atoms.pagination.get() // current-value read
  return <span>Page {pageIndex + 1}</span>
}
```

Correct:

```tsx
import { useSelector } from '@tanstack/preact-store'

function Pager() {
  const pageIndex = useSelector(table.atoms.pagination, (p) => p.pageIndex)
  return <span>Page {pageIndex + 1}</span>
}
// or
;<table.Subscribe source={table.atoms.pagination} selector={(p) => p.pageIndex}>
  {(pageIndex) => <span>Page {pageIndex + 1}</span>}
</table.Subscribe>
```

`.get()` returns the current value without subscribing.

### MEDIUM Passing the same slice via `atoms` AND `state`

Wrong:

```tsx
useTable({
  /* … */,
  atoms: { pagination: paginationAtom },
  state: { pagination },             // silently ignored
  onPaginationChange: setPagination, // silently ignored
})
```

Correct: pick exactly one ownership path per slice.

## See Also

- `tanstack-table/preact/table-state` — atoms / Subscribe / FlexRender reference.
- `tanstack-table/preact/compose-with-tanstack-query` — server-side flow keyed by atoms.
- `tanstack-table/preact/production-readiness` — when to reach for narrow subscriptions.
