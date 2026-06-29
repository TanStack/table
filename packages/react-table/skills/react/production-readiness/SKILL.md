---
name: react/production-readiness
description: >
  Ship-ready optimizations for `@tanstack/react-table` v9: tree-shake the
  bundle by registering ONLY the `features` you actually use; memoize
  `features`, `data`, and `columns` for stable identity; replace
  `(state) => state` with narrow selectors or per-slice
  `useSelector(table.atoms.<slice>)` subscriptions; and push state-driven
  re-renders down the tree with `<table.Subscribe>` / `<Subscribe>` so the
  expensive table body doesn't re-render every time you toggle a sort
  indicator. Don't over-optimize small tables — the default selector +
  inline rendering is fine until measured perf demands more.
type: lifecycle
library: tanstack-table
framework: react
library_version: '9.0.0-alpha.48'
requires:
  - setup
  - state-management
  - react/table-state
sources:
  - TanStack/table:docs/guide/features.md
  - TanStack/table:docs/framework/react/guide/table-state.md
  - TanStack/table:examples/react/basic-subscribe/src/main.tsx
  - TanStack/table:examples/react/basic-external-atoms/src/main.tsx
  - TanStack/table:examples/react/kitchen-sink/src/main.tsx
---

This skill builds on `tanstack-table/state-management` and `tanstack-table/react/table-state`. Read those first — `features` tree-shaking and the atom reactivity model are the foundation; this skill is about _which_ of the patterns introduced there you actually need in production.

## When to optimize

The default `useTable` selector is `(state) => state` — the component re-renders on any state change. That's correct and ergonomic, and for tables with a few hundred rows and basic features it's the right default. Don't reach for `<Subscribe>` walls or per-slice atom subscriptions until you've **measured** a problem (slow keystrokes in a filter input, dropped frames during scrolling, long-running renders). On small tables the optimization noise costs more than it saves.

## Setup — stable references

The biggest single perf win is keeping `features` and `columns` references stable across renders. Internal memoization keys off identity, so a new object every render forces full recomputation. Row model factories live on `features`, so they are also stable at module scope.

```tsx
// ✓ Module scope = stable identity
const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
})
const columnHelper = createColumnHelper<typeof features, Person>()
const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { header: 'First' }),
  columnHelper.accessor('age', { header: 'Age' }),
])

// Module-scope empty array for the "no data yet" branch.
const EMPTY: Person[] = []

function MyTable({ data }: { data: Person[] | undefined }) {
  const table = useTable({
    features,
    columns,
    data: data ?? EMPTY,
  })
}
```

## Core Patterns

### 1. Tree-shake `features` to only what you use

Avoid `stockFeatures` in production. A sort-only table is ~6–7kb registered explicitly versus ~15–20kb if you import the whole stock set.

```tsx
// ✓ Pay only for what you render
const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
})

// ✗ Ships filtering, faceting, grouping, pinning, expanding, sizing,
//   resizing, visibility, ordering, row-selection, row-pinning…
const features = tableFeatures(stockFeatures)
```

Source: `docs/guide/features.md`; maintainer guidance.

### 2. Narrow the `useTable` selector

`(state) => state` re-renders the holding component on any state change. If only one component cares about one slice, pass a narrow selector — or pass `() => null` and rely on `<table.Subscribe>` walls inside.

```tsx
// Narrow to specific slices at the table level.
const table = useTable({ features, columns, data }, (state) => ({
  sorting: state.sorting,
  pagination: state.pagination,
}))

// Or: opt out completely at the top, subscribe surgically inside.
const table = useTable(opts, () => null)
```

Source: `examples/react/basic-subscribe/src/main.tsx` (uses `() => null`).

### 3. Push re-renders down with `<table.Subscribe>`

A noisy footer that re-renders on every keystroke in a filter doesn't need to re-render the whole `<TableBody>`. Wrap each consumer in `<table.Subscribe>` with its own selector.

```tsx
function MyTable({ data, columns }) {
  const table = useTable(
    { features, columns, data },
    () => null, // top-level opt-out
  )
  return (
    <>
      <TableBody table={table} /> {/* heavy — keep stable */}
      {/* Footer re-renders only on pagination changes */}
      <table.Subscribe selector={(s) => s.pagination}>
        {(pagination) => <PageFooter pagination={pagination} table={table} />}
      </table.Subscribe>
    </>
  )
}
```

Source: `examples/react/basic-subscribe/src/main.tsx`.

### 4. Per-slice `useSelector(table.atoms.<slice>)` for narrowest scope

Even narrower than `<table.Subscribe>`: subscribe a leaf component to a single atom. Skips constructing a state snapshot entirely.

```tsx
import { useSelector } from '@tanstack/react-store'

function SelectedCount({ table }) {
  // Re-renders ONLY when rowSelection changes — not sorting / pagination / etc.
  const selection = useSelector(table.atoms.rowSelection)
  return <span>{Object.keys(selection).length} selected</span>
}
```

Source: `examples/react/basic-external-atoms/src/main.tsx`.

### 5. React Compiler — read state via `<Subscribe>` in nested components

The compiler can't see through the `table` closure, so reads via builder APIs (`column.getIsPinned()`, `row.getIsSelected()`) in memoized child components go stale. Wrap them in `<Subscribe>` (see `tanstack-table/react/react-subscribe-compiler-compat`).

### 6. Virtualization in the deepest possible component

