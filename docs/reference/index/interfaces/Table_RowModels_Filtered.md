---
id: Table_RowModels_Filtered
title: Table_RowModels_Filtered
---

# Interface: Table\_RowModels\_Filtered\<TFeatures, TData\>

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:198](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L198)

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

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:205](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L205)

Resolves the row model after column and global filters have been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getPreFilteredRowModel()

```ts
getPreFilteredRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:209](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L209)

Reads the row model immediately before filtering.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
