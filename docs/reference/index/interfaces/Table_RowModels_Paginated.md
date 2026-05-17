---
id: Table_RowModels_Paginated
title: Table_RowModels_Paginated
---

# Interface: Table\_RowModels\_Paginated\<TFeatures, TData\>

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:119](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L119)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getPaginatedRowModel()

```ts
getPaginatedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:126](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L126)

Resolves the row model after pagination has sliced the current page.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getPrePaginatedRowModel()

```ts
getPrePaginatedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:130](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L130)

Reads the row model immediately before pagination.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
