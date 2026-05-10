---
id: CreateRowModel_Paginated
title: CreateRowModel_Paginated
---

# Interface: CreateRowModel\_Paginated\<TFeatures, TData\>

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:126](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L126)

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

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:135](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L135)

Factory used to retrieve the paginated row model. If using server-side
pagination, this is not required. To use client-side pagination, pass
`createPaginatedRowModel()` or implement your own factory.

#### Parameters

##### table

[`Table`](../type-aliases/Table.md)\<`TFeatures`, `TData`\>

#### Returns

```ts
(): RowModel<TFeatures, TData>;
```

##### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
