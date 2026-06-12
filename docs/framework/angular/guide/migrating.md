---
title: Migrating to TanStack Table v9 (Angular)
---

> [!NOTE]
> `v9.0.0-beta.10` introduces a breaking change in how row models are defined in order to bring increased type-safety features. Row model factories and function registries now live as slots on the `features` object instead of a separate `rowModels` option, and the factories no longer take arguments. If you migrated on an earlier beta, see the [Row Model Factories](#row-model-factories) section below for the new shape.

## What's New in TanStack Table v9

TanStack Table v9 is a major release that introduces significant architectural improvements while maintaining the core table logic you're familiar with. Here are the key changes:

### 1. Tree Shaking and Extensibility

- **Features are tree-shakeable**: Features are now treated as plugins: import only what you use. If your table only needs sorting, you won't ship filtering, pagination, or other feature code. Bundlers can eliminate unused code, so for smaller tables you can expect a meaningfully smaller bundle compared to v8. This also lets TanStack Table add features over time without bloating everyone's bundles.
- **Row models and their functions are refactored**: Row model factories (`createFilteredRowModel`, `createSortedRowModel`, etc.) are now slots on the `features` object, and their processing functions (`filterFns`, `sortFns`, `aggregationFns`) are registered as their own feature slots. This enables tree-shaking of the functions themselves: if you only register a custom filter, you don't pay for built-in filters you never use.
- **Custom feature plugins with full type safety**: The same plugin architecture that powers the built-in features is open to your own code. Write a custom feature with its own state, options, and APIs, register it in `tableFeatures()` alongside the built-ins, and the table's types pick it all up automatically. See the [Custom Features Guide](./custom-features.md).

### 2. State Management

- **Uses TanStack Store**: The internal state system has been rebuilt on [TanStack Store](https://tanstack.com/store), providing a reactive, framework-agnostic foundation.
- **Opt-in subscriptions instead of memo hacks**: In Angular, table atoms are backed by signals. Use `computed(...)` when you want selector-style derivation or custom equality, and keep reads scoped to the state you actually need.

### 3. Composability

- **`tableOptions`**: New utilities let you compose and share table configurations. Define `features` (including row model factories) and default options once, then reuse them across tables or pass them through `createTableHook`.
- **`createTableHook`** (optional, advanced): Create reusable, strongly typed Angular table factories with pre-bound features, row models, default options, and component registries.

### 4. Improved Type Safety (No More Declaration Merging)

- **Function registries replace `declare module` augmentation**: Custom filter, sort, and aggregation functions are registered by name in the `filterFns` / `sortFns` / `aggregationFns` slots on `tableFeatures()`. The registered keys become the valid, type-safe string values for `filterFn`, `sortFn`, `globalFilterFn`, and `aggregationFn` in your column definitions, with full inference. No more augmenting the `FilterFns` / `SortFns` / `AggregationFns` interfaces globally.
- **Per-table meta slots**: The type-only `tableMeta`, `columnMeta`, and `filterMeta` slots declare meta types for a single table instead of merging into a global interface. The `filterMeta` slot types both the `addMeta` callback in filter functions and the values read back from `row.columnFiltersMeta`.
- **Feature-gated APIs and validated prerequisites**: APIs like `table.setSorting` only exist on the table type when their feature is registered, and `tableFeatures()` validates slot prerequisites at the type level. Registering `sortFns` without `rowSortingFeature`, or `globalFilteringFeature` without `columnFilteringFeature`, is a typed error instead of a silent runtime no-op.

### The Good News: Most Upgrades Are Opt-in

While v9 is a significant upgrade, **you don't have to adopt everything at once**:

- **Don't want to think about tree-shaking yet?** You can start with `stockFeatures` to include most commonly used features.
- **Your table markup is largely unchanged.** How you render `<table>`, `<thead>`, `<tr>`, `<td>`, etc. remains the same.

The main change is **how you define a table** with the Angular adapter, specifically the new `features` option and how row model factories are registered inside it.

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
> Keep expensive/static values (like `columns` and `features`) as stable references outside the initializer.

### New Required Option: `features`

In v9, you must explicitly declare which features and row model factories your table uses via `tableFeatures`:

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

const features = tableFeatures({}) // Empty = core features only

// Define stable references outside the initializer
const v9Table = injectTable(() => ({
  features,
  columns: this.columns,
  data: this.data(),
}))
```

---

## The `features` Option

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
const features = tableFeatures({
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
    features: stockFeatures, // All features included
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

## Row Model Factories

Row models are the functions that process your data (filtering, sorting, pagination, etc.). In v9, row model factories and their `*Fns` registries move from a separate `rowModels` option into `tableFeatures`.

### Migration Mapping

| v8 Option | v9 `tableFeatures` slot | v9 Factory Function |
|-----------|--------------------------|---------------------|
| `getCoreRowModel()` | (automatic) | Not needed, always included |
| `getFilteredRowModel()` | `filteredRowModel` | `createFilteredRowModel()` |
| `getSortedRowModel()` | `sortedRowModel` | `createSortedRowModel()` |
| `getPaginationRowModel()` | `paginatedRowModel` | `createPaginatedRowModel()` |
| `getExpandedRowModel()` | `expandedRowModel` | `createExpandedRowModel()` |
| `getGroupedRowModel()` | `groupedRowModel` | `createGroupedRowModel()` |
| `getFacetedRowModel()` | `facetedRowModel` | `createFacetedRowModel()` |
| `getFacetedMinMaxValues()` | `facetedMinMaxValues` | `createFacetedMinMaxValues()` |
| `getFacetedUniqueValues()` | `facetedUniqueValues` | `createFacetedUniqueValues()` |

The `filterFns`, `sortFns`, and `aggregationFns` objects are now registered as named slots on `tableFeatures` rather than passed as arguments to the factory functions.

### Key Change: Row Model Factories and Fn Registries Move into `tableFeatures`

```ts
import {
  tableFeatures,
  createFilteredRowModel,
  createSortedRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  filterFns, // Built-in filter functions
  sortFns, // Built-in sort functions
  aggregationFns, // Built-in aggregation functions
} from '@tanstack/angular-table'

const features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  columnGroupingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  groupedRowModel: createGroupedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns,
  sortFns,
  aggregationFns,
})

