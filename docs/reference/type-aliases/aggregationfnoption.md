---
id: AggregationFnOption
title: AggregationFnOption
---

# Type Alias: AggregationFnOption\<TFeatures, TData\>

```ts
type AggregationFnOption<TFeatures, TData>: "auto" | keyof AggregationFns | BuiltInAggregationFn | AggregationFn<TFeatures, TData>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

## Defined in

[features/column-grouping/ColumnGrouping.types.ts:44](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L44)
