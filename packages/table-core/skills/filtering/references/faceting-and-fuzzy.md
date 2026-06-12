# Faceting and fuzzy filtering — extended patterns

Extended filtering patterns extracted from `SKILL.md`. The SKILL keeps simple column filter, global filter, server-side, and tree-data patterns inline; this file covers faceted UIs and fuzzy filtering with `@tanstack/match-sorter-utils`.

## Faceted filter UIs (autocomplete + range slider)

```ts
import {
  columnFacetingFeature,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFacetedMinMaxValues,
} from '@tanstack/table-core'

const features = tableFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  facetedRowModel: createFacetedRowModel(), // REQUIRED base
  facetedMinMaxValues: createFacetedMinMaxValues(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filterFns,
})

const table = constructTable({
  features,
  columns,
  data,
})

// In a Filter component:
const uniqueValues = column.getFacetedUniqueValues() // Map<value, count>
const [min, max] = column.getFacetedMinMaxValues() ?? [0, 0]
```

## Fuzzy global search with match-sorter-utils

```ts
import {
  rankItem,
  compareItems,
  type RankingInfo,
} from '@tanstack/match-sorter-utils'
import {
  tableFeatures,
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  createFilteredRowModel,
  createSortedRowModel,
  filterFns,
  sortFns,
  metaHelper,
} from '@tanstack/table-core'
import type { FilterFn, SortFn, TableFeatures } from '@tanstack/table-core'

// 1. Describe the filterMeta shape for this feature set.
interface FuzzyFilterMeta {
  itemRank?: RankingInfo
}

// 2. Extend TableFeatures so FilterFn / SortFn can read filterMeta types.
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

const fuzzySort: SortFn<FuzzyFeatures, Person> = (rowA, rowB, columnId) => {
  let dir = 0
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId].itemRank!,
      rowB.columnFiltersMeta[columnId].itemRank!,
    )
  }
  return dir === 0 ? sortFns.alphanumeric(rowA, rowB, columnId) : dir
}

// 3. Register everything on features — no rowModels option needed.
const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { ...filterFns, fuzzy: fuzzyFilter },
  sortFns: { ...sortFns, fuzzy: fuzzySort },
  filterMeta: metaHelper<FuzzyFilterMeta>(),
})

const table = constructTable({
  features,
  columns,
  data,
  globalFilterFn: 'fuzzy',
})
```

Use string refs in column defs when the fn is registered:

```ts
columnHelper.accessor('fullName', {
  filterFn: 'fuzzy', // string ref — typechecks because 'fuzzy' is in features.filterFns
  sortFn: 'fuzzy',
})
```

## Additional MEDIUM-priority failure modes

### Using `state.columnFilters` AND `initialState.columnFilters` simultaneously

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

### Expecting `filterFromLeafRows` to keep ALL children of a matching parent visible

Wrong:

```tsx
// filterFromLeafRows hides children that don't match individually
const table = useTable({
  features: tableFeatures({
    columnFilteringFeature,
    rowExpandingFeature,
    filteredRowModel: createFilteredRowModel(),
    expandedRowModel: createExpandedRowModel(),
    filterFns,
  }),
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
  features: tableFeatures({
    columnFilteringFeature,
    rowExpandingFeature,
    filteredRowModel: createFilteredRowModel(),
    expandedRowModel: createExpandedRowModel(),
    filterFns,
  }),
  columns,
  data,
  getSubRows: (r) => r.subRows,
  maxLeafRowFilterDepth: 0,
})
```

`filterFromLeafRows: true` is bottom-up. The mutually exclusive top-down default is what preserves descendants under a matching parent.

Source: packages/table-core/src/features/column-filtering/filterRowsUtils.ts

### Auto filter type misdetects when first row has `null`/`undefined`

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
