---
title: Migrating to TanStack Table v9 (Angular)
---

## What's New in TanStack Table v9

TanStack Table v9 is a major release that introduces significant architectural improvements while maintaining the core table logic you're familiar with. Here are the key changes:

### 1. Tree-shaking

- **Features are tree-shakeable**: Features are now treated as plugins—import only what you use. If your table only needs sorting, you won't ship filtering, pagination, or other feature code. Bundlers can eliminate unused code, so for smaller tables you can expect a meaningfully smaller bundle compared to v8. This also lets TanStack Table add features over time without bloating everyone's bundles.
- **Row models and their functions are refactored**: Row model factories (`createFilteredRowModel`, `createSortedRowModel`, etc.) now accept their processing functions (`filterFns`, `sortFns`, `aggregationFns`) as parameters. This enables tree-shaking of the functions themselves—if you use a custom filter, you don't pay for built-in filters you never use.

### 2. State Management

- **Uses TanStack Store**: The internal state system has been rebuilt on [TanStack Store](https://tanstack.com/store), providing a reactive, framework-agnostic foundation.
- **Opt-in subscriptions instead of memo hacks**: In Angular, you consume state via signals and `computed(...)`. You can keep reads scoped to the state you actually need and avoid unnecessary template work.

### 3. Composability

- **`tableOptions`**: New utilities let you compose and share table configurations. Define `_features`, `_rowModels`, and default options once, then reuse them across tables or pass them through `createTableHook`.
- **`createTableHook`** (optional, advanced): Create reusable, strongly typed Angular table factories with pre-bound features, row models, default options, and component registries.

### The Good News: Most Upgrades Are Opt-in

While v9 is a significant upgrade, **you don't have to adopt everything at once**:

- **Don't want to think about tree-shaking yet?** You can start with `stockFeatures` to include most commonly used features.
- **Your table markup is largely unchanged.** How you render `<table>`, `<thead>`, `<tr>`, `<td>`, etc. remains the same.

The main change is **how you define a table** with the Angular adapter — specifically the new `_features` and `_rowModels` options.

---

## Quick Legacy Migration

Angular does **not** ship a legacy API.

If you're migrating an Angular project from TanStack Table v8 to v9, you will migrate directly to the v9 Angular adapter APIs (`injectTable`, `_features`, and `_rowModels`).

---

The rest of this guide focuses on migrating to the full v9 API and taking advantage of its features.

## Core Breaking Changes

### Entrypoint Change

The Angular adapter entrypoint to create a table instance is `injectTable`:

```ts
// v8
import { createAngularTable } from '@tanstack/angular-table'

const v8Table = createAngularTable(() => ({
  // options
}))

// v9
import { injectTable } from '@tanstack/angular-table'

const v9Table = injectTable(() => ({
  // options
}))
```

> Note: `injectTable` evaluates your initializer whenever any Angular signal read inside of it changes.
> Keep expensive/static values (like `columns`, `_features`, and `_rowModels`) as stable references outside the initializer.

### New Required Options: `_features` and `_rowModels`

In v9, you must explicitly declare which features and row models your table uses:

```ts
// v8
import { createAngularTable, getCoreRowModel } from '@tanstack/angular-table'

const v8Table = createAngularTable(() => ({
  columns,
  data: data(),
  getCoreRowModel: getCoreRowModel(),
}))

// v9
import {
  injectTable,
  tableFeatures,
} from '@tanstack/angular-table'

const _features = tableFeatures({}) // Empty = core feaFtures only

// Define stable references outside the initializer
const v9Table = injectTable(() => ({
  _features,
  _rowModels: {}, // Core row model is automatic
  columns: this.columns,
  data: this.data(),
}))
```

---

## The `_features` Option

Features control what table functionality is available. In v8, all features were bundled. In v9, you import only what you need.

### Importing Individual Features

```ts
import {
  tableFeatures,
  // Import only the features you need
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  columnVisibilityFeature,
  rowSelectionFeature,
} from '@tanstack/angular-table'

// Create a features object (define this outside your injectTable initializer for stable reference)
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

```ts
import { injectTable, stockFeatures } from '@tanstack/angular-table'

class TableCmp {
  readonly table = injectTable(() => ({
    _features: stockFeatures, // All features included
    _rowModels: { /* ... */ },
    columns: this.columns,
    data: this.data(),
  }))
}
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

```ts
import {
  injectTable,
  createFilteredRowModel,
  createSortedRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  filterFns, // Built-in filter functions
  sortFns, // Built-in sort functions
  aggregationFns, // Built-in aggregation functions
} from '@tanstack/angular-table'

class TableCmp {
  readonly table = injectTable(() => ({
    _features,
    _rowModels: {
      filteredRowModel: createFilteredRowModel(filterFns),
      sortedRowModel: createSortedRowModel(sortFns),
      groupedRowModel: createGroupedRowModel(aggregationFns),
      paginatedRowModel: createPaginatedRowModel(),
    },
    columns: this.columns,
    data: this.data(),
  }))
}
```

### Full Migration Example

```ts
// v8
import {
  injectTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  filterFns,
  sortingFns,
} from '@tanstack/angular-table'

const v8Table = createAngularTable(() => ({
  columns,
  data: data(),
  getCoreRowModel: getCoreRowModel(), // used to be called "get*RowModel()"
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  filterFns, // used to be passed in as a root option
  sortingFns,
}))

// v9
import {
  injectTable,
  tableFeatures,
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  createFilteredRowModel,
  createSortedRowModel,
  createPaginatedRowModel,
  filterFns,
  sortFns,
} from '@tanstack/angular-table'

const _features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
})

const v9Table = injectTable(() => ({
  _features,
  _rowModels: {
    filteredRowModel: createFilteredRowModel(filterFns),
    sortedRowModel: createSortedRowModel(sortFns),
    paginatedRowModel: createPaginatedRowModel(),
  },
  columns,
  data: data(),
}))
```

---

## State Management Changes

### Accessing State

In v8, you accessed state via `table.getState()`. In v9, state is accessed via the store:

```ts
// v8
const state = table.getState()
const v8 = table.getState()
const { sorting, pagination } = v8

// v9 - via the store
const fullState = table.store.state
const v9 = table.store.state
const { sorting: v9Sorting, pagination: v9Pagination } = v9
```

### Optimizing Reads with Angular Signals

In Angular, you have a few good options for consuming table state.

#### Option 1: Prefer `table.store.subscribe(...)` for a sliced signal

TanStack Store lets you subscribe to (and derive) a slice of state. With the Angular adapter, you can use that to create a signal-like value that only updates when the selected slice changes.

This is the closest equivalent to the fine-grained subscription examples you might see in other frameworks.

```ts
import { computed, effect } from '@angular/core'

class TableCmp {
  readonly table = injectTable(() => ({
    _features,
    _rowModels: { /* ... */ },
    columns: this.columns,
    data: this.data(),
  }))

  // Create a computed to a slice of state.
  // The store will only emit when this selected value changes.
  private readonly pagination = this.table.computed(
    state => state.pagination,
  )

  constructor() {
    effect(() => {
      const { pageIndex, pageSize } = this.pagination()
      console.log('Page', pageIndex, 'Size', pageSize)
    })
  }
}
```

#### Option 2: Use `computed(...)` and read from `table.store.state`

You can also use Angular `computed(...)` and directly read from `table.store.state`. This is simple and works well, but for object/array slices you should provide an equality function to avoid unnecessary downstream work when the slice is recreated with the same values.

```ts
import { computed, effect } from '@angular/core'

class TableCmp {
  readonly table = injectTable(() => ({
    _features,
    _rowModels: { /* ... */ },
    columns: this.columns,
    data: this.data(),
  }))

  // Provide an equality function for object slices
  readonly pagination = computed(
    () => this.table.store.state.pagination,
    {
      equal: (a, b) => a.pageIndex === b.pageIndex && a.pageSize === b.pageSize,
    },
  )

  constructor() {
    effect(() => {
      // This effect only re-runs when pagination changes
      const { pageIndex, pageSize } = this.pagination()
      console.log('Page', pageIndex, 'Size', pageSize)
    })
  }
}
```

### Controlled State

Controlled state patterns are pretty the same as v8:

```ts
import { signal } from '@angular/core'
import type { SortingState, PaginationState } from '@tanstack/angular-table'

class TableCmp {
  readonly sorting = signal<SortingState>([])
  readonly pagination = signal<PaginationState>({ pageIndex: 0, pageSize: 10 })

  readonly table = injectTable(() => ({
    _features,
    _rowModels: { /* ... */ },
    columns: this.columns,
    data: this.data(),
    state: {
      sorting: this.sorting(),
      pagination: this.pagination(),
    },
    onSortingChange: (updater) => {
      updater instanceof Function
        ? this.sorting.update(updater)
        : this.sorting.set(updater)
    },
    onPaginationChange: (updater) => {
      updater instanceof Function
        ? this.pagination.update(updater)
        : this.pagination.set(updater)
    },
  }))
}
```

---

## Column Helper Changes

The `createColumnHelper` function now requires a `TFeatures` type parameter in addition to `TData`:

```ts
// v8
import { createColumnHelper } from '@tanstack/angular-table'

const columnHelperV8 = createColumnHelper<Person>()

// v9
import { createColumnHelper, tableFeatures, rowSortingFeature } from '@tanstack/angular-table'

const _features = tableFeatures({ rowSortingFeature })
const columnHelperV9 = createColumnHelper<typeof _features, Person>()
```

### New `columns()` Helper Method

v9 adds a `columns()` helper for better type inference when wrapping column arrays.

```ts
const columnHelper = createColumnHelper<typeof _features, Person>()

// Wrap your columns array for better type inference
const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('lastName', {
    id: 'lastName',
    header: () => 'Last Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: () => 'Edit',
  }),
])
```

### Using with `createTableHook`

When using `createTableHook`, you get a pre-bound `createAppColumnHelper` that only requires `TData`:

```ts
import { createTableHook, tableFeatures, rowSortingFeature } from '@tanstack/angular-table'

const { injectAppTable, createAppColumnHelper } = createTableHook({
  _features: tableFeatures({ rowSortingFeature }),
  _rowModels: { /* ... */ },
})

// TFeatures is already bound — only need TData!
const columnHelper = createAppColumnHelper<Person>()
```

---

## Rendering Changes

### `FlexRender`

The rendering primitives in the Angular adapter are `FlexRender` and the `*flexRender` directives.

In v9, you can continue to render header/cell/footer content using the Angular adapter rendering utilities, but there are a few important improvements and helper APIs to be aware of.

#### Structural directive rendering

Angular rendering is directive-based:

- `FlexRender` / `*flexRender` renders arbitrary render content (primitives, `TemplateRef`, component types, or `flexRenderComponent(...)` wrappers)
- The directive is responsible for mounting embedded views or components via `ViewContainerRef`

#### Shorthand directives

If you're rendering standard table content, prefer the shorthand helpers:

- `*flexRenderCell="cell; let value"`
- `*flexRenderHeader="header; let value"`
- `*flexRenderFooter="footer; let value"`

These automatically select the correct column definition (`columnDef.cell` / `header` / `footer`) and the right props (`cell.getContext()` / `header.getContext()`), so you don't need to manually provide `props:`.

#### DI-aware render functions + context injection

Column definition render functions (`header`, `cell`, `footer`) run inside an Angular injection context, so they can safely call `inject()` and use signals.

When a component is rendered through the FlexRender directives, you can also access the full render props object via DI using `injectFlexRenderContext()`.

#### Component rendering helper: `flexRenderComponent`

If you need to render an Angular component with explicit configuration (custom `inputs`, `outputs`, `injector`, and Angular v20+ creation-time `bindings`/`directives`), return a `flexRenderComponent(Component, options)` wrapper from your column definition.

For complete rendering details (including component rendering, `TemplateRef`, `flexRenderComponent`, and context helpers), see the [Rendering components Guide](./rendering.md).

---

## The `tableOptions()` Utility

The `tableOptions()` helper provides type-safe composition of table options. It's useful for creating reusable partial configurations that can be spread into your table setup.

### Basic Usage

```ts
import { injectTable, tableOptions, tableFeatures, rowSortingFeature } from '@tanstack/angular-table'
import { isDevMode } from '@angular/core';

// Create a reusable options object with features pre-configured
const baseOptions = tableOptions({
  _features: tableFeatures({ rowSortingFeature }),
  debugTable: isDevMode()
})

class TableCmp {
  readonly table = injectTable(() => ({
    ...baseOptions,
    columns: this.columns,
    data: this.data(),
    _rowModels: {},
  }))
}
```

### Composing Partial Options

`tableOptions()` allows you to omit certain required fields (like `data`, `columns`, or `_features`) when creating partial configurations:

```ts
import {
  tableOptions,
  tableFeatures,
  rowSortingFeature,
  columnFilteringFeature,
  createSortedRowModel,
  createFilteredRowModel,
  filterFns,
  sortFns,
} from '@tanstack/angular-table'

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
```

```ts
import { injectTable, tableOptions, createPaginatedRowModel } from '@tanstack/angular-table'

// Another partial without _features (inherits from spread)
const paginationDefaults = tableOptions({
  _rowModels: {
    paginatedRowModel: createPaginatedRowModel(),
  },
  initialState: {
    pagination: { pageIndex: 0, pageSize: 25 },
  },
})

class TableCmp {
  readonly table = injectTable(() => ({
    ...featureOptions,
    ...paginationDefaults,
    columns: this.columns,
    data: this.data(),
  }))
}
```

### Using with `createTableHook`

`tableOptions()` pairs well with `createTableHook` for building composable table factories:

```ts
import {
  createTableHook,
  tableOptions,
  tableFeatures,
  rowSortingFeature,
  rowPaginationFeature,
  createSortedRowModel,
  createPaginatedRowModel,
  sortFns,
} from '@tanstack/angular-table'

const sharedOptions = tableOptions({
  _features: tableFeatures({ rowSortingFeature, rowPaginationFeature }),
  _rowModels: {
    sortedRowModel: createSortedRowModel(sortFns),
    paginatedRowModel: createPaginatedRowModel(),
  },
})

const { injectAppTable } = createTableHook(sharedOptions)
```

---

## `createTableHook`: Composable Table Patterns

**This is an advanced, optional feature.** You don't need to use `createTableHook`—`injectTable` is sufficient for most use cases.

For applications with multiple tables sharing the same configuration, `createTableHook` lets you define features, row models, and reusable components once.

For full setup and patterns, see the [Table composition Guide](./table-composition.md).

---

## Other Breaking Changes

### Column Pinning Option Split

The `enablePinning` option has been split into separate options:

```ts
// v8
enablePinning: true

// v9
enableColumnPinning: true
enableRowPinning: true
```

### Removed Internal APIs

All internal APIs prefixed with `_` have been removed. If you were using any of these, use their public equivalents.

### Column Sizing vs. Column Resizing Split

In v8, column sizing and resizing were combined in a single feature. In v9, they've been split into separate features for better tree-shaking.

| v8 | v9 |
|----|-----|
| `ColumnSizing` (combined feature) | `columnSizingFeature` + `columnResizingFeature` |
| `columnSizingInfo` state | `columnResizing` state |
| `setColumnSizingInfo()` | `setColumnResizing()` |
| `onColumnSizingInfoChange` option | `onColumnResizingChange` option |

If you only need column sizing (fixed widths) without interactive resizing, you can import just `columnSizingFeature`. If you need drag-to-resize functionality, import both.

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

Update your column definitions.

### Row API Changes

Some row APIs have changed from private to public:

| v8 | v9 |
|----|-----|
| `row._getAllCellsByColumnId()` (private) | `row.getAllCellsByColumnId()` (public) |

---

## TypeScript Changes Summary

### Type Generics

Most types now require a `TFeatures` parameter:

```txt
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

```ts
const _features = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
})

