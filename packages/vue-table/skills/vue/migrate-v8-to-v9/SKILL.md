---
name: vue/migrate-v8-to-v9
description: >
  Mechanical breaking-change migration from `@tanstack/vue-table` v8 to v9. Rename `useVueTable`
  → `useTable`, move `getCoreRowModel`/`getSortedRowModel`/etc. options into the `tableFeatures`
  object as row model factory slots, add the mandatory `features` via `tableFeatures({...})`,
  update `createColumnHelper<TData>()` → `createColumnHelper<typeof features, TData>()`, rename
  `sortingFn`/`sortingFns` → `sortFn`/`sortFns`, swap `table.getState()` for `table.state`
  / `table.state` / `table.atoms.<slice>.get()`, and prefer `<FlexRender :cell="cell" />` over
  the legacy `:render`/`:props` shape. Vue has NO `/legacy` entrypoint — migration is a direct
  rewrite. The Vue adapter installs `vueReactivity()` automatically.
type: lifecycle
library: tanstack-table
framework: vue
library_version: '9.0.0-alpha.48'
requires:
  - setup
  - state-management
  - column-definitions
sources:
  - docs/framework/vue/guide/migrating.md
  - docs/framework/vue/vue-table.md
  - docs/framework/vue/guide/table-state.md
  - packages/vue-table/src/useTable.ts
  - packages/vue-table/src/FlexRender.ts
---

# Migrate @tanstack/vue-table v8 → v9

## Dependencies

```bash
pnpm add @tanstack/vue-table@latest
# Optional, for external atoms during/after migration:
pnpm add @tanstack/vue-store
```

**Vue has no `/legacy` entrypoint.** The `useLegacyTable` React shim is React-only — Vue
projects rewrite each table directly. The good news: most call sites are mechanical renames.

## Setup — the v8 vs v9 shape side-by-side

### v8 (before)

```vue
<script setup lang="ts">
import {
  FlexRender,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import type { ColumnDef } from '@tanstack/vue-table'

const columnHelper = createColumnHelper<Person>()
const columns: ColumnDef<Person, any>[] = [
  columnHelper.accessor('age', { header: 'Age', sortingFn: 'alphanumeric' }),
]

const table = useVueTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})
</script>

<template>
  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
</template>
```

### v9 (after)

```vue
<script setup lang="ts">
import {
  FlexRender,
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'

const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
})
const columnHelper = createColumnHelper<typeof features, Person>()
const columns = columnHelper.columns([
  columnHelper.accessor('age', { header: 'Age', sortFn: 'alphanumeric' }), // sortingFn → sortFn
])

const table = useTable({
  features,
  columns,
  data,
})
</script>

<template>
  <!-- Preferred shorthand. Legacy :render / :props still compiles. -->
  <FlexRender :cell="cell" />
</template>
```

## Rename Cheat-Sheet

