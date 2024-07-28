---
id: _createRow
title: _createRow
---

# Function: \_createRow()

```ts
function _createRow<TFeatures, TData>(
   table, 
   id, 
   original, 
   rowIndex, 
   depth, 
   subRows?, 
parentId?): Row<TFeatures, TData>
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **id**: `string`

• **original**: `TData`

• **rowIndex**: `number`

• **depth**: `number`

• **subRows?**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>[]

• **parentId?**: `string`

## Returns

[`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

## Defined in

[core/rows/createRow.ts:7](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/rows/createRow.ts#L7)
