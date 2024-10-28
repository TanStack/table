---
id: CreateRowModel_Paginated
title: CreateRowModel_Paginated
---

# Interface: CreateRowModel\_Paginated\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### paginatedRowModel()?

```ts
optional paginatedRowModel: (table) => () => RowModel<TFeatures, TData>;
```

Returns the row model after pagination has taken place, but no further.

Pagination columns are automatically reordered by default to the start of the columns list. If you would rather remove them or leave them as-is, set the appropriate mode here.

#### Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

#### Returns

`Function`

##### Returns

[`RowModel`](rowmodel.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#getPaginatedRowModel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

#### Defined in

[features/row-pagination/RowPagination.types.ts:178](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L178)
