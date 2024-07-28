---
id: Table_Rows
title: Table_Rows
---

# Interface: Table\_Rows\<TFeatures, TData\>

## Extended by

- [`Table_Core`](table_core.md)

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### \_getRowId()

```ts
_getRowId: (_, index, parent?) => string;
```

#### Parameters

• **\_**: `TData`

• **index**: `number`

• **parent?**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

#### Returns

`string`

#### Defined in

[core/rows/Rows.types.ts:138](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/rows/Rows.types.ts#L138)

***

### getRow()

```ts
getRow: (id, searchAll?) => Row<TFeatures, TData>;
```

Returns the row with the given ID.

#### Parameters

• **id**: `string`

• **searchAll?**: `boolean`

#### Returns

[`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#getrow)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Defined in

[core/rows/Rows.types.ts:144](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/rows/Rows.types.ts#L144)
