---
id: CustomAggregationFns
title: CustomAggregationFns
---

# Type Alias: CustomAggregationFns\<TFeatures, TData\>

```ts
type CustomAggregationFns<TFeatures, TData> = Record<string, AggregationFnDef<TFeatures, TData, any, any>>;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:103](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L103)

Named context-based aggregation definitions registered on a feature set.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)
