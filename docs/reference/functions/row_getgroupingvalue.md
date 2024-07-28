---
id: row_getGroupingValue
title: row_getGroupingValue
---

# Function: row\_getGroupingValue()

```ts
function row_getGroupingValue<TFeatures, TData>(
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

[features/column-grouping/ColumnGrouping.utils.ts:156](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-grouping/ColumnGrouping.utils.ts#L156)
