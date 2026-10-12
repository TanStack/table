---
id: AggregationValueOptions
title: AggregationValueOptions
---

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:272](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L272)

Options for a caller-requested column aggregation value.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### maxDepth?

```ts
optional maxDepth?: number;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:277](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L277)

Overrides the column's `maxAggregationDepth` for this request.

***

### rows?

```ts
optional rows?: readonly Row<TFeatures, TData>[];
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:279](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L279)

Rows to aggregate instead of the default pre-grouped row model.
