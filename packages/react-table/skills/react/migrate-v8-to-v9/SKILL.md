---
name: react/migrate-v8-to-v9
description: >
  Mechanical breaking-change migration from `@tanstack/react-table` v8 to v9.
  Every v8-shaped option, type, or method an agent will reproduce from muscle
  memory has a v9 equivalent enumerated below: `useReactTable` → `useTable`,
  root `get*RowModel` options → row model factories on `tableFeatures({...})`
  alongside their *Fns registries,
  `createColumnHelper<TData>` → `createColumnHelper<typeof features, TData>`,
  `table.getState()` → `table.state` / `table.store.state` / `table.atoms.X.get()`,
  `sortingFn` → `sortFn`, `enablePinning` → split, `_`-prefixed APIs unprefixed,
  `ColumnSizing` split into `columnSizingFeature` + `columnResizingFeature`.
  For incremental migration, `useLegacyTable` from `@tanstack/react-table/legacy`
  accepts the v8 API on the v9 engine — deprecated, larger bundle, no
  `table.Subscribe`. Long-term you migrate every table off it.
type: lifecycle
library: tanstack-table
framework: react
library_version: '9.0.0-alpha.48'
requires:
  - setup
  - state-management
  - column-definitions
sources:
  - TanStack/table:docs/framework/react/guide/migrating.md
  - TanStack/table:docs/framework/react/guide/use-legacy-table.md
  - TanStack/table:packages/react-table/src/legacy.ts
  - TanStack/table:examples/react/basic-use-legacy-table/src/main.tsx
  - TanStack/table:examples/react/basic-use-table/src/main.tsx
---

This skill builds on `tanstack-table/state-management` and `tanstack-table/react/table-state`. Read those first — `state-management` explains the v9 `features`-first design (where row model factories and \*Fns registries live on `tableFeatures()`), and `table-state` shows the new reactivity model.

## Two migration paths

| Path                                     | Use when                                                                     | Cost                                                                                   |
| ---------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Direct: `useReactTable` → `useTable`** | New code, small/medium codebase, or you want React Compiler + Subscribe perf | Per-table refactor; no `getState()` reads in render                                    |
| **Bridge: `useLegacyTable`**             | Large v8 codebase you can't refactor in one PR                               | Bigger bundle (ships every feature), no `table.Subscribe`, deprecated — pay back later |

The bridge is React-only. Angular projects must migrate directly.

## Setup

Imports change for v9. The legacy shim lives under `/legacy`.

```tsx
// v9 (new code)
import {
  useTable,
  tableFeatures,
  rowSortingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  columnSizingFeature,
  columnResizingFeature,
  createColumnHelper,
  createSortedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  sortFns,
  filterFns,
} from '@tanstack/react-table'

// Legacy shim (migration aid only)
import {
  useLegacyTable,
  legacyCreateColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table/legacy'
```

## Direct migration: v8 → v9 line-by-line

### Hooks and helpers

```tsx
// v8
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
const columnHelper = createColumnHelper<Person>()
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})

// v9
import {
  useTable,
  tableFeatures,
  rowSortingFeature,
  createColumnHelper,
  createSortedRowModel,
  sortFns,
} from '@tanstack/react-table'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
const columnHelper = createColumnHelper<typeof features, Person>()
const table = useTable({
  features,
  columns,
  data,
})
```

### State reads

```tsx
// v8
const state = table.getState()
const cells = row._getAllCellsByColumnId()

// v9
const all = table.state // flat snapshot
const sorting = table.atoms.sorting.get() // per-slice atom
const cells = row.getAllCellsByColumnId() // no underscore — APIs unprefixed
```

In components, prefer `<table.Subscribe>` over `table.state` for reactivity (see `tanstack-table/react/table-state`).

### Renames

| v8                               | v9                                                          |
| -------------------------------- | ----------------------------------------------------------- |
| `sortingFn` (column def)         | `sortFn`                                                    |
| `sortingFns` (registry)          | `sortFns`                                                   |
| `getSortingFn()`                 | `getSortFn()`                                               |
| `getAutoSortingFn()`             | `getAutoSortFn()`                                           |
| `SortingFn` / `SortingFns` types | `SortFn` / `SortFns`                                        |
| `enablePinning: true`            | `enableColumnPinning: true` AND/OR `enableRowPinning: true` |
| `columnSizingInfo` state         | `columnResizing`                                            |
| `onColumnSizingInfoChange`       | `onColumnResizingChange`                                    |
| `table._getFacetedRowModel` etc. | `table.getFacetedRowModel` etc. (underscore dropped)        |
| `row._getAllCellsByColumnId()`   | `row.getAllCellsByColumnId()`                               |

