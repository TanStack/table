---
name: migrate-v8-to-v9
description: >
  Mechanical breaking-change migration from TanStack Table v8 to v9 at the
  `@tanstack/table-core` level. Covers hook/entry rename
  (`useReactTable`/`createSolidTable`/… → `useTable`/`injectTable`/`createTable`/
  `constructTable`), the new required `features` option (which now carries row
  model factories and fn registries — `rowModels` option is removed),
  `createColumnHelper<TData>()` → `createColumnHelper<typeof features, TData>()`,
  row-model factory rename (`getCoreRowModel()` → automatic; `getSortedRowModel()`
  → `createSortedRowModel()` as a slot on `tableFeatures({...})` with `sortFns` also
  a slot; same for filtered/paginated/grouped/expanded/faceted), `table.getState()` → `table.store.state` / `table.atoms.<slice>.get()`,
  sorting renames (`sortingFn` → `sortFn`, etc.), `enablePinning` split, column
  sizing/resizing split, underscore-prefixed APIs becoming public, `RowData`
  type tightening, TFeatures-first generics, the `useLegacyTable` React escape
  hatch (deprecated, removed in v10), and the `stockFeatures` v8-style "everything
  on" registry.
type: lifecycle
library: tanstack-table
library_version: '9.0.0-alpha.48'
requires:
  - setup
  - state-management
  - column-definitions
sources:
  - TanStack/table:docs/framework/table-core/guide/migrating.md
  - TanStack/table:docs/framework/react/guide/use-legacy-table.md
  - TanStack/table:packages/react-table/src/legacy.ts
---

## Setup

v9 is a substantial reshape, not a tweak. The breaking changes group into:

1. **Hook/entry rename** per adapter.
2. **`features` is required** — features are tree-shaken. Row model factories and fn registries (`sortFns`, `filterFns`, `aggregationFns`) now live as slots on the `features` object; the `rowModels` option is gone.
3. **Column helper generic order** — `<TFeatures, TData>` not `<TData>`.
4. **Row-model factories** moved out of root options and into `tableFeatures({...})` as named slots; factory args for `*Fns` are replaced by dedicated fn-registry slots on `features`.
5. **State surface renamed** — `table.getState()` → `table.store.state` / `table.atoms.<slice>.get()` / `table.state` (selector).
6. **Sorting names**: `sortingFn` → `sortFn`, `sortingFns` → `sortFns`, `getSortingFn()` → `getSortFn()`, type `SortingFn` → `SortFn`.
7. **`enablePinning` split** into `enableColumnPinning` + `enableRowPinning` (table-level); per-column `enablePinning` stays.
8. **Column resizing split out** of column sizing. `columnSizingInfo` state → `columnResizing`. `onColumnSizingInfoChange` → `onColumnResizingChange`.
9. **Underscore-prefixed APIs are public now** — drop the `_` prefix (`row._getAllCellsByColumnId()` → `row.getAllCellsByColumnId()`, `table._getFacetedRowModel()` → public, etc.).
10. **Generics now lead with `TFeatures`** — `Column<TFeatures, TData, TValue>`, `Row<TFeatures, TData>`, `ColumnMeta<TFeatures, TData, TValue>`.
11. **`RowData` tightened** from `unknown | object | any[]` to `Record<string, any> | Array<any>`.
12. **`data` and `columns` are readonly** in v9 — flow changes through state, don't mutate.

For React projects that cannot migrate every table at once, `useLegacyTable` from `@tanstack/react-table/legacy` accepts the v8 shape on top of the v9 engine. Deprecated, ships every feature, no `table.Subscribe`. Removed in v10.

## Core Patterns

### Full v9 equivalent for the most common v8 shape

```ts
// === v9 (correct) ===
import {
  useTable,
  tableFeatures,
  rowSortingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  columnSizingFeature,
  columnResizingFeature,
  createColumnHelper,
  createSortedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  sortFns,
  filterFns,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  columnSizingFeature,
  columnResizingFeature, // explicit — formerly part of ColumnSizing
  // Row model factories and fn registries are slots on features, not rowModels.
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
  filterFns,
})

const columnHelper = createColumnHelper<typeof features, Person>()

const columns: ColumnDef<typeof features, Person>[] = columnHelper.columns([
  columnHelper.accessor('name', {
    header: 'Name',
    sortFn: 'alphanumeric', // renamed from sortingFn
  }),
])

const table = useTable({
  features,
  columns,
  data,
  enableColumnPinning: true, // split from enablePinning
  enableRowPinning: true,
})

// State reads
const allState = table.store.state // full snapshot
const sorting = table.atoms.sorting.get() // per-slice atom
const cells = row.getAllCellsByColumnId() // no underscore

// Rendering
// <table.FlexRender header={header} />
// <table.FlexRender cell={cell} />
```

