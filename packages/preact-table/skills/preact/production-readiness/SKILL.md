---
name: preact/production-readiness
description: >
  Ship-ready optimizations for `@tanstack/preact-table` v9: tree-shake the
  bundle by registering ONLY the `features` you actually use; memoize
  `features`, `data`, and `columns` for stable identity; replace
  `(state) => state` with narrow selectors or per-slice `useSelector`
  subscriptions; wrap hot subtrees in `<table.Subscribe>`; and prefer slice
  atoms over `state` + `on*Change` for fine-grained updates. Routing keywords:
  preact-table performance, optimization, tree-shaking, stable refs, Subscribe,
  narrow selector.
type: lifecycle
library: tanstack-table
framework: preact
library_version: '9.0.0-alpha.48'
requires:
  - setup
  - state-management
  - preact/table-state
sources:
  - TanStack/table:docs/guide/features.md
  - TanStack/table:docs/framework/preact/guide/table-state.md
  - TanStack/table:examples/preact/basic-subscribe/src/main.tsx
  - TanStack/table:examples/preact/basic-external-atoms/src/main.tsx
  - TanStack/table:packages/preact-table/src/useTable.ts
---

This skill collects the production-readiness levers for a Preact v9 table. Each one is independent — apply only the ones whose problem you actually have.

## 1. Tree-Shake `features`

Only register features the table actually uses. v9's bundle savings come from `features` controlling which feature code (and which state slices and APIs) get included.

```tsx
// Bad — pulls every feature into the bundle even if the UI never uses them.
const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  rowSelectionFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  columnFacetingFeature,
  globalFacetingFeature,
  columnGroupingFeature,
  rowExpandingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  columnOrderingFeature,
  columnPinningFeature,
  rowPinningFeature,
})

// Good — feature list matches what the UI exposes.
const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  rowSelectionFeature,
})
```

The same idea applies to row-model factories: only register factories for features that need one and that you have registered, by including them in the same `tableFeatures({...})` call.

Source: `docs/guide/features.md`; `docs/framework/preact/preact-table.md`.

## 2. Stable References for `features`, `columns`, and `data`

Identity drives every internal memo. Declare these at module scope when possible; otherwise wrap with `useMemo`.

```tsx
// Best — module scope. Single allocation.
const features = tableFeatures({ rowSortingFeature })
const columns: Array<ColumnDef<typeof features, Person>> = [
  /* … */
]
const EMPTY: Person[] = []

function MyTable({ rows }: { rows: Person[] | undefined }) {
  const data = rows ?? EMPTY
  const table = useTable({ features, columns, data })
}

// Okay — useMemo for dynamic columns.
function MyTable({ visibleKeys }: { visibleKeys: string[] }) {
  const columns = useMemo(
    () => visibleKeys.map((k) => columnHelper.accessor(k as any, {})),
    [visibleKeys.join(',')],
  )
}
```

