---
id: column_getAggregationFn
title: column_getAggregationFn
---

# Function: column\_getAggregationFn()

```ts
function column_getAggregationFn<TFeatures, TData, TValue>(column): 
  | AggregationFn<TFeatures, TData>
  | undefined;
```

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:177](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L177)

Returns aggregation fn for a column.

This derives the value from the column definition, table options, and the feature state atoms registered on the table.

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
const value = column_getAggregationFn(column)
```
