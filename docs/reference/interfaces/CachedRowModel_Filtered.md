---
id: CachedRowModel_Filtered
title: CachedRowModel_Filtered
---

# Interface: CachedRowModel\_Filtered\<TFeatures, TData\>

Defined in: [packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts:214](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L214)

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

Defined in: [packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts:218](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L218)

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
