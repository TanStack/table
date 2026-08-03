---
id: AggregationValueOptions
title: AggregationValueOptions
---

# Interface: AggregationValueOptions\<TFeatures, TData\>

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:286](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L286)

Options for a caller-requested column aggregation value.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### maxDepth?

```ts
optional maxDepth: number;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:291](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L291)

Overrides the column's `maxAggregationDepth` for this request.

***

### rows?

```ts
optional rows: readonly Row<TFeatures, TData>[];
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:293](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L293)

Rows to aggregate instead of the default pre-grouped row model.
