---
id: RowModelFns_ColumnFiltering
title: RowModelFns_ColumnFiltering
---

# Interface: RowModelFns\_ColumnFiltering\<TFeatures, TData\>

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:38](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L38)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### filterFns

```ts
filterFns: Record<keyof FilterFns, FilterFn<TFeatures, TData>>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:42](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L42)
