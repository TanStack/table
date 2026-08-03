---
id: column_getAggregationValue
title: column_getAggregationValue
---

# Function: column\_getAggregationValue()

```ts
function column_getAggregationValue<TFeatures, TData, TValue>(column, options?): ColumnAggregationValue<TFeatures>;
```

Defined in: [features/row-aggregation/rowAggregationFeature.utils.ts:416](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.utils.ts#L416)

Implements `column.getAggregationValue(options?)` and its default cache.

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

### options?

[`AggregationValueOptions`](../../index/interfaces/AggregationValueOptions.md)\<`TFeatures`, `TData`\>

## Returns

[`ColumnAggregationValue`](../../index/type-aliases/ColumnAggregationValue.md)\<`TFeatures`\>