type MyFeatures = typeof _features

const columns: ColumnDef<typeof _features, Person>[] = [...]
```

### Using `StockFeatures`

If using `stockFeatures`, use the `StockFeatures` type:

```ts
import type { StockFeatures, ColumnDef } from '@tanstack/angular-table'

const columns: ColumnDef<StockFeatures, Person>[] = [...]
```

### `ColumnMeta` Generic Change

If you're using module augmentation to extend `ColumnMeta`, note that it now requires a `TFeatures` parameter.

### `RowData` Type Restriction

The `RowData` type is now more restrictive.

---

## Migration Checklist

- [ ] Update your table setup to v9 and define `_features` using `tableFeatures()` (or use `stockFeatures`)
- [ ] Migrate `get*RowModel()` options to `_rowModels`
- [ ] Update row model factories to include `Fns` parameters where needed
- [ ] Update TypeScript types to include `TFeatures` generic
- [ ] Update state access: `table.getState()` → `table.store.state`
- [ ] Update `createColumnHelper<TData>()` → `createColumnHelper<TFeatures, TData>()`
- [ ] Replace `enablePinning` with `enableColumnPinning`/`enableRowPinning` if used
- [ ] Rename `sortingFn` → `sortFn` in column definitions
- [ ] Split column sizing/resizing: use both `columnSizingFeature` and `columnResizingFeature` if needed
- [ ] Rename `columnSizingInfo` state → `columnResizing` (and related options)
- [ ] Update `ColumnMeta` module augmentation to include `TFeatures` generic (if used)
- [ ] (Optional) Use `tableOptions()` for composable configurations
- [ ] (Optional) Use `createTableHook` for reusable table patterns

---

## Examples

Check out these examples to see v9 patterns in action:
- [Basic](../examples/basic)
- [Basic (App Table)](../examples/basic-app-table)
- [Filters](../examples/filters)
- [Column Ordering](../examples/column-ordering)
- [Column Pinning](../examples/column-pinning)
- [Column Visibility](../examples/column-visibility)
- [Expanding](../examples/expanding)
- [Grouping](../examples/grouping)
- [Row Selection](../examples/row-selection)
- [Composable Tables](../examples/composable-tables)



