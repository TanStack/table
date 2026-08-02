---
name: aggregation
description: >
  Aggregate TanStack Table columns independently of grouping, including grand totals, caller-selected row totals, multiple keyed aggregations, custom context-based definitions, grouped merges, manual values, and worker constraints.
metadata:
  {
    type: sub-skill,
    library: '@tanstack/table-core',
    library_version: '9.0.0-beta.70',
  }
requires: ['core', 'table-features']
sources:
  - 'TanStack/table:docs/guide/aggregation.md'
  - 'TanStack/table:docs/framework/react/guide/aggregation.md'
  - 'TanStack/table:packages/table-core/src/features/row-aggregation'
  - 'TanStack/table:examples/react/aggregation'
  - 'TanStack/table:examples/react/grouped-aggregation'
---

This skill builds on `core` and `table-features`. Aggregation is independent
from grouping: use it alone for totals, or combine it with the `grouping` skill
for synthetic grouped rows.

## Setup

<!-- skill-snippet:check -->

```ts
import {
  rowAggregationFeature,
  aggregationFn_mean,
  aggregationFn_sum,
  tableFeatures,
} from '@tanstack/table-core'

export const features = tableFeatures({
  rowAggregationFeature,
  aggregationFns: {
    mean: aggregationFn_mean,
    sum: aggregationFn_sum,
  },
})
```

## Core Patterns

### Grand total and selected row scopes

```ts
const grandTotal = salaryColumn.getAggregationValue()
const filteredTotal = salaryColumn.getAggregationValue({
  rows: table.getFilteredRowModel().rows,
})
const childTotal = salaryColumn.getAggregationValue({
  rows: table.getCoreRowModel().rows,
  maxDepth: 1,
})
```

The default uses the pre-grouped row model. Explicit rows can come from any row
model or caller-selected subset. `maxAggregationDepth` defaults to `0`, which
selects the supplied roots; `1` selects direct sub-rows, and `Infinity` selects
terminal rows. Branches that end early contribute their deepest available row.
Default calls are cached; explicit-row calls intentionally are not because array
identity and contents are caller-owned. `table.getMaxSubRowDepth()` returns the
deepest structural depth in the core row model.

### Multiple aggregations

```ts
columnHelper.accessor('salary', {
  aggregationFn: ['mean', { id: 'range', aggregationFn: 'extent' }],
})

const value = salaryColumn.getAggregationValue<{
  mean: number
  range: [number, number]
}>()
```

A scalar option returns a scalar. An array returns a keyed object. Named
functions use their registry name; descriptors provide a stable `id`, which is
required for inline definitions in an array.

### Custom definitions

```ts
const weightedMean = constructAggregationFn({
  aggregate: ({ rows, getValue }) => {
    const total = rows.reduce((sum, row) => sum + Number(getValue(row)), 0)
    return rows.length ? total / rows.length : undefined
  },
})
```

The context provides depth-selected `rows`, `maxDepth`, `getValue`, `column`,
`columnId`, `table`, and optional grouped-only `groupingRow` and `subRows`.
Every aggregation configured on a column receives the same row frontier. Add
`merge({ subRowResults, subRows, ...context })` when nested groups can more
efficiently combine already-computed sub-row results; otherwise the engine calls
`aggregate` with both row sets. `subRowResults[i]` corresponds to `subRows[i]`.

### Manual or remote values

Set a column definition's `getAggregationValue(context)` to return `{ value }`
for requests handled by a server or another execution environment. Returning
`undefined` falls back to the local definition. `manualAggregation: true`
disables that local fallback.

## Common Mistakes

### [HIGH] Adding grouping for a grand total

Wrong: registering `columnGroupingFeature` solely to total a column.

Correct: register `rowAggregationFeature` and call
`column.getAggregationValue()`. Grouping is only required for grouped rows.

### [HIGH] Passing a scope label and rows

There is no scope option. Call `getAggregationValue()` for the cached default,
or pass a single options object containing rows from the desired row model and
`maxDepth` when the desired frontier is below those rows.

### [HIGH] Reusing the legacy callable signature

Wrong: `(columnId, leafRows, childRows) => result`.

Correct: `constructAggregationFn({ aggregate: ({ rows, subRows, getValue }) => result })`.

### [MEDIUM] Assuming arbitrary totals run in the worker

The experimental worker computes grouped row-model aggregates. Public
`getAggregationValue(options?)` totals execute on the main thread, and custom
grouped results sent by the worker must be structured-cloneable.

## API Discovery

Inspect `node_modules/@tanstack/table-core/dist/features/row-aggregation/` and the
Aggregation Guide. Use `Column_RowAggregation`, `AggregationFnDef`,
`AggregationContext`, and `AggregationResult` for the typed public surface.