Keep `useVirtualizer` in the deepest component (`TableBody`, not `App`). Any state change in the holder of the virtualizer re-runs it and tanks scroll perf. See `tanstack-table/react/compose-with-tanstack-virtual`.

## Common Mistakes

### HIGH Using `stockFeatures` in production

Wrong:

```tsx
import { useTable, stockFeatures, tableFeatures } from '@tanstack/react-table'
const features = tableFeatures(stockFeatures) // ships every feature
```

Correct:

```tsx
import {
  useTable,
  tableFeatures,
  rowSortingFeature,
  rowPaginationFeature,
} from '@tanstack/react-table'
const features = tableFeatures({ rowSortingFeature, rowPaginationFeature })
```

Tree-shaking via `features` is one of the headline reasons for the v9 rewrite. `stockFeatures` exists for migration / "everything on" smoke tests, not production.
Source: maintainer guidance; `docs/guide/features.md`.

### HIGH Unstable `features` / `columns` references

Wrong:

```tsx
function MyTable({ data }) {
  const features = tableFeatures({
    // new every render
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),
    sortFns,
  })
  const table = useTable({ features, columns, data })
}
```

Correct:

```tsx
// Module scope — declared once.
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

function MyTable({ data }) {
  const table = useTable({ features, columns, data })
}
```

Internal memoization keys off identity. A new object every render busts memos and forces full recomputation.
Source: FAQ #1; `examples/react/basic-use-table/src/main.tsx`.

### HIGH `data={rows ?? []}` in JSX

Wrong:

```tsx
<MyTable data={query.data?.rows ?? []} columns={columns} />
```

Correct:

```tsx
const EMPTY: Person[] = []  // module scope

<MyTable data={query.data?.rows ?? EMPTY} columns={columns} />
// or memoize the fallback:
const data = React.useMemo(() => query.data?.rows ?? [], [query.data])
```

The `?? []` produces a new array identity each render, busting internal memos that depend on `data` reference.
Source: `examples/react/with-tanstack-query/src/main.tsx`.

### MEDIUM Leaving `(state) => state` when only one component cares

Wrong:

```tsx
// Default selector — whole tree re-renders on every state change.
const table = useTable(opts)
return <DeeplyNestedTable table={table} />
```

Correct:

```tsx
const table = useTable(opts, () => null)
return (
  <>
    <TableBody table={table} />
    <table.Subscribe selector={(s) => s.pagination}>
      {(p) => <PageFooter pagination={p} />}
    </table.Subscribe>
  </>
)
```

Once you've measured a problem, narrow the top selector and add `<table.Subscribe>` walls around the components that actually need state.
Source: `examples/react/basic-subscribe/src/main.tsx`.

### MEDIUM Subscribing to the whole `table.store` when a single atom would do

Wrong:

```tsx
<table.Subscribe selector={(s) => s.rowSelection}>
  {(rs) => <span>{Object.keys(rs).length} selected</span>}
</table.Subscribe>
```

Correct:

```tsx
import { useSelector } from '@tanstack/react-store'

function SelectedCount({ table }) {
  const selection = useSelector(table.atoms.rowSelection)
  return <span>{Object.keys(selection).length} selected</span>
}
```

`<table.Subscribe>` still selects from `table.state` (the full state). For a single slice, `useSelector(table.atoms.X)` skips even constructing the snapshot.
Source: `docs/framework/react/guide/table-state.md`.

### MEDIUM Hoisting heavy table state reads above virtualizers

Wrong:

```tsx
function App() {
  const rowVirtualizer = useVirtualizer({
    /* … */
  }) // virtualizer too high
  const table = useTable(opts)
  return <TableBody table={table} virtualizer={rowVirtualizer} />
}
```

Correct:

```tsx
function App() {
  const tableContainerRef = React.useRef<HTMLDivElement>(null)
  const table = useTable(opts)
  return (
    <div ref={tableContainerRef} style={{ overflow: 'auto', height: 800 }}>
      <TableBody table={table} tableContainerRef={tableContainerRef} />
    </div>
  )
}
function TableBody({ table, tableContainerRef }) {
  const rowVirtualizer = useVirtualizer({
    /* … */
  }) // virtualizer at the bottom
  /* … */
}
```

The virtualizer in the deepest component avoids re-running on unrelated state changes.
Source: `examples/react/virtualized-rows/src/main.tsx`.

### MEDIUM Premature `<Subscribe>` / narrow selectors on small tables

Wrong:

```tsx
// 50-row table with Subscribe around every cell.
header: ({ table }) => (
  <Subscribe source={table.store} selector={(s) => s.sorting}>
    {() => <SortHeader />}
  </Subscribe>
)
```

Correct:

```tsx
const table = useTable({ features, columns, data })
// Reach for Subscribe later, scoped to actual hotspots.
```

Advanced state-management patterns are for advanced cases. On small tables the boundary churn costs more than it saves.
Source: maintainer guidance (Phase 4).

## See Also

- `tanstack-table/react/table-state` — the API surface this skill optimizes against.
- `tanstack-table/react/react-subscribe-compiler-compat` — required reading if React Compiler is on.
- `tanstack-table/react/compose-with-tanstack-store` — fine-grained subscriptions via external atoms.
- `tanstack-table/react/compose-with-tanstack-virtual` — row/column virtualization patterns.
- `tanstack-table/react/compose-with-tanstack-devtools` — `/production` import for live devtools in prod.
