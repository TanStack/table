---
name: preact/table-state
description: >
  Wiring reactivity for `@tanstack/preact-table` v9. Covers `useTable` (and its
  second-argument selector), reading state via `table.state` / `table.store` /
  `table.atoms.<slice>`, rendering with `table.FlexRender`, opting subtrees into
  fine-grained reactivity with `<table.Subscribe>` and the standalone
  `<Subscribe>`, owning slices with external atoms via `useCreateAtom` +
  `options.atoms`, and packaging shared config into a reusable hook with
  `createTableHook` (`useAppTable`, `createAppColumnHelper`, `table.AppTable` /
  `table.AppHeader` / `table.AppCell` / `table.AppFooter`). Routing keywords:
  useTable, useSelector, useCreateAtom, atoms, preact-store, table.Subscribe,
  FlexRender.
type: framework
library: tanstack-table
framework: preact
library_version: '9.0.0-alpha.48'
requires:
  - state-management
  - setup
sources:
  - TanStack/table:docs/framework/preact/guide/table-state.md
  - TanStack/table:docs/framework/preact/guide/create-table-hook.md
  - TanStack/table:packages/preact-table/src/useTable.ts
  - TanStack/table:packages/preact-table/src/Subscribe.ts
  - TanStack/table:packages/preact-table/src/FlexRender.tsx
  - TanStack/table:packages/preact-table/src/createTableHook.tsx
  - TanStack/table:examples/preact/basic-use-table/src/main.tsx
  - TanStack/table:examples/preact/basic-subscribe/src/main.tsx
  - TanStack/table:examples/preact/basic-external-atoms/src/main.tsx
  - TanStack/table:examples/preact/basic-external-state/src/main.tsx
  - TanStack/table:examples/preact/basic-use-app-table/src/main.tsx
---

This skill builds on `tanstack-table/state-management` and `tanstack-table/setup`. Read those first: `state-management` explains the v9 atom model (per-slice readonly `table.atoms`, internal writable `table.baseAtoms`, flat `table.store`). The Preact adapter closely mirrors the React adapter: `useTable` returns a `PreactTable<TFeatures, TData, TSelected>` whose state is backed by TanStack Store atoms, and `<table.Subscribe>` lets components subscribe to slices fine-grained.

## Setup

Every Preact v9 table follows the same shape. Define `features` (including row model factories and \*Fns slots) and `columns` at module scope so their references are stable, then call `useTable` and render with `<table.FlexRender>`.

```tsx
import { render } from 'preact'
import { useState } from 'preact/hooks'
import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/preact-table'

type Person = { firstName: string; lastName: string; age: number }

// Module-scope = stable identity. Critical for re-render perf.
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { header: 'First' }),
  columnHelper.accessor('lastName', { header: 'Last' }),
  columnHelper.accessor('age', { header: 'Age' }),
])

function PeopleTable({ data }: { data: Person[] }) {
  const table = useTable(
    {
      features,
      columns,
      data,
    },
    (state) => state, // default selector
  )

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((h) => (
              <th key={h.id} onClick={h.column.getToggleSortingHandler()}>
                {h.isPlaceholder ? null : <table.FlexRender header={h} />}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getAllCells().map((cell) => (
              <td key={cell.id}>
                <table.FlexRender cell={cell} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

Source: `examples/preact/basic-use-table/src/main.tsx`.

## Core Patterns

### 1. `useTable` selector (second argument)

The default selector returns the full `TableState<TFeatures>` — the component re-renders on any registered state slice change. Pass a narrower selector once you have a measurable perf problem, or pass `() => null` to opt the parent out at the top level and use `<table.Subscribe>` walls instead.

The Preact adapter uses `useSelector` from `@tanstack/preact-store` with `shallow` compare under the hood.

```tsx
// Narrow selector — re-render only on sorting/pagination changes.
const table = useTable(
  {
    features,
    columns,
    data,
  },
  (state) => ({ sorting: state.sorting, pagination: state.pagination }),
)

table.state.sorting // typed to the projected shape

