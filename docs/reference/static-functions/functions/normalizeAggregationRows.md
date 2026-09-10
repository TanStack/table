---
id: normalizeAggregationRows
title: normalizeAggregationRows
---

# Function: normalizeAggregationRows()

```ts
function normalizeAggregationRows<TFeatures, TData>(rows, maxDepth): Row<TFeatures, TData>[];
```

Defined in: [features/row-aggregation/rowAggregationFeature.utils.ts:114](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.utils.ts#L114)

Selects unique rows at a maximum relative depth in encounter order.
Branches that end before the requested depth contribute their deepest row.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### rows

readonly [`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

### maxDepth

`number` = `0`

## Returns

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>[]
