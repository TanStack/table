---
id: Table_RowModels_Paginated
title: Table_RowModels_Paginated
---

# Interface: Table\_RowModels\_Paginated\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### getPaginatedRowModel()

```ts
getPaginatedRowModel: () => RowModel<TFeatures, TData>;
```

Returns the row model for the table after pagination has been applied.

#### Returns

[`RowModel`](rowmodel.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#getPaginatedRowModel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

#### Defined in

[features/row-pagination/RowPagination.types.ts:158](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L158)

***

### getPrePaginatedRowModel()

```ts
getPrePaginatedRowModel: () => RowModel<TFeatures, TData>;
```

Returns the row model for the table before any pagination has been applied.

#### Returns

[`RowModel`](rowmodel.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#getprepaginationrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

#### Defined in

[features/row-pagination/RowPagination.types.ts:164](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L164)
