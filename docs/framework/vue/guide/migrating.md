---
title: Migrating to TanStack Table v9 (Vue)
---

## What's New in TanStack Table v9

TanStack Table v9 is a major release with explicit feature registration, row model registration, and a new atom-backed state model. The Vue adapter keeps table rendering headless while adding Vue-aware reactivity for table atoms and reactive options.

### 1. Tree-shaking

- **Features are tree-shakeable**: register only the table features you use.
- **Row models are explicit**: move root `get*RowModel` options into `rowModels`.
- **Function registries moved to factories**: row model factories receive `sortFns`, `filterFns`, and `aggregationFns` directly.

### 2. State Management

- **Uses TanStack Store**: table state is backed by TanStack Store atoms.
- **Uses Vue reactivity**: table atoms are backed by Vue refs and computed values.
- **Per-slice state**: registered features expose their state through `table.atoms`.
- **Vue option syncing**: `useTable` unwraps refs and computed values in options like `data` and syncs the table when they change.

### 3. Composability

- **`tableOptions()`**: compose reusable option fragments.
- **`createTableHook()`**: define shared Vue table factories with pre-bound features, row models, defaults, and components.

### The Good News: Most Table Logic Is Still Familiar

- Column definitions keep the same basic `accessorKey`, `accessorFn`, `header`, `cell`, and `footer` shapes.
- Feature APIs like `table.nextPage()`, `column.toggleSorting()`, and `row.toggleSelected()` remain the preferred way to update state.
- Templates still render header groups, rows, and cells from the table instance.

The main migration is replacing `useVueTable` with `useTable`, then moving feature and row-model setup into the v9 shape.

---

## Core Breaking Changes

### Hook Rename

```ts
// v8
import { useVueTable } from '@tanstack/vue-table'

const table = useVueTable(options)

// v9
import { useTable } from '@tanstack/vue-table'

const table = useTable(options)
```

### New Required Options: `features` and `rowModels`

```ts
// v8
import {
  getCoreRowModel,
  useVueTable,
} from '@tanstack/vue-table'

const table = useVueTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
})

// v9
import { tableFeatures, useTable } from '@tanstack/vue-table'

const features = tableFeatures({})

const table = useTable({
  features,
  rowModels: {}, // core row model is automatic
  columns,
  data,
})
```

`data` can be a raw array, a `ref`, a `computed`, or a getter. The adapter unwraps reactive option values and keeps the table synced.

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
} from '@tanstack/vue-table'

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
import { stockFeatures, useTable } from '@tanstack/vue-table'

