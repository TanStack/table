---
title: Migrating to TanStack Table V9 (Solid)
---

## What's New in TanStack Table V9

TanStack Table V9 is a major release with significant internal architectural improvements while maintaining the core table logic you're familiar with. Here are the key changes:

### 1. Better Performance

- **Lower memory usage**: The core architecture now shares more behavior across table objects, with some large-table scenarios seeing up to 90% memory savings.
- **Faster client-side row models**: Sorting, filtering, and aggregation paths have improved algorithms and memoization, with many scenarios seeing up to 40-70% speed improvements.
- **Better column resizing performance**: Column resizing also gets significant performance improvements from the same architectural and memoization work.

### 2. State Management Overhaul

- **TanStack Store foundation**: State is backed by TanStack Store atoms with Solid-aware reactivity.
- **Solid-native reads**: Atom reads participate in Solid tracking when called inside JSX, `createMemo`, `createEffect`, or `table.Subscribe`.
- **External atoms**: Apps can own individual slices with atoms from `@tanstack/solid-store`.

### 3. Type-Safety Improvements

- **New and revamped type helpers**: New type helpers help define columns, custom filters, sorts, aggregations, column and table meta, shared table options and components, and more.
- **Per-table meta types**: `tableMeta`, `columnMeta`, and `filterMeta` slots let you type meta for a specific table instead of globally augmenting shared interfaces. **No more global declaration merging required!**
- **Feature-gated APIs**: APIs only exist when their feature is registered, and `tableFeatures()` validates feature prerequisites at the type level.

### 4. Tree Shaking and Extensibility

- **Import only the features you use**: Tables that only need sorting do not ship filtering, pagination, or other unused feature code.
- **Tree-shakeable row models and functions**: Row model factories and `filterFns` / `sortFns` / `aggregationFns` now live on `tableFeatures()`, so unused processing code can be dropped.
- **Custom features use the same system**: Your own feature plugins can register state, options, and APIs alongside the built-in features. See the [Custom Features Guide](./custom-features.md).

### 5. Composability

- **`tableOptions()`**: Compose reusable table configuration, including features, row models, and default options.
- **`createTableHook()`**: Define app-specific table factories with shared features, row models, defaults, and components.

### 6. New and Refreshed Features

- **New features**: `cellSelectionFeature` adds spreadsheet-style rectangular cell range selection, with drag, Shift-extend, and multiple disjoint ranges. See the [Cell Selection Guide](./cell-selection.md).
- **Cell and header spanning**: the new `cellSpanningFeature` merges body cells across rows and columns (`spanRows` / `spanColumns`, with span-aware cell selection), and header groups now compute `header.rowSpan` so shallow columns can span header rows. See the [Cell Spanning Guide](./cell-spanning.md).
- **More capable features**: Aggregation, Row Selection, Column Pinning, and Column Resizing have all been made more feature rich (multiple aggregation definitions per column, Shift range selection, logical `start`/`end` pinning, and more).
- **New core APIs**: New table and row APIs (like `table.getMaxSubRowDepth()`, `row.getDisplayIndex()`) round out the core feature set.

### The Good News: Most Upgrades Are Opt-in

- You can begin with `stockFeatures`, then audit down to explicit features.
- Most markup using `<For>` loops, `table.getHeaderGroups()`, and `table.getRowModel().rows` stays familiar.
- Feature APIs like `table.nextPage()`, `column.toggleSorting()`, and `row.toggleSelected()` remain the preferred way to change state.

The main migration is replacing `createSolidTable` with `createTable`, then moving feature and row-model setup into the v9 shape.

---

## Core Breaking Changes

### Entrypoint Rename

```tsx
// v8
import { createSolidTable } from '@tanstack/solid-table'

const table = createSolidTable(options)

// v9
import { createTable } from '@tanstack/solid-table'

const table = createTable(options)
```

### New Required `features` Table Option

In Table V9, you must explicitly declare which features your table uses. Features, Row Models, and Row Model processing "Fns" are defined on the new `features` table option.

