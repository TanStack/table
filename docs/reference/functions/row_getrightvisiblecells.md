---
id: row_getRightVisibleCells
title: row_getRightVisibleCells
---

# Function: row\_getRightVisibleCells()

```ts
function row_getRightVisibleCells<TFeatures, TData>(row): Cell_Cell<TFeatures, TData, unknown> & UnionToIntersection<"ColumnGrouping" extends keyof TFeatures ? Cell_ColumnGrouping : never> & object[]
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

## Returns

[`Cell_Cell`](../interfaces/cell_cell.md)\<`TFeatures`, `TData`, `unknown`\> & [`UnionToIntersection`](../type-aliases/uniontointersection.md)\<`"ColumnGrouping"` *extends* keyof `TFeatures` ? [`Cell_ColumnGrouping`](../interfaces/cell_columngrouping.md) : `never`\> & `object`[]

## Defined in

[features/column-pinning/ColumnPinning.utils.ts:144](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.utils.ts#L144)
