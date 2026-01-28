---
id: CreateRowModel_Filtered
title: CreateRowModel_Filtered
---

# Interface: CreateRowModel\_Filtered\<TFeatures, TData\>

Defined in: [packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts:200](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L200)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### filteredRowModel()?

```ts
optional filteredRowModel: (table) => () => RowModel<TFeatures, TData>;
```

Defined in: [packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts:209](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L209)

If provided, this function is called **once** per table and should return a **new function** which will calculate and return the row model for the table when it's filtered.
- For server-side filtering, this function is unnecessary and can be ignored since the server should already return the filtered row model.
- For client-side filtering, this function is required. A default implementation is provided via any table adapter's `{ getFilteredRowModel }` export.

#### Parameters

##### table

[`Table`](../type-aliases/Table.md)\<`TFeatures`, `TData`\>

#### Returns

```ts
(): RowModel<TFeatures, TData>;
```

##### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
