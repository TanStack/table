---
id: RowModelFns_ColumnGrouping
title: RowModelFns_ColumnGrouping
---

# Interface: RowModelFns\_ColumnGrouping\<TFeatures, TData\>

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L21)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### aggregationFns

```ts
aggregationFns: Record<keyof AggregationFns, AggregationFn<TFeatures, TData>>;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:25](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L25)
