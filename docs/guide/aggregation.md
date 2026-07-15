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

With no options argument, `column.getAggregationValue()` aggregates the table's
pre-grouped row model. In the normal client pipeline this includes filtering,
but precedes grouping, sorting, expansion, and pagination. It uses the column's
`maxAggregationDepth` (`0` by default).

## Choosing Which Rows To Aggregate

Pass rows in the options object to override the default:

```ts
column.getAggregationValue({ rows: table.getCoreRowModel().rows }) // all core rows
column.getAggregationValue({ rows: table.getRowModel().rows }) // rendered model
column.getAggregationValue({
  rows: table.getFilteredSelectedRowModel().rows,
})
column.getAggregationValue({ rows: customRows })
column.getAggregationValue({ rows: customRows, maxDepth: 1 })
```

Depth is relative to the supplied row array. `0` selects those root rows, `1`
selects their direct sub-rows, and so on. Selection returns a unique frontier:
a branch that ends before the maximum depth contributes its deepest available
row. `Infinity` selects terminal rows.

Set the cached default depth on the column:

```ts
const amountColumn = columnHelper.accessor('amount', {
  aggregationFn: ['sum', 'mean', 'count'],
  maxAggregationDepth: 0,
})
```

Every aggregation configured on the column receives the same selected rows.
Explicit-row calls are recomputed each time; the default call is cached against
its row model, depth, registry, and column aggregation option.

`table.getMaxSubRowDepth()` returns the deepest structural depth in the core row
model. To stop one level before the deepest sub-row frontier:

```ts
const maxDepth = Math.max(0, table.getMaxSubRowDepth() - 1)
column.getAggregationValue({
  rows: table.getCoreRowModel().rows,
  maxDepth,
})
```

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

Custom aggregations are context-based definitions. `rows` contains the unique
frontier selected at `maxDepth`, and `getValue(row)` reads the current column's
value.

```ts
const joined = constructAggregationFn<any, any, string, string>({
  aggregate: ({ rows, getValue }) =>
    rows
      .map((row) => getValue(row))
      .filter(Boolean)
      .join(', '),
})
```

The context also includes `column`, `columnId`, `maxDepth`, and `table`. During grouped
aggregation it includes `groupingRow` and `subRows`; root and
caller-supplied-row aggregation omit those properties. The grouping depth is
`groupingRow.depth`. `subRows` contains the immediate rows at that grouping
level, so an aggregation can explicitly choose immediate sub-rows instead of
the depth-selected `rows`:

```ts
const subRowCount = constructAggregationFn<any, any, unknown, number>({
  aggregate: ({ subRows, rows }) => (subRows ?? rows).length,
})
```

At the terminal grouping level, `subRows` contains direct data rows. At a
nested level, it contains the immediate synthetic sub-row groups.

All built-in aggregation definitions consume the same depth-selected `rows`.
`subRows` remains available when a custom definition intentionally needs the
grouping row's immediate structural children.

For a result that can be combined more efficiently from already-computed
sub-row results, provide a `merge` function:

```ts
const sum = constructAggregationFn<any, any, unknown, number>({
  aggregate: ({ rows, getValue }) =>
    rows.reduce((total, row) => {
      const value = getValue(row)
      return total + (typeof value === 'number' ? value : 0)
    }, 0),
  merge: ({ subRowResults }) =>
    subRowResults.reduce((total, value) => total + value, 0),
})
```

For `merge`, `subRowResults[i]` is the aggregation result previously computed
for `subRows[i]`.

Without `merge`, nested grouping calls `aggregate` with both the group's
depth-selected `rows` and its immediate `subRows`. This replaces the previous
callable aggregation signature and its `fromRows` and `resolveDataValue`
properties while preserving the ability to choose either row set.

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

Every adapter has a standalone example showing grand totals, multiple
aggregations, and pagination:

- [Alpine](../framework/alpine/examples/aggregation)
- [Angular](../framework/angular/examples/aggregation)
- [Ember](../framework/ember/examples/aggregation)
- [Lit](../framework/lit/examples/aggregation)
- [Preact](../framework/preact/examples/aggregation)
- [React](../framework/react/examples/aggregation)
- [Solid](../framework/solid/examples/aggregation)
- [Svelte](../framework/svelte/examples/aggregation)
- [Vue](../framework/vue/examples/aggregation)
- [Vanilla](../framework/vanilla/examples/aggregation)

Every framework adapter also has a grouped aggregation example combining the
same API with grouped rows and grand-total footers:

- [Alpine](../framework/alpine/examples/grouped-aggregation)
- [Angular](../framework/angular/examples/grouped-aggregation)
- [Ember](../framework/ember/examples/grouped-aggregation)
- [Lit](../framework/lit/examples/grouped-aggregation)
- [Preact](../framework/preact/examples/grouped-aggregation)
- [React](../framework/react/examples/grouped-aggregation)
- [Solid](../framework/solid/examples/grouped-aggregation)
- [Svelte](../framework/svelte/examples/grouped-aggregation)
- [Vue](../framework/vue/examples/grouped-aggregation)
