# Column faceting

Faceting derives filter choices; it does not render controls.

## Setup

```ts
import {
  columnFacetingFeature,
  columnFilteringFeature,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  filterFn_includesString,
  filterFn_inNumberRange,
  tableFeatures,
} from '@tanstack/table-core'

export const features = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
  },
  columnFacetingFeature,
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
})
```

## Core patterns

```ts
const counts = table.getColumn('status')?.getFacetedUniqueValues() ?? new Map()
const range = table.getColumn('age')?.getFacetedMinMaxValues()
```

Use unique values for discrete controls and min/max only for numeric ranges.
The filtered model makes facets respond to the table's other active filters.
Register individually imported built-ins under their conventional keys so
columns can reference them by string name; a column may instead receive a
filter function directly without registering it. The full `filterFns` registry
object still works but bundles every built-in.

## Common mistakes

### [HIGH] Registering APIs without model slots

Wrong: `tableFeatures({ columnFilteringFeature, columnFacetingFeature })`

Correct: `tableFeatures({ columnFilteringFeature, columnFacetingFeature, facetedRowModel: createFacetedRowModel(), facetedUniqueValues: createFacetedUniqueValues() })`

Each faceting getter needs its matching factory slot.

Source: `packages/table-core/src/features/column-faceting/columnFacetingFeature.ts`

### Facets exclude their own column filter

A column facet intentionally applies the other active filters while excluding its own. A filter dropdown therefore retains alternative values even after the user selects one value in that column. Read [column filtering](column-filtering.md) when also changing how those filters process rows.

Source: `docs/framework/react/guide/column-faceting.md`

### [HIGH] Treating page facets as global

Wrong: `const globalCounts = column.getFacetedUniqueValues()`

Correct: `const globalCounts = await fetchFacetCounts(activeFilters)`

With server pagination, client faceting sees only loaded data.

Source: `docs/framework/react/guide/column-faceting.md#custom-server-side-faceting`

## API discovery

Inspect `node_modules/@tanstack/table-core/dist/features/column-faceting/` for exact getters and factory return types.

## Sources

- `TanStack/table:docs/framework/react/guide/column-faceting.md`
- `TanStack/table:packages/table-core/src/features/column-faceting`
- `TanStack/table:examples/react/filters-faceted`
