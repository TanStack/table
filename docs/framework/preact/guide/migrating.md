---
title: Migrating to TanStack Table V9 (Preact)
---

> [!NOTE]
> `v9.0.0-beta.10` introduces a breaking change in how row models are defined in order to bring increased type-safety features. Row model factories and function registries now live as slots on the `features` object instead of a separate `rowModels` option, and the factories no longer take arguments. If you migrated on an earlier beta, see the [Row Model Factories](#row-model-factories) section below for the new shape.

## What's New in TanStack Table V9

TanStack Table V9 is a major release with significant internal architectural improvements while maintaining the core table logic you're familiar with. Here are the key changes:

### 1. Better Performance

- **Lower memory usage**: The core architecture now shares more behavior across table objects, with some large-table scenarios seeing up to 90% memory savings.
- **Faster client-side row models**: Sorting, filtering, and aggregation paths have improved algorithms and memoization, with many scenarios seeing up to 40-70% speed improvements.
- **Better column resizing performance**: Column resizing also gets significant performance improvements from the same architectural and memoization work.

### 2. State Management Overhaul

- **TanStack Store foundation**: Table state is now backed by TanStack Store atoms.
- **Fine-grained subscriptions**: State slices can be read independently through `table.atoms`, `table.store`, `table.state`, selectors, or `table.Subscribe`.
- **External state or atoms**: You can still use `state` plus `on[State]Change`, or own individual slices with writable atoms via the new `atoms` option.

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
- **`createTableHook()`**: Create app-level Preact table factories with shared features, row models, defaults, and component conventions.

### The Good News: Most Upgrades Are Opt-in

- You can start with `stockFeatures` while migrating, then replace it with explicit feature registration.
- `useTable` defaults to v8-style full state subscriptions. Pass a narrower selector only when you want to optimize re-renders.
- Table markup is largely unchanged. Rows, headers, cells, and feature APIs still drive rendering.

The main migration is changing from the React adapter used through `preact/compat` to the native Preact adapter: `useReactTable` becomes `useTable`, and `get*RowModel` options become feature and row model factory slots on `tableFeatures`.

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

### New Required `features` Table Option

In v9, a table must declare its feature set. Features, Row Models, and Row Model processing "Fns" are defined on the new `features` table option.

In v8 React-adapter code, all features were bundled and included in the `useReactTable` hook. In v9, you import only what you need.

```tsx
// v8 / before: React adapter through preact/compat
import {
  getCoreRowModel,
  getSortedRowModel,
  sortingFns,
  useReactTable,
} from '@tanstack/react-table'

const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  sortingFns,
})

// v9
import {
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/preact-table'

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

Keep the `features` object outside the component when possible so the reference stays stable.

---

#### Shortcut: Use `stockFeatures` for Table V8-like Behavior

`stockFeatures` includes the common feature set and can be useful for smoke tests or early migration. It gives up the main bundle-size benefit of v9, so audit it before shipping.

```tsx
import { stockFeatures, useTable } from '@tanstack/preact-table'

const table = useTable({
  features: stockFeatures,
  columns,
  data,
})
```

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
| Column Faceting   | `columnFacetingFeature`   |

---

## Row Model Factories

Row models process data for features like filtering, sorting, grouping, expanding, faceting, and pagination. In v9, row model factories and function registries are slots on `tableFeatures` rather than a separate `rowModels` option. Row model slots are type-checked, so each row model must be specified after its associated feature in the same `tableFeatures` call.

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

Function registries move to slots too: pass `filterFns`, `sortFns`, and `aggregationFns` directly to `tableFeatures` instead of as factory arguments.

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
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns,
  sortFns,
})

const table = useTable({
  features,
  columns,
  data,
})
```

---

## State Management Changes

In v8 React-adapter examples, most code read all state through `table.getState()`. In v9, Preact can read a full snapshot, selected state, or a single atom.

| Surface                     | Use                                                                                      |
| --------------------------- | ---------------------------------------------------------------------------------------- |
| `table.state`               | The selected state from `useTable`; by default, this is the full registered table state. |
| `table.store.state`         | A full framework-agnostic table state snapshot.                                          |
| `table.atoms.<slice>.get()` | A narrow current-value read for one state slice.                                         |
| `table.Subscribe`           | A render boundary for selected table state or a specific atom/store source.              |
| `table.baseAtoms.<slice>`   | Internal writable atoms. Prefer feature APIs instead of writing these directly.          |

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
const table = useTable({ features, columns, data }, () => null)
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
      {({ pagination }) => <span>Page {pagination.pageIndex + 1}</span>}
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

If you want to lift or listen to any state change, set up a subscription to the `table.store`:

```tsx
const unsubscribe = table.store.subscribe((state) => {
  console.log(state)
})
```

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
const columns: Array<ColumnDef<typeof features, Person>> = columnHelper.columns(
  [
    columnHelper.accessor('age', {
      header: 'Age',
      sortFn: 'alphanumeric',
    }),
  ],
)
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
<FlexRender footer={footer} />
```

---

## The `tableOptions()` Utility

`tableOptions()` is a type helper for reusable table option fragments.

```tsx
import { tableOptions } from '@tanstack/preact-table'

const baseOptions = tableOptions({
  features,
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

const { useAppTable, createAppColumnHelper } = createTableHook({ features })

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

| v8                   | v9                |
| -------------------- | ----------------- |
| `sortingFn`          | `sortFn`          |
| `sortingFns`         | `sortFns`         |
| `getSortingFn()`     | `getSortFn()`     |
| `getAutoSortingFn()` | `getAutoSortFn()` |
| `SortingFn`          | `SortFn`          |
| `SortingFns`         | `SortFns`         |

### Removed Internal APIs

All internal APIs prefixed with `_` have been removed. If you were using any of these, use their public equivalents:

- Removed: `table._getPinnedRows()`
- Removed: `table._getFacetedRowModel()`
- Removed: `table._getFacetedMinMaxValues()`
- Removed: `table._getFacetedUniqueValues()`

### Row API Changes

Some row APIs have changed from private to public:

| Table V8                                 | Table V9                               |
| ---------------------------------------- | -------------------------------------- |
| `row._getAllCellsByColumnId()` (private) | `row.getAllCellsByColumnId()` (public) |

If you were accessing this internal API, you can now use it without the underscore prefix.

### Row Selection API Changes

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

### `FilterFns`/`SortFns`/`AggregationFns`/`FilterMeta` Augmentation Replaced by Registry Slots

In v8, making a custom function usable as a string reference (like `filterFn: 'fuzzy'`) required `declare module` augmentation of the `FilterFns` interface, and typing filter meta required augmenting `FilterMeta`. In v9, registering the function in the matching registry slot does both jobs with no global augmentation:

```tsx
// v8 / before: React adapter through preact/compat
declare module '@tanstack/react-table' {
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
- [ ] Migrate `get*RowModel()` options (or earlier-beta `rowModels: {...}` entries) to `tableFeatures({...})` slots (e.g. `filteredRowModel: createFilteredRowModel()`).
- [ ] Drop `getCoreRowModel`; the core row model is automatic.
- [ ] Move `sortingFns`, `filterFns`, and `aggregationFns` into `tableFeatures` slots (not factory args).
- [ ] Rename `sortingFn` to `sortFn` and `sortingFns` to `sortFns`.
- [ ] Replace `declare module` augmentation for `FilterFns`/`SortFns`/`AggregationFns`/`FilterMeta` with registry slots on `tableFeatures` (`filterFns`, `sortFns`, `aggregationFns`, `filterMeta`).
- [ ] Update column helpers and types to include `typeof features`.
- [ ] Replace broad `table.getState()` reads with `table.state`, `table.store.state`, or `table.atoms.<slice>.get()`.
- [ ] Replace `onStateChange` with per-slice `on[State]Change` or external atoms.
- [ ] Replace destructured row/cell/column/header methods with calls on the instance (for example, `row.getValue('name')`).
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
