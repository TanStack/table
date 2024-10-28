---
id: row_getAllCells
title: row_getAllCells
---

# Function: row\_getAllCells()

```ts
function row_getAllCells<TFeatures, TData>(row): Cell<TFeatures, TData, unknown>[]
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

## Returns

[`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Defined in

[core/rows/Rows.utils.ts:92](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.utils.ts#L92)
