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

Defined in: [features/aggregation/aggregationFeature.types.ts:143](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L143)

A scalar aggregation reference or a list that produces a keyed object.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` = `unknown`
