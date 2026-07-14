---
name: aggregation
description: >
  Aggregate TanStack Table columns independently of grouping, including grand totals, caller-selected row totals, multiple keyed aggregations, custom context-based definitions, grouped merges, manual values, and worker constraints.
metadata:
  {
    type: sub-skill,
    library: '@tanstack/table-core',
    library_version: '9.0.0-beta.49',
  }
requires: ['core', 'table-features']
sources:
  - 'TanStack/table:docs/guide/aggregation.md'
  - 'TanStack/table:docs/framework/react/guide/aggregation.md'
  - 'TanStack/table:packages/table-core/src/features/aggregation'
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
  aggregationFeature,
  aggregationFn_mean,
  aggregationFn_sum,
  tableFeatures,
} from '@tanstack/table-core'

export const features = tableFeatures({
  aggregationFeature,
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
const filteredTotal = salaryColumn.getAggregationValue(
  table.getFilteredRowModel().rows,
)
```

The default uses the pre-grouped row model. Explicit rows can come from any row
model or caller-selected subset. Hierarchical inputs are normalized to unique
terminal rows. Default calls are cached; explicit-row calls intentionally are
not because array identity and contents are caller-owned.

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

The context provides `rows`, `getValue`, `column`, `columnId`, `table`, and an
optional `groupingRow`. Add `merge({ childResults, childRows, ...context })`
when nested groups can efficiently combine child results; otherwise the engine
re-runs `aggregate` over normalized terminal rows.

### Manual or remote values

Set a column definition's `getAggregationValue(context)` to return `{ value }`
for requests handled by a server or another execution environment. Returning
`undefined` falls back to the local definition. `manualAggregation: true`
disables that local fallback.

## Common Mistakes

### [HIGH] Adding grouping for a grand total

Wrong: registering `columnGroupingFeature` solely to total a column.

Correct: register `aggregationFeature` and call
`column.getAggregationValue()`. Grouping is only required for grouped rows.

### [HIGH] Passing a scope label and rows

There is no scope option. Call `getAggregationValue()` for the default or pass
the exact rows from the desired row model.

### [HIGH] Reusing the legacy callable signature

Wrong: `(columnId, leafRows, childRows) => result`.

Correct: `constructAggregationFn({ aggregate: ({ rows, getValue }) => result })`.

### [MEDIUM] Assuming arbitrary totals run in the worker

The experimental worker computes grouped row-model aggregates. Public
`getAggregationValue(rows?)` totals execute on the main thread, and custom
grouped results sent by the worker must be structured-cloneable.

## API Discovery

Inspect `node_modules/@tanstack/table-core/src/features/aggregation/` and the
Aggregation Guide. Use `Column_Aggregation`, `AggregationFnDef`,
`AggregationContext`, and `AggregationResult` for the typed public surface.
