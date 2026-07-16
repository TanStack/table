---
id: RowModelFns_Aggregation
title: RowModelFns_Aggregation
---

# Interface: RowModelFns\_Aggregation\<TFeatures, TData\>

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:95](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L95)

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

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:99](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L99)
