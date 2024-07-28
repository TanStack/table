---
id: row_getUniqueValues
title: row_getUniqueValues
---

# Function: row\_getUniqueValues()

```ts
function row_getUniqueValues<TFeatures, TData>(
   row, 
   table, 
   columnId): any
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **columnId**: `string`

## Returns

`any`

## Defined in

[core/rows/Rows.utils.ts:39](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/rows/Rows.utils.ts#L39)
