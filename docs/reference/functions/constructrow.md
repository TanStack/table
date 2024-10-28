---
id: constructRow
title: constructRow
---

# Function: constructRow()

```ts
function constructRow<TFeatures, TData>(
   table, 
   id, 
   original, 
   rowIndex, 
   depth, 
   subRows?, 
parentId?): Row<TFeatures, TData>
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

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

[core/rows/constructRow.ts:7](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/constructRow.ts#L7)
