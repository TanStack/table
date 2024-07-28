---
id: column_pin
title: column_pin
---

# Function: column\_pin()

```ts
function column_pin<TFeatures, TData, TValue>(
   column, 
   table, 
   position): void
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **position**: [`ColumnPinningPosition`](../type-aliases/columnpinningposition.md)

## Returns

`void`

## Defined in

[features/column-pinning/ColumnPinning.utils.ts:18](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.utils.ts#L18)
