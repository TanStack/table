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

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **left**: [`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

• **center**: [`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

• **right**: [`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Returns

[`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Defined in

[features/column-visibility/ColumnVisibility.utils.ts:112](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/ColumnVisibility.utils.ts#L112)
