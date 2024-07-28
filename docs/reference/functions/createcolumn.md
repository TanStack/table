---
id: _createColumn
title: _createColumn
---

# Function: \_createColumn()

```ts
function _createColumn<TFeatures, TData, TValue>(
   table, 
   columnDef, 
   depth, 
parent?): Column<TFeatures, TData, TValue>
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **columnDef**: [`ColumnDef`](../type-aliases/columndef.md)\<`TFeatures`, `TData`, `TValue`\>

• **depth**: `number`

• **parent?**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

[`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

## Defined in

[core/columns/createColumn.ts:12](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/columns/createColumn.ts#L12)
