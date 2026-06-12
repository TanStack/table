---
name: customizing-feature-behavior
description: >
  Override per-column `sortFn`, `filterFn`, `aggregationFn` and table-level
  `globalFilterFn` in TanStack Table v9. Covers built-in `filterFns` / `sortFns` /
  `aggregationFns` registries (registered as slots on `tableFeatures({...})`),
  authoring custom functions with the `FilterFn` / `SortFn` / `AggregationFn`
  signatures, chaining filter→sort via the `addMeta` callback +
  `row.columnFiltersMeta`, `resolveFilterValue`, `autoRemove`, `invertSorting`,
  `sortUndefined` ('first'|'last'|-1|1), and `sortDescFirst`. Distinguishes
  `aggregationFn` (produces value) from `aggregatedCell` (renders value).
type: core
library: tanstack-table
library_version: '9.0.0-alpha.48'
requires:
  - state-management
sources:
  - TanStack/table:docs/guide/sorting.md
  - TanStack/table:docs/guide/column-filtering.md
  - TanStack/table:docs/guide/fuzzy-filtering.md
  - TanStack/table:packages/table-core/src/fns/filterFns.ts
  - TanStack/table:packages/table-core/src/fns/sortFns.ts
  - TanStack/table:packages/table-core/src/fns/aggregationFns.ts
  - TanStack/table:examples/react/filters-fuzzy/src/main.tsx
---

This skill builds on `tanstack-table/state-management`. Read it first for how feature plugins drive state slices.

## Setup

v9 customization happens in three places:

1. **Built-in function registries** — `filterFns`, `sortFns`, `aggregationFns` — registered as named slots on `tableFeatures({...})` so unused fns tree-shake away.
2. **Per-column overrides** — `columnDef.filterFn`, `columnDef.sortFn`, `columnDef.aggregationFn` (string name OR inline function).
3. **Table-level overrides** — `tableOptions.globalFilterFn`.

```ts
import {
  tableFeatures,
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  columnGroupingFeature,
  rowExpandingFeature,
  createFilteredRowModel,
  createSortedRowModel,
  createGroupedRowModel,
  createExpandedRowModel,
  filterFns,
  sortFns,
  aggregationFns,
  metaHelper,
  createColumnHelper,
} from '@tanstack/table-core'
import type {
  FilterFn,
  SortFn,
  AggregationFn,
  TableFeatures,
} from '@tanstack/table-core'
import {
  rankItem,
  compareItems,
  type RankingInfo,
} from '@tanstack/match-sorter-utils'

type Person = {
  id: string
  firstName: string
  lastName: string
  revenue: number
  status: 'single' | 'complicated' | 'relationship'
}

// 1. Describe meta shape for the fuzzy filter.
interface FuzzyFilterMeta {
  itemRank?: RankingInfo
}

// 2. Extend TableFeatures so FilterFn / SortFn can reference filterMeta types.
type FuzzyFeatures = TableFeatures & { filterMeta: FuzzyFilterMeta }

const fuzzyFilter: FilterFn<FuzzyFeatures, Person> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta?.({ itemRank })
  return itemRank.passed
}

// 3. Register everything on features — fn registries are named slots.
const features = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  columnGroupingFeature,
  rowExpandingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  groupedRowModel: createGroupedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  filterFns: { ...filterFns, fuzzy: fuzzyFilter }, // keep built-ins + add custom
  sortFns,
  aggregationFns,
  filterMeta: metaHelper<FuzzyFilterMeta>(),
})

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    filterFn: 'fuzzy', // ← string ref typechecks because 'fuzzy' is in features.filterFns
    sortFn: 'alphanumeric',
  }),
  columnHelper.accessor('revenue', {
    aggregationFn: 'sum',
    aggregatedCell: (info) => `$${info.getValue<number>().toLocaleString()}`,
  }),
])

const table = constructTable({
  features,
  columns,
  data,
  globalFilterFn: 'fuzzy',
})
```

## Core Patterns

### Pick a built-in `sortFn` by name + direction control

