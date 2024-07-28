---
id: _createCell
title: _createCell
---

# Function: \_createCell()

```ts
function _createCell<TFeatures, TData, TValue>(
   column, 
   row, 
table): Cell<TFeatures, TData, TValue>
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

[`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `TValue`\>

## Defined in

[core/cells/createCell.ts:9](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/cells/createCell.ts#L9)
