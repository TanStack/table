---
title: Migrating to TanStack Table V9 (Lit)
---

> [!NOTE]
> `v9.0.0-beta.10` introduces a breaking change in how row models are defined in order to bring increased type-safety features. Row model factories and function registries now live as slots on the `features` object instead of a separate `rowModels` option, and the factories no longer take arguments. If you migrated on an earlier beta, see the [Row Model and Function Registry Migration](#row-model-and-function-registry-migration) section below for the new shape.

## What's New in TanStack Table V9

TanStack Table V9 is a major release with significant internal architectural improvements while maintaining the core table logic you're familiar with. Here are the key changes:

> The Lit adapter may change during the v9 beta cycle. This guide documents the current local v9 API and avoids speculating about future beta changes.

### 1. Better Performance

- **Lower memory usage**: The core architecture now shares more behavior across table objects, with some large-table scenarios seeing up to 90% memory savings.
- **Faster client-side row models**: Sorting, filtering, and aggregation paths have improved algorithms and memoization, with many scenarios seeing up to 40-70% speed improvements.
- **Better column resizing performance**: Column resizing also gets significant performance improvements from the same architectural and memoization work.

### 2. State Management Overhaul

- **TanStack Store foundation**: State is backed by TanStack Store atoms.
- **Lit controller integration**: `TableController` wires table store changes to Lit host updates.
- **Fine-grained subscriptions**: `tableController.table(options)` exposes the full registered state by default; pass a selector only when you want to narrow it.

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
- **`createTableHook()`**: Define shared Lit table factories with pre-bound features, row models, defaults, and render helpers.

### The Good News: Most Table Logic Is Still Familiar

- Column definitions keep the same basic `accessorKey`, `accessorFn`, `header`, `cell`, and `footer` shapes.
- Feature APIs like `table.nextPage()`, `column.toggleSorting()`, and `row.toggleSelected()` remain the preferred way to update state.
- Lit templates still render header groups, rows, and cells from the table instance.

The main migration is replacing the v8 controller-with-options-thunk with a v9 controller plus `.table(options, selector?)`, then moving feature and row-model setup into the v9 shape.

---

## Core Breaking Changes

### Controller Construction Change

```ts
// v8
private tableController = new TableController(this, () => ({
  columns,
  data: this.data,
}))

protected render() {
  const table = this.tableController.table
  return html`...`
}

// v9
private tableController = new TableController<typeof features, Person>(this)

protected render() {
  const table = this.tableController.table({
    features,
    columns,
    data: this.data,
  })

  return html`...`
}
```

The v9 controller takes the host only. Pass options to `.table(...)` during render.

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

```ts
// Table V8
import {
  TableController,
  getCoreRowModel,
  getSortedRowModel,
  sortingFns,
} from '@tanstack/lit-table'

private tableController = new TableController(this, () => ({
  columns,
  data: this.data,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  sortingFns,
}))

// Table V9
import {
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  TableController,
  tableFeatures,
} from '@tanstack/lit-table'

// All table options that concern including code modules (features, row models, Fns, etc.)
const features = tableFeatures({
  rowSortingFeature, // new - import and pass the feature you want to use
  sortedRowModel: createSortedRowModel(), // now row models are defined on the features object
  sortFns, // now Fns are defined on the features object
  // ...more features, row models, etc.
})

private tableController = new TableController<typeof features, Person>(this)

protected render() {
  const table = this.tableController.table({
    features, // new required option
    columns,
    data: this.data,
  })
}
```

---

#### Shortcut: Use `stockFeatures` for Table V8-like Behavior

`stockFeatures` is useful for early migration before you audit feature usage.

```ts
import { stockFeatures } from '@tanstack/lit-table'

const table = this.tableController.table({
  features: stockFeatures,
  columns,
  data: this.data,
})
```

Use it as a temporary migration shortcut. Explicit feature registration is the production target.

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

## Row Model and Function Registry Migration

Row model factories and function registries are now slots on `tableFeatures({...})`. The separate `rowModels` option is removed. Row model slots are type-checked, so each row model must be specified after its associated feature in the same `tableFeatures` call.

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

```ts
// v8
import {
  TableController,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  filterFns,
  sortingFns,
} from '@tanstack/lit-table'

private tableController = new TableController(this, () => ({
  columns,
  data: this.data,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  filterFns,
  sortingFns,
}))
```

```ts
// v9
import {
  TableController,
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/lit-table'

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

private tableController = new TableController<typeof features, Person>(this)

protected render() {
  const table = this.tableController.table({
    features,
    columns,
    data: this.data,
  })

  return html`...`
}
```

---

## State Management Changes

Lit v9 table state is atom-backed and controller-driven. The controller requests host updates when table store or option store changes.

| Surface                     | Use                                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `table.state`               | Full registered table state by default, or selected state from the second argument to `tableController.table(...)`. |
| `table.store.state`         | Current full table state snapshot.                                                                                  |
| `table.atoms.<slice>.get()` | Narrow current-value read for one state slice.                                                                      |
| `table.subscribe`           | Template helper for selecting table state while rendering.                                                          |
| `table.baseAtoms.<slice>`   | Internal writable atoms. Prefer feature APIs or external atoms.                                                     |

### Accessing State

```ts
// v8
const sorting = table.getState().sorting

// v9: full snapshot
const sorting = table.store.state.sorting

// v9: narrow atom read
const sorting = table.atoms.sorting.get()
```

By default, `table.state` contains the full registered table state.

```ts
const table = this.tableController.table({
  features,
  columns,
  data: this.data,
})

const { pagination, sorting } = table.state
```

Pass a second-argument selector when you want `table.state` to contain only the values that should be selected for render code.

```ts
const table = this.tableController.table(
  {
    features,
    columns,
    data: this.data,
  },
  (state) => ({
    pagination: state.pagination,
  }),
)

table.state.pagination
```

Passing `(state) => state` is equivalent to the default selector and is no longer necessary.

### Selecting State with `table.subscribe`

```ts
private paginationSelector = (state) => ({
  pagination: state.pagination,
})

${table.subscribe(
  table.store,
  this.paginationSelector,
  ({ pagination }) => html`
    <span>Page ${pagination.pageIndex + 1}</span>
  `,
)}
```

It is advised to use a stable reference for the selector function, such as a class method or an arrow function defined outside of render, to avoid unnecessary re-renders.

### Controlled State

The preferred v9 pattern for owning state slices is [external atoms](#external-atoms), described below. The v8-style controlled-state pattern is still supported: use Lit `@state()` fields with per-slice callbacks.

```ts
import { state } from 'lit/decorators.js'
import type { PaginationState, SortingState } from '@tanstack/lit-table'

@state()
private sorting: SortingState = []

@state()
private pagination: PaginationState = {
  pageIndex: 0,
  pageSize: 10,
}

protected render() {
  const table = this.tableController.table({
    features,
    columns,
    data: this.data,
    state: {
      sorting: this.sorting,
      pagination: this.pagination,
    },
    onSortingChange: (updater) => {
      this.sorting =
        updater instanceof Function ? updater(this.sorting) : updater
    },
    onPaginationChange: (updater) => {
      this.pagination =
        updater instanceof Function ? updater(this.pagination) : updater
    },
  })

  return html`...`
}
```

The v8-style top-level `onStateChange` callback is gone. Use per-slice callbacks or external atoms.

If you want to lift or listen to any state change, set up a subscription to the `table.store`:

```ts
const unsubscribe = table.store.subscribe((state) => {
  console.log(state)
})
```

### External Atoms

Use external atoms when the app should own and share state slices outside the table.

```ts
import { createAtom } from '@tanstack/store'
import type { PaginationState, SortingState } from '@tanstack/lit-table'

const sortingAtom = createAtom<SortingState>([])
const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

protected render() {
  const table = this.tableController.table({
    features,
    columns,
    data: this.data,
    atoms: {
      sorting: sortingAtom,
      pagination: paginationAtom,
    },
  })

  return html`<span>Page ${paginationAtom.get().pageIndex + 1}</span>`
}
```

Do not provide both `atoms.pagination` and `state.pagination`; the atom owns that slice.

---

## Column Helper Changes

Column helpers and column types now include `TFeatures` first.

```ts
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

Use `columnHelper.columns([...])` for better inference across nested columns.

---

## Rendering Changes

Replace v8 `flexRender(def, context)` calls with `FlexRender({ cell | header | footer })`.

```ts
// v8
html`<td>${flexRender(cell.column.columnDef.cell, cell.getContext())}</td>`

// v9
html`<td>${FlexRender({ cell })}</td>`
html`<th>${FlexRender({ header })}</th>`
html`<td>${FlexRender({ footer })}</td>`
```

The table instance also exposes `table.FlexRender`:

```ts
html`<td>${table.FlexRender({ cell })}</td>`
```

---

## The `tableOptions()` Utility

`tableOptions()` helps compose shared table option fragments.

```ts
import { tableOptions } from '@tanstack/lit-table'

const baseOptions = tableOptions({
  features,
  defaultColumn: {
    minSize: 40,
  },
})

const table = this.tableController.table({
  ...baseOptions,
  columns,
  data: this.data,
})
```

---

## `createTableHook`: Composable Table Patterns

`createTableHook` creates shared Lit table helpers with features (including row model slots) and render helpers already bound.

```ts
import { createTableHook } from '@tanstack/lit-table'

export const { useAppTable, createAppColumnHelper } = createTableHook({
  features,
})

const columnHelper = createAppColumnHelper<Person>()

@customElement('people-table')
class PeopleTable extends LitElement {
  private appTable = useAppTable(this, {
    columns,
    data: this.data,
  })

  protected render() {
    const table = this.appTable.table()
    return html`...`
  }
}
```

See the [Composable Tables Guide](./composable-tables.md) for full patterns.

---

## Other Breaking Changes

### Column Pinning Option Split

Table-level `enablePinning` split into:

```ts
enableColumnPinning: true
enableRowPinning: true
```

### Column Sizing vs. Column Resizing Split

Column resizing now has its own feature and state slice.

```ts
const features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
})
```

`columnSizingInfo` became `columnResizing`, and `onColumnSizingInfoChange` became `onColumnResizingChange`.

### Sorting API Renames

| v8                   | v9                |
| -------------------- | ----------------- |
| `sortingFn`          | `sortFn`          |
| `sortingFns`         | `sortFns`         |
| `getSortingFn()`     | `getSortFn()`     |
| `getAutoSortingFn()` | `getAutoSortFn()` |
| `SortingFn`          | `SortFn`          |

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

Use `TFeatures` as the first generic:

```ts
ColumnDef<typeof features, Person>
Column<typeof features, Person>
Row<typeof features, Person>
Table<typeof features, Person>
```

### Using `typeof features`

```ts
const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
})

