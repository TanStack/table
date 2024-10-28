---
id: constructCell
title: constructCell
---

# Function: constructCell()

```ts
function constructCell<TFeatures, TData, TValue>(
   column, 
   row, 
table): Cell<TFeatures, TData, TValue>
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

[`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `TValue`\>

## Defined in

[core/cells/constructCell.ts:9](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/constructCell.ts#L9)
