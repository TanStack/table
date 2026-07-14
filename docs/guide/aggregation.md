---
title: Aggregation Guide
---

Aggregation computes column values over sets of rows. It is independent from
column grouping: use it for table totals, filtered totals, selected-row totals,
or custom subsets without creating grouped rows. Register it alongside column
grouping when grouped rows should also expose aggregate values.

## Setup

Register `aggregationFeature` and the named definitions referenced by your
columns. Registering individual built-ins keeps unused functions out of the
bundle.

```ts
import {
  aggregationFeature,
  aggregationFn_mean,
  aggregationFn_sum,
  tableFeatures,
} from '@tanstack/table-core'

const features = tableFeatures({
  aggregationFeature,
  aggregationFns: {
    mean: aggregationFn_mean,
    sum: aggregationFn_sum,
  },
})
```

The full `aggregationFns` registry remains available for compatibility, but it
bundles every built-in. Tables using `stockFeatures` already include
`aggregationFeature`; they still need the definitions that named column options
should resolve.

To combine aggregation with grouped rows, register both independent features:

```ts
const features = tableFeatures({
  aggregationFeature,
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  aggregationFns: { sum: aggregationFn_sum },
})
```

## One Aggregation Per Column

A scalar `aggregationFn` can be a registered name, `'auto'`, or an inline
definition.

```ts
const amountColumn = columnHelper.accessor('amount', {
  aggregationFn: 'sum',
  footer: ({ column }) => column.getAggregationValue<number>(),
})
```

With no row argument, `column.getAggregationValue()` aggregates the table's
pre-grouped row model. In the normal client pipeline this includes filtering,
but precedes grouping, sorting, expansion, and pagination.

## Choosing Which Rows To Aggregate

Pass any row array to override the default:

```ts
column.getAggregationValue(table.getCoreRowModel().rows) // all core rows
column.getAggregationValue(table.getRowModel().rows) // currently rendered model
column.getAggregationValue(table.getFilteredSelectedRowModel().rows)
column.getAggregationValue(customRows)
```

Hierarchical inputs are normalized to unique terminal leaves. Explicit row
calls are recomputed each time; the default call is cached against its row
model, registry, and column aggregation option.

## Multiple Aggregations Per Column

Use an array to return a keyed result object. Registered names become their own
keys. Use a descriptor when the result needs a different key or when an inline
definition appears in the array.

```ts
const scoreColumn = columnHelper.accessor('score', {
  aggregationFn: ['count', 'mean', { id: 'range', aggregationFn: 'extent' }],
  footer: ({ column }) => {
    const result = column.getAggregationValue<{
      count: number
      mean: number | undefined
      range: [number | undefined, number | undefined]
    }>()

    return `${result.count} values; mean ${result.mean}; range ${result.range}`
  },
})
```

Every entry needs a unique stable id. Duplicate ids, missing descriptor ids,
and unregistered names warn in development and preserve the affected key with
an `undefined` value.

## Custom Aggregation Definitions

Custom aggregations are context-based definitions. `rows` contains normalized
terminal rows and `getValue(row)` reads the current column's value.

```ts
const joined = constructAggregationFn<any, any, string, string>({
  aggregate: ({ rows, getValue }) =>
    rows
      .map((row) => getValue(row))
      .filter(Boolean)
      .join(', '),
})
```

The context also includes `column`, `columnId`, and `table`. During grouped
aggregation it includes `groupingRow`; root and caller-supplied-row aggregation
omit that property. The grouping depth is `groupingRow.depth`.

For a result that can be combined efficiently across nested groups, provide a
`merge` function:

```ts
const sum = constructAggregationFn<any, any, unknown, number>({
  aggregate: ({ rows, getValue }) =>
    rows.reduce((total, row) => {
      const value = getValue(row)
      return total + (typeof value === 'number' ? value : 0)
    }, 0),
  merge: ({ childResults }) =>
    childResults.reduce((total, value) => total + value, 0),
})
```

Without `merge`, nested grouping calls `aggregate` over the group's terminal
rows. This replaces the previous callable aggregation signature and its
`fromRows` and `resolveDataValue` properties.

## Grouped Cell Rendering

`aggregatedCell` renders aggregate values on synthetic grouped rows.

```ts
const amountColumn = columnHelper.accessor('amount', {
  aggregationFn: 'sum',
  aggregatedCell: ({ getValue }) => getValue<number>().toLocaleString(),
})
```

Use `cell.getIsAggregated()` to distinguish these cells. Grouping-only tables
do not expose this method; it belongs to `aggregationFeature`.

## Providing Server or External Values

A column can handle aggregation-value requests before local calculation:

```ts
const amountColumn = columnHelper.accessor('amount', {
  aggregationFn: 'sum',
  getAggregationValue: ({ rows }) => {
    if (rows !== undefined) return undefined // use local fallback for overrides
    return { value: serverTotals.amount }
  },
})
```

Returning `{ value }` marks the request as handled, including
`{ value: undefined }`. Returning `undefined` uses the local fallback. Put the
same provider on `defaultColumn` to share it across columns.

Set `manualAggregation: true` to disable the local fallback for
`column.getAggregationValue()`. This is separate from `manualGrouping`, which
controls whether the grouped row model runs.

## Built-in Definitions

- `sum`: sums numeric values; non-numbers contribute zero.
- `count`: counts rows.
- `min` / `max`: find numeric or Date bounds.
- `extent`: returns `[min, max]`; an empty input returns
  `[undefined, undefined]`.
- `mean`: averages numeric and number-like non-null values.
- `median`: requires every row value to be a number.
- `unique` / `uniqueCount`: use JavaScript `Set` semantics.
- `first` / `last`: return the positional value, including a nullish value.

`aggregationFn: 'auto'` inspects the first core row value. Numbers resolve to a
registered `sum`, Dates resolve to a registered `extent`, and other values do
not resolve an aggregation.

## Web Workers

Worker-backed grouped row models eagerly compute explicitly configured grouped
aggregates in the worker. `column.getAggregationValue()` still executes its
final total on the main thread over the selected row model. Aggregation results
crossing the worker boundary must be structured-cloneable.

See the React [Aggregation](../framework/react/examples/aggregation) and
[Grouped Aggregation](../framework/react/examples/grouped-aggregation)
examples for complete footer and grouped-cell rendering.