class TableCmp {
  readonly table = injectTable(() => ({
    features,
    columns: this.columns,
    data: this.data(),
  }))
}
```

### Full Migration Example

```ts
// v8
import {
  createAngularTable,
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

const features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns,
  sortFns,
})

const v9Table = injectTable(() => ({
  features,
  columns,
  data: data(),
}))
```

---

## State Management Changes

### Accessing State

In v8, you accessed state via `table.getState()`. In v9, read the specific
state slice from `table.atoms.<slice>.get()` where possible. Use `table.store.get()`
when you need the full flat state shape, such as debug JSON.

```ts
// v8
const state = table.getState()
const v8 = table.getState()
const { sorting, pagination } = v8

// v9 - per-slice reads, preferred for Angular render code
const sorting = table.atoms.sorting.get()
const pagination = table.atoms.pagination.get()

// v9 - full-state flat snapshot
const fullState = table.store.get()
const v9 = table.store.get()
const { sorting: v9Sorting, pagination: v9Pagination } = v9
```

### Optimizing Reads with Angular Signals

In Angular, you have a few good options for consuming table state.

#### Option 1: Read table atoms directly

The Angular adapter backs table atoms with Angular signals. Read the atom you care about directly in templates, effects, or computed values.

```ts
import { computed, effect } from '@angular/core'
import { shallow } from '@tanstack/angular-table'

class TableCmp {
  readonly table = injectTable(() => ({
    features,
    columns: this.columns,
    data: this.data(),
  }))

  // Use computed when deriving from a slice or applying equality.
  private readonly pagination = computed(
    () => this.table.atoms.pagination.get(),
    { equal: shallow },
  )

