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

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:184](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L184)

Resolves the aggregation function configured for a column.

Function-valued `columnDef.aggregationFn` is returned directly, `'auto'`
delegates to `column_getAutoAggregationFn`, and string values are looked up in
the table's aggregation function registry.

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
const aggregationFn = column_getAggregationFn(column)
```
