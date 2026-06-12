---
name: preact/migrate-v8-to-v9
description: >
  Mechanical breaking-change migration from TanStack Table v8 to v9 for
  `@tanstack/preact-table`. Maps every old-shaped option, helper, type, and
  method an agent will reproduce from v8 muscle memory to its v9 equivalent:
  `useReactTable` → `useTable`, per-row-model `get*RowModel` options →
  row-model factories registered in `tableFeatures({...})`, plain column
  helpers → typed column helpers, `state` + `on*Change` → `atoms`,
  `flexRender` → `table.FlexRender`, and core type renames.
  Routing keywords: v8 to v9, migration, useReactTable, table v8 preact,
  get*RowModel, features.
type: lifecycle
library: tanstack-table
framework: preact
library_version: '9.0.0-alpha.48'
requires:
  - setup
  - state-management
  - column-definitions
sources:
  - TanStack/table:docs/framework/preact/preact-table.md
  - TanStack/table:docs/framework/preact/guide/table-state.md
  - TanStack/table:docs/framework/react/guide/use-legacy-table.md
  - TanStack/table:packages/preact-table/src/useTable.ts
---

The Preact adapter mirrors the React v9 surface, so any v8 → v9 migration guide for React applies almost line-for-line. There is no `useLegacyTable` shim in `@tanstack/preact-table` — migrate directly.

## The Core Mapping

| v8 (Preact / React-compatible)                                           | v9 (`@tanstack/preact-table`)                                                                                                                                                                                   |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useReactTable(opts)`                                                    | `useTable(opts, selector?)`                                                                                                                                                                                     |
| `getCoreRowModel: getCoreRowModel()`                                     | included by default; no factory needed                                                                                                                                                                          |
| `getSortedRowModel: getSortedRowModel()`                                 | `tableFeatures({ rowSortingFeature, sortedRowModel: createSortedRowModel(), sortFns })`                                                                                                                         |
| `getFilteredRowModel: getFilteredRowModel()`                             | `tableFeatures({ columnFilteringFeature, globalFilteringFeature, filteredRowModel: createFilteredRowModel(), filterFns })`                                                                                      |
| `getPaginationRowModel: getPaginationRowModel()`                         | `tableFeatures({ rowPaginationFeature, paginatedRowModel: createPaginatedRowModel() })`                                                                                                                         |
| `getGroupedRowModel: getGroupedRowModel()`                               | `tableFeatures({ columnGroupingFeature, groupedRowModel: createGroupedRowModel(), aggregationFns })`                                                                                                            |
| `getExpandedRowModel: getExpandedRowModel()`                             | `tableFeatures({ rowExpandingFeature, expandedRowModel: createExpandedRowModel() })`                                                                                                                            |
| `getFacetedRowModel`, `getFacetedUniqueValues`, `getFacetedMinMaxValues` | `tableFeatures({ columnFacetingFeature, globalFacetingFeature, facetedRowModel: createFacetedRowModel(), facetedUniqueValues: createFacetedUniqueValues(), facetedMinMaxValues: createFacetedMinMaxValues() })` |
| `flexRender(def, ctx)`                                                   | `<table.FlexRender cell={cell} />` / `header={...}` / `footer={...}`                                                                                                                                            |
| `state`, `on*Change` (only)                                              | still supported, plus `atoms` (preferred per slice)                                                                                                                                                             |
| `createColumnHelper<TData>()`                                            | `createColumnHelper<typeof features, TData>()` — both generics required                                                                                                                                         |
| `ColumnDef<TData, TValue>`                                               | `ColumnDef<TFeatures, TData, TValue>` — `TFeatures` is now the first generic                                                                                                                                    |
| `Table<TData>`                                                           | `Table<TFeatures, TData>`                                                                                                                                                                                       |

Source: `docs/framework/preact/preact-table.md`; `docs/framework/preact/guide/table-state.md`.

## Migration Steps

### 1. Update the package import

```tsx
// v8
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/preact-table'

// v9
import {
  useTable,
  tableFeatures,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
  type ColumnDef,
} from '@tanstack/preact-table'
```

### 2. Declare `features` with row model factories

Replace each `get*RowModel: get*RowModel()` option with a feature import and its row-model factory registered directly in `tableFeatures({...})`.

```tsx
// v8
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})

// v9
const features = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
  filterFns,
})

const table = useTable({ features, columns, data })
```

Move `features` to module scope. Reference stability matters — see `tanstack-table/preact/production-readiness`.

### 3. Update column types and helpers

`TFeatures` is now the first generic on `ColumnDef`, `Table`, and `createColumnHelper`.

```tsx
// v8
const columnHelper = createColumnHelper<Person>()
const columns: ColumnDef<Person>[] = columnHelper.columns([
  /* … */
])

