---
id: CachedRowModel_Filtered
title: CachedRowModel_Filtered
---

# Interface: CachedRowModel\_Filtered\<TFeatures, TData\>

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:308](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L308)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### filteredRowModel()

```ts
filteredRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:312](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L312)

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
