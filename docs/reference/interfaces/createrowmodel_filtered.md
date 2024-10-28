---
id: CreateRowModel_Filtered
title: CreateRowModel_Filtered
---

# Interface: CreateRowModel\_Filtered\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### filteredRowModel()?

```ts
optional filteredRowModel: (table) => () => RowModel<TFeatures, TData>;
```

If provided, this function is called **once** per table and should return a **new function** which will calculate and return the row model for the table when it's filtered.
- For server-side filtering, this function is unnecessary and can be ignored since the server should already return the filtered row model.
- For client-side filtering, this function is required. A default implementation is provided via any table adapter's `{ getFilteredRowModel }` export.

#### Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

#### Returns

`Function`

##### Returns

[`RowModel`](rowmodel.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#getfilteredrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:268](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L268)
