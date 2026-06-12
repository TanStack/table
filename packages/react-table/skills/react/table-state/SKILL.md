---
name: react/table-state
description: >
  Wiring reactivity for `@tanstack/react-table` v9. Covers `useTable` (and its
  second-argument selector), reading state via `table.state` / `table.store` /
  `table.atoms.<slice>`, rendering with `table.FlexRender`, opting subtrees into
  fine-grained reactivity with `<table.Subscribe>` and the standalone
  `<Subscribe>`, owning slices with external atoms via `useCreateAtom` +
  `options.atoms`, and packaging shared config into a reusable hook with
  `createTableHook` (`useAppTable`, `createAppColumnHelper`, `table.AppTable` /
  `table.AppHeader` / `table.AppCell` / `table.AppFooter`). Routing keywords:
  useTable, useSelector, useCreateAtom, atoms, react-store, table.Subscribe,
  FlexRender.
type: framework
library: tanstack-table
framework: react
library_version: '9.0.0-alpha.48'
requires:
  - state-management
  - setup
sources:
  - TanStack/table:docs/framework/react/guide/table-state.md
  - TanStack/table:packages/react-table/src/useTable.ts
  - TanStack/table:packages/react-table/src/Subscribe.ts
  - TanStack/table:packages/react-table/src/FlexRender.tsx
  - TanStack/table:packages/react-table/src/createTableHook.tsx
  - TanStack/table:examples/react/basic-use-table/src/main.tsx
  - TanStack/table:examples/react/basic-subscribe/src/main.tsx
  - TanStack/table:examples/react/basic-external-atoms/src/main.tsx
  - TanStack/table:examples/react/basic-external-state/src/main.tsx
  - TanStack/table:examples/react/basic-use-app-table/src/main.tsx
---

This skill builds on `tanstack-table/state-management` and `tanstack-table/setup`. Read those first — `state-management` explains the v9 atom model (per-slice readonly `table.atoms`, internal writable `table.baseAtoms`, flat `table.store`), and this skill shows how each surface is consumed in React.

## Setup

Every React v9 table follows the same shape. Define `features` and `columns` at module scope so their references are stable, then call `useTable` and render with `<table.FlexRender>`.

```tsx
import {
  useTable,
  tableFeatures,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
  createColumnHelper,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

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
    (state) => state, // default selector — matches v8 ergonomics
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

Source: `examples/react/basic-use-table/src/main.tsx`.

## Core Patterns

### 1. `useTable` selector (second argument)

The default is `(state) => state` — the component re-renders on any state change. Pass a narrower selector once you have a measurable perf problem, or pass `() => null` to opt out at the top level and use `<table.Subscribe>` walls instead.

```tsx
// Narrow selector — only re-render this component on sorting/pagination changes.
const table = useTable({ features, columns, data }, (state) => ({
  sorting: state.sorting,
  pagination: state.pagination,
}))

// Or: subscribe to nothing at the top level; do all reads inside <table.Subscribe>.
const table = useTable(opts, () => null)
```

Source: `docs/framework/react/guide/table-state.md`; `examples/react/basic-subscribe/src/main.tsx` (uses `() => null`).

### 2. `<table.Subscribe>` and standalone `<Subscribe>`

Use `<table.Subscribe>` at the component level. Inside cell/header render contexts, `table` is the core `Table<TFeatures, TData>` (not `ReactTable`), so `table.Subscribe` is **not on the object** — import the standalone `<Subscribe>` and pass `source={table.store}` or `source={table.atoms.X}`.

```tsx
import { Subscribe } from '@tanstack/react-table'

// Component-level: table.Subscribe with a state selector.
<table.Subscribe selector={(s) => s.pagination}>
  {(pagination) => <span>Page {pagination.pageIndex + 1}</span>}
</table.Subscribe>

// Subscribe to a single atom (narrower than table.store).
<table.Subscribe source={table.atoms.rowSelection}>
  {(rowSelection) => <span>{Object.keys(rowSelection).length} selected</span>}
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

Source: `packages/react-table/src/Subscribe.ts`; `examples/react/basic-subscribe/src/main.tsx`.

### 3. External atoms with `useCreateAtom` + `options.atoms`