// Or: subscribe to nothing at the top level; read inside <table.Subscribe>.
const table = useTable(opts, () => null)
```

Source: `docs/framework/preact/guide/table-state.md`; `examples/preact/basic-subscribe/src/main.tsx` (uses `() => null`).

### 2. `<table.Subscribe>` and standalone `<Subscribe>`

Use `<table.Subscribe>` at the component level. Inside cell/header render contexts, `table` is the core `Table<TFeatures, TData>` (not `PreactTable`), so `table.Subscribe` is **not on the object** — import the standalone `<Subscribe>` and pass `source={table.store}` or `source={table.atoms.X}`.

```tsx
import { Subscribe } from '@tanstack/preact-table'

// Component-level: selector against table.store.
<table.Subscribe selector={(s) => s.pagination}>
  {(pagination) => <span>Page {pagination.pageIndex + 1}</span>}
</table.Subscribe>

// Single-atom source — narrower than table.store.
<table.Subscribe source={table.atoms.rowSelection}>
  {(rowSelection) => <span>{Object.keys(rowSelection).length} selected</span>}
</table.Subscribe>

// Per-row identity projection — re-renders only that row's checkbox.
<table.Subscribe
  source={table.atoms.rowSelection}
  selector={(rs) => rs[row.id]}
>
  {(isSelected) => (
    <input type="checkbox" checked={!!isSelected} onChange={row.getToggleSelectedHandler()} />
  )}
</table.Subscribe>

