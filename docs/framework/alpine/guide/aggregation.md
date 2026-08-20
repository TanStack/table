---
title: Aggregation (Alpine) Guide
---

## Examples

- [Aggregation](../examples/aggregation)
- [Grouped Aggregation](../examples/grouped-aggregation)

Aggregation is independent from column grouping. Register `rowAggregationFeature`
whenever columns calculate totals or aggregated values. Add
`columnGroupingFeature` separately only when the table also groups rows.

## Aggregation Setup

Register only the built-in functions referenced by name. Passing a definition
directly to a column does not require a registry entry.

```ts
import {
  rowAggregationFeature,
  aggregationFn_count,
  aggregationFn_extent,
  aggregationFn_mean,
  aggregationFn_sum,
  tableFeatures,
  createTable,
} from '@tanstack/alpine-table'

const features = tableFeatures({
  rowAggregationFeature,
  aggregationFns: {
    count: aggregationFn_count,
    extent: aggregationFn_extent,
    mean: aggregationFn_mean,
    sum: aggregationFn_sum,
  },
})

const table = createTable({
  features,
  columns,
  data,
})
```

The aggregation feature does not require a grouped row model. This makes grand
totals and custom row-subset totals available in otherwise ordinary tables.

The full `aggregationFns` registry remains available for compatibility, but it
bundles every built-in. Tables using `stockFeatures` already include
`rowAggregationFeature`; they still need the definitions that named column
options should resolve to.

## Column Aggregations

A column accepts one aggregation or an array. A single entry returns a scalar;
multiple entries return an object keyed by the aggregation name or descriptor
`id`.

```ts
columnHelper.accessor('amount', {
  aggregationFn: 'sum',
})

columnHelper.accessor('score', {
  aggregationFn: ['count', 'mean', { id: 'range', aggregationFn: 'extent' }],
})
```

String values remain backward-compatible. Use descriptors when a result needs
a stable custom key or options.

A scalar `aggregationFn` can be a registered name, `'auto'`, or an inline
definition. Every entry in an aggregation array needs a unique stable id.
Duplicate ids, missing descriptor ids, and unregistered names warn in
development and preserve the affected key with an `undefined` value.

Multiple aggregations can be read with a typed result:

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

## Grand Totals and Row Subsets

Call `column.getAggregationValue()` without arguments to aggregate the default
pre-grouped row model. Filtering is included; grouping, sorting, expansion, and
pagination do not change that default total.

```ts
footer: ({ column }) => column.getAggregationValue<number>().toLocaleString()
```

Pass one options object with rows from any row model to choose a different set:

```ts
column.getAggregationValue({ rows: table.getCoreRowModel().rows })
column.getAggregationValue({ rows: table.getRowModel().rows })
column.getAggregationValue({ rows: table.getFilteredSelectedRowModel().rows })
column.getAggregationValue({ rows: table.getCoreRowModel().rows.slice(0, 3) })
column.getAggregationValue({ rows: table.getCoreRowModel().rows, maxDepth: 1 })
```

Depth is relative to the supplied row array. `0` selects those roots, `1`
selects their direct sub-rows, and so on. Selection returns a unique frontier:
a branch that ends before the maximum depth contributes its deepest available
row. `Infinity` selects terminal rows.

Configure `maxAggregationDepth` on the column for cached default calls (it
defaults to `0`), or pass `maxDepth` in the options object as an explicit
override. Every aggregation configured on the column receives the same
selected rows. Explicit row calls are recomputed each time; the default call is
cached against its row model, depth, registry, and column aggregation option.

`table.getMaxSubRowDepth()` returns the deepest structural depth in the core
row model. To stop one level before the deepest sub-row frontier:

```ts
const maxDepth = Math.max(0, table.getMaxSubRowDepth() - 1)
column.getAggregationValue({
  rows: table.getCoreRowModel().rows,
  maxDepth,
})
```

## Grouped Aggregation

Grouped aggregation composes two independent features. Register both, add the
grouped row-model slot, and configure aggregation functions on the columns that
should produce grouped values.

```ts
const features = tableFeatures({
  rowAggregationFeature,
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  aggregationFns: { sum: aggregationFn_sum },
})

columnHelper.accessor('visits', {
  aggregationFn: 'sum',
  aggregatedCell: ({ getValue }) => getValue<number>().toLocaleString(),
  footer: ({ column }) => column.getAggregationValue<number>().toLocaleString(),
})
```

The `aggregatedCell` column option renders aggregate values on synthetic
grouped rows. Use `cell.getIsAggregated()` to identify a grouped aggregate
cell. Footer rendering uses the adapter's normal footer renderer. Grouping-only
tables do not expose `cell.getIsAggregated()`; it belongs to
`rowAggregationFeature`.

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

The context also includes `column`, `columnId`, `maxDepth`, and `table`. During
grouped aggregation it includes `groupingRow` and `subRows`; root and
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
nested level, it contains the immediate synthetic sub-row groups. All built-in
aggregation definitions consume the same depth-selected `rows`; `subRows`
remains available when a custom definition intentionally needs the grouping
row's immediate structural children.

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
for `subRows[i]`. Without `merge`, nested grouping calls `aggregate` with both
the group's depth-selected `rows` and its immediate `subRows`. This
context-based form replaces the previous callable aggregation signature and its
`fromRows` and `resolveDataValue` properties while preserving access to both
row sets.

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
controls whether the grouped row model runs. See the
[Client-Side vs Server-Side Guide](../../../guide/client-side-vs-server-side)
for guidance on choosing where the full data pipeline should run.

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
crossing the worker boundary must be structured-cloneable. See the
[Worker Row Models Guide](../../../guide/worker-row-models) for setup and
limitations.
