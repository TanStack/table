---
id: column_getAutoAggregationFn
title: column_getAutoAggregationFn
---

# Function: column\_getAutoAggregationFn()

```ts
function column_getAutoAggregationFn<TFeatures, TData, TValue>(column): 
  | AggregationFn<TFeatures, TData>
  | undefined;
```

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:145](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L145)

Infers aggregation fn for a column.

The inference uses the column definition, table options, and sampled row values when needed.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../../index/type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

  \| [`AggregationFn`](../../index/type-aliases/AggregationFn.md)\<`TFeatures`, `TData`\>
  \| `undefined`

## Example

```ts
const value = column_getAutoAggregationFn(column)
```
