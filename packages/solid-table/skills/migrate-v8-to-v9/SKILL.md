---
name: migrate-v8-to-v9
description: >
  Mechanical breaking-change migration from `@tanstack/solid-table` v8 to v9.
  Renames (`createSolidTable` → `createTable`, `getCoreRowModel`/`getSortedRowModel`/...
  → `_rowModels` + factories), new required `_features` registration via
  `tableFeatures()`, two-generic `createColumnHelper<typeof _features, TData>`,
  the v9 atom state model, and the lack of a `/legacy` entrypoint for Solid
  (full rewrite, no `useLegacyTable`).
type: lifecycle
library: tanstack-table
framework: solid
library_version: '9.0.0-alpha.47'
requires:
  - tanstack-table/core/setup
  - tanstack-table/core/state-management
  - tanstack-table/core/column-definitions
sources:
  - docs/framework/react/guide/migrating.md
  - docs/framework/solid/solid-table.md
  - docs/framework/solid/guide/table-state.md
  - packages/solid-table/src/createTable.ts
---

# Migrate v8 → v9 for `@tanstack/solid-table`

The Solid adapter has **no `/legacy` entrypoint**. Unlike React (which ships
`useLegacyTable` from `@tanstack/react-table/legacy`), Solid migrations are a
direct rewrite. Plan to do it incrementally per table, not per file.

## What changed (high-level)

1. **Adapter API renamed.** `createSolidTable(...)` → `createTable(...)`.
2. **Features must be registered.** v9 introduced `_features` via `tableFeatures({...})`. Without it, feature APIs and state slices don't exist (TS error + runtime undefined).
3. **Row models moved to `_rowModels`.** No more top-level `getCoreRowModel: getCoreRowModel()` options; instead `_rowModels: { paginatedRowModel: createPaginatedRowModel(), ... }`.
4. **State is atom-based.** Powered by TanStack Store. The classic `state`+`on*Change` pattern still works for compatibility, but `atoms` is the new recommended hand-off for per-slice external ownership.
5. **`createColumnHelper` takes two generics.** `createColumnHelper<typeof _features, TData>()` (features first).
6. **Some method/option renames.** Most notably `sortingFn` → `sortFn`; the `*Fns` registries (`sortFns`, `filterFns`, `aggregationFns`) are now passed to row-model factories.
7. **No `onStateChange` top-level callback.** Use per-slice `on[State]Change` paired with `state.<slice>`, or use `atoms`.

## Rename map

| v8 (Solid)                                                                 | v9 (Solid)                                                                                                  |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `createSolidTable(options)`                                                | `createTable(options, selector?)`                                                                           |
| `getCoreRowModel: getCoreRowModel()`                                       | (core row model included by default; pass `_rowModels: {}`)                                                 |
| `getSortedRowModel: getSortedRowModel()`                                   | `_rowModels: { sortedRowModel: createSortedRowModel(sortFns) }` + register `rowSortingFeature`              |
| `getFilteredRowModel: getFilteredRowModel()`                               | `_rowModels: { filteredRowModel: createFilteredRowModel(filterFns) }` + register `columnFilteringFeature`   |
| `getPaginationRowModel: getPaginationRowModel()`                           | `_rowModels: { paginatedRowModel: createPaginatedRowModel() }` + register `rowPaginationFeature`            |
| `getGroupedRowModel: getGroupedRowModel()`                                 | `_rowModels: { groupedRowModel: createGroupedRowModel(aggregationFns) }` + register `columnGroupingFeature` |
| `getExpandedRowModel: getExpandedRowModel()`                               | `_rowModels: { expandedRowModel: createExpandedRowModel() }` + register `rowExpandingFeature`               |
| `getFacetedRowModel` / `getFacetedUniqueValues` / `getFacetedMinMaxValues` | `_rowModels: { facetedRowModel, facetedUniqueValues, facetedMinMaxValues }` + faceting features             |
| `createColumnHelper<TData>()`                                              | `createColumnHelper<typeof _features, TData>()`                                                             |
| `sortingFn: 'alphanumeric'` on a column                                    | `sortFn: 'alphanumeric'` on a column                                                                        |
| `onStateChange` (whole-state)                                              | (gone — use per-slice `on*Change` or `atoms`)                                                               |
| `state: { ... }` + `onStateChange`                                         | `state: { ... }` + `on[State]Change`, OR `atoms: { ... }`                                                   |
| (no atoms)                                                                 | `atoms: { sorting: someAtom, pagination: someAtom, ... }`                                                   |

## Before → after

### v8 Solid table

```tsx
import {
  createSolidTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
  type SortingState,
} from '@tanstack/solid-table'
import { For, createSignal } from 'solid-js'

const columnHelper = createColumnHelper<Person>()

const columns = [
  columnHelper.accessor('firstName', { header: 'First Name' }),
  columnHelper.accessor('age', { header: 'Age', sortingFn: 'alphanumeric' }),
]

function App(props: { data: Person[] }) {
  const [sorting, setSorting] = createSignal<SortingState>([])

  const table = createSolidTable({
    get data() {
      return props.data
    },
    columns,
    state: {
      get sorting() {
        return sorting()
      },
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return /* ... flexRender(header.column.columnDef.header, header.getContext()) ... */
}
```

### v9 equivalent

