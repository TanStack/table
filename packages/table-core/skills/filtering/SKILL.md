---
name: filtering
description: >
  Filter rows in TanStack Table v9 with the `filteredRowModel` pipeline stage.
  Covers `columnFilteringFeature` + `globalFilteringFeature` + `columnFacetingFeature`,
  `createFilteredRowModel(filterFns)`, `createFacetedRowModel()` /
  `createFacetedUniqueValues()` / `createFacetedMinMaxValues()`, fuzzy filtering
  with `@tanstack/match-sorter-utils`, the built-in `filterFns` registry, custom
  `filterFn` + module augmentation, `state.columnFilters` (Array<{ id, value }>),
  `state.globalFilter`, `column.setFilterValue` / `setColumnFilters` /
  `setGlobalFilter`, `column.getFacetedUniqueValues` /
  `column.getFacetedMinMaxValues`, `manualFiltering`, `filterFromLeafRows`,
  `maxLeafRowFilterDepth`, `getColumnCanGlobalFilter`. Five subsystems:
  column-filtering, global-filtering, column-faceting, global-faceting,
  fuzzy-filtering.
type: core
library: tanstack-table
library_version: '9.0.0-alpha.47'
requires:
  - tanstack-table/state-management
  - tanstack-table/customizing-feature-behavior
sources:
  - TanStack/table:docs/guide/column-filtering.md
  - TanStack/table:docs/guide/global-filtering.md
  - TanStack/table:docs/guide/column-faceting.md
  - TanStack/table:docs/guide/global-faceting.md
  - TanStack/table:docs/guide/fuzzy-filtering.md
  - TanStack/table:examples/react/filters/src/main.tsx
  - TanStack/table:examples/react/filters-faceted/src/main.tsx
  - TanStack/table:examples/react/filters-fuzzy/src/main.tsx
---

This skill builds on `tanstack-table/state-management` and `tanstack-table/customizing-feature-behavior`. Read those first for the atom model and `filterFn`/`globalFilterFn` overrides.

## Setup

Filtering has five subsystems in v9 — register only the features you need:

| Subsystem        | Feature                  | Row-model                           |
| ---------------- | ------------------------ | ----------------------------------- |
| column-filtering | `columnFilteringFeature` | `createFilteredRowModel(filterFns)` |
| global-filtering | `globalFilteringFeature` | (same `filteredRowModel`)           |
| column-faceting  | `columnFacetingFeature`  | `createFacetedRowModel()` + helpers |
| global-faceting  | `globalFacetingFeature`  | global versions of the helpers      |
| fuzzy-filtering  | (custom filterFn)        | `@tanstack/match-sorter-utils`      |

```ts
import {
  tableFeatures,
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFns,
} from '@tanstack/table-core'
import type { ColumnFiltersState } from '@tanstack/table-core'

const _features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
})

const table = constructTable({
  _features,
  _rowModels: {
    filteredRowModel: createFilteredRowModel(filterFns),
    paginatedRowModel: createPaginatedRowModel(),
  },
  columns,
  data,
  initialState: {
    columnFilters: [] satisfies ColumnFiltersState,
    globalFilter: '',
  },
  globalFilterFn: 'includesString',
})

table.setColumnFilters([{ id: 'firstName', value: 'Ada' }])
table.setGlobalFilter('Lovelace')
```

## Core Patterns

### Text / range / select column filters

```tsx
// From examples/react/filters/src/main.tsx
function Filter({ column }) {
  const firstValue = column
    .getFacetedRowModel()
    .flatRows[0]?.getValue(column.id)
  const columnFilterValue = column.getFilterValue()

  return typeof firstValue === 'number' ? (
    <div>
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder="Min"
      />
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder="Max"
      />
    </div>
  ) : (
    <input
      value={(columnFilterValue ?? '') as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder="Search…"
    />
  )
}
```

### Faceted filter UIs (autocomplete + range slider)

```ts
import {
  columnFacetingFeature,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFacetedMinMaxValues,
} from '@tanstack/table-core'

const _features = tableFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  rowPaginationFeature,
})

const table = constructTable({
  _features,
  _rowModels: {
    filteredRowModel: createFilteredRowModel(filterFns),
    paginatedRowModel: createPaginatedRowModel(),
    facetedRowModel: createFacetedRowModel(), // REQUIRED base
    facetedMinMaxValues: createFacetedMinMaxValues(),
    facetedUniqueValues: createFacetedUniqueValues(),
  },
  columns,
  data,
})

// In a Filter component:
const uniqueValues = column.getFacetedUniqueValues() // Map<value, count>
const [min, max] = column.getFacetedMinMaxValues() ?? [0, 0]
```

### Fuzzy global search with match-sorter-utils

