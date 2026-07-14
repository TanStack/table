---
id: normalizeAggregationRows
title: normalizeAggregationRows
---

# Function: normalizeAggregationRows()

```ts
function normalizeAggregationRows<TFeatures, TData>(rows): Row<TFeatures, TData>[];
```

Defined in: [features/aggregation/aggregationFeature.utils.ts:57](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.utils.ts#L57)

Flattens hierarchical row inputs to unique terminal leaves in encounter
order. This is the normalization used by public aggregation-value calls.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### rows

readonly [`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

## Returns

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>[]