// v9
const columnHelper = createColumnHelper<typeof features, Person>()
const columns: Array<ColumnDef<typeof features, Person>> = columnHelper.columns(
  [
    /* … */
  ],
)
```

### 4. Replace `flexRender` calls with `table.FlexRender`

```tsx
// v8
<th>{flexRender(header.column.columnDef.header, header.getContext())}</th>
<td>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>

// v9
<th>{header.isPlaceholder ? null : <table.FlexRender header={header} />}</th>
<td><table.FlexRender cell={cell} /></td>
```

`flexRender` is still exported for advanced cases, but `table.FlexRender` (or the standalone `FlexRender` component) handles grouping placeholder/aggregated branches for you.

Source: `packages/preact-table/src/FlexRender.tsx`.

### 5. Move external state to atoms (recommended)

`state` + `on*Change` still works, but v9 prefers slice atoms for fine-grained reactivity.

```tsx
// v8 / v9 fallback
const [sorting, setSorting] = useState<SortingState>([])
const table = useTable({
  features,
  columns,
  data,
  state: { sorting },
  onSortingChange: setSorting,
})

// v9 preferred — external atom
import { useCreateAtom } from '@tanstack/preact-store'
const sortingAtom = useCreateAtom<SortingState>([])
const table = useTable({
  features,
  columns,
  data,
  atoms: { sorting: sortingAtom },
  // no onSortingChange needed
})
```

Source: `examples/preact/basic-external-atoms/src/main.tsx`.

### 6. Drop `onStateChange`

The v8-style global `onStateChange` is gone. Subscribe per-slice with `on*Change`, an external atom, or `table.store.subscribe(...)` if you really need every change.

Source: `docs/framework/preact/guide/table-state.md`.

## Common Mistakes

### CRITICAL Keeping `get*RowModel` options after upgrading

Wrong:

```tsx
const table = useTable({
  features,
  columns,
  data,
  getSortedRowModel: getSortedRowModel(), // v8 leftover — silently ignored
})
table.setSorting([{ id: 'age', desc: true }]) // rows are NOT sorted
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

v9 doesn't read the `get*RowModel` options. The row model only runs for stages registered in `tableFeatures`, and the feature only mounts if it is also in `tableFeatures`.
Source: `docs/framework/preact/preact-table.md`.

### CRITICAL Forgetting to register a feature whose API you are calling

Wrong:

```tsx
const features = tableFeatures({}) // no rowSelectionFeature
const table = useTable({ features, columns, data })
table.getIsAllRowsSelected() // TypeScript error / runtime no-op
row.toggleSelected(true) // same
```

Correct:

```tsx
const features = tableFeatures({ rowSelectionFeature })
const table = useTable({ features, columns, data, enableRowSelection: true })
table.getIsAllRowsSelected()
```

v9 generates feature APIs and state slices only for registered features. This is the #1 v9 trap.
Source: `docs/guide/features.md`.

### HIGH Re-using `getCoreRowModel: getCoreRowModel()` from v8

Wrong:

```tsx
const table = useTable({
  features,
  columns,
  data,
  getCoreRowModel: getCoreRowModel(), // no-op in v9
})
```

Correct:

```tsx
const table = useTable({ features, columns, data })
```

The core row model is always included in v9. There is no `getCoreRowModel` option.
Source: `docs/framework/preact/preact-table.md`.

### HIGH Single-generic column helper / `ColumnDef`

Wrong:

```tsx
const columnHelper = createColumnHelper<Person>() // v8 shape
const columns: ColumnDef<Person>[] = [
  /* … */
] // v8 shape
```

Correct:

```tsx
const columnHelper = createColumnHelper<typeof features, Person>()
const columns: Array<ColumnDef<typeof features, Person>> = [
  /* … */
]
```

`TFeatures` is the first generic for nearly every public type in v9. Without it, types degrade to `any` for feature methods.
Source: `docs/framework/preact/preact-table.md`.

### HIGH Reimplementing built-ins (the #1 AI tell)

Wrong:

```tsx
// Manual sorting, manual filtering, manual pagination, manual row-selection objects
```

Correct: register the matching feature and its row-model factory in `tableFeatures({...})`, then use the feature API. v9 ships built-ins for sorting, filtering, pagination, grouping, expanding, faceting, row selection, column visibility/order/pinning/sizing, and row pinning.
Source: `docs/guide/features.md`.

### MEDIUM Calling `flexRender` directly when grouping is on

Wrong:

```tsx
<td>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
```

Correct:

```tsx
<td>
  <table.FlexRender cell={cell} />
</td>
```

`<table.FlexRender cell={...}>` handles aggregated / placeholder cells when `columnGroupingFeature` is registered. Raw `flexRender` does not.
Source: `packages/preact-table/src/FlexRender.tsx`.

## See Also

- `tanstack-table/preact/getting-started` — green-field v9 setup.
- `tanstack-table/preact/table-state` — atom model and Subscribe patterns.
- `tanstack-table/preact/production-readiness` — perf, tree-shaking, stable refs.
