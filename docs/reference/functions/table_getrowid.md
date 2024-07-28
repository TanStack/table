---
id: table_getRowId
title: table_getRowId
---

# Function: table\_getRowId()

```ts
function table_getRowId<TFeatures, TData>(
   originalRow, 
   table, 
   index, 
   parent?): string
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **originalRow**: `TData`

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **index**: `number`

• **parent?**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

## Returns

`string`

## Defined in

[core/rows/Rows.utils.ts:136](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/rows/Rows.utils.ts#L136)