### v8 muscle-memory anti-shape

```ts
// === v8 muscle memory — every line is broken in v9. ===
import {
  useReactTable, // (1) renamed → useTable
  getCoreRowModel, // (2) no longer a root option
  getFilteredRowModel, //     move to rowModels as factories
  getSortedRowModel, //     createSortedRowModel(sortFns) etc.
  getPaginationRowModel,
  createColumnHelper, // (3) needs <TFeatures, TData> now
  sortingFns, // (4) renamed → sortFns
  filterFns,
  flexRender, // still exists, prefer table.FlexRender
} from '@tanstack/react-table'
import type { ColumnDef, Row } from '@tanstack/react-table'

const columnHelper = createColumnHelper<Person>() // wrong arity

const columns: ColumnDef<Person>[] = [
  // (5) ColumnDef<TFeatures, TData, TValue> now
  { accessorKey: 'name', header: 'Name', sortingFn: 'alphanumeric' }, // (6) renamed → sortFn
]

const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(), // (2) move into rowModels
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  filterFns, // (7) no longer a root option
  sortingFns, // (4)+(7)
  enablePinning: true, // (8) split → enableColumnPinning / enableRowPinning
  onColumnSizingInfoChange: setInfo, // (9) renamed → onColumnResizingChange
})

const all = table.getState() // (10) → table.store.state
const cells = row._getAllCellsByColumnId() // underscore removed
```

### Transitional `useLegacyTable` (React only)

```ts
import {
  useLegacyTable,
  getCoreRowModel,
  legacyCreateColumnHelper,
} from '@tanstack/react-table/legacy'

const legacyHelper = legacyCreateColumnHelper<Person>()
const legacyTable = useLegacyTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
})
```

This accepts the v8 shape on top of the v9 engine. Deprecated, ships every feature, no `table.Subscribe`, no atoms. Removed in v10. Use to unblock incremental migration only — not as a long-term API. Angular has no `useLegacyTable` equivalent; Angular projects must migrate directly.

## Common Mistakes

### [CRITICAL] Hallucinating react-table v7 / pre-v9 API names

Wrong:

```ts
// v7
import { useTable, useSortBy } from 'react-table'
const table = useTable({ columns, data }, useSortBy)

// v8
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
})
```

Correct:

```ts
import {
  useTable,
  tableFeatures,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
} from '@tanstack/react-table'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
const table = useTable({ features, columns, data })
```

Every major release of TanStack Table has been a substantial upgrade. Agents trained on v7 or v8 will confidently emit shapes that no longer exist. This is the #2 AI failure (after reimplementing built-ins).

Source: maintainer interview (Phase 4, 2026-05-17)

### [CRITICAL] Importing pre-bundled `getCoreRowModel` / `getSortedRowModel` etc.

Wrong:

```ts
// v8 pattern — won't drive v9 row models
const table = useTable({
  features,
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
```

Correct:

```ts
import {
  useTable,
  tableFeatures,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
} from '@tanstack/react-table'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
const table = useTable({ features, columns, data })
```

In v9, row model factories are slots on `features`: `filteredRowModel: createFilteredRowModel()`, `sortedRowModel: createSortedRowModel()`, `groupedRowModel: createGroupedRowModel()`. The fn registries move too: `filterFns`, `sortFns`, `aggregationFns` are named slots on `features`. Core is automatic.

Source: PR #6234 (atoms refactor); packages/table-core/src/index.ts

### [CRITICAL] `createColumnHelper<TData>()` (v8 arity)

Wrong:

```ts
const columnHelper = createColumnHelper<Person>()
```

Correct:

```ts
const features = tableFeatures({ rowSortingFeature })
const columnHelper = createColumnHelper<typeof features, Person>()
```

v9 requires `<TFeatures, TData>`. `typeof features` is the standard idiom — declare features once at module scope and reuse the type.

Source: packages/table-core/src/helpers/columnHelper.ts; docs/framework/react/guide/migrating.md

### [HIGH] Reading state via `table.getState()`

Wrong:

```ts
const all = table.getState()
```

Correct:

```ts
const all = table.store.state // flat snapshot, no subscription
const sorting = table.atoms.sorting.get() // per-slice
const selected = table.state // typed selector output (framework adapters)
```

`table.getState()` was removed. There are three reads now, picked by what you need.

Source: docs/framework/table-core/guide/migrating.md

### [HIGH] Sorting renames missed

Wrong:

