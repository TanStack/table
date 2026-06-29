---
name: filtering
description: >
  Filter rows in TanStack Table v9 with the `filteredRowModel` pipeline stage.
  Covers `columnFilteringFeature` + `globalFilteringFeature` + `columnFacetingFeature`,
  `createFilteredRowModel()` (registered on `features` with `filterFns` slot), `createFacetedRowModel()` /
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
library_version: '9.0.0-alpha.48'
requires:
  - state-management
  - customizing-feature-behavior
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

| Subsystem        | Feature                  | Row-model                                     |
| ---------------- | ------------------------ | --------------------------------------------- |
| column-filtering | `columnFilteringFeature` | `createFilteredRowModel()` + `filterFns` slot |
| global-filtering | `globalFilteringFeature` | (same `filteredRowModel`)                     |
| column-faceting  | `columnFacetingFeature`  | `createFacetedRowModel()` + helpers           |
| global-faceting  | `globalFacetingFeature`  | global versions of the helpers                |
| fuzzy-filtering  | (custom filterFn)        | `@tanstack/match-sorter-utils`                |

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

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns,
})

const table = constructTable({
  features,
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

### Faceted filter UIs and fuzzy global search

Faceting requires `createFacetedRowModel()` as the base plus `createFacetedUniqueValues()` / `createFacetedMinMaxValues()` — all registered on the `features` object; fuzzy filtering wires a custom `FilterFn` backed by `@tanstack/match-sorter-utils` (`rankItem` / `compareItems`) with the `filterFns` registry slot and `filterMeta` slot for type-safe meta. Full examples in [faceting-and-fuzzy.md](references/faceting-and-fuzzy.md).

### Server-side filtering

```tsx
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
const { data } = useQuery({
  queryKey: ['rows', columnFilters],
  queryFn: () =>
    fetch('/api/rows?' + serialize(columnFilters)).then((r) => r.json()),
})
const table = useTable({
  features: tableFeatures({ columnFilteringFeature }),
  // no filteredRowModel registered — server filters
  data,
  columns,
  manualFiltering: true,
  state: { columnFilters },
  onColumnFiltersChange: setColumnFilters,
})
```

### Filter tree data and keep matching descendants visible

```ts
const features = tableFeatures({
  columnFilteringFeature,
  rowExpandingFeature,
  filteredRowModel: createFilteredRowModel(),
  expandedRowModel: createExpandedRowModel(),
  filterFns,
})
const table = constructTable({
  features,
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
  features: tableFeatures({
    columnFacetingFeature,
    columnFilteringFeature,
    filteredRowModel: createFilteredRowModel(),
    // BUG: missing facetedRowModel
    facetedUniqueValues: createFacetedUniqueValues(),
    facetedMinMaxValues: createFacetedMinMaxValues(),
    filterFns,
  }),
  columns,
  data,
})
```

Correct:

```tsx
const table = useTable({
  features: tableFeatures({
    columnFacetingFeature,
    columnFilteringFeature,
    rowPaginationFeature,
    filteredRowModel: createFilteredRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    facetedRowModel: createFacetedRowModel(), // REQUIRED base
    facetedMinMaxValues: createFacetedMinMaxValues(),
    facetedUniqueValues: createFacetedUniqueValues(),
    filterFns,
  }),
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
  features: tableFeatures({
    columnFilteringFeature,
    filteredRowModel: createFilteredRowModel(),
    filterFns,
  }),
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
  features: tableFeatures({ columnFilteringFeature }),
  // no filteredRowModel registered for manual mode
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
const features = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { fuzzy: fuzzyFilter }, // BUG: drops built-ins
})
// Column with filterFn: 'includesString' now warns and never filters
```

Correct:

```tsx
import { filterFns } from '@tanstack/react-table'

const features = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: {
    ...filterFns, // KEEP built-ins
    fuzzy: fuzzyFilter, // ADD custom
  },
})
```

The `filterFns` slot replaces the registry with whatever you provide. Any column using a built-in name like `'includesString'` becomes a no-op if the built-ins are dropped.

Source: examples/react/filters-fuzzy/src/main.tsx

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
  features: tableFeatures({
    globalFilteringFeature,
    filteredRowModel: createFilteredRowModel(),
    filterFns,
  }),
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
  features: tableFeatures({
    columnFilteringFeature,
    filteredRowModel: createFilteredRowModel(),
    filterFns,
  }),
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

## References

- [faceting-and-fuzzy.md](references/faceting-and-fuzzy.md) — faceted filter UIs (autocomplete + range slider) with `createFacetedRowModel`/`createFacetedUniqueValues`/`createFacetedMinMaxValues`, fuzzy global search via `@tanstack/match-sorter-utils`, plus MEDIUM-priority failure modes: `state` + `initialState` collision, `filterFromLeafRows` semantics, `'auto'` filter misdetection on null first row
