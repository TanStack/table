---
id: CreateRowModel_Grouped
title: CreateRowModel_Grouped
---

# Interface: CreateRowModel\_Grouped\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### groupedRowModel()?

```ts
optional groupedRowModel: (table) => () => RowModel<TFeatures, TData>;
```

Returns the row model after grouping has taken place, but no further.

#### Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

#### Returns

`Function`

##### Returns

[`RowModel`](rowmodel.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getgroupedrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:262](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L262)
