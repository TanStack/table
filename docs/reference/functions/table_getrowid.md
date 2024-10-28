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

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **originalRow**: `TData`

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **index**: `number`

• **parent?**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

## Returns

`string`

## Defined in

[core/rows/Rows.utils.ts:114](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.utils.ts#L114)
