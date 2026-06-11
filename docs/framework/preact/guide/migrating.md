---
title: Migrating to TanStack Table v9 (Preact)
---

## What's New in TanStack Table v9

TanStack Table v9 is a major release with a smaller, more explicit table setup. The core table logic is familiar, but the table instance now declares exactly which features, row models, and state subscriptions it needs.

### 1. Tree-shaking

- **Features are tree-shakeable**: features are registered explicitly. If a table only needs sorting and pagination, it does not need to ship filtering, grouping, or row selection code.
- **Row models are registered explicitly**: row model factories now live under `rowModels` instead of root `get*RowModel` options.
- **Function registries moved to factories**: row model factories like `createSortedRowModel(sortFns)`, `createFilteredRowModel(filterFns)`, and `createGroupedRowModel(aggregationFns)` receive the function registry they need. This lets unused built-in functions tree-shake.

### 2. State Management

- **Uses TanStack Store**: table state is now backed by TanStack Store atoms.
- **Per-slice state atoms**: state slices like `sorting`, `pagination`, and `rowSelection` are separate atoms instead of one monolithic state object.
- **Default full-state subscription, optional narrower selectors**: By default, `useTable` selects all registered table state, so `table.state` contains the full state and the component re-renders when any registered state changes. Pass a narrower selector, use `table.Subscribe`, or use atom selectors when only a smaller part of the UI should re-render.
- **External atoms**: apps can own individual state slices by passing writable atoms through the `atoms` option.

### 3. Composability

- **`tableOptions()`**: build type-safe partial table option objects that can be shared and composed.
- **`createTableHook()`**: create app-level Preact table factories with shared features, row models, defaults, and component conventions.

### The Good News: Most Upgrades Are Opt-in

- You can start with `stockFeatures` while migrating, then replace it with explicit feature registration.
- `useTable` defaults to v8-style full state subscriptions. Pass a narrower selector only when you want to optimize re-renders.
- Table markup is largely unchanged. Rows, headers, cells, and feature APIs still drive rendering.

The main migration is changing from the React adapter used through `preact/compat` to the native Preact adapter: `useReactTable` becomes `useTable`, and `get*RowModel` options become `features` plus `rowModels`.

## Preact v8 Context

TanStack Table v8 did not have an officially released Preact adapter. If you used TanStack Table in a Preact app on v8, you were most likely using `@tanstack/react-table` through `preact/compat`.

This guide is for migrating that setup to the native v9 `@tanstack/preact-table` adapter. After this migration, TanStack Table's Preact packages should not be the reason your table code requires `preact/compat`; any remaining compat aliases should come from the rest of your app or other dependencies.

---

## Core Breaking Changes

### Hook Rename

```tsx
// v8 / before: Preact app using the React adapter through preact/compat
import { useReactTable } from '@tanstack/react-table'

const table = useReactTable(options)

// v9: native Preact adapter
import { useTable } from '@tanstack/preact-table'

const table = useTable(options)
```

### New Required Options: `features` and `rowModels`

In v9, a table must declare its feature set and row models.

```tsx
// v8 / before: React adapter through preact/compat
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'

const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
})

// v9
import { tableFeatures, useTable } from '@tanstack/preact-table'

const features = tableFeatures({})

const table = useTable({
  features,
  rowModels: {}, // core row model is automatic
  columns,
  data,
})
```

Keep `features` and reusable `rowModels` objects outside the component when possible so references stay stable.

---

## The `features` Option

Features control which APIs, options, and state slices exist on the table instance. In the v8 React adapter, features were bundled together. In v9, importing and registering only what you use is the default.

### Importing Individual Features

```tsx
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/preact-table'

const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
})
```

### Using `stockFeatures` for v8-like Behavior

`stockFeatures` includes the common feature set and can be useful for smoke tests or early migration. It gives up the main bundle-size benefit of v9, so audit it before shipping.

```tsx
import { stockFeatures, useTable } from '@tanstack/preact-table'

const table = useTable({
  features: stockFeatures,
  rowModels,
  columns,
  data,
})
```

### Available Features