```tsx
// Table V8
import {
  createSolidTable,
  getCoreRowModel,
  getSortedRowModel,
  sortingFns,
} from '@tanstack/solid-table'

const table = createSolidTable({
  columns,
  get data() {
    return data()
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  sortingFns,
})

// Table V9
import {
  createSortedRowModel,
  createTable,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/solid-table'

// All table options that concern including code modules (features, row models, Fns, etc.)
const features = tableFeatures({
  rowSortingFeature, // new - import and pass the feature you want to use
  sortedRowModel: createSortedRowModel(), // now row models are defined on the features object
  sortFns, // now Fns are defined on the features object
  // ...more features, row models, etc.
})

const table = createTable({
  features, // new required option
  columns,
  get data() {
    return data()
  },
})
```

Keep `features` and column definitions outside reactive component work when they are static.

#### Shortcut: Use `stockFeatures` for Table V8-like Behavior

`stockFeatures` is useful when you want a quick v8-like migration path before auditing features.

```tsx
import { createTable, stockFeatures } from '@tanstack/solid-table'

const table = createTable({
  features: stockFeatures,
  columns,
  get data() {
    return data()
  },
})
```

Use it as a migration shortcut, not as the preferred production end state.

#### Available Features

| Feature           | Import Name               |
| ----------------- | ------------------------- |
| Column Faceting   | `columnFacetingFeature`   |
| Column Filtering  | `columnFilteringFeature`  |
| Column Grouping   | `columnGroupingFeature`   |
| Column Ordering   | `columnOrderingFeature`   |
| Column Pinning    | `columnPinningFeature`    |
| Column Resizing   | `columnResizingFeature`   |
| Column Sizing     | `columnSizingFeature`     |
| Column Visibility | `columnVisibilityFeature` |
| Global Filtering  | `globalFilteringFeature`  |
| Row Aggregation   | `rowAggregationFeature`   |
| Row Expanding     | `rowExpandingFeature`     |
| Row Pagination    | `rowPaginationFeature`    |
| Row Pinning       | `rowPinningFeature`       |
| Row Selection     | `rowSelectionFeature`     |
| Row Sorting       | `rowSortingFeature`       |

### Row Model Factories

Row model factories now live inside `tableFeatures` alongside feature objects. Function registries (`filterFns`, `sortFns`, `aggregationFns`) are also passed as slots in `tableFeatures` rather than as arguments to the factory functions. Row model slots are type-checked, so each row model must be specified after its associated feature in the same `tableFeatures` call.

#### Migration Mapping

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

#### Full Migration Example

```tsx
// v8
import {
  createSolidTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  filterFns,
  sortingFns,
} from '@tanstack/solid-table'

const table = createSolidTable({
  columns,
  get data() {
    return data()
  },
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  filterFns,
  sortingFns,
})

// v9
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTable,
  filterFns,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/solid-table'

const features = tableFeatures({
  columnFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns,
  sortFns,
})

const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
})
```

#### Prefer Individual Fn Imports Over Full Registries

The `filterFns`, `sortFns`, and `aggregationFns` registry exports are now deprecated in favor of importing individual `filterFn_*`, `sortFn_*`, and `aggregationFn_*` functions and registering only the ones you use (or passing functions directly in column definitions with no registration at all). The full registries still work, but spreading them puts every built-in function in your bundle. Keep in mind that string names, including the default `'auto'`, only resolve functions you have registered.

```tsx
// Before: registers every built-in function
import { filterFns, sortFns } from '@tanstack/solid-table'

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
} from '@tanstack/solid-table'

const features = tableFeatures({
  // ...other features and row models
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
})
```

### Instance Methods Must Be Called on Their Instance

In v9, methods on rows, cells, columns, headers, and similar table objects are shared on the object's prototype instead of being created as arrow functions on each object. This improves memory usage, but it means destructuring those methods loses the `this` context they need to operate on the instance.

```tsx
// v8 - worked because getValue closed over the row object
const { getValue } = row
const value = getValue('name')

// v9 - call the method on the instance
const value = row.getValue('name')
```

