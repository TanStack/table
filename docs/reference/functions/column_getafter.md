---
id: column_getAfter
title: column_getAfter
---

# Function: column\_getAfter()

```ts
function column_getAfter<TFeatures, TData, TValue>(
   columns, 
   column, 
   table, 
   position?): number
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **columns**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\>[]

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **position?**: `false` \| `"left"` \| `"right"` \| `"center"`

## Returns

`number`

## Defined in

[features/column-sizing/ColumnSizing.utils.ts:52](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-sizing/ColumnSizing.utils.ts#L52)