const table = useTable({
  features: stockFeatures,
  rowModels,
  columns,
  data,
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
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  filterFns,
  sortingFns,
  useVueTable,
} from '@tanstack/vue-table'

const table = useVueTable({
  columns,
  data,
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
  filterFns,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'

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

Vue v9 table state is atom-backed and Vue-aware. Prefer Vue `computed` values around narrow atom reads over broad whole-state reads.

| Surface | Use |
|---|---|
| `table.atoms.<slice>.get()` | Narrow reactive reads inside Vue tracking scopes. |
| `table.store.get()` | Current full state snapshot. Use mostly for debug output or intentionally broad dependencies. |
| `table.Subscribe` | A render-function or JSX boundary whose child reads the atoms it needs. |
| `table.baseAtoms.<slice>` | Internal writable atoms. Prefer feature APIs or external atoms. |

### Accessing State

```ts
// v8
const sorting = table.getState().sorting

// v9: narrow atom read
const sorting = table.atoms.sorting.get()

// v9: full snapshot
const tableState = table.store.get()
```

Use Vue primitives to derive reactive values:

```ts
import { computed } from 'vue'

const pagination = computed(() => table.atoms.pagination.get())
const pageIndex = computed(() => pagination.value.pageIndex)
const tableStateJson = computed(() =>
  JSON.stringify(table.store.get(), null, 2),
)
```

### Reactive Options

`data` can be a `ref` or `computed`; the adapter unwraps and syncs it.

```ts
import { ref } from 'vue'

const data = ref(makeData(100))

const table = useTable({
  features,
  rowModels: {},
  columns,
  data,
})

data.value = makeData(200)
```

Getter-based options also work:

```ts
const table = useTable({
  features,
  rowModels,
  columns,
  get data() {
    return data.value
  },
})
```

### Fine-grained Updates with `table.Subscribe`

Use `table.Subscribe` in render functions or JSX when a specific subtree should track selected atoms. Pass the function as an explicit `children` prop; `table.Subscribe` reads `props.children`, and Vue JSX delivers element children as slots instead.

```tsx
<table.Subscribe
  children={(atoms) => {
    const pagination = atoms.pagination.get()

    return (
      <span>Page {pagination.pageIndex + 1}</span>
    )
  }}
/>
```

### Controlled State

The v8-style `state` + `on[State]Change` controlled state patterns still work and remain convenient for simple integrations. For new v9 code, prefer owning state slices with external atoms (see [External Atoms](#external-atoms) below), which give you fine-grained subscriptions without mirroring state through Vue refs.

When Vue refs own a state slice, expose the current value with getters and update the ref in the matching callback.

```ts
import { ref } from 'vue'
import type {
  PaginationState,
  SortingState,
  Updater,
} from '@tanstack/vue-table'

function resolveUpdater<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === 'function'
    ? (updater as (old: T) => T)(previous)
    : updater
}

const sorting = ref<SortingState>([])
const pagination = ref<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const table = useTable({
  features,
  rowModels,
  columns,
  get data() {
    return data.value
  },
  state: {
    get sorting() {
      return sorting.value
    },
    get pagination() {
      return pagination.value
    },
  },
  onSortingChange: (updater) => {
    sorting.value = resolveUpdater(updater, sorting.value)
  },
  onPaginationChange: (updater) => {
    pagination.value = resolveUpdater(updater, pagination.value)
  },
})
```

The v8-style top-level `onStateChange` callback is gone. Use per-slice callbacks or external atoms.

### External Atoms

Use external atoms when the app should own and share state slices outside the table.

```ts
import { createAtom, useSelector } from '@tanstack/vue-store'
import type { PaginationState, SortingState } from '@tanstack/vue-table'

const sortingAtom = createAtom<SortingState>([])
const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const pagination = useSelector(paginationAtom)

const table = useTable({
  features,
  rowModels,
  columns,
  get data() {
    return data.value
  },
  atoms: {
    sorting: sortingAtom,
    pagination: paginationAtom,
  },
})

pagination.value.pageIndex
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

The v9 `FlexRender` component supports shorthand props for cells, headers, and footers.

```vue
<!-- v8 -->
<FlexRender
  :render="cell.column.columnDef.cell"
  :props="cell.getContext()"
/>

<!-- v9 preferred -->
<FlexRender :cell="cell" />
<FlexRender :header="header" />
<FlexRender :footer="header" />
```

The older `:render` and `:props` shape still compiles, but the shorthand props are the preferred migration target.

---

## The `tableOptions()` Utility

`tableOptions()` helps compose shared table option fragments.

```ts
import { tableOptions } from '@tanstack/vue-table'

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

---

## `createTableHook`: Composable Table Patterns

`createTableHook` creates shared Vue table helpers with features, row models, and registered components already bound.

```ts
import { createTableHook } from '@tanstack/vue-table'

const { useAppTable, createAppColumnHelper } = createTableHook({
  features,
  rowModels,
})

const columnHelper = createAppColumnHelper<Person>()

const table = useAppTable({
  columns,
  data,
})
```

See the [Composable Tables Guide](./composable-tables) for full patterns.

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

`columnSizingInfo` became `columnResizing`, `setColumnSizingInfo()` became `setcolumnResizing()` (note the lowercase `c`, the current v9 spelling), and `onColumnSizingInfoChange` became `onColumnResizingChange`.

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
import type { StockFeatures } from '@tanstack/vue-table'

type PersonColumn = ColumnDef<StockFeatures, Person>
```

### `TableMeta`/`ColumnMeta` Typing Changes

No more declaration merging required! (Although it still works if you want to keep using it)

Global declaration merging works exactly like it did in v8. The only change you need to make is updating the generics shape: both interfaces now take `TFeatures` as the first type parameter.

```ts
declare module '@tanstack/vue-table' {
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

- [ ] Replace `useVueTable` with `useTable`.
- [ ] Define `features` using `tableFeatures()` (or use `stockFeatures`).
- [ ] Move root `get*RowModel` options into `rowModels`.
- [ ] Remove `getCoreRowModel`; the core row model is automatic.
- [ ] Pass `sortFns`, `filterFns`, and `aggregationFns` to row model factories.
- [ ] Rename `sortingFn` to `sortFn`.
- [ ] Add `typeof features` to column helpers and types.
- [ ] Replace `table.getState()` reads with `table.atoms.<slice>.get()` or `table.store.get()`.
- [ ] Use Vue getters for controlled `state` slices.
- [ ] Replace top-level `onStateChange` with per-slice callbacks or external atoms.
- [ ] Prefer `<FlexRender :cell="cell" />`, `:header`, and `:footer` shorthand rendering.
- [ ] Audit `stockFeatures` before production.

---

## Examples

- [Basic useTable](../examples/basic-use-table)
- [Basic External Atoms](../examples/basic-external-atoms)
- [Basic External State](../examples/basic-external-state)
- [With TanStack Query](../examples/with-tanstack-query)
- [Sorting](../examples/sorting)
- [Pagination](../examples/pagination)
- [Composable Tables](../examples/composable-tables)
