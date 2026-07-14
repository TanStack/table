---
id: cell_getIsAggregated
title: cell_getIsAggregated
---

# Function: cell\_getIsAggregated()

```ts
function cell_getIsAggregated<TFeatures, TData, TValue>(cell): boolean;
```

Defined in: [features/aggregation/aggregationFeature.utils.ts:364](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.utils.ts#L364)

Implements `cell.getIsAggregated()` for synthetic grouped rows.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### cell

[`Cell`](../../index/type-aliases/Cell.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`boolean`
