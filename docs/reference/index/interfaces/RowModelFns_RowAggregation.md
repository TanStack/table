---
id: RowModelFns_RowAggregation
title: RowModelFns_RowAggregation
---

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:81](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L81)

Aggregation-definition registry carried by a table feature set.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### aggregationFns

```ts
aggregationFns: Record<string, AggregationFnDef<TFeatures, TData, any, any>>;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:85](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L85)
