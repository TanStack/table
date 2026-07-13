---
id: Table_RowModels_Filtered
title: Table_RowModels_Filtered
---

# Interface: Table\_RowModels\_Filtered\<TFeatures, TData\>

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:289](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L289)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getFilteredRowModel()

```ts
getFilteredRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:296](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L296)

Resolves the row model after column and global filters have been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getPreFilteredRowModel()

```ts
getPreFilteredRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:300](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L300)

Reads the row model immediately before filtering.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