Source: `docs/framework/preact/guide/table-state.md` (FAQ #1).

## 3. Narrow `useTable` Selector

The default selector `(state) => state` re-renders the component on any registered slice change. Narrow it to just the slices the component reads. The Preact adapter uses `shallow` compare from `@tanstack/preact-store` — projected objects only trigger a render when a member changes.

```tsx
// All slices — fine for a small table.
const table = useTable(opts, (state) => state)

// Narrow — re-render only on sorting/pagination changes.
const table = useTable(opts, (state) => ({
  sorting: state.sorting,
  pagination: state.pagination,
}))
table.state.pagination

// Opt-out at the parent; do subscriptions lower in the tree.
const table = useTable(opts, () => null)
```

Source: `examples/preact/basic-subscribe/src/main.tsx`.

## 4. Wrap Hot Subtrees in `<table.Subscribe>`

Once the parent uses `() => null`, push subscriptions next to the UI that actually reads them. Subscribe to single atoms (`source={table.atoms.X}`) to avoid re-deriving the flat store on unrelated changes.

```tsx
const table = useTable(opts, () => null)

// Row body — re-render only when filters/pagination cause the row model to change.
<table.Subscribe
  selector={(s) => ({
    columnFilters: s.columnFilters,
    globalFilter:  s.globalFilter,
    pagination:    s.pagination,
  })}
>
  {() => (
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <tr key={row.id}>{/* … */}</tr>
      ))}
    </tbody>
  )}
</table.Subscribe>

// Per-row selection checkbox — narrow to that row's selection bit.
<table.Subscribe
  source={table.atoms.rowSelection}
  selector={(rs) => rs[row.id]}
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

Source: `examples/preact/basic-subscribe/src/main.tsx`.

## 5. Prefer Slice Atoms over `state` + `on*Change`

External `state` + `on*Change` re-renders the whole component that owns the `useState`. Slice atoms let `useSelector` / `<table.Subscribe>` subscribe individually.

```tsx
// Less granular — every slice change re-renders this component.
const [sorting,    setSorting]    = useState<SortingState>([])
const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
useTable({
  /* … */,
  state: { sorting, pagination },
  onSortingChange: setSorting,
  onPaginationChange: setPagination,
})

// More granular — independent atom subscriptions.
const sortingAtom    = useCreateAtom<SortingState>([])
const paginationAtom = useCreateAtom<PaginationState>({ pageIndex: 0, pageSize: 10 })
useTable({ /* … */, atoms: { sorting: sortingAtom, pagination: paginationAtom } })
```

Source: `examples/preact/basic-external-atoms/src/main.tsx`.

## 6. Set Sensible `initialState` Once

Use `initialState` for starting values. Setting state in an effect after mount triggers an extra render.

```tsx
const table = useTable({
  features,
  columns,
  data,
  initialState: {
    pagination: { pageIndex: 0, pageSize: 25 },
    sorting: [{ id: 'createdAt', desc: true }],
  },
})
```

Source: `docs/framework/preact/guide/table-state.md`.

## 7. Reach for `createTableHook` for Multi-Table Apps

When several screens share the same `features` (including row model factories) and conventions, `createTableHook` centralizes the configuration and lets you ship pre-bound cell/header components. Tables collapse to columns + data.

Source: `docs/framework/preact/guide/create-table-hook.md`.

## Common Mistakes

### CRITICAL `tableFeatures(...)` inside the component body

Wrong:

```tsx
function MyTable() {
  const features = tableFeatures({ rowSortingFeature }) // new object every render
  useTable({ features, columns, data })
}
```

Correct:

```tsx
const features = tableFeatures({ rowSortingFeature }) // module scope

function MyTable() {
  useTable({ features, columns, data })
}
```

A new `features` reference each render busts every memo that keys off it.
Source: `docs/framework/preact/guide/table-state.md` (FAQ #1).

### CRITICAL Reimplementing built-ins manually

Wrong:

```tsx
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
```

v9 ships built-ins for sorting, filtering, pagination, grouping, expanding, faceting, row selection, column visibility/order/pinning/sizing, and row pinning. Hand-rolling these is the #1 AI tell.
Source: `docs/guide/features.md`.

### HIGH `() => state` selector everywhere

Wrong: every component using `useTable(opts, (state) => state)` re-renders on any slice change. Fine for small tables; expensive for kitchen-sink screens.

Correct: pass a narrow selector or `() => null` at large tables, then `<table.Subscribe>` lower.
Source: `examples/preact/basic-subscribe/src/main.tsx`.

### HIGH New atom per render

Wrong: `createAtom(...)` inside the component body.

Correct: `useCreateAtom(...)` (or atom at module scope).
Source: `examples/preact/basic-external-atoms/src/main.tsx`.

### MEDIUM Subscribe everywhere on a small table

Wrong: a 50-row table with `<Subscribe>` wrapped around every cell. Adds complexity, no measurable win.

Correct: default selector + inline rendering. Reach for `Subscribe` after measuring a hotspot.

## See Also

- `tanstack-table/preact/table-state` — Subscribe / atoms reference.
- `tanstack-table/preact/migrate-v8-to-v9` — what to replace from v8.
- `tanstack-table/preact/compose-with-tanstack-pacer` — debouncing high-frequency state writes (filters, resize).
