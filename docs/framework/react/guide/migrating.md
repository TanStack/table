---
title: Migrating to TanStack Table V9 (React)
---

> [!IMPORTANT]
> `v9.0.0-beta.48` and `v9.0.0-beta.49` introduces breaking aggregation changes. `columnGroupingFeature` no longer provides aggregation options or APIs. Tables that group rows and calculate aggregate values must now register both `columnGroupingFeature` and `aggregationFeature`. Grouping-only tables can register only `columnGroupingFeature`, while grand totals or other aggregation without grouping can register only `aggregationFeature`. `stockFeatures` already contains both. If you use an explicit feature list, add `aggregationFeature` anywhere you use `aggregationFns`, `aggregationFn`, `aggregatedCell`, `cell.getIsAggregated()`, or `column.getAggregationValue()`. Aggregation definitions, row-depth selection, and the `getAggregationValue` signature also changed; see [Aggregation Feature Split](#aggregation-feature-split), the [Grouping Guide](./grouping), and the [Aggregation Guide](./aggregation).

> [!NOTE]
> `v9.0.0-beta.38` renames column pinning from physical `left`/`right` terminology to logical `start`/`end` terminology. These are logical positions: in LTR languages/layouts, `start` usually corresponds to left and `end` to right; in RTL languages/layouts, `start` usually corresponds to right and `end` to left. If you migrated on an earlier beta, update `columnPinning.left` to `columnPinning.start`, `columnPinning.right` to `columnPinning.end`, `column.pin('left' | 'right')` to `column.pin('start' | 'end')`, and `getLeft*` / `getRight*` table and row APIs to `getStart*` / `getEnd*`. See the [Column Pinning](#column-pinning) section below for the full mapping.

> [!NOTE]
> `v9.0.0-beta.10` introduces a breaking change in how row models are defined in order to bring increased type-safety features. Row model factories and function registries now live as slots on the `features` object instead of a separate `rowModels` option, and the factories no longer take arguments. If you migrated on an earlier beta, see the [Row Model Factories](#row-model-factories) section below for the new shape.

---

## What's New in TanStack Table V9

TanStack Table V9 is a major release with significant internal architectural improvements while maintaining the core table logic you're familiar with. Here are the key changes:

### 1. Better Performance

- **Lower memory usage**: The core architecture now shares more behavior across table objects, with some large-table scenarios seeing up to 90% memory savings.
- **Faster client-side row models**: Sorting, filtering, and aggregation paths have improved algorithms and memoization, with many scenarios seeing up to 40-70% speed improvements.
- **Better column resizing performance**: Column resizing also gets significant performance improvements from the same architectural and memoization work.

### 2. State Management Overhaul (Backward Compatible)

- **React Compiler compatibility**: The state system is built on [TanStack Store](https://tanstack.com/store), giving the table a reactive foundation that works correctly under the React Compiler.
- **Fine-grained subscriptions**: State slices can be read independently through `table.atoms`, `table.store`, `table.state`, selectors, or `table.Subscribe`.
- **External state or atoms**: You can still use `state` plus `on[State]Change`, or own individual slices with writable atoms via the new `atoms` option.

### 3. Type-Safety Improvements

- **New and revamped type helpers**: New type helpers help define columns, custom filters, sorts, aggregations, column and table meta, shared table options and components, and more!
- **Per-table meta types**: `tableMeta`, `columnMeta`, and `filterMeta` slots let you type meta for a specific table instead of globally augmenting shared interfaces. **No more global declaration merging required!**
- **Feature-gated APIs**: APIs only exist when their feature is registered, and `tableFeatures()` validates feature prerequisites at the type level.

### 4. Tree Shaking and Extensibility

- **Import only the features you use**: Tables that only need sorting do not ship filtering, pagination, or other unused feature code. Start with 5kb of bundled JS and only bundle the features you need.
- **Tree-shakeable row models and functions**: Row model factories and `filterFns` / `sortFns` / `aggregationFns` now live on `tableFeatures()`, so unused processing code can be dropped.
- **Custom features use the same system**: Your own feature plugins can register state, options, and APIs alongside the built-in features. See the [Custom Features Guide](./custom-features.md).

### 5. Composability

- `tableOptions`: Compose reusable table configuration, including features, row models, and default options.
- `createTableHook`: Create custom table hooks with pre-bound features and components when you need a reusable app-level table pattern. See the [composable-tables (createTableHook) guide](./composable-tables.md).

### The Good News: Most Upgrades Are Opt-in

While Table V9 is a significant upgrade, **you don't have to adopt everything at once**:

- **Don't want to optimize renders yet?** Do nothing special. The default selector selects all registered state, so rendering works like Table V8.
- **Don't want to think about tree-shaking?** Import `stockFeatures` to include all features, just like Table V8.
- **Table markup is largely unchanged.** How you render `<table>`, `<thead>`, `<tr>`, `<td>`, etc. remains the same.

The main change is **how you define a table** with the `useTable` hook, specifically the new `features` option and where row model factories are registered.

---

## Quick Legacy Migration

Need to migrate incrementally? We are providing a temporary shortcut with the `useLegacyTable` hook. It accepts the Table V8-style API while using Table V9 under the hood. **This is deprecated** and intended only as a temporary migration aid. It includes all features by default, resulting in a larger bundle size than you even got with Table V8.

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

The rest of this guide focuses on migrating to the full Table V9 API and taking advantage of its features.

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

### Hook Rename

The hook name has been simplified to be consistent across all TanStack libraries:

```tsx
// Table V8
import { useReactTable } from '@tanstack/react-table'
const table = useReactTable(options)

// Table V9
import { useTable } from '@tanstack/react-table'
const table = useTable(options)
```

### Instance Methods Must Be Called on Their Instance

In Table V9, methods on rows, cells, columns, headers, and similar table objects are shared on the object's prototype instead of being created as arrow functions on each object. This improves memory usage, but it means destructuring those methods loses the `this` context they need to operate on the instance.

```tsx
// Table V8 - worked because getValue closed over the row object
const { getValue } = row
const value = getValue('name')

// Table V9 - call the method on the instance
const value = row.getValue('name')
```

This applies to row, cell, column, header, and related instance APIs, but not to the table instance itself. Audit code that destructures methods from table objects or passes them around as bare callbacks. Prefer calling them through the original object, for example `row.getValue('name')`, `cell.getContext()`, `column.getCanSort()`, or `header.getContext()`.

Because these methods now live on the prototype, they also do not appear as own properties in `Object.keys(instance)`, object spread, or `JSON.stringify`. A shallow clone like `{ ...row }` copies row data but does not copy row methods. The methods are still callable normally because JavaScript looks them up through the prototype chain.

### New Required `features` Table Option

In Table V9, you must explicitly declare which features your table uses. Features, Row Models, and Row Model processing "Fns" are defined on the new `features` table option.

In Table V8, all features were bundled and included in the `useReactTable` hook. In Table V9, you import only what you need.

```tsx
// Table V8
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  sortingFns,
} from '@tanstack/react-table'

const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  sortingFns,
})

// Table V9
import {
  useTable,
  tableFeatures,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
} from '@tanstack/react-table'

// All table options that concern including code modules (features, row models, Fns, etc.)
const features = tableFeatures({
  rowSortingFeature, // new - import and pass the feature you want to use
  sortedRowModel: createSortedRowModel(), // now row models are defined on the features object
  sortFns, // now Fns are defined on the features object
  // ...more features, row models, etc.
})

const table = useTable({
  features, // new required option
  columns,
  data,
})
```

---

#### Shortcut: Use `stockFeatures` for Table V8-like Behavior

If you want all features without having to think about it (like Table V8), import `stockFeatures`:

```tsx
import { useTable, stockFeatures } from '@tanstack/react-table'

const table = useTable({
  features: stockFeatures, // All features included - just like Table V8 (though larger bundle now)
  columns,
  data,
})
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

Aggregation row selection is now depth-based and shared by every definition on
a column. `maxAggregationDepth` defaults to `0` (the supplied root rows); use
`1` for direct sub-rows or `Infinity` for terminal rows. An explicit
`column.getAggregationValue({ rows, maxDepth })` call can override the column
default.

`getAggregationValue` now has one options-object signature. Calls without
arguments are unchanged, but positional row and depth arguments must be moved
into the object:

```ts
// Table V8/earlier V9 betas
column.getAggregationValue(rows, maxDepth)

// Current V9
column.getAggregationValue({ rows, maxDepth })
```

All built-in definitions on a column now consume the same depth-selected
`context.rows` frontier. This replaces the old per-function choice between
`childRows` and `leafRows`. The default depth `0` preserves direct-child
grouped aggregation; set `maxAggregationDepth: Infinity` to aggregate terminal
rows. Custom definitions can still inspect grouped `context.subRows`, and
`merge` receives matching `subRowResults` for nested groups.

`table.getMaxSubRowDepth()` returns the deepest structural depth in the core
row model. For example, use `Math.max(0, table.getMaxSubRowDepth() - 1)` as
`maxDepth` to target one level before the maximum structural depth; shorter
branches still contribute their deepest available row. Default no-row calls
are cached; calls with `options.rows` are recomputed because the caller owns
that array.

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

Row models are the functions that process your data (filtering, sorting, pagination, etc.). In Table V9, row model factories live on the `tableFeatures({})` call rather than a separate `rowModels` option. The processing function registries (`filterFns`, `sortFns`, `aggregationFns`) are also registered on features. Row model slots are type-checked, so each row model must be specified after its associated feature in the same `tableFeatures` call.

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

### Key Change: Row Model Factories and Fns Registries Move to `tableFeatures`

Row model factories and their processing function registries are now slots on `tableFeatures`. This enables better tree-shaking: you only bundle the row model code and filter/sort/aggregation functions you actually register.

```tsx
import {
  tableFeatures,
  createFilteredRowModel,
  createSortedRowModel,
  createGroupedRowModel,
  filterFns, // Built-in filter functions
  sortFns, // Built-in sort functions
  aggregationFns, // Built-in aggregation functions
} from '@tanstack/react-table'

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

const table = useTable({
  features,
  columns,
  data,
})
```

### Prefer Individual Fn Imports Over Full Registries

The `filterFns`, `sortFns`, and `aggregationFns` registry exports are now deprecated in favor of importing individual `filterFn_*`, `sortFn_*`, and `aggregationFn_*` functions and registering only the ones you use (or passing functions directly in column definitions with no registration at all). The full registries still work, but spreading them puts every built-in function in your bundle. Keep in mind that string names, including the default `'auto'`, only resolve functions you have registered.

```tsx
// Before: registers every built-in function
import { filterFns, sortFns } from '@tanstack/react-table'

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
} from '@tanstack/react-table'

const features = tableFeatures({
  // ...other features and row models
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
})
```

---

## State Management Changes

Table V9's state system is built on [TanStack Store](https://tanstack.com/store) and exposes three read surfaces on the table instance:

| Surface               | Type                                                                                                             | When to use                                                                                                                                                                           |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `table.state`         | `TSelected` (full registered table state by default, or the shape returned from your custom `useTable` selector) | The most ergonomic read surface inside a component rendered by `useTable`.                                                                                                            |
| `table.store`         | `ReadonlyStore<TableState>`                                                                                      | A flat, framework-agnostic store of the entire table state. Use `table.store.state` for one-off reads, or pair with `useSelector` / `table.Subscribe` for fine-grained subscriptions. |
| `table.atoms.<slice>` | `ReadonlyAtom<TableState[slice]>`                                                                                | A per-slice readonly atom. Subscribe to a single slice (e.g. `table.atoms.sorting`) when you want the narrowest possible re-render surface.                                           |

Writable counterparts (mostly internal):

| Surface                   | Type                         | When to use                                                                                                                                    |
| ------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `table.baseAtoms.<slice>` | `Atom<TableState[slice]>`    | The library's internal write target. You generally don't touch these directly; use `table.setSorting(...)`, `table.setPagination(...)`, etc.   |
| `options.atoms`           | `Partial<{ [slice]: Atom }>` | Pass in your own writable atom for any slice to take ownership of that state externally. See [External Atoms](#external-atoms-advanced) below. |

### Accessing State

In Table V8, you accessed state via `table.getState()`. In Table V9, state is accessed differently:

```tsx
// Table V8
const state = table.getState()
const { sorting, pagination } = table.getState()

// Table V9 (RECOMMENDED) - via table.state (full selected state by default)
const table = useTable({
  features,
  columns,
  data,
})
const { sorting, pagination } = table.state

// Table V9 - via the store (full state)
const fullState = table.store.state
const { sorting, pagination } = table.store.state

// Table V9 - via table.state with a custom selector
const selectedTable = useTable(options, (state) => ({
  sorting: state.sorting,
  pagination: state.pagination,
}))
// Now selectedTable.state only contains sorting and pagination
const { sorting, pagination } = selectedTable.state

// Table V9 - via a single slice atom (framework-agnostic, ideal for fine-grained subscriptions)
const sorting = table.atoms.sorting.get()
```

#### onStateChange Table Option Removed

The `onStateChange` table option was removed in Table V9, although individual `on[State]Change` handlers are still available for specific state slices.

If you want to lift or listen to any state change, you can set up a subscription to the `table.store`

```tsx
const unsubscribe = table.store.subscribe((state) => {
  console.log(state)
})
```

### Optimized Rendering with `table.Subscribe`

The biggest state management improvement is `table.Subscribe`, which enables fine-grained reactivity:

```tsx
function MyTable() {
  const table = useTable(
    {
      features,
      columns,
      data,
    },
    (state) => ({}), // default is state => state - this opts out of all default re-renders in favor of manual subscriptions down below
  )

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

### Default: Table V8-Style Full State Subscription

The default selector already gives Table V8-style behavior where the component re-renders on any registered table state change:

```tsx
const table = useTable({
  features,
  columns,
  data,
})

// table.state contains the full registered state
const { sorting, pagination, columnFilters } = table.state
```

Passing `(state) => state` is equivalent to the default and is no longer necessary. Pass a custom selector when you want `table.state` to contain only specific slices, or pass `() => null` and use `table.Subscribe` lower in the tree when the parent should not re-render for table state changes.

### Controlled State

The Table V8-style `state` + `on[State]Change` controlled state patterns still work and remain convenient for simple integrations. For new Table V9 code, prefer owning state slices with external atoms (see [External Atoms](#external-atoms-advanced) below), which give you fine-grained subscriptions without mirroring state through React:

```tsx
const [sorting, setSorting] = useState<SortingState>([])
const [pagination, setPagination] = useState<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const table = useTable({
  features,
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
  // Re-renders only when pagination changes. Sorting, filtering, selection, etc. are all ignored.
  const pagination = useSelector(table.atoms.pagination)

  return <div>Page {pagination.pageIndex + 1}</div>
}
```

This is the narrowest subscription surface available. Compared to `table.Subscribe`, which selects from the full `table.store.state`, reading a per-slice atom skips even constructing the full state snapshot on change.

> **When to reach for** `table.atoms` **vs.** `table.Subscribe`**:** Both give you fine-grained re-renders. `table.Subscribe` is nicer when you want to project multiple slices into a single rendered block. `table.atoms.<slice>` is nicer when a component only cares about one slice, or when you're passing a subscription source to non-table code.

### External Atoms (Advanced)

For advanced patterns (sharing a slice across tables, integrating with atom-based libraries, or wiring a slice up to persistence), Table V9 lets you **own individual state slices yourself** by passing writable atoms via the new `atoms` option. See the [Basic External Atoms example](../examples/basic-external-atoms).

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

const features = tableFeatures({ rowSortingFeature, rowPaginationFeature })

function MyTable({ data, columns }) {
  // Create stable external atoms for the slices you want to own.
  const sortingAtom = useCreateAtom<SortingState>([])
  const paginationAtom = useCreateAtom<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Subscribe to each atom independently for fine-grained reactivity.
  const sorting = useSelector(sortingAtom)
  const pagination = useSelector(paginationAtom)

  const table = useTable({
    features,
    columns,
    data,
    // Per-slice external atoms. The library writes directly to these,
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
- **Writes**: Library writes (e.g. `table.setSorting(...)`, `column.toggleSorting()`) go directly to your external atom's `set()`. You do **not** need a corresponding `onSortingChange` handler; owning the atom is the subscription.
- **Precedence**: If you pass both `options.atoms[key]` and `options.state[key]`, the atom wins. If you pass neither, Table V9 falls back to its internal `baseAtoms[key]` (Table V8-style self-managed state).
- **Reset**: `table.reset()` does **not** clear external atoms. You own them, so you decide when to reset. Call `myAtom.set(defaultValue)` yourself if needed.

#### When to Choose External Atoms vs. Controlled State

| Pattern                                                 | Use when                                                                                                                                                      |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Internal state (no `state`, no `atoms`)                 | Simplest path; the table manages everything.                                                                                                                  |
| `state` + `on*Change` (Table V8-style controlled state) | You want your framework's idiomatic state (React `useState`, signals, etc.) to own the slice.                                                                 |
| `atoms` option                                          | You want atom-based ergonomics (cross-component subscriptions, `useSelector`, `useAtom`) without the overhead of mirroring between React state and the table. |

---

## Column Helper Changes

The `createColumnHelper` function now requires a `TFeatures` type parameter in addition to `TData`:

```tsx
// Table V8
import { createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper<Person>()

// Table V9
import {
  createColumnHelper,
  tableFeatures,
  rowSortingFeature,
} from '@tanstack/react-table'

const features = tableFeatures({ rowSortingFeature })
const columnHelper = createColumnHelper<typeof features, Person>()
```

### New `columns()` Helper Method

Table V9 adds a `columns()` helper for better type inference when wrapping column arrays. In Table V8, `TValue` wasn't always type-safe, especially with group columns, where nested column types could be lost or widened. The `columns()` helper uses variadic tuple types to preserve each column's individual `TValue` type, so `info.getValue()` and cell renderers stay correctly typed throughout nested structures:

```tsx
const columnHelper = createColumnHelper<typeof features, Person>()

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

---

## Rendering Changes

### `flexRender` Function

The `flexRender` function still exists and works the same way:

```tsx
import { flexRender } from '@tanstack/react-table'

// Still works in Table V9
flexRender(cell.column.columnDef.cell, cell.getContext())
flexRender(header.column.columnDef.header, header.getContext())
```

### New `FlexRender` and `<table.FlexRender />` Component

Table V9 adds a cleaner component-based approach attached to the table instance:

```tsx
const table = useTable({ /* ... */ })

// Instead of:
{flexRender(header.column.columnDef.header, header.getContext())}

// You can use:
<table.FlexRender header={header} />
<table.FlexRender cell={cell} />
<table.FlexRender footer={footer} />
// or
import { FlexRender } from '@tanstack/react-table'
<FlexRender header={header} />
<FlexRender cell={cell} />
<FlexRender footer={footer} />
```

This should be way more convenient than the old `flexRender` function!

---

## The `tableOptions()` Utility

The `tableOptions()` helper provides type-safe composition of table options. It's useful for creating reusable partial configurations that can be spread into your table setup.

### Basic Usage

```tsx
import {
  tableOptions,
  tableFeatures,
  rowSortingFeature,
} from '@tanstack/react-table'

const features = tableFeatures({ rowSortingFeature })

// Create a reusable options object with features pre-configured
const baseOptions = tableOptions({
  features,
  debugTable: process.env.NODE_ENV === 'development',
})

// Use in your table; columns, data, and other options can be added
const table = useTable({
  ...baseOptions,
  columns,
  data,
})
```

### Composing Partial Options

`tableOptions()` allows you to omit certain required fields (like `data`, `columns`, or `features`) when creating partial configurations:

```tsx
// Row model factories and fns registries are registered on the features object
const features = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  sortFns,
  filterFns,
})

// Partial options without data or columns
const featureOptions = tableOptions({
  features,
  getRowId: (row) => row.id,
  manualPagination: true,
  manualSorting: true,
  manualFiltering: true,
})

// Another partial without features (inherits from spread)
const paginationDefaults = tableOptions({
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
const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
})

const sharedOptions = tableOptions({ features })

const { useAppTable } = createTableHook(sharedOptions)
```

---

## `createTableHook`: Composable Table Patterns

**This is an advanced, optional feature.** You don't need to use `createTableHook`; `useTable` is sufficient for most use cases. If you're familiar with [TanStack Form](https://tanstack.com/form)'s `createFormHook`, `createTableHook` works almost the same way: it creates a custom hook with pre-bound configuration that you can reuse across many tables.

For applications with multiple tables sharing the same configuration, `createTableHook` lets you define features (including row model factories), and reusable components once:

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

// Features and row model factories defined once
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

export const {
  useAppTable,
  createAppColumnHelper,
  useTableContext,
  useCellContext,
  useHeaderContext,
} = createTableHook({
  features,

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
    // features (including row model factories) already configured!
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
// Table V8
enablePinning: true

// Table V9
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

In Table V8, column sizing and resizing were combined in a single feature. In Table V9, they've been split into separate features for better tree-shaking.

| Table V8                          | Table V9                                        |
| --------------------------------- | ----------------------------------------------- |
| `ColumnSizing` (combined feature) | `columnSizingFeature` + `columnResizingFeature` |
| `columnSizingInfo` state          | `columnResizing` state                          |
| `setColumnSizingInfo()`           | `setColumnResizing()`                           |
| `onColumnSizingInfoChange` option | `onColumnResizingChange` option                 |

If you only need column sizing (fixed widths) without interactive resizing, you can import just `columnSizingFeature`. If you need drag-to-resize functionality, import both:

```tsx
import {
  columnSizingFeature,
  columnResizingFeature,
} from '@tanstack/react-table'

const features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature, // Only if you need interactive resizing
})
```

### Sorting API Renames

Sorting-related APIs have been renamed for consistency:

| Table V8                          | Table V9                 |
| --------------------------------- | ------------------------ |
| `sortingFn` (column def option)   | `sortFn`                 |
| `column.getSortingFn()`           | `column.getSortFn()`     |
| `column.getAutoSortingFn()`       | `column.getAutoSortFn()` |
| `SortingFn` type                  | `SortFn` type            |
| `SortingFns` interface            | `SortFns` interface      |
| `sortingFns` (built-in functions) | `sortFns`                |

Update your column definitions:

```tsx
// Table V8
const columns = [
  {
    accessorKey: 'name',
    sortingFn: 'alphanumeric', // or custom function
  },
]

// Table V9
const columns = [
  {
    accessorKey: 'name',
    sortFn: 'alphanumeric', // or custom function
  },
]
```

### Row API Changes

Some row APIs have changed from private to public:

| Table V8                                 | Table V9                               |
| ---------------------------------------- | -------------------------------------- |
| `row._getAllCellsByColumnId()` (private) | `row.getAllCellsByColumnId()` (public) |

If you were accessing this internal API, you can now use it without the underscore prefix.

### Row Selection API Changes

> [!WARNING]
> **Minor breaking change:** `row.getToggleSelectedHandler()` now enables inclusive Shift range selection by default when `rowSelectionFeature` is enabled. Existing checkboxes or rows wired through this handler establish an anchor on an ordinary interaction and select or deselect the current display-order range on a Shift interaction. Direct `row.toggleSelected()` calls are unchanged.
>
> Set `enableRowRangeSelection: false` to preserve the previous non-range handler behavior. The handler must receive an event that exposes Shift directly or through `nativeEvent`; see [Shift Range Selection](./row-selection.md#shift-range-selection).

The "some rows selected" checks were simplified to mean "at least one row is selected":

| API                                 | Table V8                                            | Table V9                                      |
| ----------------------------------- | --------------------------------------------------- | --------------------------------------------- |
| `table.getIsSomeRowsSelected()`     | `true` when some but not all rows are selected      | `true` when at least one row is selected      |
| `table.getIsSomePageRowsSelected()` | `true` when some but not all page rows are selected | `true` when at least one page row is selected |

In Table V8 these returned `false` once every row was selected; in Table V9 they stay `true`. If you use them to drive an indeterminate "select all" checkbox, gate the indeterminate state on the matching all-selected check so it clears at full selection:

`getIsSomeRowsSelected() && !getIsAllRowsSelected()`

---

## TypeScript Changes Summary

### Type Generics

Most types now require a `TFeatures` parameter:

```tsx
// Table V8
type Column<TData>
type ColumnDef<TData>
type Table<TData>
type Row<TData>
type Cell<TData, TValue>

// Table V9
type Column<TFeatures, TData, TValue>
type ColumnDef<TFeatures, TData, TValue>
type Table<TFeatures, TData>
type Row<TFeatures, TData>
type Cell<TFeatures, TData, TValue>
```

### Using `typeof features`

The easiest way to get the `TFeatures` type is with `typeof`:

```tsx
const features = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
})

// Use typeof to get the type
type MyFeatures = typeof features

const columns: ColumnDef<typeof features, Person>[] = [...]

function Filter({ column }: { column: Column<typeof features, Person, unknown> }) {
  // ...
}
```

### Using `StockFeatures`

If using `stockFeatures` with `useTable`, use the `StockFeatures` type:

```tsx
import type { StockFeatures, ColumnDef } from '@tanstack/react-table'

const columns: ColumnDef<StockFeatures, Person>[] = [...]
```

### `TableMeta`/`ColumnMeta` Typing Changes

No more declaration merging required! (Although it still works if you want to keep using it)

Global declaration merging to extend `TableMeta` or `ColumnMeta` works exactly like it did in Table V8. The only change you need to make is updating the generics shape: both interfaces now take `TFeatures` as the first type parameter.

```tsx
// Table V8
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    customProperty: string
  }
}

// Table V9 - TFeatures is now the first parameter
declare module '@tanstack/react-table' {
  interface ColumnMeta<TFeatures, TData, TValue> {
    customProperty: string
  }
}
```

That's all that's required if you want to keep declaring meta types globally.

Optionally, Table V9 also adds a new way to declare meta types **per-table** without declaration merging. You can use type-only `tableMeta`/`columnMeta` slots on the `features` option, which only affect tables created with that `features` object:

```tsx
const features = tableFeatures({
  rowSortingFeature,
  columnMeta: metaHelper<{ customProperty: string }>(),
})
```

See the new [Table and Column Meta Guide](../../../guide/table-and-column-meta) for full details on both approaches.

### `FilterFns`/`SortFns`/`AggregationFns`/`FilterMeta` Augmentation Replaced by Registry Slots

In Table V8, making a custom function usable as a string reference (like `filterFn: 'fuzzy'`) required `declare module` augmentation of the `FilterFns` interface, and typing filter meta required augmenting `FilterMeta`. In Table V9, registering the function in the matching registry slot does both jobs with no global augmentation:

```tsx
// Table V8
declare module '@tanstack/react-table' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

// Table V9 - register in the slot; the key becomes a valid string value
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

```tsx
// Table V8 - very permissive
type RowData = unknown

// Table V9 - must be a record or array
type RowData = Record<string, any> | Array<any>
```

This change improves type safety. If you were passing unusual data types, ensure your data conforms to `Record<string, any>` or `Array<any>`.

---

## Migration Checklist

- [ ] Update import: `useReactTable` → `useTable`
- [ ] Define `features` using `tableFeatures()` (or use `stockFeatures`)
- [ ] If aggregating, add `aggregationFeature`; add `columnGroupingFeature` separately only when grouping rows
- [ ] Convert custom aggregation callables to `constructAggregationFn({ aggregate, merge? })` definitions
- [ ] Migrate `get*RowModel()` options to `tableFeatures` slots (e.g. `filteredRowModel: createFilteredRowModel()`)
- [ ] Register `filterFns` / `sortFns` / `aggregationFns` registries as slots on `tableFeatures` (row model factories no longer take arguments)
- [ ] Replace `declare module` augmentation of `FilterFns`/`SortFns`/`AggregationFns` with registry-slot registration, and `FilterMeta` augmentation with the `filterMeta` slot
- [ ] Update TypeScript types to include `TFeatures` generic
- [ ] Update state access: `table.getState()` → `table.store.state` or `table.state`
- [ ] Update `createColumnHelper<TData>()` → `createColumnHelper<TFeatures, TData>()`
- [ ] Replace `enablePinning` with `enableColumnPinning`/`enableRowPinning` if used
- [ ] Rename `sortingFn` → `sortFn` in column definitions
- [ ] Split column sizing/resizing: use both `columnSizingFeature` and `columnResizingFeature` if needed
- [ ] Rename `columnSizingInfo` state → `columnResizing` (and related options)
- [ ] If you use `TableMeta`/`ColumnMeta` declaration merging, add the `TFeatures` generic to your augmentations (optionally, switch to the per-table `tableMeta`/`columnMeta` feature slots)
- [ ] Replace destructured row/cell/column/header methods with calls on the instance (for example, `row.getValue('name')`)
- [ ] (Optional) Add `table.Subscribe` for render optimizations
- [ ] (Optional) Subscribe to individual slices via `table.atoms.<slice>` + `useSelector` for the narrowest re-renders
- [ ] (Optional) Pass writable atoms via the new `atoms` option to own specific state slices externally
- [ ] (Optional) Use `tableOptions()` for composable configurations
- [ ] (Optional) Migrate to `createTableHook` for reusable table patterns

---

## Examples

Check out these examples to see Table V9 patterns in action:

- [Basic useTable](../examples/basic-use-table) - Simple table with the new `useTable` hook
- [Basic useLegacyTable](../examples/basic-use-legacy-table) - Migration example using `useLegacyTable`
- [Basic useAppTable](../examples/basic-use-app-table) - Using `createTableHook`
- [Basic External State](../examples/basic-external-state) - Classic `state` + `on*Change` controlled state
- [Basic External Atoms](../examples/basic-external-atoms) - Owning state slices with `useCreateAtom` + the `atoms` option
- [Filters](../examples/filters) - Filtering with the new API
- [Sorting](../examples/sorting) - Sorting with the new API
- [Composable Tables](../examples/composable-tables) - Advanced `createTableHook` patterns
- [Kitchen Sink](../examples/kitchen-sink) - A comprehensive example of all features
