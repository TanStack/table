---
id: cell_getIsAggregated
title: cell_getIsAggregated
---

# Function: cell\_getIsAggregated()

```ts
function cell_getIsAggregated<TFeatures, TData, TValue>(cell): boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:345](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L345)

Checks whether this cell should render an aggregated value.

Aggregated cells are non-placeholder, non-grouped cells on rows that have
subRows.

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

## Example

```ts
const isAggregated = cell_getIsAggregated(cell)
```
