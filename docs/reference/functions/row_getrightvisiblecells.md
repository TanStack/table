---
id: row_getRightVisibleCells
title: row_getRightVisibleCells
---

# Function: row\_getRightVisibleCells()

```ts
function row_getRightVisibleCells<TFeatures, TData>(row, table): Cell<TFeatures, TData, unknown>[]
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

[`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Defined in

[features/column-pinning/ColumnPinning.utils.ts:130](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.utils.ts#L130)
