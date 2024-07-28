---
id: column_getIsFirstColumn
title: column_getIsFirstColumn
---

# Function: column\_getIsFirstColumn()

```ts
function column_getIsFirstColumn<TFeatures, TData, TValue>(
   column, 
   table, 
   position?): boolean
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

`boolean`

## Defined in

[features/column-ordering/ColumnOrdering.utils.ts:22](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-ordering/ColumnOrdering.utils.ts#L22)