// Inside a cell — table here is the CORE Table, no .Subscribe. Use the import.
columnHelper.display({
  id: 'select',
  cell: ({ row, table }) => (
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
})
```

Source: `packages/preact-table/src/Subscribe.ts`; `examples/preact/basic-subscribe/src/main.tsx`.

### 3. External atoms with `useCreateAtom` + `options.atoms`

Move ownership of any slice to an atom you create with `useCreateAtom` from `@tanstack/preact-store`. Pass it via `options.atoms.<slice>`. The table writes to your atom when you call `table.setSorting(...)`, `table.setPageIndex(...)`, etc. — **no `on*Change` handler is needed**.

Precedence: `options.atoms[key]` > `options.state[key]` > internal `baseAtoms[key]`. Don't pass both `state.foo` and `atoms.foo` for the same slice; `atoms` wins silently.

```tsx
import { useCreateAtom, useSelector } from '@tanstack/preact-store'
import type { PaginationState, SortingState } from '@tanstack/preact-table'

function MyTable({ data }) {
  const sortingAtom = useCreateAtom<SortingState>([])
  const paginationAtom = useCreateAtom<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Fine-grained subscriptions independent of the table.
  const sorting = useSelector(sortingAtom)
  const pagination = useSelector(paginationAtom)

  const table = useTable({
    features,
    columns,
    data,
    atoms: { sorting: sortingAtom, pagination: paginationAtom },
    // NOTE: no onSortingChange / onPaginationChange — table writes directly to atoms.
  })
}
```

Source: `examples/preact/basic-external-atoms/src/main.tsx`.

### 4. External state with `state` + `on*Change` and `createTableHook`

Classic `useState` + `on*Change` integration (v8 migration paths) and the `createTableHook` factory for packaging shared `features` (with row model factories) and cell components into `useAppTable` + `createAppColumnHelper` + `table.AppTable` / `AppHeader` / `AppCell` / `AppFooter` boundaries — see [advanced-state-patterns.md](references/advanced-state-patterns.md).

## Common Mistakes

### CRITICAL Reading `table.atoms.X.get()` during render and expecting re-renders

Wrong:

```tsx
function Pager({ table }) {
  const pagination = table.atoms.pagination.get() // current-value read, NOT a subscription
  return <span>Page {pagination.pageIndex + 1}</span>
}
```

Correct:

```tsx
function Pager({ table }) {
  return (
    <table.Subscribe
      source={table.atoms.pagination}
      selector={(p) => p.pageIndex}
    >
      {(pageIndex) => <span>Page {pageIndex + 1}</span>}
    </table.Subscribe>
  )
}
```

`.get()` and `table.state` are current-value reads, not subscriptions. The component never re-renders when the atom changes.
Source: `docs/framework/preact/guide/table-state.md`.

### HIGH Passing both `atoms.X` and `state.X` for the same slice

Wrong:

```tsx
const table = useTable({
  features,
  columns,
  data,
  atoms: { pagination: paginationAtom },
  state: { pagination }, // silently ignored
  onPaginationChange: setPagination, // silently ignored
})
```

Correct:

```tsx
const table = useTable({
  features,
  columns,
  data,
  atoms: { pagination: paginationAtom },
})
```

Precedence is `options.atoms[key]` > `options.state[key]` > internal. `state` is dropped without a warning when `atoms` is provided for the same slice.
Source: `docs/framework/preact/guide/table-state.md`.

### HIGH Using `table.Subscribe` inside a column cell or header render

Wrong:

```tsx
cell: ({ row, table }) => (
  <table.Subscribe
    source={table.atoms.rowSelection}
    selector={(s) => s[row.id]}
  >
    {(isSelected) => <input type="checkbox" checked={!!isSelected} />}
  </table.Subscribe>
)
```

Correct:

```tsx
import { Subscribe } from '@tanstack/preact-table'

cell: ({ row, table }) => (
  <Subscribe source={table.atoms.rowSelection} selector={(s) => s[row.id]}>
    {(isSelected) => (
      <input
        type="checkbox"
        checked={!!isSelected}
        onChange={row.getToggleSelectedHandler()}
      />
    )}
  </Subscribe>
)
```

In cell and header render contexts, `table` is the core `Table<TFeatures, TData>`, not `PreactTable` — `table.Subscribe` is undefined. Use the standalone import.
Source: `packages/preact-table/src/Subscribe.ts`.

### CRITICAL Creating an atom inside the render body without `useCreateAtom`

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

A fresh atom each render unbinds the table from the slice and resets the state to the initial value on every render.
Source: `examples/preact/basic-external-atoms/src/main.tsx`.

### HIGH Unstable `data` / `columns` / `features` references

Wrong:

```tsx
function MyTable({ rows }) {
  const features = tableFeatures({ rowSortingFeature }) // new every render
  const columns = [
    /* … */
  ] // new every render
  const table = useTable({
    features,
    columns,
    data: rows ?? [],
  })
}
```

Correct:

```tsx
// Module scope — declared once.
const features = tableFeatures({ rowSortingFeature })
const columns: ColumnDef<typeof features, Person>[] = [
  /* … */
]
const EMPTY: Person[] = []

function MyTable({ rows }) {
  const data = rows ?? EMPTY
  const table = useTable({ features, columns, data })
}
```

Internal memoization keys off identity. A new reference each render busts memos and forces full recomputation.
Source: `docs/framework/preact/guide/table-state.md` (FAQ #1).

### HIGH Reimplementing built-in feature logic by hand

Wrong:

```tsx
// Re-sorting rows manually outside the table — duplicates rowSortingFeature work.
const sorted = useMemo(() => [...data].sort(/* … */), [data, sorting])
```

Correct:

```tsx
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
const table = useTable({ features, columns, data })
const rows = table.getRowModel().rows // already sorted
```

TanStack Table v9 ships built-ins for sorting, filtering, pagination, grouping, expanding, faceting, row selection, column visibility/order/pinning/sizing, and row pinning. Register the matching `*Feature` and its row-model factory in `tableFeatures`, then call the feature APIs (`setSorting`, `setColumnFilters`, etc.). Re-implementing these by hand is the #1 AI tell.
Source: `docs/guide/features.md`.

## See Also

- `tanstack-table/preact/getting-started` — first-table walkthrough.
- `tanstack-table/preact/migrate-v8-to-v9` — mechanical v8 → v9 breaking changes.
- `tanstack-table/preact/production-readiness` — narrowing selectors, tree-shaking, reference stability.
- `tanstack-table/preact/compose-with-tanstack-store` — sharing slice atoms across components, persistence.

## References

- [advanced-state-patterns.md](references/advanced-state-patterns.md) — `state` + `on*Change` external state and `createTableHook` for reusable shared config