This applies to row, cell, column, header, and related instance APIs, but not to the table instance itself. Audit code that destructures methods from table objects or passes them around as bare callbacks. Prefer calling them through the original object, for example `row.getValue('name')`, `cell.getContext()`, `column.getCanSort()`, or `header.getContext()`.

Because these methods now live on the prototype, they also do not appear as own properties in `Object.keys(instance)`, object spread, or `JSON.stringify`. A shallow clone like `{ ...row }` copies row data but does not copy row methods. The methods are still callable normally because JavaScript looks them up through the prototype chain.

---

## State Management Changes

Solid v9 uses table atoms backed by Solid primitives. Prefer narrow atom reads or Solid memos over broad whole-state reads.

| Surface                     | Use                                                                                           |
| --------------------------- | --------------------------------------------------------------------------------------------- |
| `table.atoms.<slice>.get()` | Narrow reactive reads inside Solid tracking scopes.                                           |
| `table.store.get()`         | Current full state snapshot. Use mostly for debug output or intentionally broad dependencies. |
| `table.Subscribe`           | A Solid render boundary whose child reads the atoms it needs.                                 |
| `table.baseAtoms.<slice>`   | Internal writable atoms. Prefer feature APIs or external atoms.                               |

### Accessing State

```tsx
// v8
const sorting = table.getState().sorting

// v9: narrow atom read
const sorting = table.atoms.sorting.get()

// v9: full snapshot
const tableState = table.store.get()
```

Use Solid primitives to derive reactive values:

```tsx
import { createMemo } from 'solid-js'

const pagination = createMemo(() => table.atoms.pagination.get())
const pageIndex = createMemo(() => pagination().pageIndex)
const tableStateJson = createMemo(() =>
  JSON.stringify(table.store.get(), null, 2),
)
```

Atom reads can also be used directly in JSX:

```tsx
<span>
  Page {table.atoms.pagination.get().pageIndex + 1} of {table.getPageCount()}
</span>
```

### Fine-grained Updates with `table.Subscribe`

`table.Subscribe` passes `table.atoms` to its child function. As with any Solid component, the child function body runs once and is untracked, so read atoms inside JSX expressions (or thunks called from JSX) for Solid to track them.

```tsx
<table.Subscribe>
  {(atoms) => <span>Page {atoms.pagination.get().pageIndex + 1}</span>}
</table.Subscribe>
```

### Controlled State