```ts
columnHelper.accessor('lastName', {
  sortFn: 'alphanumeric',
  sortDescFirst: false,
  sortUndefined: 'last', // ABSOLUTE: always at end regardless of asc/desc
})
```

Layered direction controls:

- `sortDescFirst: true/false` — first click sorts descending
- `sortUndefined: 'first' | 'last' | -1 | 1 | false` — string forms are absolute; numeric flips with `desc`
- `invertSorting: true` — for "lower-is-better" scales (rank 1 above rank 2 even when descending)

### Filter → sort handoff via `addMeta`

```ts
const fuzzyFilter: FilterFn<typeof features, Person> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta?.({ itemRank })
  return itemRank.passed
}

// Custom sortFn reads the meta the filter stashed
const fuzzySort: SortFn<typeof features, Person> = (rowA, rowB, columnId) => {
  let dir = 0
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId].itemRank!,
      rowB.columnFiltersMeta[columnId].itemRank!,
    )
  }
  return dir === 0 ? sortFns.alphanumeric(rowA, rowB, columnId) : dir
}

columnHelper.accessor('fullName', { filterFn: 'fuzzy', sortFn: fuzzySort })
```

`row.columnFiltersMeta` is keyed by the column id that produced the meta (or `'__global__'` for the global filter). The sortFn MUST look up the same column id its filterFn used.

### Custom `aggregationFn` for grouping

```ts
import type { AggregationFn } from '@tanstack/table-core'

// Signature: (columnId, leafRows, childRows) → aggregated value
// leafRows = all descendant non-grouped rows
// childRows = immediate children (may be sub-aggregates at deeper levels)
const weightedMean: AggregationFn<typeof features, Person> = (
  columnId,
  leafRows,
) => {
  let totalWeight = 0
  let weightedSum = 0
  leafRows.forEach((row) => {
    const v = row.getValue<number>(columnId)
    const w = row.original.revenue
    weightedSum += v * w
    totalWeight += w
  })
  return totalWeight === 0 ? 0 : weightedSum / totalWeight
}

const customFeatures = tableFeatures({
  columnGroupingFeature,
  rowExpandingFeature,
  groupedRowModel: createGroupedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  aggregationFns: { ...aggregationFns, weightedMean },
})

const table = constructTable({
  features: customFeatures,
  columns: columnHelper.columns([
    columnHelper.accessor('revenue', {
      aggregationFn: 'weightedMean',
      aggregatedCell: (info) => `$${info.getValue<number>().toFixed(2)}`,
    }),
  ]),
  data,
})
```

## Common Mistakes

### [CRITICAL] Referencing a custom `filterFn` by string without registering it

Wrong:

```ts
// "fuzzy" string never registered in features.filterFns
const features = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns, // ❌ built-ins only — no fuzzy
})
const table = useTable({
  features,
  columns: [columnHelper.accessor('fullName', { filterFn: 'fuzzy' })],
  data,
})
```

Correct:

```ts
const fuzzyFilter: FilterFn<FuzzyFeatures, Person> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta?.({ itemRank })
  return itemRank.passed
}

const features = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { ...filterFns, fuzzy: fuzzyFilter }, // ✅ registered
  filterMeta: metaHelper<FuzzyFilterMeta>(),
})

const table = useTable({
  features,
  columns: [columnHelper.accessor('fullName', { filterFn: 'fuzzy' })],
  data,
})
```

String values are looked up in `features.filterFns`. Unregistered names log `Could not find a valid 'column.filterFn' …` in dev and silently no-op in prod.

Source: examples/react/filters-fuzzy/src/main.tsx; packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts

### [HIGH] Using v8 `sortingFn` / `sortingFns` names

Wrong:

```ts
columnHelper.accessor('age', {
  sortingFn: 'alphanumeric', // v8 name — ignored
})
```

Correct:

```ts
columnHelper.accessor('age', {
  sortFn: 'alphanumeric',
})
```

