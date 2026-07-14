---
title: Migrating to TanStack Table V9 (Angular)
---

> [!IMPORTANT]
> `v9.0.0-beta.48` introduces a breaking feature split: `columnGroupingFeature` no longer provides aggregation options or APIs. Tables that group rows and calculate aggregate values must now register both `columnGroupingFeature` and `aggregationFeature`. Grouping-only tables can register only `columnGroupingFeature`, while grand totals or other aggregation without grouping can register only `aggregationFeature`. `stockFeatures` already contains both. If you use an explicit feature list, add `aggregationFeature` anywhere you use `aggregationFns`, `aggregationFn`, `aggregatedCell`, `cell.getIsAggregated()`, or `column.getAggregationValue()`. See the [Grouping Guide](./grouping) and [Aggregation Guide](./aggregation).

> [!NOTE]
> `v9.0.0-beta.38` renames column pinning from physical `left`/`right` terminology to logical `start`/`end` terminology. These are logical positions: in LTR languages/layouts, `start` usually corresponds to left and `end` to right; in RTL languages/layouts, `start` usually corresponds to right and `end` to left. If you migrated on an earlier beta, update `columnPinning.left` to `columnPinning.start`, `columnPinning.right` to `columnPinning.end`, `column.pin('left' | 'right')` to `column.pin('start' | 'end')`, and `getLeft*` / `getRight*` table and row APIs to `getStart*` / `getEnd*`. See the [Column Pinning](#column-pinning) section below for the full mapping.

> [!NOTE]
> `v9.0.0-beta.10` introduces a breaking change in how row models are defined in order to bring increased type-safety features. Row model factories and function registries now live as slots on the `features` object instead of a separate `rowModels` option, and the factories no longer take arguments. If you migrated on an earlier beta, see the [Row Model Factories](#row-model-factories) section below for the new shape.

## What's New in TanStack Table V9

TanStack Table V9 is a major release with significant internal architectural improvements while maintaining the core table logic you're familiar with. Here are the key changes:

### 1. Better Performance

- **Lower memory usage**: The core architecture now shares more behavior across table objects, with some large-table scenarios seeing up to 90% memory savings.
- **Faster client-side row models**: Sorting, filtering, and aggregation paths have improved algorithms and memoization, with many scenarios seeing up to 40-70% speed improvements.
- **Better column resizing performance**: Column resizing also gets significant performance improvements from the same architectural and memoization work.

### 2. State Management Overhaul

- **TanStack Store foundation**: The internal state system has been rebuilt on [TanStack Store](https://tanstack.com/store), providing a reactive, framework-agnostic foundation.
- **Angular signal integration**: Table atoms are backed by signals. Use `computed(...)` when you want selector-style derivation or custom equality, and keep reads scoped to the state you actually need.
- **External state remains supported**: You can still use `state` plus `on[State]Change` by owning slices with Angular signals.

### 3. Type-Safety Improvements

- **New and revamped type helpers**: New type helpers help define columns, custom filters, sorts, aggregations, column and table meta, shared table options and components, and more.
- **Per-table meta types**: `tableMeta`, `columnMeta`, and `filterMeta` slots let you type meta for a specific table instead of globally augmenting shared interfaces. **No more global declaration merging required!**
- **Feature-gated APIs**: APIs only exist when their feature is registered, and `tableFeatures()` validates feature prerequisites at the type level.

### 4. Tree Shaking and Extensibility

- **Import only the features you use**: Tables that only need sorting do not ship filtering, pagination, or other unused feature code.
- **Tree-shakeable row models and functions**: Row model factories and `filterFns` / `sortFns` / `aggregationFns` now live on `tableFeatures()`, so unused processing code can be dropped.
- **Custom features use the same system**: Your own feature plugins can register state, options, and APIs alongside the built-in features. See the [Custom Features Guide](./custom-features.md).

### 5. Composability

- **`tableOptions`**: Compose reusable table configuration, including features, row models, and default options.
- **`createTableHook`**: Create reusable, strongly typed Angular table factories with pre-bound features, row models, default options, and component registries.

### The Good News: Most Upgrades Are Opt-in

While v9 is a significant upgrade, **you don't have to adopt everything at once**:

- **Don't want to think about tree-shaking yet?** You can start with `stockFeatures` to include most commonly used features.
- **Your table markup is largely unchanged.** How you render `<table>`, `<thead>`, `<tr>`, `<td>`, etc. remains the same.

The main change is **how you define a table** with the Angular adapter, specifically the new `features` option and how row model factories are registered inside it.

## Core Breaking Changes

### Column Pinning

`v9.0.0-beta.38` changes column pinning to use logical `start`/`end` terminology instead of physical `left`/`right` terminology. In LTR languages/layouts, `start` usually corresponds to left and `end` to right; in RTL languages/layouts, `start` usually corresponds to right and `end` to left. There are no deprecated aliases in beta.38.

| Before beta.38                       | beta.38+                             |
| ------------------------------------ | ------------------------------------ |
| `columnPinning.left`                 | `columnPinning.start`                |
| `columnPinning.right`                | `columnPinning.end`                  |
| `column.pin('left')`                 | `column.pin('start')`                |
| `column.pin('right')`                | `column.pin('end')`                  |
| `column.getIsPinned() === 'left'`    | `column.getIsPinned() === 'start'`   |
| `column.getIsPinned() === 'right'`   | `column.getIsPinned() === 'end'`     |
| `row.getLeftVisibleCells()`          | `row.getStartVisibleCells()`         |
| `row.getRightVisibleCells()`         | `row.getEndVisibleCells()`           |
| `table.getLeftHeaderGroups()`        | `table.getStartHeaderGroups()`       |
| `table.getRightHeaderGroups()`       | `table.getEndHeaderGroups()`         |
| `table.getLeftLeafColumns()`         | `table.getStartLeafColumns()`        |
| `table.getRightLeafColumns()`        | `table.getEndLeafColumns()`          |
| `table.getLeftVisibleLeafColumns()`  | `table.getStartVisibleLeafColumns()` |
| `table.getRightVisibleLeafColumns()` | `table.getEndVisibleLeafColumns()`   |
| `table.getLeftTotalSize()`           | `table.getStartTotalSize()`          |
| `table.getRightTotalSize()`          | `table.getEndTotalSize()`            |
| `column.getStart('left')`            | `column.getStart('start')`           |
| `column.getAfter('right')`           | `column.getAfter('end')`             |
| `column.getIndex('left')`            | `column.getIndex('start')`           |
| `column.getIndex('right')`           | `column.getIndex('end')`             |

This rename is about logical table regions, not automatic DOM direction handling. For sticky column pinning, prefer CSS logical properties like `insetInlineStart` and `insetInlineEnd`. The `columnResizeDirection` table option is unchanged.

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

### Instance Methods Must Be Called on Their Instance

In v9, methods on rows, cells, columns, headers, and similar table objects are shared on the object's prototype instead of being created as arrow functions on each object. This improves memory usage, but it means destructuring those methods loses the `this` context they need to operate on the instance.

```ts
// v8 - worked because getValue closed over the row object
const { getValue } = row
const value = getValue('name')

// v9 - call the method on the instance
const value = row.getValue('name')
```

This applies to row, cell, column, header, and related instance APIs, but not to the table instance itself. Audit code that destructures methods from table objects or passes them around as bare callbacks. Prefer calling them through the original object, for example `row.getValue('name')`, `cell.getContext()`, `column.getCanSort()`, or `header.getContext()`.

Because these methods now live on the prototype, they also do not appear as own properties in `Object.keys(instance)`, object spread, or `JSON.stringify`. A shallow clone like `{ ...row }` copies row data but does not copy row methods. The methods are still callable normally because JavaScript looks them up through the prototype chain.

### New Required `features` Table Option

In Table V9, you must explicitly declare which features your table uses. Features, Row Models, and Row Model processing "Fns" are defined on the new `features` table option.

In Table V8, all features were bundled and included in the table setup. In Table V9, you import only what you need.

```ts
// Table V8
import {
  createAngularTable,
  getCoreRowModel,
  getSortedRowModel,
  sortingFns,
} from '@tanstack/angular-table'

const v8Table = createAngularTable(() => ({
  columns,
  data: data(),
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  sortingFns,
}))

// Table V9
import {
  createSortedRowModel,
  injectTable,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/angular-table'

// All table options that concern including code modules (features, row models, Fns, etc.)
const features = tableFeatures({
  rowSortingFeature, // new - import and pass the feature you want to use
  sortedRowModel: createSortedRowModel(), // now row models are defined on the features object
  sortFns, // now Fns are defined on the features object
  // ...more features, row models, etc.
})

// Define stable references outside the initializer
const v9Table = injectTable(() => ({
  features, // new required option
  columns: this.columns,
  data: this.data(),
}))
```

---

#### Shortcut: Use `stockFeatures` for Table V8-like Behavior

If you want all features without thinking about it (like Table V8), import `stockFeatures`:

```ts
import { injectTable, stockFeatures } from '@tanstack/angular-table'

class TableCmp {
  readonly table = injectTable(() => ({
    features: stockFeatures, // All features included - just like Table V8
    columns: this.columns,
    data: this.data(),
  }))
}
```

### Aggregation Feature Split

Aggregation is now independent from column grouping. `stockFeatures` still includes both, so tables using it need no feature-registration change. If you declare features explicitly, add `aggregationFeature` whenever columns use `aggregationFn`, `aggregatedCell`, `getAggregationValue`, or `cell.getIsAggregated`. Add `columnGroupingFeature` and `groupedRowModel` only when you also group rows. Root totals can use aggregation without grouping.

```ts
const features = tableFeatures({
  aggregationFeature,
  columnGroupingFeature, // only for grouped rows
  groupedRowModel: createGroupedRowModel(),
  aggregationFns: { sum: aggregationFn_sum },
})
```

Custom aggregation callables have changed to context-based definitions:

```ts
// Table V8/earlier V9 betas
const total = (columnId, leafRows, childRows) =>
  leafRows.reduce((sum, row) => sum + row.getValue(columnId), 0)

// Current V9
const total = constructAggregationFn({
  aggregate: ({ rows, getValue }) =>
    rows.reduce((sum, row) => sum + Number(getValue(row)), 0),
})
```

`column.getAggregationFn()` is now `column.getAggregationFns()` because a column can run multiple definitions. A single `aggregationFn` still returns a scalar; an array returns an object keyed by function name or descriptor `id`. The old callable `AggregationFn` and `CreatedAggregationFn` types are replaced by `AggregationFnDef`.

### Available Features

| Feature           | Import Name               |
| ----------------- | ------------------------- |
| Column Filtering  | `columnFilteringFeature`  |
| Global Filtering  | `globalFilteringFeature`  |
| Row Sorting       | `rowSortingFeature`       |
| Row Pagination    | `rowPaginationFeature`    |
| Row Selection     | `rowSelectionFeature`     |
| Row Expanding     | `rowExpandingFeature`     |
| Row Pinning       | `rowPinningFeature`       |
| Column Pinning    | `columnPinningFeature`    |
| Column Visibility | `columnVisibilityFeature` |
| Column Ordering   | `columnOrderingFeature`   |
| Column Sizing     | `columnSizingFeature`     |
| Column Resizing   | `columnResizingFeature`   |
| Column Grouping   | `columnGroupingFeature`   |
| Aggregation       | `aggregationFeature`      |
| Column Faceting   | `columnFacetingFeature`   |

---

## Row Model Factories

Row models are the functions that process your data (filtering, sorting, pagination, etc.). In Table V9, row model factories and their `*Fns` registries move from a separate `rowModels` option into `tableFeatures`. Row model slots are type-checked, so each row model must be specified after its associated feature in the same `tableFeatures` call.

### Migration Mapping

| Table V8 Option            | Table V9 `tableFeatures` Slot | Table V9 Factory Function     |
| -------------------------- | ----------------------------- | ----------------------------- |
| `getCoreRowModel()`        | (automatic)                   | Not needed, always included   |
| `getFilteredRowModel()`    | `filteredRowModel`            | `createFilteredRowModel()`    |
| `getSortedRowModel()`      | `sortedRowModel`              | `createSortedRowModel()`      |
| `getPaginationRowModel()`  | `paginatedRowModel`           | `createPaginatedRowModel()`   |
| `getExpandedRowModel()`    | `expandedRowModel`            | `createExpandedRowModel()`    |
| `getGroupedRowModel()`     | `groupedRowModel`             | `createGroupedRowModel()`     |
| `getFacetedRowModel()`     | `facetedRowModel`             | `createFacetedRowModel()`     |
| `getFacetedMinMaxValues()` | `facetedMinMaxValues`         | `createFacetedMinMaxValues()` |
| `getFacetedUniqueValues()` | `facetedUniqueValues`         | `createFacetedUniqueValues()` |

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
  aggregationFeature,
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

### Prefer Individual Fn Imports Over Full Registries

The `filterFns`, `sortFns`, and `aggregationFns` registry exports are now deprecated in favor of importing individual `filterFn_*`, `sortFn_*`, and `aggregationFn_*` functions and registering only the ones you use (or passing functions directly in column definitions with no registration at all). The full registries still work, but spreading them puts every built-in function in your bundle. Keep in mind that string names, including the default `'auto'`, only resolve functions you have registered.

```ts
// Before: registers every built-in function
import { filterFns, sortFns } from '@tanstack/angular-table'

const features = tableFeatures({
  // ...other features and row models
  filterFns,
  sortFns,
})

// After: registers only the functions you use
import {
  filterFn_includesString,
  sortFn_alphanumeric,
  sortFn_text,
} from '@tanstack/angular-table'

const features = tableFeatures({
  // ...other features and row models
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
})
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
  readonly pagination = computed(() => this.table.atoms.pagination.get(), {
    equal: shallow,
  })

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

The v8-style `onStateChange` callback is no longer part of the v9 table state model. Use per-slice `on[State]Change` callbacks or subscribe to the table store when you need to listen to all state changes.

```ts
const unsubscribe = this.table.store.subscribe((state) => {
  console.log(state)
})
```

---

## Column Helper Changes

The `createColumnHelper` function now requires a `TFeatures` type parameter in addition to `TData`:

```ts
// v8
import { createColumnHelper } from '@tanstack/angular-table'

const columnHelperV8 = createColumnHelper<Person>()

// v9
import {
  createColumnHelper,
  tableFeatures,
  rowSortingFeature,
} from '@tanstack/angular-table'

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
import {
  createTableHook,
  tableFeatures,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
} from '@tanstack/angular-table'

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
import {
  injectTable,
  tableOptions,
  tableFeatures,
  rowSortingFeature,
} from '@tanstack/angular-table'
import { isDevMode } from '@angular/core'

const features = tableFeatures({ rowSortingFeature })

// Create a reusable options object with features pre-configured
const baseOptions = tableOptions({
  features,
  debugTable: isDevMode(),
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

- Removed: `table._getPinnedRows()`
- Removed: `table._getFacetedRowModel()`
- Removed: `table._getFacetedMinMaxValues()`
- Removed: `table._getFacetedUniqueValues()`

### Column Sizing vs. Column Resizing Split

In v8, column sizing and resizing were combined in a single feature. In v9, they've been split into separate features for better tree-shaking.

| v8                                | v9                                              |
| --------------------------------- | ----------------------------------------------- |
| `ColumnSizing` (combined feature) | `columnSizingFeature` + `columnResizingFeature` |
| `columnSizingInfo` state          | `columnResizing` state                          |
| `setColumnSizingInfo()`           | `setColumnResizing()`                           |
| `onColumnSizingInfoChange` option | `onColumnResizingChange` option                 |

If you only need column sizing (fixed widths) without interactive resizing, you can import just `columnSizingFeature`. If you need drag-to-resize functionality, import both.

### Sorting API Renames

Sorting-related APIs have been renamed for consistency:

| v8                                | v9                       |
| --------------------------------- | ------------------------ |
| `sortingFn` (column def option)   | `sortFn`                 |
| `column.getSortingFn()`           | `column.getSortFn()`     |
| `column.getAutoSortingFn()`       | `column.getAutoSortFn()` |
| `SortingFn` type                  | `SortFn` type            |
| `SortingFns` interface            | `SortFns` interface      |
| `sortingFns` (built-in functions) | `sortFns`                |

Update your column definitions.

### Row API Changes

Some row APIs have changed from private to public:

| v8                                       | v9                                     |
| ---------------------------------------- | -------------------------------------- |
| `row._getAllCellsByColumnId()` (private) | `row.getAllCellsByColumnId()` (public) |

### Row Selection API Changes

> [!WARNING]
> **Minor breaking change:** `row.getToggleSelectedHandler()` now enables inclusive Shift range selection by default when `rowSelectionFeature` is enabled. Existing checkboxes or rows wired through this handler establish an anchor on an ordinary interaction and select or deselect the current display-order range on a Shift interaction. Direct `row.toggleSelected()` calls are unchanged.
>
> Set `enableRowRangeSelection: false` to preserve the previous non-range handler behavior. The handler must receive an event that exposes Shift directly or through `nativeEvent`; see [Shift Range Selection](./row-selection.md#shift-range-selection).

The "some rows selected" checks were simplified to mean "at least one row is selected":

| API                                 | v8                                                  | v9                                            |
| ----------------------------------- | --------------------------------------------------- | --------------------------------------------- |
| `table.getIsSomeRowsSelected()`     | `true` when some but not all rows are selected      | `true` when at least one row is selected      |
| `table.getIsSomePageRowsSelected()` | `true` when some but not all page rows are selected | `true` when at least one page row is selected |

In v8 these returned `false` once every row was selected; in v9 they stay `true`. If you use them to drive an indeterminate "select all" checkbox, gate the indeterminate state on the matching all-selected check so it clears at full selection:

`getIsSomeRowsSelected() && !getIsAllRowsSelected()`

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
  filterFns: { fuzzy: fuzzyFilter },
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
- [ ] Replace destructured row/cell/column/header methods with calls on the instance (for example, `row.getValue('name')`)
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
