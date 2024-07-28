---
id: table_getRow
title: table_getRow
---

# Function: table\_getRow()

```ts
function table_getRow<TFeatures, TData>(
   table, 
   rowId, 
searchAll?): Row<TFeatures, TData>
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **rowId**: `string`

• **searchAll?**: `boolean`

## Returns

[`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

## Defined in

[core/rows/Rows.utils.ts:151](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/rows/Rows.utils.ts#L151)
