---
id: column_getIndex
title: column_getIndex
---

# Function: column\_getIndex()

```ts
function column_getIndex<TFeatures, TData, TValue>(
   column, 
   table, 
   position?): number
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **position?**: [`ColumnPinningPosition`](../type-aliases/columnpinningposition.md) \| `"center"`

## Returns

`number`

## Defined in

[features/column-ordering/ColumnOrdering.utils.ts:9](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-ordering/ColumnOrdering.utils.ts#L9)
