---
id: row_getVisibleCells
title: row_getVisibleCells
---

# Function: row\_getVisibleCells()

```ts
function row_getVisibleCells<TFeatures, TData>(
   left, 
   center, 
   right): Cell<TFeatures, TData, unknown>[]
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **left**: [`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

• **center**: [`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

• **right**: [`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Returns

[`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Defined in

[features/column-visibility/ColumnVisibility.utils.ts:135](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-visibility/ColumnVisibility.utils.ts#L135)