| Feature | Import Name |
|---|---|
| Column Filtering | `columnFilteringFeature` |
| Global Filtering | `globalFilteringFeature` |
| Row Sorting | `rowSortingFeature` |
| Row Pagination | `rowPaginationFeature` |
| Row Selection | `rowSelectionFeature` |
| Row Expanding | `rowExpandingFeature` |
| Row Pinning | `rowPinningFeature` |
| Column Pinning | `columnPinningFeature` |
| Column Visibility | `columnVisibilityFeature` |
| Column Ordering | `columnOrderingFeature` |
| Column Sizing | `columnSizingFeature` |
| Column Resizing | `columnResizingFeature` |
| Column Grouping | `columnGroupingFeature` |
| Column Faceting | `columnFacetingFeature` |

---

## The `rowModels` Option

Row models process data for features like filtering, sorting, grouping, expanding, faceting, and pagination. In v9, they are configured under `rowModels`.

### Migration Mapping

| v8 Option | v9 `rowModels` Key | v9 Factory Function |
|---|---|---|
| `getCoreRowModel()` | (automatic) | Not needed |
| `getFilteredRowModel()` | `filteredRowModel` | `createFilteredRowModel(filterFns)` |
| `getSortedRowModel()` | `sortedRowModel` | `createSortedRowModel(sortFns)` |
| `getPaginationRowModel()` | `paginatedRowModel` | `createPaginatedRowModel()` |
| `getExpandedRowModel()` | `expandedRowModel` | `createExpandedRowModel()` |
| `getGroupedRowModel()` | `groupedRowModel` | `createGroupedRowModel(aggregationFns)` |
| `getFacetedRowModel()` | `facetedRowModel` | `createFacetedRowModel()` |
| `getFacetedMinMaxValues()` | `facetedMinMaxValues` | `createFacetedMinMaxValues()` |
| `getFacetedUniqueValues()` | `facetedUniqueValues` | `createFacetedUniqueValues()` |

### Full Migration Example

```tsx
// v8 / before: React adapter through preact/compat
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  sortingFns,
  filterFns,
  useReactTable,
} from '@tanstack/react-table'

const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  sortingFns,
  filterFns,
})

// v9
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/preact-table'

const features = tableFeatures({
  columnFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
})

const rowModels = {
  filteredRowModel: createFilteredRowModel(filterFns),
  sortedRowModel: createSortedRowModel(sortFns),
  paginatedRowModel: createPaginatedRowModel(),
}

const table = useTable({
  features,
  rowModels,
  columns,
  data,
})
```

---

## State Management Changes

In v8 React-adapter examples, most code read all state through `table.getState()`. In v9, Preact can read a full snapshot, selected state, or a single atom.

| Surface | Use |
|---|---|
| `table.state` | The selected state from `useTable`; by default, this is the full registered table state. |
| `table.store.state` | A full framework-agnostic table state snapshot. |
| `table.atoms.<slice>.get()` | A narrow current-value read for one state slice. |
| `table.Subscribe` | A render boundary for selected table state or a specific atom/store source. |
| `table.baseAtoms.<slice>` | Internal writable atoms. Prefer feature APIs instead of writing these directly. |

### Accessing State

```tsx
// v8
const sorting = table.getState().sorting
const pagination = table.getState().pagination

// v9: full snapshot
const sorting = table.store.state.sorting
const pagination = table.store.state.pagination

// v9: narrow atom read
const sorting = table.atoms.sorting.get()
```

By default, `table.state` is reactive and contains the full registered table state:

```tsx
const table = useTable({
  features,
  rowModels,
  columns,
  data,
})

const { pagination, sorting } = table.state
```

Pass a custom selector when you want `table.state` to contain only the reactive state values that should cause this component to re-render.

```tsx
const table = useTable(
  {
    features,
    rowModels,
    columns,
    data,
  },
  (state) => ({
    pagination: state.pagination,
    sorting: state.sorting,
  }),
)

table.state.pagination
```

Passing `(state) => state` is equivalent to the default selector and is no longer necessary.

For large tables, opt the parent out and subscribe lower in the tree:

```tsx
const table = useTable(options, () => null)
```

### Optimized Rendering with `table.Subscribe`

```tsx
function PaginationFooter({ table }) {
  return (
    <table.Subscribe
      selector={(state) => ({
        pagination: state.pagination,
      })}
    >
      {({ pagination }) => (
        <span>Page {pagination.pageIndex + 1}</span>
      )}
    </table.Subscribe>
  )
}
```

