---
id: AggregationFnOption
title: AggregationFnOption
---

# Type Alias: AggregationFnOption\<TFeatures, TData\>

```ts
type AggregationFnOption<TFeatures, TData> = 
  | "auto"
  | keyof AggregationFns
  | BuiltInAggregationFn
| AggregationFn<TFeatures, TData>;
```

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts:44](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L44)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)
