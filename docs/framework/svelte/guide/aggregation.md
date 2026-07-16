---
title: Aggregation (Svelte) Guide
---

## Examples

- [Aggregation](../examples/aggregation)
- [Grouped Aggregation](../examples/grouped-aggregation)

Aggregation is independent from column grouping. Register `rowAggregationFeature`
whenever columns calculate totals or aggregated values. Add
`columnGroupingFeature` separately only when the table also groups rows.

For the complete behavior and type reference, see the core
[Aggregation Guide](../../../guide/aggregation).

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
} from '@tanstack/svelte-table'

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
selects their direct sub-rows, and `Infinity` selects terminal rows. Configure
`maxAggregationDepth` on the column for cached default calls, or pass
`maxDepth` in the options object as an explicit override.
`table.getMaxSubRowDepth()` returns
the deepest structural depth in the core row model. Column option
`getAggregationValue(context)` can provide an external or server-computed
value; return `undefined` to fall back to the configured aggregation function.

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

Use `cell.getIsAggregated()` to identify a grouped aggregate cell. Footer
rendering uses the adapter's normal footer renderer.

## Custom Aggregation Definitions

Use `constructAggregationFn({ aggregate, merge? })` for custom definitions.
The aggregate context includes depth-selected `rows`, `maxDepth`, `getValue`,
`column`, and `table`. Every aggregation configured on a column receives the
same row frontier. Grouped calls also include `groupingRow` and immediate
`subRows` for custom structural behavior. A `merge` implementation can more
efficiently combine already-computed sub-row results.

See [Custom Aggregation Definitions](../../../guide/aggregation#custom-aggregation-definitions)
for the full contract, return typing, caching behavior, and worker limitations.