const columnHelper = createColumnHelper<typeof features, Person>()
```

### Using `StockFeatures`

```ts
import type { StockFeatures } from '@tanstack/lit-table'

type PersonColumn = ColumnDef<StockFeatures, Person>
```

### `TableMeta`/`ColumnMeta` Typing Changes

No more declaration merging required! (Although it still works if you want to keep using it)

Global declaration merging works exactly like it did in v8. The only change you need to make is updating the generics shape: both interfaces now take `TFeatures` as the first type parameter.

```ts
declare module '@tanstack/lit-table' {
  interface ColumnMeta<TFeatures, TData, TValue> {
    align?: 'left' | 'right'
  }
}
```

That's all that's required if you want to keep declaring meta types globally.

Optionally, v9 also adds a new way to declare meta types **per-table** without declaration merging. You can use type-only `tableMeta`/`columnMeta` slots on the `features` option, which only affect tables created with that `features` object:

```ts
const features = tableFeatures({
  rowSortingFeature,
  columnMeta: metaHelper<{ align?: 'left' | 'right' }>(),
})
```

See the new [Table and Column Meta Guide](../../../guide/table-and-column-meta) for full details on both approaches.

### `FilterFns`/`SortFns`/`AggregationFns`/`FilterMeta` Augmentation Replaced by Registry Slots

In v8, making a custom function usable as a string reference (like `filterFn: 'fuzzy'`) required `declare module` augmentation of the `FilterFns` interface, and typing filter meta required augmenting `FilterMeta`. In v9, registering the function in the matching registry slot does both jobs with no global augmentation:

```ts
// v8
declare module '@tanstack/lit-table' {
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

Prefer explicit object row types:

```ts
type Person = {
  firstName: string
  lastName: string
  age: number
}
```

---

## Migration Checklist

- [ ] Replace controller construction with `new TableController<typeof features, TData>(this)`.
- [ ] Move table options from the controller constructor into `tableController.table(...)`.
- [ ] Define `features` using `tableFeatures()` (or use `stockFeatures`).
- [ ] Move row model factories and function registries into `tableFeatures({...})` slots (remove the separate `rowModels` option).
- [ ] Remove `getCoreRowModel`; the core row model is automatic.
- [ ] Register `sortFns`, `filterFns`, and `aggregationFns` as slots on `tableFeatures({...})` (not as factory arguments).
- [ ] Replace `declare module` augmentation of `FilterFns`/`SortFns`/`AggregationFns` with registry-slot registration, and `FilterMeta` augmentation with the `filterMeta` slot.
- [ ] Rename `sortingFn` to `sortFn`.
- [ ] Add `typeof features` to column helpers and types.
- [ ] Replace `table.getState()` reads with `table.state`, `table.store.state`, or `table.atoms.<slice>.get()`.
- [ ] Replace top-level `onStateChange` with per-slice callbacks or external atoms.
- [ ] Replace destructured row/cell/column/header methods with calls on the instance (for example, `row.getValue('name')`).
- [ ] Replace `flexRender(...)` calls with `FlexRender({ cell | header | footer })`.
- [ ] Audit `stockFeatures` before production.

---

## Examples

- [Basic TableController](../examples/basic-table-controller)
- [Basic App Table](../examples/basic-app-table)
- [Basic External Atoms](../examples/basic-external-atoms)
- [Basic External State](../examples/basic-external-state)
- [Sorting](../examples/sorting)
- [Pagination](../examples/pagination)
- [Composable Tables](../examples/composable-tables)
