---
title: Aggregation (Lit) Guide
---

## Examples

- [Aggregation](../examples/aggregation)
- [Grouped Aggregation](../examples/grouped-aggregation)

Aggregation is independent from column grouping. Register `aggregationFeature`
whenever columns calculate totals or aggregated values. Add
`columnGroupingFeature` separately only when the table also groups rows.

For the complete behavior and type reference, see the core
[Aggregation Guide](../../../guide/aggregation).

## Aggregation Setup

Register only the built-in functions referenced by name. Passing a definition
directly to a column does not require a registry entry.

```ts
import {
  TableController,
  aggregationFeature,
  aggregationFn_count,
  aggregationFn_extent,
  aggregationFn_mean,
  aggregationFn_sum,
  tableFeatures,
} from '@tanstack/lit-table'

const features = tableFeatures({
  aggregationFeature,
  aggregationFns: {
    count: aggregationFn_count,
    extent: aggregationFn_extent,
    mean: aggregationFn_mean,
    sum: aggregationFn_sum,
  },
})

const tableController = new TableController(this)

const table = tableController.table({
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

Pass rows from any row model to choose a different set explicitly:

```ts
column.getAggregationValue(table.getCoreRowModel().rows) // all core rows
column.getAggregationValue(table.getRowModel().rows) // visible page/pipeline
column.getAggregationValue(table.getFilteredSelectedRowModel().rows)
column.getAggregationValue(table.getCoreRowModel().rows.slice(0, 3))
```

There is no separate scope option. The row array is the complete override.
Column option `getAggregationValue(context)` can provide an external or
server-computed value; return `undefined` to fall back to the configured
aggregation function.

## Grouped Aggregation

Grouped aggregation composes two independent features. Register both, add the
grouped row-model slot, and configure aggregation functions on the columns that
should produce grouped values.

```ts
const features = tableFeatures({
  aggregationFeature,
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
The aggregate context includes terminal `rows`, `getValue`, `column`,
`table`, and an optional `groupingRow`. A `merge` implementation can make
nested grouped aggregation more efficient.

See [Custom Aggregation Definitions](../../../guide/aggregation#custom-aggregation-definitions)
for the full contract, return typing, caching behavior, and worker limitations.
