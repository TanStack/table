---
id: CachedRowModel_Paginated
title: CachedRowModel_Paginated
---

# Interface: CachedRowModel\_Paginated\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### paginatedRowModel()

```ts
paginatedRowModel: () => RowModel<TFeatures, TData>;
```

#### Returns

[`RowModel`](rowmodel.md)\<`TFeatures`, `TData`\>

#### Defined in

[features/row-pagination/RowPagination.types.ts:187](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L187)
