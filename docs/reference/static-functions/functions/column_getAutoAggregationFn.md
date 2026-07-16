---
id: column_getAutoAggregationFn
title: column_getAutoAggregationFn
---

# Function: column\_getAutoAggregationFn()

```ts
function column_getAutoAggregationFn<TFeatures, TData, TValue>(column): 
  | AggregationFnDef<TFeatures, TData, any, any>
  | undefined;
```

Defined in: [features/row-aggregation/rowAggregationFeature.utils.ts:113](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.utils.ts#L113)

Resolves the `sum` or `extent` definition inferred from the first core row.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../../index/interfaces/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

  \| [`AggregationFnDef`](../../index/interfaces/AggregationFnDef.md)\<`TFeatures`, `TData`, `any`, `any`\>
  \| `undefined`