Move ownership of any slice to an atom you create with `useCreateAtom` (from `@tanstack/react-store`). Pass it via `options.atoms.<slice>`. The table writes to your atom when you call `table.setSorting(...)`, `table.setPageIndex(...)`, etc. — **no `on*Change` handler is needed**.

Precedence: `options.atoms[key]` > `options.state[key]` > internal `baseAtoms[key]`. Don't pass both `state.foo` and `atoms.foo` for the same slice; `atoms` wins silently.

```tsx
import { useCreateAtom, useSelector } from '@tanstack/react-store'
import type { PaginationState, SortingState } from '@tanstack/react-table'

function MyTable({ columns, data }) {
  const sortingAtom = useCreateAtom<SortingState>([])
  const paginationAtom = useCreateAtom<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Independent fine-grained subscriptions.
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

Source: `examples/react/basic-external-atoms/src/main.tsx`.

### 4. `createTableHook` for reusable shared config

When you ship the same `features` / row model factories / cell components across many tables, package them with `createTableHook`. You get `useAppTable`, `createAppColumnHelper`, and `table.AppTable` / `AppHeader` / `AppCell` / `AppFooter` boundaries.

```tsx
import { createTableHook } from '@tanstack/react-table'

const { useAppTable, createAppColumnHelper } = createTableHook({
  features: {},
  debugTable: true,
})

const columnHelper = createAppColumnHelper<Person>()
const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { cell: (info) => info.getValue() }),
  // …
])

function App() {
  const [data] = React.useState(() => [...defaultData])
  const table = useAppTable({ columns, data }, (state) => state)
  return (
    <table>
      <thead>{/* table.FlexRender header={h} */}</thead>
      <tbody>{/* table.FlexRender cell={c} */}</tbody>
    </table>
  )
}
```

Source: `examples/react/basic-use-app-table/src/main.tsx`; `packages/react-table/src/createTableHook.tsx`.

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
Source: `docs/framework/react/guide/table-state.md`; `examples/react/basic-subscribe/src/main.tsx`.

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
// Pick exactly one source of truth per slice.
const table = useTable({
  features,
  columns,
  data,
  atoms: { pagination: paginationAtom },
})
```

Precedence is `options.atoms[key]` > `options.state[key]` > internal — `state` is dropped without a warning.
Source: `docs/framework/react/guide/table-state.md`; `examples/react/basic-external-atoms/src/main.tsx`.

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
import { Subscribe } from '@tanstack/react-table'

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

In cell and header render contexts, `table` is the core `Table<TFeatures, TData>`, not `ReactTable` — `table.Subscribe` is undefined. Use the standalone import.
Source: `docs/framework/react/guide/table-state.md` (Tips); `packages/react-table/src/Subscribe.ts`.

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
Source: `examples/react/basic-external-atoms/src/main.tsx`.

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

function MyTable({ rows }) {
  const data = rows ?? EMPTY // EMPTY at module scope
  const table = useTable({ features, columns, data })
}
```

Internal memoization keys off identity. A new reference each render busts memos and forces full recomputation.
Source: `docs/framework/react/guide/table-state.md` (FAQ #1).

### MEDIUM Premature `Subscribe` / custom selector on small tables

Wrong:

```tsx
// 50-row table with Subscribe wrapped around every cell.
header: ({ table }) => (
  <Subscribe source={table.store} selector={(s) => s.sorting}>
    {() => <SortHeader />}
  </Subscribe>
)
```

Correct:

```tsx
// Default selector + inline rendering. Reach for Subscribe later, scoped to actual hotspots.
const table = useTable({ features, columns, data })
```

Subscribe and narrow selectors are for large / expensive tables where full re-renders measurably hurt. On a small table they only add complexity.
Source: maintainer guidance (Phase 4).

## See Also

- `tanstack-table/react/react-subscribe-compiler-compat` — when builder reads in nested components break under React Compiler memoization.
- `tanstack-table/react/getting-started` — first-table walkthrough.
- `tanstack-table/react/production-readiness` — narrowing selectors, tree-shaking, reference stability.
- `tanstack-table/react/compose-with-tanstack-store` — sharing slice atoms across components, persistence.
