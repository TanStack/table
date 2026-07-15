---
id: column_getAggregationFns
title: column_getAggregationFns
---

# Function: column\_getAggregationFns()

```ts
function column_getAggregationFns<TFeatures, TData, TValue>(column): readonly ResolvedAggregationFn<TFeatures, TData>[];
```

Defined in: [features/aggregation/aggregationFeature.utils.ts:155](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.utils.ts#L155)

Resolves and validates a column's scalar or multiple aggregation option.

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

readonly [`ResolvedAggregationFn`](../../index/interfaces/ResolvedAggregationFn.md)\<`TFeatures`, `TData`\>[]
