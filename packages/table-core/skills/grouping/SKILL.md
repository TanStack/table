---
name: grouping
description: >
  Group rows with columnGroupingFeature, groupedRowModel, groupedColumnMode, and manualGrouping, and combine grouping with the independent aggregationFeature. Load for grouped or placeholder cells and grouping interactions with expansion, aggregation, or pagination.
metadata:
  {
    type: sub-skill,
    library: '@tanstack/table-core',
    library_version: '9.0.0-beta.47',
  }
requires: ['core', 'table-features', 'client-vs-server']
sources:
  - 'TanStack/table:docs/framework/react/guide/grouping.md'
  - 'TanStack/table:docs/guide/aggregation.md'
  - 'TanStack/table:packages/table-core/src/features/column-grouping'
  - 'TanStack/table:examples/react/grouping'
---

This skill builds on `core`, `table-features`, and `client-vs-server`. Grouping creates row structure; the independent aggregation feature creates aggregate values; the renderer chooses grouped-cell UI.

## Setup

```ts
import {
  aggregationFeature,
  aggregationFn_sum,
  columnGroupingFeature,
  createGroupedRowModel,
  tableFeatures,
} from '@tanstack/table-core'

export const features = tableFeatures({
  aggregationFeature,
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  aggregationFns: { sum: aggregationFn_sum },
})
```

Import individual `aggregationFn_*` built-ins and register only those your
columns reference by string name or that `aggregationFn: 'auto'` should
resolve (numbers resolve to `sum`, dates to `extent`). The full
`aggregationFns` registry object still works but bundles every built-in.

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

The grouped row-model slot requires `columnGroupingFeature`. The aggregation
registry and aggregation APIs independently require `aggregationFeature`.

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

Inspect `node_modules/@tanstack/table-core/src/features/column-grouping/` for
grouping and `src/features/aggregation/` for aggregation. Load the
`aggregation` skill when totals, multiple aggregations, or custom definitions
are the main task.