```tsx
import {
  createTable,
  FlexRender,
  createColumnHelper,
  createSortedRowModel,
  createPaginatedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  type SortingState,
} from '@tanstack/solid-table'
import { For, createSignal } from 'solid-js'

const _features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { header: 'First Name' }),
  columnHelper.accessor('age', { header: 'Age', sortFn: 'alphanumeric' }),
])

function App(props: { data: Person[] }) {
  const [sorting, setSorting] = createSignal<SortingState>([])

  const table = createTable({
    _features,
    _rowModels: {
      sortedRowModel: createSortedRowModel(sortFns),
      paginatedRowModel: createPaginatedRowModel(),
    },
    columns,
    get data() {
      return props.data
    },
    state: {
      get sorting() {
        return sorting()
      },
    },
    onSortingChange: setSorting,
  })

  // FlexRender component replaces calls to flexRender(def, ctx)
  return (
    <For each={table.getHeaderGroups()}>
      {(hg) => (
        <For each={hg.headers}>
          {(header) => (
            <th>
              <FlexRender header={header} />
            </th>
          )}
        </For>
      )}
    </For>
  )
}
```

## Reading state — `table.state()` is now an accessor

In Solid v9, the `table.state` returned by `createTable` is an **Accessor** —
call it. If you migrated from a non-Solid v8 pattern, double-check this.

```tsx
// v8 muscle memory:
table.getState().sorting

// v9 Solid:
table.state().sorting
```

`table.getState()` still exists on the table-core surface for parity, but
`table.state()` (the accessor) is the Solid-idiomatic read.

## State ownership choices in v9

- **Default**: Pass `initialState`. Table owns everything.
- **Per-slice signal**: Use `state` getters + `on[State]Change` setters (works with `createSignal`).
- **Per-slice external atom (recommended for cross-component / server-driven)**:

  ```tsx
  import { createAtom } from '@tanstack/solid-store'

  const sortingAtom = createAtom<SortingState>([])

  createTable({
    _features,
    _rowModels: { sortedRowModel: createSortedRowModel(sortFns) },
    columns,
    get data() {
      return data()
    },
    atoms: { sorting: sortingAtom },
  })
  ```

  External atoms take precedence over `state`. Don't supply both for the same slice.

## Filter / sort / aggregation `*Fns`

v9 separates the registry (what comparator functions are bundled) from the row
model factory. Pass exactly what you need so the rest tree-shakes.

```tsx
import { sortFns, filterFns, aggregationFns } from '@tanstack/solid-table'

createSortedRowModel(sortFns) // all sort fns
createSortedRowModel({ alphanumeric: sortFns.alphanumeric }) // narrowed
createFilteredRowModel(filterFns)
createGroupedRowModel(aggregationFns)
```

On columns, the option name is now `sortFn`, `filterFn`, `aggregationFn`
(singular), not `sortingFn` / `filteringFn`.

## What does NOT change

- `<For each={table.getRowModel().rows}>` style rendering.
- `accessorKey` / `accessorFn` shapes.
- `header`, `cell`, `footer` definitions (modulo using `FlexRender` instead of raw `flexRender`).
- Reactive getters for `data` (you should already be doing this).
- Feature APIs like `table.nextPage`, `column.toggleSorting`, `row.toggleSelected`.

## Failure modes

### CRITICAL — `_features` missing → API gone

The single biggest v8→v9 trap. `table.setSorting` won't exist unless
`rowSortingFeature` is in `_features`. Likewise for every other feature. v8 had
no such requirement.

### CRITICAL — `getCoreRowModel: getCoreRowModel()` pattern

v9 has no such option. The core row model is included by default. Move every
`get*RowModel` option to a key under `_rowModels` and call the matching
`create*RowModel()` factory. Don't leave the v8 options in place.

### CRITICAL — `createColumnHelper<Person>()` missing the features generic

v8: `createColumnHelper<Person>()`. v9: `createColumnHelper<typeof _features, Person>()`.
Forgetting the first generic gives bad inference and broken cell typing.

### HIGH — `createSolidTable` no longer exists

The function is named `createTable` in Solid v9. (`createSolidTable` was a v8
spelling and is gone.) There is no `useReactTable` analogue on Solid; it's just
`createTable`.

### HIGH — `sortingFn` / `filteringFn` rename

Column-level `sortingFn` is now `sortFn`. Filter is `filterFn`. Aggregation is
`aggregationFn`. Old names typecheck-fail.

### HIGH — top-level `onStateChange`

There is no whole-state `onStateChange` in v9. Migrate to per-slice
`on[State]Change` paired with `state.<slice>`, or move to `atoms`.

### MEDIUM — `state` shape without getters

v8 worked with `state: { sorting: sorting() }` if `sorting()` was read in a
tracked scope. v9 still needs reactive getters: `state: { get sorting() { return sorting() } }`.
Plain values disconnect reactivity.

### MEDIUM — no `/legacy` entrypoint for Solid

If you're searching for `@tanstack/solid-table/legacy` or `useLegacyTable` (the
React fast-path migration), they don't exist on Solid. There is no escape hatch
that preserves the v8 shape — migrate to v9 directly.

### MEDIUM — `flexRender(def, ctx)` calls

Still works, but use the `FlexRender` component for cleaner JSX:

```tsx
// Old
{
  flexRender(cell.column.columnDef.cell, cell.getContext())
}

// New
;<FlexRender cell={cell} />
```
