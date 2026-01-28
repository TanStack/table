---
id: CreateRowModel_Sorted
title: CreateRowModel_Sorted
---

# Interface: CreateRowModel\_Sorted\<TFeatures, TData\>

Defined in: [packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts:212](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L212)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### sortedRowModel()?

```ts
optional sortedRowModel: (table) => () => RowModel<TFeatures, TData>;
```

Defined in: [packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts:219](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L219)

This function is used to retrieve the sorted row model. If using server-side sorting, this function is not required. To use client-side sorting, pass the exported `getSortedRowModel()` from your adapter to your table or implement your own.

#### Parameters

##### table

[`Table`](../type-aliases/Table.md)\<`TFeatures`, `TData`\>

#### Returns

```ts
(): RowModel<TFeatures, TData>;
```

##### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