```ts
import {
  rankItem,
  compareItems,
  type RankingInfo,
} from '@tanstack/match-sorter-utils'
import type { FilterFn, SortFn } from '@tanstack/table-core'

declare module '@tanstack/react-table' {
  interface FilterFns {
    fuzzy: FilterFn<typeof _features, Person>
  }
  interface FilterMeta {
    itemRank?: RankingInfo
  }
}

const fuzzyFilter: FilterFn<typeof _features, Person> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta?.({ itemRank })
  return itemRank.passed
}

const fuzzySort: SortFn<typeof _features, Person> = (rowA, rowB, columnId) => {
  let dir = 0
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId].itemRank!,
      rowB.columnFiltersMeta[columnId].itemRank!,
    )
  }
  return dir === 0 ? sortFns.alphanumeric(rowA, rowB, columnId) : dir
}

const table = constructTable({
  _features,
  _rowModels: {
    filteredRowModel: createFilteredRowModel({
      ...filterFns,
      fuzzy: fuzzyFilter,
    }),
    sortedRowModel: createSortedRowModel(sortFns),
  },
  columns,
  data,
  globalFilterFn: 'fuzzy',
})
```

### Server-side filtering

```tsx
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
const { data } = useQuery({
  queryKey: ['rows', columnFilters],
  queryFn: () =>
    fetch('/api/rows?' + serialize(columnFilters)).then((r) => r.json()),
})
const table = useTable({
  _features: tableFeatures({ columnFilteringFeature }),
  _rowModels: {}, // no filteredRowModel needed for manual filtering
  data,
  columns,
  manualFiltering: true,
  state: { columnFilters },
  onColumnFiltersChange: setColumnFilters,
})
```

### Filter tree data and keep matching descendants visible

```ts
const table = constructTable({
  _features: tableFeatures({ columnFilteringFeature, rowExpandingFeature }),
  _rowModels: {
    filteredRowModel: createFilteredRowModel(filterFns),
    expandedRowModel: createExpandedRowModel(),
  },
  columns,
  data,
  getSubRows: (r) => r.subRows,
  filterFromLeafRows: true, // bottom-up: keep parent if any descendant matches
})
```

## Common Mistakes

### [HIGH] Forgetting `createFacetedRowModel()` while registering `createFacetedUniqueValues()` / `createFacetedMinMaxValues()`

Wrong:

```tsx
const table = useTable({
  _features: tableFeatures({ columnFacetingFeature, columnFilteringFeature }),
  _rowModels: {
    filteredRowModel: createFilteredRowModel(filterFns),
    // BUG: missing facetedRowModel
    facetedUniqueValues: createFacetedUniqueValues(),
    facetedMinMaxValues: createFacetedMinMaxValues(),
  },
  columns,
  data,
})
```

Correct:

```tsx
const table = useTable({
  _features: tableFeatures({
    columnFacetingFeature,
    columnFilteringFeature,
    rowPaginationFeature,
  }),
  _rowModels: {
    filteredRowModel: createFilteredRowModel(filterFns),
    paginatedRowModel: createPaginatedRowModel(),
    facetedRowModel: createFacetedRowModel(), // REQUIRED base
    facetedMinMaxValues: createFacetedMinMaxValues(),
    facetedUniqueValues: createFacetedUniqueValues(),
  },
  columns,
  data,
})
```

Without the base `facetedRowModel`, the unique/minMax helpers fall back to `getPreFilteredRowModel()` — facet values stop excluding the column's own active filter, and a select dropdown collapses to only the currently selected value once the user picks one.

Source: packages/table-core/src/features/column-faceting/columnFacetingFeature.utils.ts; examples/react/filters-faceted/src/main.tsx

### [HIGH] Setting `manualFiltering: true` without refetching data

Wrong:

```tsx
// manualFiltering bypasses the filteredRowModel — filter UI changes do nothing
const table = useTable({
  _features: tableFeatures({ columnFilteringFeature }),
  _rowModels: { filteredRowModel: createFilteredRowModel(filterFns) },
  data,
  columns,
  manualFiltering: true,
  // ...but no useEffect / useQuery key tracking columnFilters
})
```

Correct:

```tsx
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
const { data } = useQuery({
  queryKey: ['rows', columnFilters],
  queryFn: () =>
    fetch('/api/rows?' + serialize(columnFilters)).then((r) => r.json()),
})

const table = useTable({
  _features: tableFeatures({ columnFilteringFeature }),
  _rowModels: {}, // no filteredRowModel needed
  data,
  columns,
  manualFiltering: true,
  state: { columnFilters },
  onColumnFiltersChange: setColumnFilters,
})
```

With `manualFiltering: true`, `table_getFilteredRowModel` short-circuits and returns the core rows. Rows are NOT filtered client-side — you must refetch.

Source: docs/guide/column-filtering.md; packages/table-core/src/core/row-models/coreRowModelsFeature.utils.ts

### [HIGH] Custom fuzzy filter without merging into `filterFns`

Wrong:

```tsx
// drops the built-in registry
filteredRowModel: createFilteredRowModel({
  fuzzy: fuzzyFilter,
}),
// Column with filterFn: 'includesString' now warns and never filters
```

Correct:

```tsx
import { filterFns } from '@tanstack/react-table'

filteredRowModel: createFilteredRowModel({
  ...filterFns, // KEEP built-ins
  fuzzy: fuzzyFilter, // ADD custom
}),
```