  constructor() {
    effect(() => {
      const { pageIndex, pageSize } = this.pagination()
      console.log('Page', pageIndex, 'Size', pageSize)
    })
  }
}
```

#### Option 2: Use `computed(...)` for selected object slices

Use Angular `computed(...)` when you want selector-style behavior, a derived value, or an equality function. For object/array slices, use `shallow` from `@tanstack/angular-table` to avoid unnecessary downstream work when the slice is recreated with the same values.

```ts
import { computed, effect } from '@angular/core'
import { shallow } from '@tanstack/angular-table'

class TableCmp {
  readonly table = injectTable(() => ({
    features,
    columns: this.columns,
    data: this.data(),
  }))

  // Provide an equality function for object slices
  readonly pagination = computed(
    () => this.table.atoms.pagination.get(),
    { equal: shallow },
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

The v8-style `state` + `on[State]Change` controlled state patterns still work and remain convenient for simple integrations. For new v9 code, prefer owning state slices with external atoms via the new `atoms` table option (created with `createAtom` from `@tanstack/angular-store`), which give you fine-grained subscriptions without mirroring state through Angular signals. See the [External Atoms section of the Table State Guide](./table-state#external-atoms) and the [Basic External Atoms example](../examples/basic-external-atoms).

```ts
import { signal } from '@angular/core'
import type { SortingState, PaginationState } from '@tanstack/angular-table'

class TableCmp {
  readonly sorting = signal<SortingState>([])
  readonly pagination = signal<PaginationState>({ pageIndex: 0, pageSize: 10 })

  readonly table = injectTable(() => ({
    features,
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

const features = tableFeatures({ rowSortingFeature })
const columnHelperV9 = createColumnHelper<typeof features, Person>()
```

### New `columns()` Helper Method

v9 adds a `columns()` helper for better type inference when wrapping column arrays.

```ts
const columnHelper = createColumnHelper<typeof features, Person>()

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
import { createTableHook, tableFeatures, rowSortingFeature, createSortedRowModel, sortFns } from '@tanstack/angular-table'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const { injectAppTable, createAppColumnHelper } = createTableHook({ features })

// TFeatures is already bound, only need TData!
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

const features = tableFeatures({ rowSortingFeature })

// Create a reusable options object with features pre-configured
const baseOptions = tableOptions({
  features,
  debugTable: isDevMode()
})

class TableCmp {
  readonly table = injectTable(() => ({
    ...baseOptions,
    columns: this.columns,
    data: this.data(),
  }))
}
```

### Composing Partial Options

`tableOptions()` allows you to omit certain required fields (like `data`, `columns`, or `features`) when creating partial configurations:

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

const features = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  sortFns,
  filterFns,
})

// Partial options without data or columns
const featureOptions = tableOptions({ features })
```

```ts
import { injectTable, tableOptions } from '@tanstack/angular-table'

// Another partial (inherits features from spread)
const paginationDefaults = tableOptions({
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

const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
})

const sharedOptions = tableOptions({ features })

const { injectAppTable } = createTableHook(sharedOptions)
```

---

## `createTableHook`: Composable Table Patterns

**This is an advanced, optional feature.** You don't need to use `createTableHook`; `injectTable` is sufficient for most use cases.

For applications with multiple tables sharing the same configuration, `createTableHook` lets you define features, row models, and reusable components once.

For full setup and patterns, see the [Composable Tables Guide](./composable-tables.md).

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
| `setColumnSizingInfo()` | `setcolumnResizing()` (note the lowercase `c`, the current v9 spelling) |
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

### Using `typeof features`

The easiest way to get the `TFeatures` type is with `typeof`:

```ts
const features = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
})

type MyFeatures = typeof features

const columns: ColumnDef<typeof features, Person>[] = [...]
```

### Using `StockFeatures`

If using `stockFeatures`, use the `StockFeatures` type:

```ts
import type { StockFeatures, ColumnDef } from '@tanstack/angular-table'

