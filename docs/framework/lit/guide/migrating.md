---
title: Migrating to TanStack Table v9 (Lit)
---

## What's New in TanStack Table v9

TanStack Table v9 is a major release with explicit feature registration, row model registration, and a new atom-backed state model. The Lit adapter wraps those APIs in a `ReactiveController`.

> The Lit adapter may change during the v9 beta cycle. This guide documents the current local v9 API and avoids speculating about future beta changes.

### 1. Tree-shaking

- **Features are tree-shakeable**: register only the table features you use.
- **Row models are explicit**: move root `get*RowModel` options into the `rowModels` object.
- **Function registries moved to factories**: row model factories receive `sortFns`, `filterFns`, and `aggregationFns` directly.

### 2. State Management

- **Uses TanStack Store**: state is backed by TanStack Store atoms.
- **Uses a `TableController`**: the controller wires table store changes to Lit host updates.
- **Per-slice state**: registered features expose their state through `table.atoms`.
- **Default full-state selection**: `tableController.table(options)` exposes the full registered state on `table.state`; pass a selector only when you want to narrow it.

### 3. Composability

- **`tableOptions()`**: compose reusable option fragments.
- **`createTableHook()`**: define shared Lit table factories with pre-bound features, row models, defaults, and render helpers.

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
    rowModels,
    columns,
    data: this.data,
  })

  return html`...`
}
```

The v9 controller takes the host only. Pass options to `.table(...)` during render.

### New Required Options: `features` and `rowModels`

```ts
// v8
import {
  TableController,
  getCoreRowModel,
} from '@tanstack/lit-table'

private tableController = new TableController(this, () => ({
  columns,
  data: this.data,
  getCoreRowModel: getCoreRowModel(),
}))

// v9
import {
  TableController,
  tableFeatures,
} from '@tanstack/lit-table'

const features = tableFeatures({})

private tableController = new TableController<typeof features, Person>(this)

protected render() {
  const table = this.tableController.table({
    features,
    rowModels: {}, // core row model is automatic
    columns,
    data: this.data,
  })
}
```

---

## The `features` Option

Features control which APIs, options, and state slices exist on the table.

### Importing Individual Features

```ts
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/lit-table'

const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
})
```

If a feature is not registered, its APIs and state slice are not available.

### Using `stockFeatures` for v8-like Behavior

`stockFeatures` is useful for early migration before you audit feature usage.

```ts
import { stockFeatures } from '@tanstack/lit-table'

const table = this.tableController.table({
  features: stockFeatures,
  rowModels,
  columns,
  data: this.data,
})
```

Use it as a temporary migration shortcut. Explicit feature registration is the production target.

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

Row models now live under `rowModels`.

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
})

const rowModels = {
  filteredRowModel: createFilteredRowModel(filterFns),
  sortedRowModel: createSortedRowModel(sortFns),
  paginatedRowModel: createPaginatedRowModel(),
}

private tableController = new TableController<typeof features, Person>(this)

protected render() {
  const table = this.tableController.table({
    features,
    rowModels,
    columns,
    data: this.data,
  })

  return html`...`
}
```

---

## State Management Changes

Lit v9 table state is atom-backed and controller-driven. The controller requests host updates when table store or option store changes.

| Surface | Use |
|---|---|
| `table.state` | Full registered table state by default, or selected state from the second argument to `tableController.table(...)`. |
| `table.store.state` | Current full table state snapshot. |
| `table.atoms.<slice>.get()` | Narrow current-value read for one state slice. |
| `table.Subscribe` | Template helper for selecting table state while rendering. |
| `table.baseAtoms.<slice>` | Internal writable atoms. Prefer feature APIs or external atoms. |

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
  rowModels,
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
    rowModels,
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

### Selecting State with `table.Subscribe`

```ts
${table.Subscribe({
  selector: (state) => ({
    pagination: state.pagination,
  }),
  children: ({ pagination }) => html`
    <span>Page ${pagination.pageIndex + 1}</span>
  `,
})}
```

`table.Subscribe` can also accept a `source`, but the current Lit adapter invalidates the host through the table store subscription. Treat source mode as render-time selection convenience.

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
    rowModels,
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
    rowModels,
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
const columns: Array<ColumnDef<typeof features, Person>> = columnHelper.columns([
  columnHelper.accessor('age', {
    header: 'Age',
    sortFn: 'alphanumeric',
  }),
])
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
html`<td>${FlexRender({ footer: header })}</td>`
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
  rowModels,
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

`createTableHook` creates shared Lit table helpers with features, row models, and render helpers already bound.

```ts
import { createTableHook } from '@tanstack/lit-table'

export const { useAppTable, createAppColumnHelper } = createTableHook({
  features,
  rowModels,
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

| v8 | v9 |
|---|---|
| `sortingFn` | `sortFn` |
| `sortingFns` | `sortFns` |
| `getSortingFn()` | `getSortFn()` |
| `getAutoSortingFn()` | `getAutoSortFn()` |
| `SortingFn` | `SortFn` |

### Removed Internal API Prefixes

Underscore-prefixed APIs that are now public should be called without `_`, such as `row.getAllCellsByColumnId()`.

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
- [ ] Move root `get*RowModel` options into `rowModels`.
- [ ] Remove `getCoreRowModel`; the core row model is automatic.
- [ ] Pass `sortFns`, `filterFns`, and `aggregationFns` to row model factories.
- [ ] Rename `sortingFn` to `sortFn`.
- [ ] Add `typeof features` to column helpers and types.
- [ ] Replace `table.getState()` reads with `table.state`, `table.store.state`, or `table.atoms.<slice>.get()`.
- [ ] Replace top-level `onStateChange` with per-slice callbacks or external atoms.
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