The v8-style `state` + `on[State]Change` controlled state patterns still work and remain convenient for simple integrations. For new v9 code, prefer owning state slices with external atoms (see [External Atoms](#external-atoms) below), which give you fine-grained subscriptions without mirroring state through signals. If you do control state with signals, use getters in `state` so Solid tracks the current signal values.

```tsx
import { createSignal } from 'solid-js'
import type { PaginationState, SortingState } from '@tanstack/solid-table'

const [sorting, setSorting] = createSignal<SortingState>([])
const [pagination, setPagination] = createSignal<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
  state: {
    get sorting() {
      return sorting()
    },
    get pagination() {
      return pagination()
    },
  },
  onSortingChange: setSorting,
  onPaginationChange: setPagination,
})
```

The v8-style top-level `onStateChange` callback is gone. Use per-slice `on[State]Change` handlers or external atoms.

If you want to lift or listen to any state change, set up a subscription to the `table.store`:

```tsx
const unsubscribe = table.store.subscribe((state) => {
  console.log(state)
})
```

### External Atoms

External atoms are useful when the app should own a table state slice outside one component.

```tsx
import { createAtom, useSelector } from '@tanstack/solid-store'
import type { PaginationState, SortingState } from '@tanstack/solid-table'

const sortingAtom = createAtom<SortingState>([])
const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

function MyTable() {
  const pagination = useSelector(paginationAtom)

  const table = createTable({
    features,
    columns,
    get data() {
      return data()
    },
    atoms: {
      sorting: sortingAtom,
      pagination: paginationAtom,
    },
  })

  return <span>Page {pagination().pageIndex + 1}</span>
}
```

Do not provide both `atoms.pagination` and `state.pagination`; the atom owns that slice.

---

## Feature-by-Feature Breaking Changes

### Sorting

Sorting-related APIs have been renamed for consistency:

| v8                   | v9                |
| -------------------- | ----------------- |
| `sortingFn`          | `sortFn`          |
| `sortingFns`         | `sortFns`         |
| `getSortingFn()`     | `getSortFn()`     |
| `getAutoSortingFn()` | `getAutoSortFn()` |
| `SortingFn`          | `SortFn`          |

### Column Pinning

V9 changes column pinning to use logical `start`/`end` terminology instead of the physical `left`/`right` terminology used in V8. In LTR languages/layouts, `start` usually corresponds to left and `end` to right; in RTL languages/layouts, `start` usually corresponds to right and `end` to left. There are no deprecated aliases.

| V8                                   | V9                                   |
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

The `enablePinning` option has also been split into separate options:

```tsx
// Table V8
enablePinning: true

// Table V9
enableColumnPinning: true
enableRowPinning: true
```

### Column Sizing vs. Column Resizing Split

Column resizing is now a separate feature and state slice.

```tsx
const features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
})
```

`columnSizingInfo` became `columnResizing`, and `onColumnSizingInfoChange` became `onColumnResizingChange`. The `setColumnSizingInfo()` API became `setColumnResizing()`.

### Grouping and Aggregation

Aggregation is now its own feature, independent from column grouping. `stockFeatures` still includes both, so tables using it need no feature-registration change. If you declare features explicitly, add `rowAggregationFeature` whenever columns use `aggregationFn`, `aggregatedCell`, `getAggregationValue`, or `cell.getIsAggregated`. Add `columnGroupingFeature` and `groupedRowModel` only when you also group rows.

```ts
const features = tableFeatures({
  rowAggregationFeature,
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

The old per-function choice between `childRows` and `leafRows` is replaced by a single depth-selected `context.rows`, controlled by the `maxAggregationDepth` column option. The default (`0`) preserves V8's direct-child grouped aggregation; use `Infinity` to aggregate terminal leaf rows.

`column.getAggregationValue()` now takes a single options object instead of positional arguments:

```ts
// Table V8/earlier V9 betas
column.getAggregationValue(rows, maxDepth)

// Current V9
column.getAggregationValue({ rows, maxDepth })
```

`column.getAggregationFn()` is now `column.getAggregationFns()` because a column can run multiple definitions, and the old callable `AggregationFn`/`CreatedAggregationFn` types are replaced by `AggregationFnDef`.

See the [Grouping Guide](./grouping) and the [Aggregation Guide](./aggregation) for full documentation of the new capabilities.

### Row Selection

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

### Row and Internal API Changes

Some row APIs have changed from private to public:

| Table V8                                 | Table V9                               |
| ---------------------------------------- | -------------------------------------- |
| `row._getAllCellsByColumnId()` (private) | `row.getAllCellsByColumnId()` (public) |

If you were accessing this internal API, you can now use it without the underscore prefix.

All other internal APIs prefixed with `_` have been removed. If you were using any of these, use their public equivalents:

- Removed: `table._getPinnedRows()`
- Removed: `table._getFacetedRowModel()`
- Removed: `table._getFacetedMinMaxValues()`
- Removed: `table._getFacetedUniqueValues()`

---

## Column Helper Changes

Column helpers and column types now include `TFeatures` first.

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
const columns: Array<ColumnDef<typeof features, Person>> = columnHelper.columns(
  [
    columnHelper.accessor('age', {
      header: 'Age',
      sortFn: 'alphanumeric',
    }),
  ],
)
```

Use `columnHelper.columns([...])` to keep `TValue` inference across nested column definitions.

---

## Rendering Changes

Replace `flexRender(def, context)` calls with `FlexRender`.

```tsx
// v8
<th>{flexRender(header.column.columnDef.header, header.getContext())}</th>

// v9
<th>
  <FlexRender header={header} />
</th>
```

The table instance also exposes the same component:

```tsx
<table.FlexRender header={header} />
<table.FlexRender cell={cell} />
<table.FlexRender footer={footer} />
```

---

## The `tableOptions()` Utility

`tableOptions()` lets you compose reusable option fragments with type inference.

```tsx
import { tableOptions } from '@tanstack/solid-table'

const baseOptions = tableOptions({
  features,
  defaultColumn: {
    minSize: 40,
  },
})

const table = createTable({
  ...baseOptions,
  columns,
  get data() {
    return data()
  },
})
```

---

## `createTableHook`: Composable Table Patterns

`createTableHook` creates shared Solid table helpers.

```tsx
import { createTableHook } from '@tanstack/solid-table'

const { createAppTable, createAppColumnHelper } = createTableHook({
  features,
})

const columnHelper = createAppColumnHelper<Person>()

const table = createAppTable({
  columns,
  get data() {
    return data()
  },
})
```

See the [Composable Tables Guide](./composable-tables) for complete patterns.

---

## TypeScript Changes Summary

### Type Generics

Use `TFeatures` as the first generic:

```tsx
ColumnDef<typeof features, Person>
Column<typeof features, Person>
Row<typeof features, Person>
Table<typeof features, Person>
```

### Using `typeof features`

```tsx
const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
})

const columnHelper = createColumnHelper<typeof features, Person>()
```

### Using `StockFeatures`

```tsx
import type { StockFeatures } from '@tanstack/solid-table'

type PersonColumn = ColumnDef<StockFeatures, Person>
```

### `TableMeta`/`ColumnMeta` Typing Changes

No more declaration merging required! (Although it still works if you want to keep using it)

Global declaration merging works exactly like it did in v8. The only change you need to make is updating the generics shape: both interfaces now take `TFeatures` as the first type parameter.

```tsx
declare module '@tanstack/solid-table' {
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

### `FilterFns`/`SortFns`/`AggregationFns`/`FilterMeta` Augmentation Replaced by Registry Slots

In v8, making a custom function usable as a string reference (like `filterFn: 'fuzzy'`) required `declare module` augmentation of the `FilterFns` interface, and typing filter meta required augmenting `FilterMeta`. In v9, registering the function in the matching registry slot does both jobs with no global augmentation:

```tsx
// v8
declare module '@tanstack/solid-table' {
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

Prefer explicit object row types:

```tsx
type Person = {
  firstName: string
  lastName: string
  age: number
}
```

---

## Migration Checklist

- [ ] Replace `createSolidTable` with `createTable`.
- [ ] Define `features` using `tableFeatures()` (or use `stockFeatures`)
- [ ] Move every `get*RowModel` factory into `tableFeatures` as a slot (e.g. `sortedRowModel: createSortedRowModel()`).
- [ ] Remove `getCoreRowModel`; the core row model is automatic.
- [ ] Move `sortFns`, `filterFns`, and `aggregationFns` into `tableFeatures` as slots (not as factory arguments).
- [ ] Convert custom aggregation callables to `constructAggregationFn({ aggregate, merge? })` definitions.
- [ ] Replace destructured row/cell/column/header methods with calls on the instance (for example, `row.getValue('name')`).
- [ ] Rename `sortingFn` to `sortFn`.
- [ ] Use getters for reactive `data` and controlled `state` slices.
- [ ] Replace `table.getState()` reads with `table.atoms.<slice>.get()` or `table.store.get()`.
- [ ] Replace top-level `onStateChange` with per-slice handlers or external atoms.
- [ ] Add `typeof features` to column helpers and table types.
- [ ] Replace `declare module` augmentation of `FilterFns`/`SortFns`/`AggregationFns` with registry-slot registration, and `FilterMeta` augmentation with the `filterMeta` slot.
- [ ] Replace `flexRender(...)` calls with `<FlexRender />`.
- [ ] Audit `stockFeatures` before production.

---

## Examples

- [Basic createTable](../examples/basic-use-table)
- [Basic External Atoms](../examples/basic-external-atoms)
- [Basic External State](../examples/basic-external-state)
- [With TanStack Query](../examples/with-tanstack-query)
- [Sorting](../examples/sorting)
- [Pagination](../examples/pagination)
- [Composable Tables](../examples/composable-tables)
