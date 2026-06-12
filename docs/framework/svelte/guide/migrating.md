---
title: Migrating to TanStack Table v9 (Svelte)
---

> [!NOTE]
> `v9.0.0-beta.10` introduces a breaking change in how row models are defined in order to bring increased type-safety features. Row model factories and function registries now live as slots on the `features` object instead of a separate `rowModels` option, and the factories no longer take arguments. If you migrated on an earlier beta, see the [Row Models](#row-models) section below for the new shape.

## What's New in TanStack Table v9

TanStack Table v9 is a major release with explicit feature registration, row model registration, and a new atom-backed state model. The Svelte adapter was also rewritten around Svelte 5 runes.

### 1. Tree Shaking and Extensibility

- **Features are tree-shakeable**: register only the table features you use.
- **Row models are explicit**: register row model factories as slots inside `tableFeatures({...})`.
- **Function registries moved to features**: pass `sortFns`, `filterFns`, and `aggregationFns` as their own slots inside `tableFeatures({...})` instead of as factory arguments or root table options. This enables tree-shaking of the functions themselves: if you only register a custom filter, you don't pay for built-in filters you never use.
- **Custom feature plugins with full type safety**: The same plugin architecture that powers the built-in features is open to your own code. Write a custom feature with its own state, options, and APIs, register it in `tableFeatures()` alongside the built-ins, and the table's types pick it all up automatically. See the [Custom Features Guide](./custom-features.md).

### 2. State Management

- **Uses TanStack Store**: table state is backed by TanStack Store atoms.
- **Uses Svelte 5 reactivity**: the adapter uses Svelte 5 runes and Svelte-aware atom bindings.
- **Per-slice state**: each registered feature creates its own state slice in `table.atoms`.
- **Default full-state selection, optional narrower selectors**: `table.state` contains the full registered state by default; use a custom selector, `subscribeTable`, or `useSelector` from `@tanstack/svelte-store` when you need a narrower reactive surface.

### 3. Composability

- **`tableOptions()`**: compose reusable option fragments.
- **`createTableHook()`**: define shared Svelte table factories with pre-bound features, row models, defaults, and registered components.

### 4. Improved Type Safety (No More Declaration Merging)

- **Function registries replace `declare module` augmentation**: Custom filter, sort, and aggregation functions are registered by name in the `filterFns` / `sortFns` / `aggregationFns` slots on `tableFeatures()`. The registered keys become the valid, type-safe string values for `filterFn`, `sortFn`, `globalFilterFn`, and `aggregationFn` in your column definitions, with full inference. No more augmenting the `FilterFns` / `SortFns` / `AggregationFns` interfaces globally.
- **Per-table meta slots**: The type-only `tableMeta`, `columnMeta`, and `filterMeta` slots declare meta types for a single table instead of merging into a global interface. The `filterMeta` slot types both the `addMeta` callback in filter functions and the values read back from `row.columnFiltersMeta`.
- **Feature-gated APIs and validated prerequisites**: APIs like `table.setSorting` only exist on the table type when their feature is registered, and `tableFeatures()` validates slot prerequisites at the type level. Registering `sortFns` without `rowSortingFeature`, or `globalFilteringFeature` without `columnFilteringFeature`, is a typed error instead of a silent runtime no-op.

### The Good News: Most Table Logic Is Still Familiar

- Column definitions keep the same basic `accessorKey`, `accessorFn`, `header`, `cell`, and `footer` shapes.
- Feature APIs like `table.nextPage()`, `column.toggleSorting()`, and `row.toggleSelected()` remain the preferred way to change state.
- Markup still renders header groups, rows, and cells from the table instance.

The main changes are the Svelte 5 requirement, the new `createTable` entrypoint, explicit `features` (including row models registered as feature slots), and the move from v8 writable-store patterns to v9 runes and atoms.

---

## Svelte 5 Requirement

The v9 Svelte adapter only supports **Svelte 5+**. It is built on Svelte 5 runes such as `$state`, `$derived.by`, and `$effect.pre`.

If your app is still on Svelte 3 or Svelte 4, choose one of these paths:

- Stay on `@tanstack/svelte-table@8`.
- Migrate the app to Svelte 5 first, then migrate TanStack Table.

There is no Svelte 3/4 compatibility shim for the v9 Svelte adapter.

---

## Core Breaking Changes

### Entrypoint Rename

```ts
// v8
import { createSvelteTable } from '@tanstack/svelte-table'

const table = createSvelteTable(options)

// v9
import { createTable } from '@tanstack/svelte-table'

const table = createTable(options)
```

### New Required Option: `features`

```ts
// v8
import {
  createSvelteTable,
  getCoreRowModel,
} from '@tanstack/svelte-table'

const table = createSvelteTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
})

// v9
import { createTable, tableFeatures } from '@tanstack/svelte-table'

const features = tableFeatures({})

const table = createTable({
  features,
  columns,
  get data() {
    return data
  },
})
```

In Svelte 5, pass reactive values like `data` through getters so table options read the current rune value.

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
} from '@tanstack/svelte-table'

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

