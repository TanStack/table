---
title: Migrating to TanStack Table v9 (Solid)
---

> [!NOTE]
> `v9.0.0-beta.10` introduces a breaking change in how row models are defined in order to bring increased type-safety features. Row model factories and function registries now live as slots on the `features` object instead of a separate `rowModels` option, and the factories no longer take arguments. If you migrated on an earlier beta, see the [Row Model Factories](#row-model-factories) section below for the new shape.

## What's New in TanStack Table v9

TanStack Table v9 is a major release that makes table setup more explicit and more tree-shakeable. The Solid adapter keeps the same headless rendering model, but table creation, row model registration, state reads, and rendering helpers have changed.

### 1. Tree Shaking and Extensibility

- **Features are tree-shakeable**: register only the features a table uses.
- **Row models are explicit**: client-side row processing moved from root `get*RowModel` options into `tableFeatures` as row model factory slots.
- **Function registries moved to features**: `sortFns`, `filterFns`, and `aggregationFns` are now slots on `tableFeatures` instead of arguments to row model factories.
- **Custom feature plugins with full type safety**: The same plugin architecture that powers the built-in features is open to your own code. Write a custom feature with its own state, options, and APIs, register it in `tableFeatures()` alongside the built-ins, and the table's types pick it all up automatically. See the [Custom Features Guide](./custom-features.md).

### 2. State Management

- **Uses TanStack Store**: state is backed by TanStack Store atoms with Solid-aware reactivity.
- **State is per-slice**: slices like `sorting`, `pagination`, and `rowSelection` are exposed through `table.atoms`.
- **Solid-native reads**: atom reads participate in Solid tracking when called inside JSX, `createMemo`, `createEffect`, or `table.Subscribe`.
- **External atoms**: apps can own individual slices with atoms from `@tanstack/solid-store`.

### 3. Composability

- **`tableOptions()`**: compose reusable table option fragments.
- **`createTableHook()`**: define app-specific table factories with shared features, row models, defaults, and components.

### 4. Improved Type Safety (No More Declaration Merging)

- **Function registries replace `declare module` augmentation**: Custom filter, sort, and aggregation functions are registered by name in the `filterFns` / `sortFns` / `aggregationFns` slots on `tableFeatures()`. The registered keys become the valid, type-safe string values for `filterFn`, `sortFn`, `globalFilterFn`, and `aggregationFn` in your column definitions, with full inference. No more augmenting the `FilterFns` / `SortFns` / `AggregationFns` interfaces globally.
- **Per-table meta slots**: The type-only `tableMeta`, `columnMeta`, and `filterMeta` slots declare meta types for a single table instead of merging into a global interface. The `filterMeta` slot types both the `addMeta` callback in filter functions and the values read back from `row.columnFiltersMeta`.
- **Feature-gated APIs and validated prerequisites**: APIs like `table.setSorting` only exist on the table type when their feature is registered, and `tableFeatures()` validates slot prerequisites at the type level. Registering `sortFns` without `rowSortingFeature`, or `globalFilteringFeature` without `columnFilteringFeature`, is a typed error instead of a silent runtime no-op.

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

### New Required Option: `features`

```tsx
// v8
import {
  createSolidTable,
  getCoreRowModel,
} from '@tanstack/solid-table'

const table = createSolidTable({
  columns,
  get data() {
    return data()
  },
  getCoreRowModel: getCoreRowModel(),
})

// v9
import { createTable, tableFeatures } from '@tanstack/solid-table'

const features = tableFeatures({})

const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
})
```

Keep `features` and column definitions outside reactive component work when they are static.

---

## The `features` Option

Features control which APIs, options, and state slices exist on the table.

### Importing Individual Features

```tsx
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/solid-table'

const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
})
```

If a feature is not registered, its APIs and state slice are not available. For example, `table.atoms.rowSelection` requires `rowSelectionFeature`.

### Using `stockFeatures` for v8-like Behavior

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

## Row Model Factories

Row model factories now live inside `tableFeatures` alongside feature objects. Function registries (`filterFns`, `sortFns`, `aggregationFns`) are also passed as slots in `tableFeatures` rather than as arguments to the factory functions.

### Migration Mapping

| v8 Option | v9 `tableFeatures` Key | v9 Factory Function |
|---|---|---|
| `getCoreRowModel()` | (automatic) | Not needed |
| `getFilteredRowModel()` | `filteredRowModel` | `createFilteredRowModel()` |
| `getSortedRowModel()` | `sortedRowModel` | `createSortedRowModel()` |
| `getPaginationRowModel()` | `paginatedRowModel` | `createPaginatedRowModel()` |
| `getExpandedRowModel()` | `expandedRowModel` | `createExpandedRowModel()` |
| `getGroupedRowModel()` | `groupedRowModel` | `createGroupedRowModel()` |
| `getFacetedRowModel()` | `facetedRowModel` | `createFacetedRowModel()` |
| `getFacetedMinMaxValues()` | `facetedMinMaxValues` | `createFacetedMinMaxValues()` |
| `getFacetedUniqueValues()` | `facetedUniqueValues` | `createFacetedUniqueValues()` |

### Full Migration Example

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

---

## State Management Changes

Solid v9 uses table atoms backed by Solid primitives. Prefer narrow atom reads or Solid memos over broad whole-state reads.

| Surface | Use |
|---|---|
| `table.atoms.<slice>.get()` | Narrow reactive reads inside Solid tracking scopes. |
| `table.store.get()` | Current full state snapshot. Use mostly for debug output or intentionally broad dependencies. |
| `table.Subscribe` | A Solid render boundary whose child reads the atoms it needs. |
| `table.baseAtoms.<slice>` | Internal writable atoms. Prefer feature APIs or external atoms. |

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
  {(atoms) => (
    <span>Page {atoms.pagination.get().pageIndex + 1}</span>
  )}
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
const columns: Array<ColumnDef<typeof features, Person>> = columnHelper.columns([
  columnHelper.accessor('age', {
    header: 'Age',
    sortFn: 'alphanumeric',
  }),
])
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
<table.FlexRender footer={header} />
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

## Other Breaking Changes

### Column Pinning Option Split

Table-level `enablePinning` split into:

```tsx
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

`columnSizingInfo` became `columnResizing`, and `onColumnSizingInfoChange` became `onColumnResizingChange`. The `setColumnSizingInfo()` API became `setcolumnResizing()` (note the lowercase `c`, the current v9 spelling).

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
  filterFns: { ...filterFns, fuzzy: fuzzyFilter },
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
- [ ] Define `features` using `tableFeatures()` (or use `stockFeatures`).
- [ ] Move every `get*RowModel` factory into `tableFeatures` as a slot (e.g. `sortedRowModel: createSortedRowModel()`).
- [ ] Remove `getCoreRowModel`; the core row model is automatic.
- [ ] Move `sortFns`, `filterFns`, and `aggregationFns` into `tableFeatures` as slots (not as factory arguments).
- [ ] Replace `declare module` augmentation of `FilterFns`/`SortFns`/`AggregationFns` with registry-slot registration, and `FilterMeta` augmentation with the `filterMeta` slot.
- [ ] Rename `sortingFn` to `sortFn`.
- [ ] Add `typeof features` to column helpers and table types.
- [ ] Use getters for reactive `data` and controlled `state` slices.
- [ ] Replace `table.getState()` reads with `table.atoms.<slice>.get()` or `table.store.get()`.
- [ ] Replace top-level `onStateChange` with per-slice handlers or external atoms.
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
