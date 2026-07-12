---
name: grouping
description: >
  Group and aggregate rows with columnGroupingFeature, groupedRowModel, aggregationFns, groupedColumnMode, and manualGrouping. Load for grouped, placeholder, or aggregated cells and grouping interactions with expansion or pagination.
metadata:
  {
    type: sub-skill,
    library: '@tanstack/table-core',
    library_version: '9.0.0-beta.43',
  }
requires: ['core', 'table-features', 'client-vs-server']
sources:
  - 'TanStack/table:docs/framework/react/guide/grouping.md'
  - 'TanStack/table:packages/table-core/src/features/column-grouping'
  - 'TanStack/table:examples/react/grouping'
---

This skill builds on `core`, `table-features`, and `client-vs-server`. Grouping creates row structure and aggregate values; the renderer chooses grouped-cell UI.

## Setup

```ts
import {
  aggregationFns,
  columnGroupingFeature,
  createGroupedRowModel,
  tableFeatures,
} from '@tanstack/table-core'

export const features = tableFeatures({
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  aggregationFns,
})
```

## Core Patterns

```ts
const options = { groupedColumnMode: 'reorder' as const }
const mode = cell.getIsGrouped()
  ? 'grouped'
  : cell.getIsAggregated()
    ? 'aggregated'
    : cell.getIsPlaceholder()
      ? 'placeholder'
      : 'value'
```

Render these cell modes deliberately.

## Common Mistakes

### [HIGH] Registering processing without grouping

Wrong: `tableFeatures({ groupedRowModel: createGroupedRowModel() })`

Correct: `tableFeatures({ columnGroupingFeature, groupedRowModel: createGroupedRowModel() })`

The grouped slot and aggregation registry require `columnGroupingFeature`.

Source: `packages/table-core/src/types/TableFeatures.ts#FeatureSlotPrereqs`

### [HIGH] Treating rendered rows as underlying records

Wrong: `const leafCount = table.getRowModel().flatRows.filter(row => !row.subRows.length).length`

Correct:

```ts
const countLeafRows = (rows: typeof groupRow.subRows): number =>
  rows.reduce(
    (count, row) =>
      count + (row.subRows.length ? countLeafRows(row.subRows) : 1),
    0,
  )
const leafCount = countLeafRows(groupRow.subRows)
```

Count descendants from one group row rather than the flattened render model,
where group rows and expanded rows may both appear. The current
`table.getRowModel().rows` is render order, while original dataset counts come
from the data owner.

Source: `docs/framework/react/guide/grouping.md`

### [HIGH] Rendering every cell identically

Wrong: `render(cell.getValue())`

Correct: `render(cell.getIsPlaceholder() ? null : cell.getValue())`

Placeholder and aggregated cells do not represent ordinary leaf values.

Source: `examples/react/grouping/src/main.tsx`

## API Discovery

Inspect `node_modules/@tanstack/table-core/src/features/column-grouping/` and `src/fns/aggregationFns.ts`.
