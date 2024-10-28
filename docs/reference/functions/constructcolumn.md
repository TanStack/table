---
id: constructColumn
title: constructColumn
---

# Function: constructColumn()

```ts
function constructColumn<TFeatures, TData, TValue>(
   table, 
   columnDef, 
   depth, 
parent?): Column<TFeatures, TData, TValue>
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **columnDef**: [`ColumnDef`](../type-aliases/columndef.md)\<`TFeatures`, `TData`, `TValue`\>

• **depth**: `number`

• **parent?**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

[`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

## Defined in

[core/columns/constructColumn.ts:12](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/constructColumn.ts#L12)
