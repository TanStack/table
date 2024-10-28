---
id: CreateRowModel_Expanded
title: CreateRowModel_Expanded
---

# Interface: CreateRowModel\_Expanded\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### expandedRowModel()?

```ts
optional expandedRowModel: (table) => () => RowModel<TFeatures, TData>;
```

This function is responsible for returning the expanded row model. If this function is not provided, the table will not expand rows. You can use the default exported `getExpandedRowModel` function to get the expanded row model or implement your own.

#### Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

#### Returns

`Function`

##### Returns

[`RowModel`](rowmodel.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getexpandedrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

#### Defined in

[features/row-expanding/RowExpanding.types.ts:177](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L177)
