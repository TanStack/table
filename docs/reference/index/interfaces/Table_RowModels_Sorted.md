---
id: Table_RowModels_Sorted
title: Table_RowModels_Sorted
---

# Interface: Table\_RowModels\_Sorted\<TFeatures, TData\>

Defined in: [features/row-sorting/rowSortingFeature.types.ts:269](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L269)

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

Defined in: [features/row-sorting/rowSortingFeature.types.ts:276](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L276)

Reads the row model immediately before sorting.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getSortedRowModel()

```ts
getSortedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:280](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L280)

Resolves the row model after sorting has been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
