---
name: column-faceting
description: >
  Build faceted filter UIs with columnFacetingFeature, facetedRowModel, facetedUniqueValues, and facetedMinMaxValues. Load for facet counts, numeric ranges, own-filter exclusion, or server-page facet completeness.
metadata:
  {
    type: sub-skill,
    library: '@tanstack/table-core',
    library_version: '9.0.0-beta.48',
  }
requires: ['core', 'table-features', 'column-filtering']
sources:
  - 'TanStack/table:docs/framework/react/guide/column-faceting.md'
  - 'TanStack/table:packages/table-core/src/features/column-faceting'
  - 'TanStack/table:examples/react/filters-faceted'
---

This skill builds on `core`, `table-features`, and `column-filtering`. Faceting derives filter choices; it does not render controls.

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

## Core Patterns

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

## Common Mistakes

### [HIGH] Registering APIs without model slots

Wrong: `tableFeatures({ columnFilteringFeature, columnFacetingFeature })`

Correct: `tableFeatures({ columnFilteringFeature, columnFacetingFeature, facetedRowModel: createFacetedRowModel(), facetedUniqueValues: createFacetedUniqueValues() })`

Each faceting getter needs its matching factory slot.

Source: `packages/table-core/src/features/column-faceting/columnFacetingFeature.ts`

### [MEDIUM] Expecting facet to apply itself

Wrong: `column.getFacetedUniqueValues().get(activeValue) === 0`

Correct: `column.getFacetedUniqueValues().get(activeValue) ?? 0`

A column facet intentionally excludes that column's own filter while applying other filters.

Source: `docs/framework/react/guide/column-faceting.md`

### [HIGH] Treating page facets as global

Wrong: `const globalCounts = column.getFacetedUniqueValues()`

Correct: `const globalCounts = await fetchFacetCounts(activeFilters)`

With server pagination, client faceting sees only loaded data.

Source: `docs/framework/react/guide/column-faceting.md#custom-server-side-faceting`

## API Discovery

Inspect `node_modules/@tanstack/table-core/src/features/column-faceting/` for exact getters and factory return types.