v9 renamed every sorting API: `sortingFn` → `sortFn`, `sortingFns` → `sortFns`, type `SortingFn` → `SortFn`, `column.getSortingFn()` → `column.getSortFn()`. The default `sortFn` is `'auto'`, falling back to `sortFn_basic` if the lookup misses — so wrong names sort wrong instead of erroring.

Source: docs/framework/react/guide/migrating.md; packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts

### [HIGH] Custom `sortFn` reads filter meta from a different column id

Wrong:

```ts
// filter on 'fullName', sort reads meta from 'firstName'
const fuzzySort: SortFn<typeof features, Person> = (a, b, columnId) => {
  const meta = a.columnFiltersMeta['firstName'] // ❌ wrong key
  return meta
    ? compareItems(meta.itemRank, b.columnFiltersMeta['firstName'].itemRank)
    : 0
}
columnHelper.accessor('fullName', { filterFn: 'fuzzy', sortFn: fuzzySort })
```

Correct:

```ts
const fuzzySort: SortFn<typeof features, Person> = (rowA, rowB, columnId) => {
  let dir = 0
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId].itemRank!,
      rowB.columnFiltersMeta[columnId].itemRank!,
    )
  }
  return dir === 0 ? sortFns.alphanumeric(rowA, rowB, columnId) : dir
}
```

`row.columnFiltersMeta` is keyed by the column id that produced it. Always use the `columnId` argument the sortFn receives.

Source: examples/react/filters-fuzzy/src/main.tsx

### [MEDIUM] Returning a complex value from the accessor while using a built-in `sortFn`

Wrong:

```ts
// accessor returns object; alphanumeric sees "[object Object]"
columnHelper.accessor((row) => row.name, {
  id: 'name',
  sortFn: 'alphanumeric',
})
```

Correct:

```ts
// Option A — return a primitive
columnHelper.accessor((row) => `${row.name.first} ${row.name.last}`, {
  id: 'fullName',
  sortFn: 'alphanumeric',
})

// Option B — custom sortFn that knows the shape
columnHelper.accessor((row) => row.name, {
  id: 'name',
  sortFn: (a, b, id) => {
    const av = a.getValue<{ first: string }>(id).first
    const bv = b.getValue<{ first: string }>(id).first
    return av === bv ? 0 : av > bv ? 1 : -1
  },
})
```

Built-in sortFns (`alphanumeric`, `text`, `basic`) coerce via comparison operators. Object accessors collapse to `"[object Object]"` and every row ties.

Source: packages/table-core/src/fns/sortFns.ts

### [MEDIUM] Confusing `aggregationFn` with `aggregatedCell`

Wrong:

```ts
// rendering JSX inside the aggregation function
columnHelper.accessor('revenue', {
  aggregationFn: (id, leaves) => <b>${leaves.reduce((a, r) => a + r.getValue(id), 0)}</b>,
})
```

Correct:

```ts
columnHelper.accessor('revenue', {
  aggregationFn: 'sum', // returns a value
  aggregatedCell: (info) => <b>${info.getValue<number>().toLocaleString()}</b>, // renders it
})
```

`aggregationFn` produces the grouped-row value (signature `(columnId, leafRows, childRows)`). `aggregatedCell` renders it. Don't combine.

Source: packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts

### [CRITICAL] Reimplementing what built-in APIs provide

Wrong:

```ts
// Reimplements sorting state manually instead of using the API
const [sorting, setSorting] = useState([])
const sortedData = useMemo(() => [...data].sort(/* … */), [data, sorting])
```

Correct:

```ts
const table = useTable({
  features: tableFeatures({
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),
    sortFns,
  }),
  columns,
  data,
})
// table.setSorting(...), column.toggleSorting(), header.getToggleSortingHandler()
```

Source: maintainer interview (Phase 4, 2026-05-17)

## See also

- `tanstack-table/filtering` — `filterFn` placement, fuzzy filter pattern, faceted UI
- `tanstack-table/sorting` — built-in `sortFns`, multi-sort, `sortUndefined`
- `tanstack-table/grouping` — `aggregationFn` signature details and built-ins
