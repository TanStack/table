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

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts:97](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L97)

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
