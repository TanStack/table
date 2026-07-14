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

Defined in: [features/aggregation/aggregationFeature.types.ts:133](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L133)

One named or explicitly keyed entry in a multiple aggregation option.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` = `unknown`
