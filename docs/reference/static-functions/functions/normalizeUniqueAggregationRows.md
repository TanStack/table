---
id: normalizeUniqueAggregationRows
title: normalizeUniqueAggregationRows
---

# Function: normalizeUniqueAggregationRows()

```ts
function normalizeUniqueAggregationRows<TFeatures, TData>(rows, maxDepth): readonly Row<TFeatures, TData>[];
```

Defined in: [features/row-aggregation/rowAggregationFeature.utils.ts:105](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.utils.ts#L105)

Frontier selection for rows that are distinct nodes of a single row tree —
the row models the table builds itself. Skips `normalizeAggregationRows`'
duplicate-id guard (disjoint subtrees cannot revisit a row) and returns
`rows` unchanged when no row descends, so the default `maxDepth: 0` case
costs nothing per aggregation.

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

readonly [`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>[]