`table.Subscribe` can also subscribe directly to one atom:

```tsx
<table.Subscribe source={table.atoms.rowSelection}>
  {(rowSelection) => <span>{Object.keys(rowSelection).length} selected</span>}
</table.Subscribe>
```

### Controlled State

The v8-style `state` plus `on[State]Change` pattern still works for migration and remains convenient for simple integrations. Keep it per-slice. For new v9 code, prefer owning state slices with external atoms (see [External Atoms](#external-atoms) below), which give you fine-grained subscriptions without mirroring state through Preact.

```tsx
import { useState } from 'preact/hooks'
import type { PaginationState, SortingState } from '@tanstack/preact-table'

const [sorting, setSorting] = useState<SortingState>([])
const [pagination, setPagination] = useState<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const table = useTable({
  features,
  rowModels,
  columns,
  data,
  state: {
    sorting,
    pagination,
  },
  onSortingChange: setSorting,
  onPaginationChange: setPagination,
})
```

The v8-style `onStateChange` callback is no longer part of the v9 `useTable` state model.

### External Atoms

Use external atoms when the app should own a table state slice and share it outside the table.

```tsx
import { useCreateAtom, useSelector } from '@tanstack/preact-store'
import type { PaginationState, SortingState } from '@tanstack/preact-table'

function MyTable({ columns, data }) {
  const sortingAtom = useCreateAtom<SortingState>([])
  const paginationAtom = useCreateAtom<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const sorting = useSelector(sortingAtom)
  const pagination = useSelector(paginationAtom)

  const table = useTable({
    features,
    rowModels,
    columns,
    data,
    atoms: {
      sorting: sortingAtom,
      pagination: paginationAtom,
    },
  })

  return <span>Page {pagination.pageIndex + 1}</span>
}
```

When `atoms.pagination` is provided, table writes like `table.setPageIndex(2)` write to that atom. Do not also pass `state.pagination`; atoms take precedence.

---

## Column Helper Changes

`TFeatures` is now the first generic for column helpers and table types.

```tsx
// v8
const columnHelper = createColumnHelper<Person>()
const columns: ColumnDef<Person>[] = [
  columnHelper.accessor('age', {
    header: 'Age',
    sortingFn: 'alphanumeric',
  }),
]

// v9
const columnHelper = createColumnHelper<typeof features, Person>()
const columns: Array<ColumnDef<typeof features, Person>> = columnHelper.columns([
  columnHelper.accessor('age', {
    header: 'Age',
    sortFn: 'alphanumeric',
  }),
])
```

Use `columnHelper.columns([...])` to preserve better inference for nested and grouped column definitions.

---

## Rendering Changes

The React-adapter `flexRender(def, context)` function still exists for advanced cases, but v9 prefers the table-aware `FlexRender` component.

```tsx
// v8
<td>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>

// v9
<td><table.FlexRender cell={cell} /></td>
```

You can also import the standalone component:

```tsx
import { FlexRender } from '@tanstack/preact-table'

<FlexRender header={header} />
<FlexRender cell={cell} />
<FlexRender footer={header} />
```

---

## The `tableOptions()` Utility

`tableOptions()` is a type helper for reusable table option fragments.

```tsx
import { tableOptions } from '@tanstack/preact-table'

const baseOptions = tableOptions({
  features,
  rowModels,
  defaultColumn: {
    minSize: 40,
  },
})

const table = useTable({
  ...baseOptions,
  columns,
  data,
})
```

Use it when several tables share feature registration, row models, defaults, or manual server-side settings.

---

## `createTableHook`: Composable Table Patterns

`createTableHook` creates app-specific Preact table helpers with features, row models, and component conventions already bound.

```tsx
import { createTableHook } from '@tanstack/preact-table'

const { useAppTable, createAppColumnHelper } = createTableHook({
  features,
  rowModels,
})

const columnHelper = createAppColumnHelper<Person>()

function PeopleTable({ data }) {
  const table = useAppTable({
    columns,
    data,
  })
}
```

See the [Composable Tables Guide](./composable-tables.md) for full patterns.

---

## Other Breaking Changes

### Column Pinning Option Split

At the table level, `enablePinning` split into column and row options:

```tsx
const table = useTable({
  enableColumnPinning: true,
  enableRowPinning: true,
})
```

Per-column `enablePinning` remains a column option.

### Column Sizing vs. Column Resizing Split

Column resizing now has its own feature and state slice.

```tsx
const features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
})
```

`columnSizingInfo` is now `columnResizing`, and `onColumnSizingInfoChange` is now `onColumnResizingChange`.

### Sorting API Renames

| v8 | v9 |
|---|---|
| `sortingFn` | `sortFn` |
| `sortingFns` | `sortFns` |
| `getSortingFn()` | `getSortFn()` |
| `getAutoSortingFn()` | `getAutoSortFn()` |
| `SortingFn` | `SortFn` |
| `SortingFns` | `SortFns` |

### Removed Internal API Prefixes

Several underscore-prefixed APIs are now public without the underscore. For example, `row._getAllCellsByColumnId()` becomes `row.getAllCellsByColumnId()`.

---

## TypeScript Changes Summary

### Type Generics

`TFeatures` is now the first generic on core table types.

```tsx
ColumnDef<typeof features, Person>
Column<typeof features, Person>
Row<typeof features, Person>
Cell<typeof features, Person, TValue>
Table<typeof features, Person>
```

### Using `typeof features`

Use the concrete `features` object for type inference:

```tsx
const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
})

const columnHelper = createColumnHelper<typeof features, Person>()
```

### Using `StockFeatures`

If a helper must support `stockFeatures`, use `StockFeatures`:

```tsx
import type { StockFeatures } from '@tanstack/preact-table'

type PersonColumn = ColumnDef<StockFeatures, Person>
```

### `TableMeta`/`ColumnMeta` Typing Changes

No more declaration merging required! (Although it still works if you want to keep using it)

Global declaration merging works exactly like it did in v8. The only change you need to make is updating the generics shape: both interfaces now take `TFeatures` as the first type parameter.

```tsx
declare module '@tanstack/preact-table' {
  interface ColumnMeta<TFeatures, TData, TValue> {
    align?: 'left' | 'right'
  }
}
```

That's all that's required if you want to keep declaring meta types globally.

Optionally, v9 also adds a new way to declare meta types **per-table** without declaration merging. You can use type-only `tableMeta`/`columnMeta` slots on the `features` option, which only affect tables created with that `features` object:

```tsx
const features = tableFeatures({
  rowSortingFeature,
  columnMeta: metaHelper<{ align?: 'left' | 'right' }>(),
})
```

See the new [Table and Column Meta Guide](../../../guide/table-and-column-meta) for full details on both approaches.

### `RowData` Type Restriction

`RowData` is now constrained to record-like objects or arrays. Prefer object row types such as:

```tsx
type Person = {
  firstName: string
  lastName: string
  age: number
}
```

---

## Migration Checklist

- [ ] Replace `@tanstack/react-table` imports used through `preact/compat` with `@tanstack/preact-table`.
- [ ] Replace `useReactTable` with `useTable`.
- [ ] Define `features` using `tableFeatures()` (or use `stockFeatures`).
- [ ] Replace root `get*RowModel` options with `rowModels`.
- [ ] Drop `getCoreRowModel`; the core row model is automatic.
- [ ] Move `sortingFns`, `filterFns`, and `aggregationFns` into row model factories.
- [ ] Rename `sortingFn` to `sortFn` and `sortingFns` to `sortFns`.
- [ ] Update column helpers and types to include `typeof features`.
- [ ] Replace broad `table.getState()` reads with `table.state`, `table.store.state`, or `table.atoms.<slice>.get()`.
- [ ] Replace `onStateChange` with per-slice `on[State]Change` or external atoms.
- [ ] Replace direct `flexRender(...)` calls with `<table.FlexRender />` or `<FlexRender />`.
- [ ] Remove `preact/compat` aliases that were only needed for TanStack Table.
- [ ] Audit `stockFeatures` usage before production.
- [ ] Run type checks and click through sorting, filtering, pagination, and selection flows.

---

## Examples

- [Basic useTable](../examples/basic-use-table)
- [Basic Subscribe](../examples/basic-subscribe)
- [Basic External Atoms](../examples/basic-external-atoms)
- [Basic External State](../examples/basic-external-state)
- [With TanStack Query](../examples/with-tanstack-query)
- [Sorting](../examples/sorting)
- [Pagination](../examples/pagination)
- [Composable Tables](../examples/composable-tables)
