---
id: row_getAllVisibleCells
title: row_getAllVisibleCells
---

# Function: row\_getAllVisibleCells()

```ts
function row_getAllVisibleCells<TFeatures, TData>(row): Cell<TFeatures, TData, unknown>[]
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

## Returns

[`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Defined in

[features/column-visibility/ColumnVisibility.utils.ts:105](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/ColumnVisibility.utils.ts#L105)
