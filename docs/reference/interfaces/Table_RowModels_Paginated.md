---
id: Table_RowModels_Paginated
title: Table_RowModels_Paginated
---

# Interface: Table\_RowModels\_Paginated\<TFeatures, TData\>

Defined in: [packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts:109](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L109)

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

Defined in: [packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts:116](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L116)

Returns the row model for the table after pagination has been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getPrePaginatedRowModel()

```ts
getPrePaginatedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts:120](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L120)

Returns the row model for the table before any pagination has been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