| v8                                                                                        | v9                                                                                    |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `useVueTable(opts)`                                                                       | `useTable(opts, selector?)`                                                           |
| `getCoreRowModel: getCoreRowModel()`                                                      | implicit; not an option                                                               |
| `getSortedRowModel: getSortedRowModel()`                                                  | `tableFeatures({ sortedRowModel: createSortedRowModel(), sortFns })`                  |
| `getFilteredRowModel: getFilteredRowModel()`                                              | `tableFeatures({ filteredRowModel: createFilteredRowModel(), filterFns })`            |
| `getPaginationRowModel: getPaginationRowModel()`                                          | `tableFeatures({ paginatedRowModel: createPaginatedRowModel() })`                     |
| `getGroupedRowModel: getGroupedRowModel()`                                                | `tableFeatures({ groupedRowModel: createGroupedRowModel(), aggregationFns })`         |
| `createColumnHelper<TData>()`                                                             | `createColumnHelper<typeof features, TData>()`                                        |
| `ColumnDef<TData, TValue>`                                                                | `ColumnDef<TFeatures, TData, TValue>`                                                 |
| `Column<TData, TValue>` / `Row<TData>` / `Cell<TData, TValue>`                            | `…<TFeatures, TData, TValue>`                                                         |
| `sortingFn` (column def)                                                                  | `sortFn`                                                                              |
| `sortingFns`                                                                              | `sortFns`                                                                             |
| `getSortingFn()` / `getAutoSortingFn()`                                                   | `getSortFn()` / `getAutoSortFn()`                                                     |
| `SortingFn` / `SortingFns` types                                                          | `SortFn` / `SortFns`                                                                  |
| `enablePinning: true`                                                                     | `enableColumnPinning` and/or `enableRowPinning`                                       |
| `state.columnSizingInfo`                                                                  | `state.columnResizing`                                                                |
| `onColumnSizingInfoChange`                                                                | `onColumnResizingChange`                                                              |
| `ColumnSizing` feature                                                                    | `columnSizingFeature` + `columnResizingFeature` (split)                               |
| `table.getState()`                                                                        | `table.state` (full) / `table.state` (selector) / `table.atoms.<slice>.get()`         |
| `row._getAllCellsByColumnId()`                                                            | `row.getAllCellsByColumnId()` (underscore removed)                                    |
| `table._getFacetedRowModel()` / `_getFacetedMinMaxValues()` / `_getFacetedUniqueValues()` | Same names without leading underscore                                                 |
| `<FlexRender :render="…" :props="…" />`                                                   | `<FlexRender :cell="cell" />` / `:header` / `:footer` (preferred; legacy still works) |

Source: `docs/framework/vue/guide/migrating.md`, `docs/framework/react/guide/migrating.md` (the
non-Vue-specific renames are shared across adapters).

## Core Patterns

### 1. Convert `getXRowModel` options to features-slot factories

Row model factories now live on the `tableFeatures({...})` object alongside the feature
they belong to. The `*Fns` registries move there too — this is what makes them tree-shakeable
in v9.

```ts
const features = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  rowGroupingFeature,
  rowExpandingFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  groupedRowModel: createGroupedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  sortFns,
  filterFns,
  aggregationFns,
})
```

The `*Fns` registries are open-ended; do not cite a number of built-in fns.

### 2. Add `tableFeatures` and register every feature you use

If a feature isn't in `features`, its API isn't on the table (TS error AND runtime
`undefined`). This is v9's biggest behavioral change.

```ts
import {
  columnFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  rowSelectionFeature,
  tableFeatures,
} from '@tanstack/vue-table'

const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  rowSelectionFeature,
})
```

For a quick migration that doesn't audit usage, `stockFeatures` is the "everything" escape
hatch — but it forfeits the bundle benefit. Prefer explicit registration.

### 3. Move state reads off `table.getState()`

```ts
// v8
const sorting = table.getState().sorting

// v9 — pick the narrowest read.
const sorting = table.atoms.sorting.get() // narrowest, no full state object built
const snapshot = table.state // full readonly view
const table = useTable(opts, (s) => ({ sorting: s.sorting })) // selected reactive state
table.state.sorting // typed selector output
```

For Vue reactivity, wrap an atom read in `computed`:

```ts
const sorting = computed(() => table.atoms.sorting.get())
```

### 4. v8 controlled state still works — just use getters

v8 controlled state via `state` + `on[State]Change` is preserved in v9 for migration paths.
The Vue-specific rule is that each `state.<slice>` must be a **getter** so Vue tracks `.value`.

```ts
const sorting = ref<SortingState>([])

const table = useTable({
  features,
  columns,
  data,
  state: {
    get sorting() {
      return sorting.value
    }, // ← getter, not raw ref
  },
  onSortingChange: (u) => {
    sorting.value = typeof u === 'function' ? u(sorting.value) : u
  },
})
```

For new code, prefer `atoms: { sorting: sortingAtom }` from `@tanstack/vue-store` — no
`on[State]Change` plumbing required. See `tanstack-table/vue/compose-with-tanstack-store`.

### 5. Update `<FlexRender>` shape

```vue
<!-- v8 (still works in v9, but verbose) -->
<FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />

<!-- v9 preferred -->
<FlexRender :cell="cell" />
<FlexRender :header="header" />
<FlexRender :footer="header" />
```