`createFilteredRowModel` replaces the registry with whatever you pass. Any column using a built-in name like `'includesString'` becomes a no-op.

Source: examples/react/filters-fuzzy/src/main.tsx

### [MEDIUM] Using `state.columnFilters` AND `initialState.columnFilters` simultaneously

Wrong:

```tsx
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
const table = useTable({
  initialState: { columnFilters: [{ id: 'name', value: 'John' }] }, // IGNORED
  state: { columnFilters }, // wins, starts empty
  onColumnFiltersChange: setColumnFilters,
})
```

Correct:

```tsx
// Seed the controlled state at useState time, NOT in initialState
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
  { id: 'name', value: 'John' },
])
const table = useTable({
  state: { columnFilters },
  onColumnFiltersChange: setColumnFilters,
})
```

`state` always overrides `initialState`. Seed your controlled state instead.

Source: docs/guide/column-filtering.md

### [MEDIUM] Global filter silently skips columns with non-string/non-number values

Wrong:

```tsx
// createdAt is a Date object — global filter silently skips it
const columns = [
  columnHelper.accessor('createdAt', { header: 'Created' }),
  columnHelper.accessor('name', { header: 'Name' }),
]
// table.setGlobalFilter('2024') will never find Date rows
```

Correct:

```tsx
const table = useTable({
  _features: tableFeatures({ globalFilteringFeature }),
  _rowModels: { filteredRowModel: createFilteredRowModel(filterFns) },
  columns,
  data,
  globalFilterFn: 'includesString',
  getColumnCanGlobalFilter: (column) => true, // include every column
})

// Or per-column:
columnHelper.accessor('createdAt', {
  header: 'Created',
  enableGlobalFilter: true,
})
```

`globalFilteringFeature` defaults `getColumnCanGlobalFilter` to a function that returns `typeof value === 'string' || typeof value === 'number'` sampled from the first row. Objects, dates, booleans, undefined all silently fail.

Source: packages/table-core/src/features/global-filtering/globalFilteringFeature.ts

### [MEDIUM] Expecting `filterFromLeafRows` to keep ALL children of a matching parent visible

Wrong:

```tsx
// filterFromLeafRows hides children that don't match individually
const table = useTable({
  _features: tableFeatures({ columnFilteringFeature, rowExpandingFeature }),
  _rowModels: {
    filteredRowModel: createFilteredRowModel(filterFns),
    expandedRowModel: createExpandedRowModel(),
  },
  columns,
  data,
  getSubRows: (r) => r.subRows,
  filterFromLeafRows: true,
  // expectation: parent matches "John" → all children visible
  // reality: only children that also match "John" stay visible
})
```

Correct:

```tsx
// Filter root-only to preserve all sub-rows under a matching parent
const table = useTable({
  _features: tableFeatures({ columnFilteringFeature, rowExpandingFeature }),
  _rowModels: {
    filteredRowModel: createFilteredRowModel(filterFns),
    expandedRowModel: createExpandedRowModel(),
  },
  columns,
  data,
  getSubRows: (r) => r.subRows,
  maxLeafRowFilterDepth: 0,
})
```

`filterFromLeafRows: true` is bottom-up. The mutually exclusive top-down default is what preserves descendants under a matching parent.

Source: packages/table-core/src/features/column-filtering/filterRowsUtils.ts

### [MEDIUM] Auto filter type misdetects when first row has `null`/`undefined`

Wrong:

```ts
const data = [
  { id: 1, name: null }, // first row
  { id: 2, name: 'Alice' },
]
// Column filter returns 0 results — auto picked wrong filter from null
```

Correct:

```ts
columnHelper.accessor('name', {
  filterFn: 'includesString', // explicit, don't rely on auto
})
```

The default `'auto'` `filterFn` infers from the first row's value. If it's null/undefined, type detection fails.

Source: https://github.com/TanStack/table/issues/4711

### [CRITICAL] Reimplementing what built-in APIs provide

Wrong:

```ts
// Hand-rolled filter loop, bypassing the table
const filteredData = useMemo(
  () => data.filter(/* …custom matching… */),
  [data, query],
)
```

Correct:

```ts
const table = useTable({
  _features: tableFeatures({ columnFilteringFeature }),
  _rowModels: { filteredRowModel: createFilteredRowModel(filterFns) },
  columns,
  data,
})
table.setColumnFilters([{ id: 'name', value: 'Ada' }])
// or: column.setFilterValue('Ada')
```

`table.setColumnFilters`, `column.setFilterValue`, `table.setGlobalFilter` honor reset behavior and internal invariants.

Source: maintainer interview (Phase 4, 2026-05-17)

## See also

- `tanstack-table/customizing-feature-behavior` — `filterFn` / `globalFilterFn` authoring, `addMeta` chain
- `tanstack-table/sorting` — fuzzy sort pairing for `match-sorter-utils`
- `tanstack-table/row-expanding` — `filterFromLeafRows` interaction with tree data
