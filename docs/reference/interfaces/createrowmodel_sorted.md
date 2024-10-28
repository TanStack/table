---
id: CreateRowModel_Sorted
title: CreateRowModel_Sorted
---

# Interface: CreateRowModel\_Sorted\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### sortedRowModel()?

```ts
optional sortedRowModel: (table) => () => RowModel<TFeatures, TData>;
```

This function is used to retrieve the sorted row model. If using server-side sorting, this function is not required. To use client-side sorting, pass the exported `getSortedRowModel()` from your adapter to your table or implement your own.

#### Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

#### Returns

`Function`

##### Returns

[`RowModel`](rowmodel.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getsortedrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:283](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L283)
