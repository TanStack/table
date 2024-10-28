---
id: Table_Rows
title: Table_Rows
---

# Interface: Table\_Rows\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

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

[core/rows/Rows.types.ts:148](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L148)

***

### getRowId()

```ts
getRowId: (_, index, parent?) => string;
```

#### Parameters

• **\_**: `TData`

• **index**: `number`

• **parent?**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

#### Returns

`string`

#### Defined in

[core/rows/Rows.types.ts:142](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L142)
