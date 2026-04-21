---
title: Migrating to TanStack Table v9 (React)
---

## What's New in TanStack Table v9

TanStack Table v9 is a major release that introduces significant architectural improvements while maintaining the core table logic you're familiar with. Here are the key changes:

### 1. Tree-shaking

- **Features are tree-shakeable**: Features are now treated as plugins—import only what you use. If your table only needs sorting, you won't ship filtering, pagination, or other feature code. Bundlers can eliminate unused code, so for smaller tables you can expect to bundle ~6–7kb compared to 15–20kb for the same table in v8. This also lets TanStack Table add more features over time without bloating everyone's bundles.
- **Row models and their functions are refactored**: Row model factories (`createFilteredRowModel`, `createSortedRowModel`, etc.) now accept their processing functions (`filterFns`, `sortFns`, `aggregationFns`) as parameters. This enables tree-shaking of the functions themselves—if you use a custom filter, you don't pay for built-in filters you never use.

### 2. State Management

- **Uses TanStack Store**: The internal state system has been rebuilt on [TanStack Store](https://tanstack.com/store), providing a reactive, framework-agnostic foundation. This works similarly to TanStack Form's state model.
- **Three-layer atom architecture**: Each state slice (sorting, pagination, rowSelection, etc.) lives in its own [atom](https://tanstack.com/store/latest/docs/reference/atom) rather than a single monolithic state object. Internally, the library writes to per-slice `baseAtoms`; reads go through derived `table.atoms` and the flat `table.store`. This enables fine-grained reactivity — components can subscribe to just the slices they care about.
- **Opt-in subscriptions instead of memo hacks**: Use `table.Subscribe` or pass a selector to `useTable` to subscribe to specific slices of state. Only re-render when the state you care about changes—no more `React.memo` or manual memoization. Pass `state => state` if you want v8-style behavior where any state change triggers a re-render.
- **Bring your own atoms (optional)**: For advanced use cases, you can own individual state slices by passing your own writable atoms via the new `atoms` option. This is great for sharing a slice across components or integrating with other atom-based tools. Precedence: `options.atoms[key]` > `options.state[key]` > internal `baseAtoms[key]`.

### 3. Composability

- **`tableOptions`**: New utilities let you compose and share table configurations. Define `_features`, `_rowModels`, and default options once, then reuse them across tables or pass them through `createTableHook`.
- **`createTableHook`** (optional, advanced): Create custom table hooks with pre-bound features, row models, and components—similar to TanStack Form's `createFormHook`. Define your table setup once and reuse it across many tables. You don't need this for most use cases; `useTable` is sufficient.

### The Good News: Most Upgrades Are Opt-in

While v9 is a significant upgrade, **you don't have to adopt everything at once**:

- **Don't want to optimize renders?** Pass `state => state` as the selector to `useTable` and rendering works like v8.
- **Don't want to think about tree-shaking?** Import `stockFeatures` to include all features, just like v8.
- **Table markup is largely unchanged.** How you render `<table>`, `<thead>`, `<tr>`, `<td>`, etc. remains the same.

The main change is **how you define a table** with the `useTable` hook — specifically the new `_features` and `_rowModels` options.

---

## Quick Legacy Migration

Need to migrate incrementally? Use `useLegacyTable` — it accepts the v8-style API while using v9 under the hood. **This is deprecated** and intended only as a temporary migration aid. It includes all features by default, resulting in a larger bundle size.

Legacy APIs live in a separate export. Import core utilities from `@tanstack/react-table` and legacy-specific APIs from `@tanstack/react-table/legacy`:

```tsx
import { flexRender } from '@tanstack/react-table'
import {
  useLegacyTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  legacyCreateColumnHelper,
} from '@tanstack/react-table/legacy'
```

See the [useLegacyTable Guide](./use-legacy-table.md) for full documentation, examples, and type helpers.

---

The rest of this guide focuses on migrating to the full v9 API and taking advantage of its features.

## Core Breaking Changes

### Hook Rename

The hook name has been simplified to be consistent across all TanStack libraries:

```tsx
// v8
import { useReactTable } from '@tanstack/react-table'
const table = useReactTable(options)

// v9
import { useTable } from '@tanstack/react-table'
const table = useTable(options)
```

### New Required Options: `_features` and `_rowModels`

In v9, you must explicitly declare which features and row models your table uses:

```tsx
// v8
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'

const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
})

// v9
import { useTable, tableFeatures } from '@tanstack/react-table'

const _features = tableFeatures({}) // Empty = core features only

const table = useTable({
  _features,
  _rowModels: {}, // Core row model is automatic
  columns,
  data,
})
```

---

## The `_features` Option

Features control what table functionality is available. In v8, all features were bundled. In v9, you import only what you need.

### Importing Individual Features

```tsx
import {
  tableFeatures,
  // Import only the features you need
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  columnVisibilityFeature,
  rowSelectionFeature,
} from '@tanstack/react-table'

// Create a features object (define this outside your component for stable reference)
const _features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  columnVisibilityFeature,
  rowSelectionFeature,
})
```

### Using `stockFeatures` for v8-like Behavior

If you want all features without thinking about it (like v8), import `stockFeatures`:

```tsx
import { useTable, stockFeatures } from '@tanstack/react-table'

const table = useTable({
  _features: stockFeatures, // All features included
  _rowModels: { /* ... */ },
  columns,
  data,
})
```

### Available Features

| Feature | Import Name |
|---------|-------------|
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

## The `_rowModels` Option

Row models are the functions that process your data (filtering, sorting, pagination, etc.). In v9, they're configured via `_rowModels` instead of `get*RowModel` options.

### Migration Mapping

| v8 Option | v9 `_rowModels` Key | v9 Factory Function |
|-----------|---------------------|---------------------|
| `getCoreRowModel()` | (automatic) | Not needed — always included |
| `getFilteredRowModel()` | `filteredRowModel` | `createFilteredRowModel(filterFns)` |
| `getSortedRowModel()` | `sortedRowModel` | `createSortedRowModel(sortFns)` |
| `getPaginationRowModel()` | `paginatedRowModel` | `createPaginatedRowModel()` |
| `getExpandedRowModel()` | `expandedRowModel` | `createExpandedRowModel()` |
| `getGroupedRowModel()` | `groupedRowModel` | `createGroupedRowModel(aggregationFns)` |
| `getFacetedRowModel()` | `facetedRowModel` | `createFacetedRowModel()` |
| `getFacetedMinMaxValues()` | `facetedMinMaxValues` | `createFacetedMinMaxValues()` |
| `getFacetedUniqueValues()` | `facetedUniqueValues` | `createFacetedUniqueValues()` |

### Key Change: Row Model Functions Now Accept Parameters

Several row model factories now accept their processing functions as parameters. This enables better tree-shaking and explicit configuration:

```tsx
import {
  createFilteredRowModel,
  createSortedRowModel,
  createGroupedRowModel,
  filterFns,  // Built-in filter functions
  sortFns,    // Built-in sort functions
  aggregationFns, // Built-in aggregation functions
} from '@tanstack/react-table'

const table = useTable({
  _features,
  _rowModels: {
    filteredRowModel: createFilteredRowModel(filterFns),
    sortedRowModel: createSortedRowModel(sortFns),
    groupedRowModel: createGroupedRowModel(aggregationFns),
    paginatedRowModel: createPaginatedRowModel(),
  },
  columns,
  data,
})
```

### Full Migration Example

```tsx
// v8
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  filterFns,
  sortingFns,
} from '@tanstack/react-table'

const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(), // used to be called "get*RowModel()"
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  filterFns, // used to be passed in as a root option
  sortingFns,
})

// v9
import {
  useTable,
  tableFeatures,
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  createFilteredRowModel,
  createSortedRowModel,
  createPaginatedRowModel,
  filterFns,
  sortFns,
} from '@tanstack/react-table'

const _features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
})

const table = useTable({
  _features,
  _rowModels: {
    filteredRowModel: createFilteredRowModel(filterFns), // now called "create*RowModel()" with a Fns parameter
    sortedRowModel: createSortedRowModel(sortFns),
    paginatedRowModel: createPaginatedRowModel(),
  },
  columns,
  data,
})
```

---

## State Management Changes

v9's state system is built on [TanStack Store](https://tanstack.com/store) and exposes three read surfaces on the table instance:

| Surface | Type | When to use |
|---------|------|-------------|
| `table.state` | `TSelected` (the shape you return from your `useTable` selector) | The most ergonomic read surface inside a component rendered by `useTable`. |
| `table.store` | `ReadonlyStore<TableState>` | A flat, framework-agnostic store of the entire table state. Use `table.store.state` for one-off reads, or pair with `useSelector` / `table.Subscribe` for fine-grained subscriptions. |
| `table.atoms.<slice>` | `ReadonlyAtom<TableState[slice]>` | A per-slice readonly atom. Subscribe to a single slice (e.g. `table.atoms.sorting`) when you want the narrowest possible re-render surface. |

Writable counterparts (mostly internal):

| Surface | Type | When to use |
|---------|------|-------------|
| `table.baseAtoms.<slice>` | `Atom<TableState[slice]>` | The library's internal write target. You generally don't touch these directly — use `table.setSorting(...)`, `table.setPagination(...)`, etc. |
| `options.atoms` | `Partial<{ [slice]: Atom }>` | Pass in your own writable atom for any slice to take ownership of that state externally. See [External Atoms](#external-atoms-advanced) below. |

### Accessing State

In v8, you accessed state via `table.getState()`. In v9, state is accessed differently:

```tsx
// v8
const state = table.getState()
const { sorting, pagination } = table.getState()

// v9 - via the store (full state)
const fullState = table.store.state
const { sorting, pagination } = table.store.state

// v9 - via table.state (selected state from your selector)
const table = useTable(options, (state) => ({
  sorting: state.sorting,
  pagination: state.pagination,
}))
// Now table.state only contains sorting and pagination
const { sorting, pagination } = table.state

// v9 - via a single slice atom (framework-agnostic, ideal for fine-grained subscriptions)
const sorting = table.atoms.sorting.get()
```

### Optimized Rendering with `table.Subscribe`

The biggest state management improvement is `table.Subscribe`, which enables fine-grained reactivity:

```tsx
function MyTable() {
  const table = useTable({
    _features,
    _rowModels: { /* ... */ },
    columns,
    data,
  })

  return (
    <table.Subscribe
      selector={(state) => ({
        sorting: state.sorting,
        pagination: state.pagination,
      })}
    >
      {({ sorting, pagination }) => (
        // This only re-renders when sorting or pagination changes
        <div>
          <table>{/* ... */}</table>
          <div>Page {pagination.pageIndex + 1}</div>
        </div>
      )}
    </table.Subscribe>
  )
}
```

### Opt-Out: v8-Style Full State Subscription

If you want v8-style behavior where the component re-renders on any state change, pass `state => state` as the selector:

```tsx
// Re-renders on ANY state change (like v8)
const table = useTable(
  {
    _features,
    _rowModels: { /* ... */ },
    columns,
    data,
  },
  (state) => state, // Subscribe to entire state
)

// table.state now contains the full state
const { sorting, pagination, columnFilters } = table.state
```

### Controlled State

Controlled state patterns work similarly to v8:

```tsx
const [sorting, setSorting] = useState<SortingState>([])
const [pagination, setPagination] = useState<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const table = useTable({
  _features,
  _rowModels: { /* ... */ },
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

### Per-Slice Atom Subscriptions

Because each state slice is backed by its own atom, you can subscribe a component to a single slice without re-rendering on any other state change. Use `useSelector` from `@tanstack/react-store` with `table.atoms.<slice>`:

```tsx
import { useSelector } from '@tanstack/react-store'

function PaginationFooter({ table }) {
  // Re-renders only when pagination changes — sorting, filtering, selection, etc. are all ignored.
  const pagination = useSelector(table.atoms.pagination)

  return <div>Page {pagination.pageIndex + 1}</div>
}
```

This is the narrowest subscription surface available. Compared to `table.Subscribe`, which selects from the full `table.store.state`, reading a per-slice atom skips even constructing the full state snapshot on change.

> **When to reach for `table.atoms` vs. `table.Subscribe`:** Both give you fine-grained re-renders. `table.Subscribe` is nicer when you want to project multiple slices into a single rendered block. `table.atoms.<slice>` is nicer when a component only cares about one slice, or when you're passing a subscription source to non-table code.

### External Atoms (Advanced)

For advanced patterns — sharing a slice across tables, integrating with atom-based libraries, or wiring a slice up to persistence — v9 lets you **own individual state slices yourself** by passing writable atoms via the new `atoms` option. See the [Basic External Atoms example](../examples/basic-external-atoms).

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

const _features = tableFeatures({ rowSortingFeature, rowPaginationFeature })

function MyTable({ data, columns }) {
  // Create stable external atoms for the slices you want to own.
  const sortingAtom = useCreateAtom<SortingState>([])
  const paginationAtom = useCreateAtom<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Subscribe to each atom independently — fine-grained reactivity.
  const sorting = useSelector(sortingAtom)
  const pagination = useSelector(paginationAtom)

  const table = useTable({
    _features,
    _rowModels: {
      sortedRowModel: createSortedRowModel(sortFns),
      paginatedRowModel: createPaginatedRowModel(),
    },
    columns,
    data,
    // Per-slice external atoms — the library writes directly to these,
    // bypassing the internal baseAtoms for those slices.
    atoms: {
      sorting: sortingAtom,
      pagination: paginationAtom,
    },
  })

  // Table writes like table.setPageIndex(2) go straight to `paginationAtom`.
  // Any other subscriber of `paginationAtom` will see the update too.
  // ...
}
```

#### How External Atoms Interact with `state` and `on*Change`

When you register an external atom for a slice:

- **Reads**: The derived `table.atoms[slice]` and `table.store.state[slice]` both read from your external atom.
- **Writes**: Library writes (e.g. `table.setSorting(...)`, `column.toggleSorting()`) go directly to your external atom's `set()`. You do **not** need a corresponding `onSortingChange` handler — owning the atom is the subscription.
- **Precedence**: If you pass both `options.atoms[key]` and `options.state[key]`, the atom wins. If you pass neither, v9 falls back to its internal `baseAtoms[key]` (v8-style self-managed state).
- **Reset**: `table.reset()` does **not** clear external atoms — you own them, so you decide when to reset. Call `myAtom.set(defaultValue)` yourself if needed.

#### When to Choose External Atoms vs. Controlled State

| Pattern | Use when |
|---------|----------|
| Internal state (no `state`, no `atoms`) | Simplest path; the table manages everything. |
| `state` + `on*Change` (v8-style controlled state) | You want your framework's idiomatic state (React `useState`, signals, etc.) to own the slice. |
| `atoms` option | You want atom-based ergonomics (cross-component subscriptions, `useSelector`, `useAtom`) without the overhead of mirroring between React state and the table. |

---

## Column Helper Changes

The `createColumnHelper` function now requires a `TFeatures` type parameter in addition to `TData`:

```tsx
// v8
import { createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper<Person>()

// v9
import { createColumnHelper, tableFeatures, rowSortingFeature } from '@tanstack/react-table'

const _features = tableFeatures({ rowSortingFeature })
const columnHelper = createColumnHelper<typeof _features, Person>()
```

### New `columns()` Helper Method

v9 adds a `columns()` helper for better type inference when wrapping column arrays. In v8, `TValue` wasn't always type-safe—especially with group columns, where nested column types could be lost or widened. The `columns()` helper uses variadic tuple types to preserve each column's individual `TValue` type, so `info.getValue()` and cell renderers stay correctly typed throughout nested structures:

```tsx
const columnHelper = createColumnHelper<typeof _features, Person>()

// Wrap your columns array for better type inference
const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('lastName', {
    id: 'lastName',
    header: () => <span>Last Name</span>,
    cell: (info) => <i>{info.getValue()}</i>,
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: (info) => <button>Edit</button>,
  }),
])
```

### Using with `createTableHook`

When using `createTableHook`, you get a pre-bound `createAppColumnHelper` that only requires `TData`:

```tsx
const { useAppTable, createAppColumnHelper } = createTableHook({
  _features: tableFeatures({ rowSortingFeature }),
  _rowModels: { /* ... */ },
})

// TFeatures is already bound — only need TData!
const columnHelper = createAppColumnHelper<Person>()
```

---

## Rendering Changes

### `flexRender` Function

The `flexRender` function still exists and works the same way:

```tsx
import { flexRender } from '@tanstack/react-table'

// Still works in v9
{flexRender(cell.column.columnDef.cell, cell.getContext())}
{flexRender(header.column.columnDef.header, header.getContext())}
```

### New `<table.FlexRender />` Component

v9 adds a cleaner component-based approach attached to the table instance:

```tsx
const table = useTable({ /* ... */ })

// Instead of:
{flexRender(header.column.columnDef.header, header.getContext())}

// You can use:
<table.FlexRender header={header} />
<table.FlexRender cell={cell} />
<table.FlexRender footer={footer} />
```

This should be way more convenient and type-safe than the old `flexRender` function!

### Standalone `<FlexRender />` Component

There's also a standalone component you can import:

```tsx
import { FlexRender } from '@tanstack/react-table'

<FlexRender header={header} />
<FlexRender cell={cell} />
<FlexRender footer={footer} />
```

---

## The `tableOptions()` Utility

The `tableOptions()` helper provides type-safe composition of table options. It's useful for creating reusable partial configurations that can be spread into your table setup.

### Basic Usage

```tsx
import { tableOptions, tableFeatures, rowSortingFeature } from '@tanstack/react-table'

// Create a reusable options object with features pre-configured
const baseOptions = tableOptions({
  _features: tableFeatures({ rowSortingFeature }),
  debugTable: process.env.NODE_ENV === 'development',
})

// Use in your table — columns, data, and other options can be added
const table = useTable({
  ...baseOptions,
  columns,
  data,
  _rowModels: {},
})
```

### Composing Partial Options

`tableOptions()` allows you to omit certain required fields (like `data`, `columns`, or `_features`) when creating partial configurations:

```tsx
// Partial options without data or columns
const featureOptions = tableOptions({
  _features: tableFeatures({
    rowSortingFeature,
    columnFilteringFeature,
  }),
  _rowModels: {
    sortedRowModel: createSortedRowModel(sortFns),
    filteredRowModel: createFilteredRowModel(filterFns),
  },
})

// Another partial without _features (inherits from spread)
const paginationDefaults = tableOptions({
  _rowModels: {
    paginatedRowModel: createPaginatedRowModel(),
  },
  initialState: {
    pagination: { pageIndex: 0, pageSize: 25 },
  },
})

// Combine them
const table = useTable({
  ...featureOptions,
  ...paginationDefaults,
  columns,
  data,
})
```

### Using with `createTableHook`

`tableOptions()` pairs well with `createTableHook` for building composable table factories:

```tsx
const sharedOptions = tableOptions({
  _features: tableFeatures({ rowSortingFeature, rowPaginationFeature }),
  _rowModels: {
    sortedRowModel: createSortedRowModel(sortFns),
    paginatedRowModel: createPaginatedRowModel(),
  },
})

const { useAppTable } = createTableHook(sharedOptions)
```

---

## `createTableHook`: Composable Table Patterns

**This is an advanced, optional feature.** You don't need to use `createTableHook`—`useTable` is sufficient for most use cases. If you're familiar with [TanStack Form](https://tanstack.com/form)'s `createFormHook`, `createTableHook` works almost the same way: it creates a custom hook with pre-bound configuration that you can reuse across many tables.

For applications with multiple tables sharing the same configuration, `createTableHook` lets you define features, row models, and reusable components once:

```tsx
// hooks/table.ts
import {
  createTableHook,
  tableFeatures,
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  createFilteredRowModel,
  createSortedRowModel,
  createPaginatedRowModel,
  filterFns,
  sortFns,
} from '@tanstack/react-table'

// Import your reusable components
import { PaginationControls, SortIndicator, TextCell } from './components'

export const {
  useAppTable,
  createAppColumnHelper,
  useTableContext,
  useCellContext,
  useHeaderContext,
} = createTableHook({
  // Features defined once
  _features: tableFeatures({
    columnFilteringFeature,
    rowSortingFeature,
    rowPaginationFeature,
  }),

  // Row models defined once
  _rowModels: {
    filteredRowModel: createFilteredRowModel(filterFns),
    sortedRowModel: createSortedRowModel(sortFns),
    paginatedRowModel: createPaginatedRowModel(),
  },

  // Default table options
  debugTable: process.env.NODE_ENV === 'development',

  // Register reusable components
  tableComponents: { PaginationControls },
  cellComponents: { TextCell },
  headerComponents: { SortIndicator },
})
```

### Using `useAppTable`

```tsx
// features/users.tsx
import { useAppTable, createAppColumnHelper } from './hooks/table'

const columnHelper = createAppColumnHelper<Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: ({ cell }) => <cell.TextCell />, // Pre-bound component!
  }),
])

function UsersTable({ data }: { data: Person[] }) {
  const table = useAppTable({
    columns,
    data,
    // _features and _rowModels already configured!
  })

  return (
    <table.AppTable>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((h) => (
                <table.AppHeader header={h} key={h.id}>
                  {(header) => (
                    <th>
                      <header.FlexRender />
                      <header.SortIndicator />
                    </th>
                  )}
                </table.AppHeader>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getAllCells().map((c) => (
                <table.AppCell cell={c} key={c.id}>
                  {(cell) => (
                    <td>
                      <cell.FlexRender />
                    </td>
                  )}
                </table.AppCell>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <table.PaginationControls />
    </table.AppTable>
  )
}
```

### Context Hooks for Components

Components registered via `createTableHook` can access their context:

```tsx
// components/SortIndicator.tsx
import { useHeaderContext } from './hooks/table'

export function SortIndicator() {
  const header = useHeaderContext()
  const sorted = header.column.getIsSorted()
  
  if (!sorted) return null
  return sorted === 'asc' ? ' 🔼' : ' 🔽'
}

// components/TextCell.tsx
import { useCellContext } from './hooks/table'

export function TextCell() {
  const cell = useCellContext()
  return <span>{cell.getValue() as string}</span>
}

// components/PaginationControls.tsx
import { useTableContext } from './hooks/table'

export function PaginationControls() {
  const table = useTableContext()
  
  return (
    <table.Subscribe selector={(s) => s.pagination}>
      {(pagination) => (
        <div>
          <button onClick={() => table.previousPage()}>Previous</button>
          <span>Page {pagination.pageIndex + 1}</span>
          <button onClick={() => table.nextPage()}>Next</button>
        </div>
      )}
    </table.Subscribe>
  )
}
```

---

## Other Breaking Changes

### Column Pinning Option Split

The `enablePinning` option has been split into separate options:

```tsx
// v8
enablePinning: true

// v9
enableColumnPinning: true
enableRowPinning: true
```

### Removed Internal APIs

All internal APIs prefixed with `_` have been removed. If you were using any of these, use their public equivalents:

- Removed: `table._getPinnedRows()`
- Removed: `table._getFacetedRowModel()`
- Removed: `table._getFacetedMinMaxValues()`
- Removed: `table._getFacetedUniqueValues()`

### Column Sizing vs. Column Resizing Split

In v8, column sizing and resizing were combined in a single feature. In v9, they've been split into separate features for better tree-shaking.

| v8 | v9 |
|----|-----|
| `ColumnSizing` (combined feature) | `columnSizingFeature` + `columnResizingFeature` |
| `columnSizingInfo` state | `columnResizing` state |
| `setColumnSizingInfo()` | `setColumnResizing()` |
| `onColumnSizingInfoChange` option | `onColumnResizingChange` option |

If you only need column sizing (fixed widths) without interactive resizing, you can import just `columnSizingFeature`. If you need drag-to-resize functionality, import both:

```tsx
import { columnSizingFeature, columnResizingFeature } from '@tanstack/react-table'

const _features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature, // Only if you need interactive resizing
})
```

### Sorting API Renames

Sorting-related APIs have been renamed for consistency:

| v8 | v9 |
|----|-----|
| `sortingFn` (column def option) | `sortFn` |
| `column.getSortingFn()` | `column.getSortFn()` |
| `column.getAutoSortingFn()` | `column.getAutoSortFn()` |
| `SortingFn` type | `SortFn` type |
| `SortingFns` interface | `SortFns` interface |
| `sortingFns` (built-in functions) | `sortFns` |

Update your column definitions:

```tsx
// v8
const columns = [
  {
    accessorKey: 'name',
    sortingFn: 'alphanumeric', // or custom function
  },
]

// v9
const columns = [
  {
    accessorKey: 'name',
    sortFn: 'alphanumeric', // or custom function
  },
]
```

### Row API Changes

Some row APIs have changed from private to public:

| v8 | v9 |
|----|-----|
| `row._getAllCellsByColumnId()` (private) | `row.getAllCellsByColumnId()` (public) |

If you were accessing this internal API, you can now use it without the underscore prefix.

---

## TypeScript Changes Summary

### Type Generics

Most types now require a `TFeatures` parameter:

```tsx
// v8
type Column<TData>
type ColumnDef<TData>
type Table<TData>
type Row<TData>
type Cell<TData, TValue>

// v9
type Column<TFeatures, TData, TValue>
type ColumnDef<TFeatures, TData, TValue>
type Table<TFeatures, TData>
type Row<TFeatures, TData>
type Cell<TFeatures, TData, TValue>
```

### Using `typeof _features`

The easiest way to get the `TFeatures` type is with `typeof`:

```tsx
const _features = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
})

// Use typeof to get the type
type MyFeatures = typeof _features

const columns: ColumnDef<typeof _features, Person>[] = [...]

function Filter({ column }: { column: Column<typeof _features, Person, unknown> }) {
  // ...
}
```

### Using `StockFeatures`

If using `stockFeatures` with `useTable`, use the `StockFeatures` type:

```tsx
import type { StockFeatures, ColumnDef } from '@tanstack/react-table'

const columns: ColumnDef<StockFeatures, Person>[] = [...]
```

### `ColumnMeta` Generic Change

If you're using module augmentation to extend `ColumnMeta`, note that it now requires a `TFeatures` parameter:

```tsx
// v8
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    customProperty: string
  }
}

// v9 - TFeatures is now the first parameter
declare module '@tanstack/react-table' {
  interface ColumnMeta<TFeatures, TData, TValue> {
    customProperty: string
  }
}
```

### `RowData` Type Restriction

The `RowData` type is now more restrictive:

```tsx
// v8 - very permissive
type RowData = unknown | object | any[]

// v9 - must be a record or array
type RowData = Record<string, any> | Array<any>
```

This change improves type safety. If you were passing unusual data types, ensure your data conforms to `Record<string, any>` or `Array<any>`.

---

## Migration Checklist

- [ ] Update import: `useReactTable` → `useTable`
- [ ] Define `_features` using `tableFeatures()` (or use `stockFeatures`)
- [ ] Migrate `get*RowModel()` options to `_rowModels`
- [ ] Update row model factories to include `Fns` parameters where needed
- [ ] Update TypeScript types to include `TFeatures` generic
- [ ] Update state access: `table.getState()` → `table.store.state` or `table.state`
- [ ] Update `createColumnHelper<TData>()` → `createColumnHelper<TFeatures, TData>()`
- [ ] Replace `enablePinning` with `enableColumnPinning`/`enableRowPinning` if used
- [ ] Rename `sortingFn` → `sortFn` in column definitions
- [ ] Split column sizing/resizing: use both `columnSizingFeature` and `columnResizingFeature` if needed
- [ ] Rename `columnSizingInfo` state → `columnResizing` (and related options)
- [ ] Update `ColumnMeta` module augmentation to include `TFeatures` generic (if used)
- [ ] (Optional) Add `table.Subscribe` for render optimizations
- [ ] (Optional) Subscribe to individual slices via `table.atoms.<slice>` + `useSelector` for the narrowest re-renders
- [ ] (Optional) Pass writable atoms via the new `atoms` option to own specific state slices externally
- [ ] (Optional) Use `tableOptions()` for composable configurations
- [ ] (Optional) Migrate to `createTableHook` for reusable table patterns

---

## Examples

Check out these examples to see v9 patterns in action:

- [Basic useTable](../examples/basic-use-table) - Simple table with the new `useTable` hook
- [Basic useLegacyTable](../examples/basic-use-legacy-table) - Migration example using `useLegacyTable`
- [Basic useAppTable](../examples/basic-use-app-table) - Using `createTableHook`
- [Basic External State](../examples/basic-external-state) - Classic `state` + `on*Change` controlled state
- [Basic External Atoms](../examples/basic-external-atoms) - Owning state slices with `useCreateAtom` + the `atoms` option
- [Filters](../examples/filters) - Filtering with the new API
- [Sorting](../examples/sorting) - Sorting with the new API
- [Composable Tables](../examples/composable-tables) - Advanced `createTableHook` patterns
