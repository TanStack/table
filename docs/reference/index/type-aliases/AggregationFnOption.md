---
id: AggregationFnOption
title: AggregationFnOption
---

# Type Alias: AggregationFnOption\<TFeatures, TData\>

```ts
type AggregationFnOption<TFeatures, TData> = 
  | "auto"
  | ExtractAggregationFnKeys<TFeatures>
| AggregationFn<TFeatures, TData>;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:60](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L60)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)
