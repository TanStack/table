---
id: column_getAggregationValue
title: column_getAggregationValue
---

# Function: column\_getAggregationValue()

```ts
function column_getAggregationValue<TFeatures, TData, TValue>(column, rows?): ColumnAggregationValue<TFeatures>;
```

Defined in: [features/aggregation/aggregationFeature.utils.ts:310](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.utils.ts#L310)

Implements `column.getAggregationValue(rows?)` and its default-value cache.

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

### rows?

readonly [`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

## Returns

[`ColumnAggregationValue`](../../index/type-aliases/ColumnAggregationValue.md)\<`TFeatures`\>