Source: `packages/vue-table/src/FlexRender.ts`.

## Common Mistakes

### Importing `useVueTable` (CRITICAL)

```ts
// ❌
import { useVueTable } from '@tanstack/vue-table'

// ✅
import { useTable } from '@tanstack/vue-table'
```

`useVueTable` is not exported. Migration is a rename.

### Trying to use `useLegacyTable` in Vue (CRITICAL)

`useLegacyTable` is a React-only shim from `@tanstack/react-table/legacy`. There is no Vue
equivalent. If you have many tables to convert, do them one file at a time — the renames are
mechanical.

### Passing `getCoreRowModel: getCoreRowModel()` as an option (CRITICAL)

```ts
// ❌ v8 muscle memory.
const table = useTable({
  features,
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
})

// ✅ Core row model is implicit. No `rowModels` option needed.
const table = useTable({ features, columns, data })
```

### Forgetting `features` (CRITICAL)

`features` is required even for a no-features migration. Pass `tableFeatures({})` for empty,
or list everything you use (features + row model factories + fn registries). Without it:
`'features' is missing in type`.

### Wrong `createColumnHelper` generic arity (CRITICAL)

```ts
// ❌ v8
const columnHelper = createColumnHelper<Person>()

// ✅ v9
const columnHelper = createColumnHelper<typeof features, Person>()
```

Same applies to type annotations: `ColumnDef<typeof features, Person>`,
`Row<typeof features, Person>`, `Cell<typeof features, Person, unknown>`.

### Forgetting to register `sortFns` / `filterFns` in the features object (CRITICAL)

```ts
// ❌ Runtime: no sort fns registered, sort is a no-op.
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
})

// ✅ Register the fn map as a slot on the features object.
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
```

### Missed `sortingFn` → `sortFn` rename (HIGH)

```ts
// ❌ v8 name on a column def. TypeScript will complain.
columnHelper.accessor('age', { header: 'Age', sortingFn: 'alphanumeric' })

// ✅
columnHelper.accessor('age', { header: 'Age', sortFn: 'alphanumeric' })
```

### `enablePinning: true` (HIGH)

Split in v9 — pick one or both:

```ts
useTable({
  // ...
  enableColumnPinning: true,
  enableRowPinning: true,
})
```

### Reading `table.getState()` everywhere (HIGH)

The method was removed. Replace each call site explicitly — the right substitute depends on
the read pattern (see "Move state reads off `table.getState()`" above).

### Underscore-prefixed APIs (HIGH)

```ts
row._getAllCellsByColumnId() // ❌
row.getAllCellsByColumnId() // ✅

table._getFacetedRowModel() // ❌
table.getFacetedRowModel() // ✅
```

Drop the underscore on every former internal API.

### Bundling `stockFeatures` and calling it done (HIGH)

`stockFeatures` is the "ship everything" escape hatch — useful during the rename pass to keep
things compiling, but if you don't go back and replace it with an explicit `tableFeatures({...})`
that lists only what you actually render, you forfeit v9's tree-shaking — which is one of the
main reasons to migrate.

### Hallucinating pre-v9 names (CRITICAL — top AI tell)

`useTable` from `react-table` v7, `useVueTable` from v8, `getCoreRowModel()` as an option,
single-generic `createColumnHelper<TData>()`, `sortingFn`, `enablePinning`, `table.getState()` —
all v7/v8 shapes. None of them compile in v9.

### Reimplementing what built-in APIs already provide (CRITICAL — #1 AI tell)

Migration is a great time to delete hand-rolled sort/filter/select state machines and route
through `table.setSorting`, `table.setColumnFilters`, `row.toggleSelected`, `table.nextPage`,
etc.

## See Also

- `tanstack-table/vue/getting-started` — the v9 minimum-viable shape
- `tanstack-table/vue/table-state` — reactivity model + reading state
- `tanstack-table/vue/production-readiness` — finish the migration with bundle + identity audits
- `tanstack-table/table-core/setup` — `features` / row model factory slots deep dive
- `tanstack-table/table-core/column-definitions` — column helper + generics