const columns: ColumnDef<StockFeatures, Person>[] = [...]
```

### `TableMeta`/`ColumnMeta` Typing Changes

No more declaration merging required! (Although it still works if you want to keep using it)

Global declaration merging to extend `TableMeta` or `ColumnMeta` works exactly like it did in v8. The only change you need to make is updating the generics shape: both interfaces now take `TFeatures` as the first type parameter.

Optionally, v9 also adds a new way to declare meta types **per-table** without declaration merging. You can use type-only `tableMeta`/`columnMeta` slots on the `features` option, which only affect tables created with that `features` object:

```ts
const features = tableFeatures({
  rowSortingFeature,
  columnMeta: metaHelper<{ customProperty: string }>(),
})
```

See the new [Table and Column Meta Guide](../../../guide/table-and-column-meta) for full details on both approaches.

### `FilterFns`/`SortFns`/`AggregationFns`/`FilterMeta` Augmentation Replaced by Registry Slots

In v8, making a custom function usable as a string reference (like `filterFn: 'fuzzy'`) required `declare module` augmentation of the `FilterFns` interface, and typing filter meta required augmenting `FilterMeta`. In v9, registering the function in the matching registry slot does both jobs with no global augmentation:

```ts
// v8
declare module '@tanstack/angular-table' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

// v9 - register in the slot; the key becomes a valid string value
interface FuzzyFilterMeta {
  itemRank?: RankingInfo
}

const features = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { ...filterFns, fuzzy: fuzzyFilter },
  filterMeta: metaHelper<FuzzyFilterMeta>(),
})

// 'fuzzy' now typechecks in column defs for tables using these features
columnHelper.accessor('name', { filterFn: 'fuzzy' })
```

The same pattern applies to `sortFns` (for `sortFn` string values) and `aggregationFns` (for `aggregationFn` string values). See the [Fuzzy Filtering Guide](./fuzzy-filtering.md) for a complete example.

### `RowData` Type Restriction

The `RowData` type is now more restrictive:

```ts
// v8 - very permissive
type RowData = unknown

// v9 - must be a record or array
type RowData = Record<string, any> | Array<any>
```

This change improves type safety. If you were passing unusual data types, ensure your data conforms to `Record<string, any>` or `Array<any>`.

---

## Migration Checklist

- [ ] Update your table setup to v9 and define `features` using `tableFeatures()` (or use `stockFeatures`)
- [ ] Migrate `get*RowModel()` options: move row model factories into `tableFeatures` as named slots
- [ ] Move `filterFns`, `sortFns`, and `aggregationFns` into `tableFeatures` as named slots (no longer passed as factory arguments)
- [ ] Replace `declare module` augmentation of `FilterFns`/`SortFns`/`AggregationFns` with registry-slot registration, and `FilterMeta` augmentation with the `filterMeta` slot
- [ ] Update TypeScript types to include `TFeatures` generic
- [ ] Update state access: `table.getState().slice` → `table.atoms.<slice>.get()` where possible; use `table.store.get()` for full-state/debug reads
- [ ] Update `createColumnHelper<TData>()` → `createColumnHelper<TFeatures, TData>()`
- [ ] Replace `enablePinning` with `enableColumnPinning`/`enableRowPinning` if used
- [ ] Rename `sortingFn` → `sortFn` in column definitions
- [ ] Split column sizing/resizing: use both `columnSizingFeature` and `columnResizingFeature` if needed
- [ ] Rename `columnSizingInfo` state → `columnResizing` (and related options)
- [ ] If you use `TableMeta`/`ColumnMeta` declaration merging, add the `TFeatures` generic to your augmentations (optionally, switch to the per-table `tableMeta`/`columnMeta` feature slots)
- [ ] (Optional) Use `tableOptions()` for composable configurations
- [ ] (Optional) Use `createTableHook` for reusable table patterns

---

## Examples

Check out these examples to see v9 patterns in action:
- [Basic (Inject Table)](../examples/basic-inject-table)
- [Basic (App Table)](../examples/basic-app-table)
- [Filters](../examples/filters)
- [Column Ordering](../examples/column-ordering)
- [Column Pinning](../examples/column-pinning)
- [Column Visibility](../examples/column-visibility)
- [Expanding](../examples/expanding)
- [Grouping](../examples/grouping)
- [Row Selection](../examples/row-selection)
- [Composable Tables](../examples/composable-tables)
