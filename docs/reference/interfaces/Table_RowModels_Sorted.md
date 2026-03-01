---
id: Table_RowModels_Sorted
title: Table_RowModels_Sorted
---

# Interface: Table\_RowModels\_Sorted\<TFeatures, TData\>

Defined in: [features/row-sorting/rowSortingFeature.types.ts:198](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L198)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getPreSortedRowModel()

```ts
getPreSortedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:205](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L205)

Returns the row model for the table before any sorting has been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getSortedRowModel()

```ts
getSortedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:209](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L209)

Returns the row model for the table after sorting has been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