```ts
{ accessorKey: 'age', sortingFn: 'alphanumeric' } // v8 name
useTable({ sortingFns: { ... } })                  // v8 option
column.getSortingFn()                              // v8 method
```

Correct:

```ts
columnHelper.accessor('age', { sortFn: 'alphanumeric' })
// sortFns is a slot on features: tableFeatures({ rowSortingFeature, sortedRowModel: createSortedRowModel(), sortFns })
column.getSortFn()
```

v9 renamed every sorting API: `sortingFn` → `sortFn`, `sortingFns` → `sortFns` (now a features slot, not a factory arg), type `SortingFn` → `SortFn`, `getSortingFn()` → `getSortFn()`. TypeScript surfaces these but agents try v8 names first.

Source: packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts

### [HIGH] Using `enablePinning` at the table level

Wrong:

```ts
const table = useTable({
  features: tableFeatures({ columnPinningFeature, rowPinningFeature }),
  enablePinning: true, // ignored at table level in v9
})
```

Correct:

```ts
const table = useTable({
  features: tableFeatures({ columnPinningFeature, rowPinningFeature }),
  enableColumnPinning: true,
  enableRowPinning: true,
})

// Per-column opt-out is still `enablePinning`:
columnHelper.accessor('id', { enablePinning: false })
```

v9 split `enablePinning` (table-level) into `enableColumnPinning` + `enableRowPinning`. The bare name now refers ONLY to per-column opt-out.

Source: packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts

### [HIGH] Treating column resizing as part of column sizing

Wrong:

```ts
// v8 — ColumnSizing implied resizing too
const table = useTable({
  features: tableFeatures({ columnSizingFeature }),
  onColumnSizingInfoChange: setInfo, // v8 name
})
```

Correct:

```ts
const table = useTable({
  features: tableFeatures({
    columnSizingFeature,
    columnResizingFeature, // explicit in v9
  }),
  onColumnResizingChange: setResizing, // renamed
  // state key columnSizingInfo → columnResizing
})
```

v9 split them: `columnSizingFeature` for fixed widths, `columnResizingFeature` for drag-to-resize. State key `columnSizingInfo` → `columnResizing`; option `onColumnSizingInfoChange` → `onColumnResizingChange`.

Source: docs/framework/table-core/guide/migrating.md

### [MEDIUM] Calling underscore-prefixed APIs

Wrong:

```ts
row._getAllCellsByColumnId()
table._getFacetedRowModel()
table._getFacetedMinMaxValues()
table._getFacetedUniqueValues()
table._getPinnedRows()
```

Correct:

```ts
row.getAllCellsByColumnId()
table.getFacetedRowModel()
table.getFacetedMinMaxValues()
table.getFacetedUniqueValues()
table.getPinnedRows()
```

All became public — drop the underscore.

Source: docs/framework/table-core/guide/migrating.md

### [MEDIUM] Module augmentation with v8 generic arity

Wrong:

```ts
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    customProp: string
  }
}
```

Correct:

```ts
declare module '@tanstack/react-table' {
  interface ColumnMeta<TFeatures, TData, TValue> {
    customProp: string
  }
}
```

v9 added `TFeatures` as the first generic. Module augmentation silently widens types if arity is wrong.

Source: docs/framework/table-core/guide/migrating.md

### [MEDIUM] Mutating `data` or `columns` in place

Wrong:

```ts
// v8 pattern, breaks at TS layer in v9
const data: Person[] = []
function addRow(row: Person) {
  data.push(row)
  rerender()
}
```

Correct:

```ts
const [data, setData] = useState<Person[]>([])
function addRow(row: Person) {
  setData((prev) => [...prev, row])
}
```

PR #6183 makes `data` and `columns` readonly to force changes through state.

Source: PR #6183

### [MEDIUM] Reaching for `useLegacyTable` in new code

Wrong:

```ts
// Long-term use of the legacy shim
import { useLegacyTable, getCoreRowModel } from '@tanstack/react-table/legacy'
const table = useLegacyTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
})
```

Correct:

```ts
// Migrate to native v9 shape
import {
  useTable,
  tableFeatures,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
} from '@tanstack/react-table'
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
const table = useTable({ features, columns, data })
```

`useLegacyTable` is React-only, deprecated, bundles every feature, doesn't support `table.Subscribe`, and is removed in v10. It exists to unblock incremental migration — not as a long-term API.

Source: packages/react-table/src/legacy.ts; docs/framework/react/guide/use-legacy-table.md

## See also

- `tanstack-table/setup` — what the v9-native shape looks like
- `tanstack-table/state-management` — `table.store.state` / `table.atoms` / `table.state` ownership
- `tanstack-table/column-definitions` — `createColumnHelper<typeof features, TData>()` generic order
