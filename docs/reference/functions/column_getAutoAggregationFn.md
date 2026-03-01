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

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L75)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

  \| [`AggregationFn`](../type-aliases/AggregationFn.md)\<`TFeatures`, `TData`\>
  \| `undefined`