`stockFeatures` is useful for early migration when you have not audited feature usage yet.

```ts
import { createTable, stockFeatures } from '@tanstack/svelte-table'

const table = createTable({
  features: stockFeatures,
  columns,
  get data() {
    return data
  },
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

## Row Models

Row model factories now live as slots directly inside `tableFeatures({...})`. The `rowModels` option no longer exists.

### Migration Mapping

| v8 Option | v9 `tableFeatures` Slot | v9 Factory Function |
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

Function registries move to slots too: pass `filterFns`, `sortFns`, and `aggregationFns` directly to `tableFeatures` instead of as factory arguments.

### Full Migration Example

```svelte
<script lang="ts">
  // v8
  import {
    createSvelteTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    filterFns,
    sortingFns,
  } from '@tanstack/svelte-table'

  const table = createSvelteTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    filterFns,
    sortingFns,
  })
</script>
```

```svelte
<script lang="ts">
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
  } from '@tanstack/svelte-table'

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

  let data = $state(makeData(1000))

  const table = createTable({
    features,
    columns,
    get data() {
      return data
    },
  })
</script>
```

---

## State Management Changes

Svelte v9 table state is atom-backed and rune-aware. Do not port v8 writable-store table option patterns directly except as "before" code.

| Surface | Use |
|---|---|
| `table.state` | Full registered table state by default, or selected state from the second argument to `createTable`. |
| `table.store.state` | Current full table state snapshot. |
| `table.atoms.<slice>.get()` | Narrow current-value read for one state slice. |
| `subscribeTable(source, selector?)` | Fine-grained Svelte subscription helper that exposes `.current`. |
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
const table = createTable({
  features,
  columns,
  get data() {
    return data
  },
})

const { pagination, sorting } = table.state
```

Pass a second-argument selector when you want `table.state` to contain only the values that should cause reactive updates.

```ts
const table = createTable(
  {
    features,
    columns,
    get data() {
      return data
    },
  },
  (state) => ({
    pagination: state.pagination,
  }),
)

table.state.pagination
```

Passing `(state) => state` is equivalent to the default selector and is no longer necessary.

### Fine-grained Updates with `subscribeTable`

```ts
import { subscribeTable } from '@tanstack/svelte-table'

const pagination = subscribeTable(table.atoms.pagination)
const pageIndex = subscribeTable(
  table.atoms.pagination,
  (pagination) => pagination.pageIndex,
)
```

```svelte
<strong>
  Page {pagination.current.pageIndex + 1} of {table.getPageCount()}
</strong>
```

### Controlled State

