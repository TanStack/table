---
id: RowModelFns_RowSorting
title: RowModelFns_RowSorting
---

# Interface: RowModelFns\_RowSorting\<TFeatures, TData\>

Defined in: [packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L21)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### sortFns

```ts
sortFns: Record<keyof SortFns, SortFn<TFeatures, TData>>;
```

Defined in: [packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts:25](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L25)
