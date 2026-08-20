---
id: AggregationFnOption
title: AggregationFnOption
---

# Type Alias: AggregationFnOption\<TFeatures, TData, TValue\>

```ts
type AggregationFnOption<TFeatures, TData, TValue> =
  | AggregationFnRef<TFeatures, TData, TValue, any>
| ReadonlyArray<AggregationFnListItem<TFeatures, TData, TValue>>;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:151](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L151)

A scalar aggregation reference or a list that produces a keyed object.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` = `unknown`