### Column resizing split

```tsx
// v8
useReactTable({
  /* ColumnSizing feature handles BOTH widths AND drag */
})

// v9 — explicit
const features = tableFeatures({
  columnSizingFeature, // fixed widths
  columnResizingFeature, // drag-to-resize (separate feature)
})
```

### Type generics — `TFeatures` first

```tsx
// v8
type MyDef = ColumnDef<Person, string>
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    customProp: string
  }
}

// v9
type MyDef = ColumnDef<typeof features, Person, string>
declare module '@tanstack/react-table' {
  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  > {
    customProp: string
  }
}
```

`RowData` was also tightened from `unknown | object | any[]` to `Record<string, any> | Array<any>`.

### Mutability

`data` and `columns` are `readonly` in v9. Any code that mutates the array in place (`data.push(...)`) will fail at the TS layer; flow changes through `setData(prev => [...prev, row])`.

## Bridge migration: `useLegacyTable`

When you need to keep one or many tables on the v8 API while you upgrade others, switch the import path:

```tsx
// Before: v8 import
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, getFilteredRowModel, createColumnHelper, flexRender }
  from '@tanstack/react-table'

// After: legacy shim, same call shape
import {
  useLegacyTable,
  legacyCreateColumnHelper,
  getCoreRowModel, getSortedRowModel, getPaginationRowModel, getFilteredRowModel,
} from '@tanstack/react-table/legacy'
import { flexRender } from '@tanstack/react-table'

const columnHelper = legacyCreateColumnHelper<Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { cell: (info) => info.getValue() }),
  // ...
])

function App({ data }) {
  const [sorting, setSorting] = React.useState([])
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })

  const table = useLegacyTable({
    columns,
    data,
    // v8-style root options — mapped to v9 rowModels under the hood
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  })

  // Rendering: with useLegacyTable, prefer `flexRender(header.column.columnDef.header, header.getContext())`.
  return (/* same JSX shape as v8 */)
}
```

Source: `examples/react/basic-use-legacy-table/src/main.tsx`; `packages/react-table/src/legacy.ts`.

Tradeoffs of the bridge:

- Bundles every feature (no tree-shaking benefit).
- No `table.Subscribe`, no `table.atoms`, no fine-grained reactivity — subscribes to all state like v8.
- **Deprecated in v9, removed in v10.** Use it to unblock incremental migration; don't ship new features against it.

## Common Mistakes

### CRITICAL Keeping `useReactTable` + `get*RowModel` options on v9

Wrong:

```tsx
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
})
```

Correct:

```tsx
import { useTable, tableFeatures } from '@tanstack/react-table'
const features = tableFeatures({})
const table = useTable({ features, data, columns })
```

`useReactTable` is the v8 entry point and won't have `table.Subscribe` / `table.atoms`. `getCoreRowModel()` as an option was removed — core is automatic; non-core models move into `tableFeatures()` as factory slots alongside their \*Fns registries.
Source: PR #6202; `packages/react-table/src/useTable.ts`.

### CRITICAL `createSortedRowModel` without registering `sortFns`

Wrong:

```tsx
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  // missing sortFns — built-in sort functions not available
})
```

Correct:

```tsx
import { createSortedRowModel, sortFns } from '@tanstack/react-table'
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns, // registers built-in sort functions for tree-shaking
})
```

The `sortFns` slot on `tableFeatures()` is what makes the built-in sort functions tree-shakeable: `filterFns` for `createFilteredRowModel()`, `aggregationFns` for `createGroupedRowModel()`.
Source: `docs/framework/react/guide/migrating.md`.

### CRITICAL `createColumnHelper<Person>()` (v8 arity)

Wrong:

```tsx
const columnHelper = createColumnHelper<Person>()
```

Correct:

```tsx
const columnHelper = createColumnHelper<typeof features, Person>()
```

v9 requires `<TFeatures, TData>`. `typeof features` is the standard idiom — declare features once and reuse the type.
Source: `docs/framework/react/guide/migrating.md`.

