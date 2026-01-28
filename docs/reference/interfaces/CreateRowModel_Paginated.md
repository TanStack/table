---
id: CreateRowModel_Paginated
title: CreateRowModel_Paginated
---

# Interface: CreateRowModel\_Paginated\<TFeatures, TData\>

Defined in: [packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts:123](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L123)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### paginatedRowModel()?

```ts
optional paginatedRowModel: (table) => () => RowModel<TFeatures, TData>;
```

Defined in: [packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts:131](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L131)

Returns the row model after pagination has taken place, but no further.
Pagination columns are automatically reordered by default to the start of the columns list. If you would rather remove them or leave them as-is, set the appropriate mode here.

#### Parameters

##### table

[`Table`](../type-aliases/Table.md)\<`TFeatures`, `TData`\>

#### Returns

```ts
(): RowModel<TFeatures, TData>;
```

##### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
