---
id: AggregationFnListItem
title: AggregationFnListItem
---

# Type Alias: AggregationFnListItem\<TFeatures, TData, TValue\>

```ts
type AggregationFnListItem<TFeatures, TData, TValue> = 
  | "auto"
  | ExtractAggregationFnKeys<TFeatures>
| AggregationFnDescriptor<TFeatures, TData, TValue, any>;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:141](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L141)

One named or explicitly keyed entry in a multiple aggregation option.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` = `unknown`
