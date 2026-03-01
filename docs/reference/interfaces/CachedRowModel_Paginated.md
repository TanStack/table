---
id: CachedRowModel_Paginated
title: CachedRowModel_Paginated
---

# Interface: CachedRowModel\_Paginated\<TFeatures, TData\>

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:136](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L136)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### paginatedRowModel()

```ts
paginatedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:140](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L140)

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
