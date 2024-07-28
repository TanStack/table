---
id: AggregationFnOption
title: AggregationFnOption
---

# Type Alias: AggregationFnOption\<TFeatures, TData\>

```ts
type AggregationFnOption<TFeatures, TData>: "auto" | keyof AggregationFns | BuiltInAggregationFn | AggregationFn<TFeatures, TData>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

## Defined in

[features/column-grouping/ColumnGrouping.types.ts:36](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L36)