### CRITICAL `table.getState()` reads on v9

Wrong:

```tsx
function Toolbar({ table }) {
  const { rowSelection } = table.getState() // exists on v8, removed on v9
  return <div>{Object.keys(rowSelection).length} selected</div>
}
```

Correct:

```tsx
function Toolbar({ table }) {
  return (
    <table.Subscribe selector={(s) => Object.keys(s.rowSelection).length}>
      {(count) => <div>{count} selected</div>}
    </table.Subscribe>
  )
}
```

`getState` was removed. Use `table.state` for a flat snapshot, `table.state` if you passed a `useTable` selector, or `<table.Subscribe>` for reactive reads.
Source: `docs/framework/react/guide/migrating.md`; `examples/react/basic-subscribe/src/main.tsx`.

### HIGH `enablePinning: true` on v9

Wrong:

```tsx
useTable({ features, columns, data, enablePinning: true })
```

Correct:

```tsx
useTable({
  features,
  columns,
  data,
  enableColumnPinning: true,
  enableRowPinning: true,
})
```

`enablePinning` was split. Pick one or both depending on what you actually want.
Source: `docs/framework/react/guide/migrating.md`.

### HIGH `_`-prefixed APIs

Wrong:

```tsx
row._getAllCellsByColumnId()
table._getFacetedRowModel()
table._getFacetedMinMaxValues()
```

Correct:

```tsx
row.getAllCellsByColumnId()
table.getFacetedRowModel()
table.getFacetedMinMaxValues()
```

All went public — drop the underscore.
Source: `docs/framework/react/guide/migrating.md`.

### HIGH Module augmentation with v8 generic arity

Wrong:

```tsx
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    customProp: string
  }
}
```

Correct:

```tsx
declare module '@tanstack/react-table' {
  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  > {
    customProp: string
  }
}
```

v9 added `TFeatures` as the first generic on `ColumnMeta` / `Column` / `Row` / `ColumnDef`. Wrong arity silently widens the augmentation.
Source: `examples/react/basic-use-legacy-table/src/main.tsx` (correct shape).

### MEDIUM Mutating `data` or `columns` in place

Wrong:

```tsx
const data = []
function addRow(row) {
  data.push(row)
  rerender()
}
```

Correct:

```tsx
const [data, setData] = React.useState<Person[]>([])
function addRow(row: Person) {
  setData((prev) => [...prev, row])
}
```

PR #6183 made `data` and `columns` `readonly` to force changes through React state.
Source: `docs/framework/react/guide/migrating.md`.

### MEDIUM Treating `useLegacyTable` as a long-term answer

Wrong:

```tsx
// New feature shipped on the legacy shim — locks in the bigger bundle indefinitely.
import { useLegacyTable } from '@tanstack/react-table/legacy'
```

Correct:

```tsx
// New tables: useTable. Reach for the legacy shim only when migrating an existing v8 table piecemeal.
import { useTable, tableFeatures } from '@tanstack/react-table'
```

`useLegacyTable` is deprecated in v9 and scheduled for removal in v10. It exists to unblock incremental migration, not to be a permanent API.
Source: `docs/framework/react/guide/use-legacy-table.md`.

### CRITICAL Hallucinating react-table v7 / `useTable(opts, useSortBy)` shape

Wrong:

```tsx
import { useTable, useSortBy } from 'react-table' // v7 package name + plugin hooks
const table = useTable({ columns, data }, useSortBy)
```

Correct:

```tsx
import {
  useTable,
  tableFeatures,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
} from '@tanstack/react-table'
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
const table = useTable({
  features,
  columns,
  data,
})
```

The `react-table` package (v7) was renamed to `@tanstack/react-table` in v8 and reshaped again in v9. Agents trained on pre-v9 data will produce all three shapes — only the v9 shape compiles today.
Source: maintainer interview (Phase 4).

## See Also

- `tanstack-table/react/getting-started` — the v9 minimum-viable shape.
- `tanstack-table/react/table-state` — replacing `getState()` with selectors / `<Subscribe>`.
- `tanstack-table/react/production-readiness` — tree-shaking with `features` (the whole point of the v9 redesign).
- `tanstack-table/react/react-subscribe-compiler-compat` — fixes the v8-React-Compiler "incompatible library" warning.
