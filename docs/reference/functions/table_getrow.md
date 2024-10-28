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

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **rowId**: `string`

• **searchAll?**: `boolean`

## Returns

[`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

## Defined in

[core/rows/Rows.utils.ts:129](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.utils.ts#L129)