The v8-style `state` plus `on[State]Change` pattern still works in v9 and is the most direct migration path, but [External Atoms](#external-atoms) (below) are the preferred v9 way to own state slices outside the table.

Use `createTableState` for Svelte-owned state slices that need to accept TanStack Table updater functions.

```svelte
<script lang="ts">
  import {
    createTable,
    createTableState,
    type PaginationState,
    type SortingState,
  } from '@tanstack/svelte-table'

  let data = $state(makeData(1000))

  const [sorting, setSorting] = createTableState<SortingState>([])
  const [pagination, setPagination] = createTableState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = createTable({
    features,
    columns,
    get data() {
      return data
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
</script>
```

The v8-style `onStateChange` callback is gone. Use per-slice `on[State]Change` callbacks or external atoms.

### External Atoms

Use external atoms when the app should own and share state slices outside the table.

```svelte
<script lang="ts">
  import { createAtom, useSelector } from '@tanstack/svelte-store'
  import type {
    PaginationState,
    SortingState,
  } from '@tanstack/svelte-table'

  const sortingAtom = createAtom<SortingState>([])
  const paginationAtom = createAtom<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const sorting = useSelector(sortingAtom)
  const pagination = useSelector(paginationAtom)

  const table = createTable({
    features,
    columns,
    get data() {
      return data
    },
    atoms: {
      sorting: sortingAtom,
      pagination: paginationAtom,
    },
  })
</script>

<span>Page {pagination.current.pageIndex + 1}</span>
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

Replace v8 `flexRender` calls with the Svelte `FlexRender` component.

```svelte
<!-- v8 -->
<svelte:component
  this={flexRender(header.column.columnDef.header, header.getContext())}
/>

<!-- v9 -->
<FlexRender {header} />
<FlexRender {cell} />
```

For Svelte components in column definitions, use `renderComponent`.

```ts
import { renderComponent } from '@tanstack/svelte-table'
import StatusCell from './StatusCell.svelte'

const columns = columnHelper.columns([
  columnHelper.accessor('status', {
    cell: ({ row }) => renderComponent(StatusCell, { row }),
  }),
])
```

For Svelte snippets, use `renderSnippet`.

```svelte
<script lang="ts">
  import { renderSnippet } from '@tanstack/svelte-table'

  const columns = columnHelper.columns([
    columnHelper.accessor('firstName', {
      cell: ({ row }) => renderSnippet(nameCell, row),
    }),
  ])
</script>

{#snippet nameCell(row)}
  <strong>{row.original.firstName}</strong>
{/snippet}
```

---

## The `tableOptions()` Utility

`tableOptions()` helps compose shared table option fragments.

```ts
import { tableOptions } from '@tanstack/svelte-table'

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
    return data
  },
})
```

---

## `createTableHook`: Composable Table Patterns

`createTableHook` creates shared Svelte table helpers with features (including row model slots) and registered components already bound.

```ts
import { createTableHook } from '@tanstack/svelte-table'

export const { createAppTable, createAppColumnHelper } = createTableHook({ features })

const columnHelper = createAppColumnHelper<Person>()

const table = createAppTable({
  columns,
  get data() {
    return data
  },
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
import type { StockFeatures } from '@tanstack/svelte-table'

type PersonColumn = ColumnDef<StockFeatures, Person>
```

### `TableMeta`/`ColumnMeta` Typing Changes

No more declaration merging required! (Although it still works if you want to keep using it)

Global declaration merging works exactly like it did in v8. The only change you need to make is updating the generics shape: both interfaces now take `TFeatures` as the first type parameter.

```ts
declare module '@tanstack/svelte-table' {
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
declare module '@tanstack/svelte-table' {
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

The same pattern applies to `sortFns` (for `sortFn` string values) and `aggregationFns` (for `aggregationFn` string values). Once a custom function is registered in a registry slot, prefer the string reference in column defs (`sortFn: 'fuzzy'`) over passing the function directly; svelte-check is stricter about function variance, and the string form sidesteps it. See the [Fuzzy Filtering Guide](./fuzzy-filtering.md) for a complete example.

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

- [ ] Upgrade the app to Svelte 5.
- [ ] Replace `createSvelteTable` with `createTable`.
- [ ] Replace Svelte 3/4 writable-store table patterns with runes and getters.
- [ ] Define `features` using `tableFeatures()` (or use `stockFeatures`).
- [ ] Move row model factories into `tableFeatures({...})` as slots (e.g. `filteredRowModel: createFilteredRowModel()`).
- [ ] Remove `getCoreRowModel`; the core row model is automatic.
- [ ] Pass `sortFns`, `filterFns`, and `aggregationFns` as slots in `tableFeatures({...})` instead of as factory arguments (row model factories no longer take arguments).
- [ ] Replace `declare module` augmentation of `FilterFns`/`SortFns`/`AggregationFns` with registry-slot registration, and `FilterMeta` augmentation with the `filterMeta` slot.
- [ ] Rename `sortingFn` to `sortFn`.
- [ ] Add `typeof features` to column helpers and types.
- [ ] Pass reactive `data` and controlled `state` slices through getters.
- [ ] Replace `table.getState()` reads with `table.state`, `table.store.state`, `table.atoms.<slice>.get()`, or `subscribeTable`.
- [ ] Replace `onStateChange` with per-slice callbacks or external atoms.
- [ ] Replace `flexRender(...)` and `<svelte:component>` table rendering with `<FlexRender />`.
- [ ] Use `renderComponent` or `renderSnippet` for Svelte component/snippet cells.
- [ ] Audit `stockFeatures` before production.

---

## Examples

- [Basic createTable](../examples/basic-create-table)
- [Basic External Atoms](../examples/basic-external-atoms)
- [Basic External State](../examples/basic-external-state)
- [With TanStack Query](../examples/with-tanstack-query)
- [Sorting](../examples/sorting)
- [Pagination](../examples/pagination)
- [Composable Tables](../examples/composable-tables)
